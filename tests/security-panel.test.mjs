import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

const code=readFileSync(new URL('../src/security-panel-card.js',import.meta.url),'utf8');
const els=new Map();
const context={
  HTMLElement:class HTMLElement {},
  customElements:{get:name=>els.get(name),define:(name,cls)=>els.set(name,cls)},
  window:{customCards:[],matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}})},
  TextEncoder, crypto:webcrypto, console, Uint8Array, Date, JSON, Number, Object, Array, String,
};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(code+'\nglobalThis.__test={spConfig,spEntity,spList,spKnown,spSensorState,spPercent,spStateLabel,spEscape,spPinMake,spPinCheck,spImageUrl,spTimeInfo,spLatestActive,spLatestTransition,spIcon,spStateIcon};',context);
const f=context.__test;

test('card and editor register once with correct picker metadata',()=>{
  assert.ok(els.has('security-panel-card'));
  assert.ok(els.has('security-panel-card-editor'));
  assert.equal(context.window.customCards[0].type,'security-panel-card');
  assert.equal(context.window.customCards.length,1);
});
test('default commands off and no hardcoded customer entities',()=>{
  const c=f.spConfig();assert.equal(c.controls_enabled,false);
  assert.equal(c.alarm_entity,'');assert.equal(c.lock_entity,'');assert.equal(c.nvr_on_script,'');
  assert.equal(c.nvr_off_script,'');assert.equal(c.lock_pin_enabled,false);
});
test('invalid domains and unsanitized ids discarded',()=>{
  const c=f.spConfig({alarm_entity:'lock.test',lock_entity:'alarm_control_panel.home',
    nvr_on_script:'script.good',nvr_off_script:'script.bad<script>',
    windows:['binary_sensor.open','binary_sensor.open','sensor.fake','binary_sensor.ok']});
  assert.equal(c.alarm_entity,'');assert.equal(c.lock_entity,'');
  assert.equal(c.nvr_on_script,'script.good');assert.equal(c.nvr_off_script,'');
  assert.deepEqual(Array.from(c.windows),['binary_sensor.open','binary_sensor.ok']);
});
test('unknown sensors cannot be counted as closed',()=>{
  assert.equal(f.spSensorState({state:'unknown'}),'unknown');
  assert.equal(f.spSensorState({state:'unavailable'}),'unknown');
  assert.equal(f.spStateLabel({state:'unavailable'},'windows'),'Non disponibile');
  assert.equal(f.spStateLabel({state:'on'},'windows'),'Aperta');
  assert.equal(f.spStateLabel({state:'off'},'windows'),'Chiusa');
  assert.equal(f.spStateLabel({state:'on'},'motion'),'Movimento rilevato');
});
test('battery percentage ignores unknown and invalid data',()=>{
  assert.equal(f.spPercent({state:'68'}),68);
  assert.equal(f.spPercent({state:'101'}),null);
  assert.equal(f.spPercent({state:'unavailable'}),null);
  assert.equal(f.spPercent({state:'-1'}),null);
});
test('rendered labels escaped against injection',()=>{
  assert.equal(f.spEscape('<img src=x onerror="oops">'),'&lt;img src=x onerror=&quot;oops&quot;&gt;');
});
test('visual confirmation PIN is salted PBKDF2 and not stored in clear',async()=>{
  const secret=await f.spPinMake('2580');
  assert.match(secret,/^pbkdf2-sha256:120000:[0-9a-f]{32}:[0-9a-f]{64}$/);
  assert.ok(!secret.includes('2580'));
  assert.equal(await f.spPinCheck('2580',secret),true);
  assert.equal(await f.spPinCheck('1234',secret),false);
  assert.equal(await f.spPinCheck('2580',''),false);
});
test('no untrusted external loading or local persistent storage',()=>{
  assert.ok(!/fetch\(|XMLHttpRequest|localStorage|sessionStorage|https:\/\/[^\s"']+\.js/.test(code));
});

test('supports image entities for a last snapshot and not camera streams',()=>{
  const cfg=f.spConfig({image_entity:'image.front_door',camera_entity:'camera.old_stream'});
  assert.equal(cfg.image_entity,'image.front_door');
  assert.equal(f.spConfig({image_entity:'camera.stream'}).image_entity,'');
  assert.match(code, /Entità|Ultima immagine rilevata/);
  assert.match(code, /connectedCallback\(\)\{this\._lastRender='';this\._paint\(\);\}/);
});
test('snapshot URLs must be local relative resources only',()=>{
  assert.equal(f.spImageUrl({state:'2026-10-18T09:00:00Z',attributes:{entity_picture:'/api/image_proxy/image.front_door?token=xyz'}}),'/api/image_proxy/image.front_door?token=xyz&sp_v=2026-10-18T09%3A00%3A00Z');
  assert.equal(f.spImageUrl({attributes:{entity_picture:'https://tracker.example.com/image'}}),'');
  assert.equal(f.spImageUrl({attributes:{entity_picture:'//tracker.example.com/image'}}),'');
  assert.equal(f.spImageUrl({attributes:{entity_picture:'javascript:alert(1)'}}),'');
});
test('history identifies ON transitions and never labels the OFF change as opening',()=>{
  const from=Date.parse('2026-10-11T00:00:00Z');
  const history=[[{state:'off',last_changed:'2026-10-11T00:00:01Z'},
    {state:'on',last_changed:'2026-10-12T08:00:00Z'},
    {state:'off',last_changed:'2026-10-12T08:00:30Z'},
    {state:'on',last_changed:'2026-10-13T20:15:00Z'},
    {state:'off',last_changed:'2026-10-13T20:16:00Z'}]];
  assert.equal(f.spLatestActive(history,from),'2026-10-13T20:15:00Z');
  assert.equal(f.spLatestActive([[{state:'off',last_changed:'2026-10-12T08:00:00Z'}]],from),null);
});
test('relative time units are automatic and exact date retained',()=>{
  const now=Date.parse('2026-10-18T12:00:00Z');
  assert.equal(f.spTimeInfo('2026-10-18T11:54:00Z',now).ago,'6 min fa');
  assert.equal(f.spTimeInfo('2026-10-18T09:00:00Z',now).ago,'3 ore fa');
  assert.equal(f.spTimeInfo('2026-10-15T12:00:00Z',now).ago,'3 giorni fa');
  assert.equal(f.spTimeInfo('non una data',now),null);
  assert.equal(f.spTimeInfo('2026-10-19T12:00:00Z',now),null);
});
test('uses native Home Assistant icons and suppresses entity id in popup text',()=>{
  assert.match(f.spIcon('motion'),/ha-icon.*mdi:motion-sensor/);
  assert.match(f.spStateIcon('binary_sensor.window','window'),/ha-state-icon.*binary_sensor.window/);
  assert.match(code,/data-more-info/);
  assert.ok(!code.includes('<div class="sp-entity">${spEscape(id)}</div>'));
});

test('only active Casa/Fuori casa buttons are tinted, alarm body stays neutral',()=>{
  assert.match(code, /\.sp-mode\.selected\.sp-mode-home\{background:var\(--sp-accent\)/);
  assert.match(code, /\.sp-mode\.selected\.sp-mode-away\{background:var\(--sp-away\)/);
  assert.ok(!/\.sp-row\.sp-alarm-(home|away)\s*\{/.test(code));
  assert.match(code, /state==='armed_home'\?'sp-mode-home'/);
  assert.match(code, /state==='armed_away'\?'sp-mode-away'/);
  assert.ok(!code.includes('https://cdn'));
});
test('triggered alarm gets a separate red alert only on triggered state',()=>{
  assert.match(code, /alarmTriggered=aState==='triggered'/);
  assert.match(code, /\$\{alarmTriggered\?`<section class="sp-trigger-alert"/);
  assert.match(code, /role="alert" aria-live="polite"/);
  assert.match(code, /<strong>Allarme scattato<\/strong>/);
  assert.match(code, /\.sp-row\.sp-alarm-triggered\{border-color:#b83a42/);
  assert.doesNotMatch(code,/alarmTriggered\|\|sirenState===true\?'sp-alarm-triggered'/);
});

test('recording remains separately configurable and visible beside last movement',()=>{
  const cfg=f.spConfig({recording_entity:'binary_sensor.door_recording',recording_active_state:'on',image_entity:'image.frontdoor'});
  assert.equal(cfg.recording_entity,'binary_sensor.door_recording');
  assert.match(code,/Stato registrazione \(facoltativo\)/);
  assert.match(code,/<strong>Stato registrazione<\/strong>/);
  assert.match(code,/Ultimo movimento rilevato/);
  assert.match(code,/Ultima immagine rilevata \(image\.\*\)/);
});

test('PIN configuration fails closed without Web Crypto, never downgraded to plaintext',async()=>{
  const clean=code.replace('globalThis.crypto?.subtle','globalThis.crypto?.subtle');
  assert.match(clean,/PIN disponibile solo in una connessione HTTPS affidabile/);
  assert.match(clean,/lock_pin_enabled.*t.checked.*!globalThis.crypto\?\.subtle/);
  assert.ok(!/localStorage|sessionStorage/.test(clean));
});


test('alarm history recognizes triggered transitions only, not siren or motion',()=>{
  const from=Date.parse('2026-10-09T00:00:00Z');
  const rows=[[{state:'disarmed',last_changed:'2026-10-09T01:00:00Z'},
    {state:'armed_away',last_changed:'2026-10-09T05:00:00Z'},
    {state:'triggered',last_changed:'2026-10-10T05:00:00Z'},
    {state:'disarmed',last_changed:'2026-10-10T05:05:00Z'},
    {state:'triggered',last_changed:'2026-10-15T08:45:00Z'},
    {state:'disarmed',last_changed:'2026-10-15T09:00:00Z'}]];
  assert.equal(f.spLatestTransition(rows,'triggered',from),'2026-10-15T08:45:00Z');
  assert.equal(f.spLatestTransition([[{state:'triggered',last_changed:'2026-10-09T01:00:00Z'}]],'triggered',from),null);
  assert.equal(f.spLatestTransition(rows,'triggered',Date.parse('2026-10-16T00:00:00Z')),null);
  assert.equal(f.spLatestTransition(rows,'fake',from),null);
});
test('siren manual control is opt-in, independent from read-only status',()=>{
  const initial=f.spConfig();
  assert.equal(initial.siren_manual_enabled,false);
  assert.equal(initial.siren_control_entity,'');
  const safe=f.spConfig({siren_entity:'binary_sensor.status',siren_control_entity:'binary_sensor.status',siren_manual_enabled:true});
  assert.equal(safe.siren_entity,'binary_sensor.status');
  assert.equal(safe.siren_control_entity,'');
  assert.equal(safe.siren_manual_enabled,true);
  assert.equal(f.spConfig({siren_control_entity:'siren.entrance'}).siren_control_entity,'siren.entrance');
  assert.equal(f.spConfig({siren_control_entity:'switch.manual_siren'}).siren_control_entity,'switch.manual_siren');
  assert.match(code,/a==='siren-on'.*a==='siren-off'/);
  assert.match(code,/a==='siren-on'\)this\._open\(\{type:'confirm'/);
});
test('history queries include explicit end_time for full interval',()=>{
  assert.match(code,/history\/period\/\$\{new Date\(from\)\.toISOString\(\)\}\?end_time=/);
  assert.match(code,/spLatestTransition\(history,'triggered',from\)/);
  assert.match(code,/data-action="detail-alarm-history"/);
});
test('native entity selector can be cleared explicitly; arrays have remove icon',()=>{
  assert.match(code,/data-clear-entity="\$\{key\}"/);
  assert.match(code,/this\._update\(clear\.dataset\.clearEntity,''\)/);
  assert.match(code,/class="sp-remove sp-remove-x"/);
});
test('font weight reduced for body but signature title and green point preserved',()=>{
  assert.match(code,/\.sp-name\{font-size:14px;font-weight:600/);
  assert.match(code,/\.sp-title\{font-size:25px;line-height:1\.14;font-weight:780/);
  assert.match(code,/\.sp-title b\{color:var\(--sp-accent\)/);
  assert.match(code,/\.sp-close\{display:flex;justify-content:center;align-items:center/);
});
test('camera tile uses doorbell icon, not image entity native icon',()=>{
  assert.match(code,/eye:'doorbell-video'/);
  assert.match(code,/extras\+=display\('camera'/);
  assert.doesNotMatch(code,/cameraMotion===true\|\|cameraPerson===true\|\|record===true,cfg\.image_entity\)/);
});


test('compact preview uses short NVR state and grouped icon/label layout',()=>{
  assert.ok(code.includes("!cfg.nvr_state_entity?'Non monitorato'"));
  assert.ok(code.includes('class="sp-device-info"'));
  assert.match(code,/\.sp-device-main\{display:flex;align-items:center;flex-wrap:wrap/);
  assert.match(code,/\.sp-device-info \.sp-name,\.sp-device-info \.sp-sub\{[^}]*white-space:nowrap;overflow-wrap:normal/);
});
test('native MDI glyph aligns with button text via matching icon size',()=>{
  assert.match(code,/\.sp-button \.sp-icon\{width:16px;height:16px;--mdc-icon-size:16px\}/);
  assert.match(code,/\.sp-button\{[^}]*align-items:center;justify-content:center/);
});
