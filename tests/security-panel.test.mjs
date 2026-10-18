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
vm.runInContext(code+'\nglobalThis.__test={spConfig,spEntity,spList,spKnown,spSensorState,spPercent,spStateLabel,spEscape,spPinMake,spPinCheck};',context);
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
