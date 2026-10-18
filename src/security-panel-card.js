/**
 * Security Panel Card — Home Assistant dashboard card.
 * Copyright (c) 2026 luigi-regolo. SPDX-License-Identifier: GPL-3.0-only.
 * No external scripts, fonts, analytics or assets.
 * The optional lock PIN is a CLIENT-SIDE UI confirmation only, NOT access control.
 */
const SP_TAG = 'security-panel-card';
const SP_EDITOR_TAG = 'security-panel-card-editor';
const SP_DOMAINS = {
  alarm_entity: ['alarm_control_panel'],
  nvr_on_script: ['script'], nvr_off_script: ['script'],
  nvr_state_entity: ['switch', 'binary_sensor', 'input_boolean', 'sensor'],
  lock_entity: ['lock'], lock_battery_entity: ['sensor'],
  door_entity: ['binary_sensor'],
  camera_entity: ['camera'], camera_battery_entity: ['sensor'],
  recording_entity: ['binary_sensor', 'switch', 'sensor'],
  camera_motion_entity: ['binary_sensor'], camera_person_entity: ['binary_sensor'], camera_last_event_entity: ['sensor','input_datetime'],
  siren_entity: ['siren', 'binary_sensor', 'switch', 'sensor'],
  base_entity: ['binary_sensor', 'sensor', 'switch'],
  windows: ['binary_sensor'], motion: ['binary_sensor'],
};
const SP_DEFAULTS = Object.freeze({
  title: 'Sicurezza', eyebrow: 'SECURITY PANEL CARD', theme_mode: 'auto',
  alarm_name: 'Allarme', nvr_name: 'Videosorveglianza', lock_name: 'Serratura',
  door_name: 'Porta', windows_name: 'Finestre', motion_name: 'Volumetrico', camera_name: 'Spioncino',
  controls_enabled: false,
  alarm_entity: '', alarm_disarm_code: true, alarm_arm_code: false,
  siren_entity: '', base_entity: '', base_ok_state: '',
  nvr_on_script: '', nvr_off_script: '', nvr_state_entity: '', nvr_active_state: 'on',
  lock_entity: '', lock_battery_entity: '', lock_pin_enabled: false, lock_pin_hash: '', lock_confirm_direct: true,
  door_entity: '', windows: [], motion: [], camera_entity: '', camera_battery_entity: '',
  recording_entity: '', recording_active_state: 'on',
  camera_motion_entity: '', camera_person_entity: '', camera_last_event_entity: '', camera_location_name: 'Davanti alla porta',
  show_door: false, show_windows: false, show_motion: false, show_camera: false,
  alert_highlight: true, alert_animation: false,
});
function spText(v, limit = 110) { return String(v == null ? '' : v).trim().slice(0, limit); }
function spEscape(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function spEntity(v, domainList) {
  const id = spText(v, 160);
  return domainList.includes(id.split('.')[0]) && /^[a-z0-9_]+\.[a-z0-9_]+$/.test(id) ? id : '';
}
function spList(v, domains = ['binary_sensor']) {
  return Array.from(new Set((Array.isArray(v) ? v : []).map(x => spEntity(x, domains)).filter(Boolean))).slice(0, 80);
}
function spConfig(raw = {}) {
  const cfg = { ...SP_DEFAULTS, ...(raw && typeof raw === 'object' ? raw : {}) };
  for (const [k, ds] of Object.entries(SP_DOMAINS)) if (k !== 'windows' && k !== 'motion') cfg[k] = spEntity(cfg[k], ds);
  cfg.windows = spList(cfg.windows); cfg.motion = spList(cfg.motion);
  for (const key of ['title','eyebrow','alarm_name','nvr_name','lock_name','door_name','windows_name','motion_name','camera_name','camera_location_name']) cfg[key] = spText(cfg[key], 60);
  for (const key of ['nvr_active_state','base_ok_state','recording_active_state']) cfg[key] = spText(cfg[key], 64);
  cfg.theme_mode = ['auto','light','dark'].includes(cfg.theme_mode) ? cfg.theme_mode : 'auto';
  for (const k of Object.keys(SP_DEFAULTS).filter(k => typeof SP_DEFAULTS[k] === 'boolean')) cfg[k] = cfg[k] === true;
  cfg.lock_pin_hash = /^pbkdf2-sha256:120000:[0-9a-f]{32}:[0-9a-f]{64}$/.test(cfg.lock_pin_hash || '') ? cfg.lock_pin_hash : '';
  return cfg;
}
function spKnown(entity) { return !!entity && entity.state !== 'unavailable' && entity.state !== 'unknown' && entity.state !== ''; }
function spSensorState(entity) { return !spKnown(entity) ? 'unknown' : entity.state === 'on' ? 'active' : entity.state === 'off' ? 'inactive' : 'other'; }
function spPercent(entity) {
  if (!spKnown(entity)) return null;
  const val = Number(entity.state);
  return Number.isFinite(val) && val >= 0 && val <= 100 ? Math.round(val) : null;
}
function spIcon(name) { const paths = {
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  shieldoff:'<path d="M3 3l18 18M9 3l3-1 8 3v7c0 1.5-.3 2.7-1 4M15 20l-3 2s-8-4-8-10V5l2-1"/>',
  home:'<path d="m3 10 9-7 9 7v10H3zM9 20v-8h6v8"/>',
  video:'<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  power:'<path d="M12 2v10M6.1 5.5a9 9 0 1 0 11.8 0"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2"/>',
  unlock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.5-2M12 15v2"/>',
  door:'<rect x="5" y="2" width="14" height="20" rx="1"/><path d="M15 12h.01"/>',
  window:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M3 12h18"/>',
  motion:'<circle cx="12" cy="5" r="2.5"/><path d="m12 9-3 5 4 2 2 5M12 9l4 4 3 1M9 14l-4 7M3 7l2-2M21 7l-2-2"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',
  x:'<path d="M5 5 19 19M19 5 5 19"/>',
  back:'<path d="m14 5-7 7 7 7M7 12h14"/>',
  battery:'<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2M5 10h9v4H5z"/>',
  alert:'<path d="M12 3 2 21h20L12 3zM12 9v5M12 18h.01"/>',
  siren:'<path d="M5 17h14l-1-9a6 6 0 0 0-12 0L5 17zM3 21h18M12 1v2M2 8l-2-2M22 8l2-2"/>',
  circle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>',
};return `<svg viewBox="0 0 24 24" class="sp-icon" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round" stroke-linecap="round">${paths[name] || paths.circle}</svg>`; }
const SP_STYLE = `
:host{display:block;box-sizing:border-box;font-family:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif));font-size:14px;color:var(--sp-text)}
*,*:before,*:after{box-sizing:border-box}
:host([data-theme="light"]){--sp-bg:#fafbf9;--sp-tile:#f0f2ef;--sp-circle:#ffffff;--sp-line:#e0e5df;--sp-text:#18221c;--sp-muted:#56675c;--sp-button:#e5eae5;--sp-accent:#0a7156;--sp-red:#ae4742}
:host([data-theme="dark"]){--sp-bg:#101211;--sp-tile:#191c1a;--sp-circle:#282b29;--sp-line:#2b302c;--sp-text:#f5f7f4;--sp-muted:#bbc5bd;--sp-button:#282d29;--sp-accent:#0e795d;--sp-red:#ec817b}
:host([data-theme="light"]) .active-accent{color:#fff}
button{font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}button:disabled{opacity:.45;cursor:not-allowed}button:focus-visible,input:focus-visible{outline:2px solid var(--sp-accent);outline-offset:2px}
.sp-icon{width:21px;height:21px;flex-shrink:0;display:block}.sp-shell{padding:18px;background:var(--sp-bg);border:1px solid var(--sp-line);border-radius:26px;min-width:0}
.sp-header{margin:2px 4px 17px}.sp-eyebrow{color:var(--sp-muted);font-size:10px;letter-spacing:1.7px;font-weight:750;margin-bottom:7px}.sp-title{font-size:25px;line-height:1.14;font-weight:780;letter-spacing:-.7px;overflow-wrap:anywhere}.sp-title b{color:var(--sp-accent);font-weight:800}
.sp-row{border:1px solid var(--sp-line);background:var(--sp-tile);border-radius:24px;padding:12px;margin-top:9px;min-width:0}
.sp-main{display:flex;align-items:center;gap:11px;min-height:44px}.sp-orb{flex:none;width:43px;height:43px;border-radius:50%;background:var(--sp-circle);display:grid;place-items:center}.sp-meta{flex:1;min-width:0}.sp-name{font-size:14px;font-weight:700;line-height:1.3}.sp-sub{font-size:12px;color:var(--sp-muted);margin-top:3px;line-height:1.45;overflow-wrap:anywhere}.sp-status{display:inline-block;width:7px;height:7px;border-radius:50%;background:#8f9990;margin-right:5px;vertical-align:1px}.sp-status.ok{background:var(--sp-accent)}.sp-status.error{background:var(--sp-red)}
.sp-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:12px}.sp-mode{border:1px solid transparent;border-radius:15px;background:var(--sp-button);min-height:65px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;font-size:11px}.sp-mode.selected{background:var(--sp-circle);border-color:var(--sp-line);font-weight:750}
.sp-button{border:1px solid var(--sp-line);background:var(--sp-circle);padding:9px 12px;border-radius:999px;font-size:12px;font-weight:650;display:flex;align-items:center;gap:6px;white-space:nowrap;flex:none;min-height:36px}.sp-button .sp-icon{width:16px;height:16px}.sp-buttons{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.sp-mini{border-top:1px solid var(--sp-line);margin-top:11px;padding-top:10px;display:flex;gap:10px 12px;flex-wrap:wrap}.sp-pill{display:inline-flex;gap:5px;align-items:center;color:var(--sp-muted);font-size:11px}.sp-pill .sp-icon{width:14px;height:14px}.sp-critical{color:var(--sp-red)!important}.sp-focus{border-color:var(--sp-accent)!important;box-shadow:inset 0 0 0 1px var(--sp-accent)}.sp-alarm-focus{border-color:var(--sp-red)!important}.sp-pulse{animation:sp-breathe 2.5s ease-in-out infinite}@keyframes sp-breathe{0%,100%{box-shadow:inset 0 0 0 1px var(--sp-accent)}50%{box-shadow:inset 0 0 0 2px var(--sp-accent)}}.sp-section{color:var(--sp-muted);font-weight:750;font-size:10px;letter-spacing:1.3px;margin:19px 4px 10px}
.sp-extras{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.sp-sensor{width:100%;text-align:left;min-width:0;border:1px solid var(--sp-line);background:var(--sp-tile);padding:8px 10px;border-radius:999px;display:flex;align-items:center;gap:10px;min-height:65px}.sp-sensor-orb{width:43px;height:43px;flex:none;border-radius:50%;background:var(--sp-circle);display:grid;place-items:center}.sp-sensor-orb .sp-icon{width:22px;height:22px}.sp-sensor-text{flex:1;display:block;min-width:0}.sp-sensor .sp-name{display:block;font-size:13px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sp-sensor .sp-sub{display:block;font-size:11.5px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sp-sensor>.sp-icon:last-child{width:14px;height:14px;flex:none;color:var(--sp-muted)}.sp-sensor.sp-focus{background:var(--sp-accent);border-color:var(--sp-accent)!important;color:white;box-shadow:none!important}.sp-sensor.sp-focus .sp-sub,.sp-sensor.sp-focus>.sp-icon{color:#fff}.sp-sensor.sp-focus .sp-sensor-orb .sp-icon{color:var(--sp-accent)}:host([data-theme="light"]) .sp-sensor.sp-focus .sp-name{color:#001a11}:host([data-theme="light"]) .sp-sensor.sp-focus .sp-sub{color:#001a11;font-weight:650}.sp-sensor.sp-pulse{animation:sp-breathe 2.5s ease-in-out infinite}.sp-sensor:active,.sp-button:active,.sp-mode:active{transform:scale(.99)}
.sp-note{border:1px solid var(--sp-line);border-radius:12px;margin-top:12px;padding:9px 11px;color:var(--sp-muted);font-size:11px}.sp-note.error{color:var(--sp-red)}.sp-small{font-size:11px;color:var(--sp-muted)}.sp-spinner{opacity:.6}
.sp-backdrop{position:fixed;inset:0;background:#0009;z-index:999;display:grid;place-items:center;padding:16px}.sp-dialog{width:min(390px,100%);max-height:90vh;overflow:auto;background:var(--sp-bg);color:var(--sp-text);padding:20px;border:1px solid var(--sp-line);border-radius:26px;box-shadow:0 18px 60px #0005}.sp-dialoghead{display:flex;align-items:center;gap:10px}.sp-dialoghead strong{flex:1;font-size:17px}.sp-close{display:grid;place-items:center;border:0;background:var(--sp-tile);width:33px;height:33px;border-radius:50%}.sp-close .sp-icon{width:16px;height:16px}.sp-dialog .sp-sub{margin:10px 0 14px}.sp-item{display:flex;width:100%;align-items:center;gap:8px;border:1px solid var(--sp-line);border-radius:14px;background:var(--sp-tile);padding:12px;margin-top:7px;text-align:left}.sp-item .sp-meta{min-width:0}.sp-entity{font-size:10px;color:var(--sp-muted);overflow-wrap:anywhere}.sp-dots{display:flex;gap:12px;justify-content:center;padding:12px 0 20px}.sp-pin-dot{width:12px;height:12px;border-radius:50%;border:1px solid var(--sp-muted)}.sp-pin-dot.full{background:var(--sp-text)}.sp-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.sp-pad button{border:1px solid var(--sp-line);background:var(--sp-tile);border-radius:12px;height:48px;font-size:19px}.sp-input{width:100%;border:1px solid var(--sp-line);border-bottom:1px solid var(--sp-muted);background:var(--sp-tile);color:var(--sp-text);font:inherit;font-size:18px;border-radius:10px 10px 0 0;padding:13px}.sp-wide{display:block;width:100%;border:0;border-radius:14px;margin-top:13px;padding:13px;background:var(--sp-accent);color:white;font-weight:730}.sp-wide:disabled{opacity:.4}.sp-error{font-size:12px;color:var(--sp-red);padding-top:8px}.sp-camera{margin:12px 0;border-radius:17px;background:var(--sp-tile);padding:15px}.sp-camera .sp-icon{margin:auto}.sp-event,.sp-event-location{display:flex;gap:10px;align-items:center;border:1px solid var(--sp-line);background:var(--sp-tile);border-radius:14px;padding:11px 12px;margin-top:8px;font-size:12px}.sp-event .sp-small{margin-top:3px}.sp-event.active-accent{background:var(--sp-accent);color:#fff;border-color:var(--sp-accent)}.sp-event.active-accent .sp-small{color:#fff}.sp-event-location{font-size:11px;color:var(--sp-muted)}
@media(max-width:420px){.sp-shell{padding:13px;border-radius:23px}.sp-row{padding:10px}.sp-orb{width:39px;height:39px}.sp-title{font-size:23px}.sp-sensor{padding:6px;gap:7px}.sp-sensor-orb{width:36px;height:36px}.sp-sensor .sp-name{font-size:11.5px}.sp-sensor .sp-sub{font-size:10.5px}.sp-button{font-size:11px;padding:7px 9px}.sp-mode{font-size:10px}}
@media(prefers-reduced-motion:reduce){.sp-sensor:active,.sp-button:active,.sp-mode:active{transform:none}.sp-pulse{animation:none!important}}
`;
const SP_EDITOR_CSS = `
:host{display:block;color:var(--primary-text-color,#18221c);font-family:var(--ha-font-family-body,Roboto,Arial,sans-serif);font-size:var(--ha-font-size-m,14px)}*,*:before,*:after{box-sizing:border-box}
.sp-editor{display:block}.sp-tabs{display:flex;gap:5px;overflow-x:auto;padding-bottom:14px;border-bottom:1px solid var(--divider-color,#dfe5df)}.sp-tab{border:0;background:none;color:var(--secondary-text-color,#536359);border-radius:13px;padding:10px 13px;white-space:nowrap;font:inherit;cursor:pointer}.sp-tab.active{color:var(--primary-text-color,#17231c);background:var(--secondary-background-color,#f0f2ef);font-weight:650}.sp-heading{font-size:21px;font-weight:500;margin:25px 0 9px}.sp-desc{color:var(--secondary-text-color,#55665a);font-size:13px;line-height:1.5;margin-bottom:24px}.sp-field{display:block;margin:20px 0}.sp-label{font-size:14px;margin-bottom:10px}.sp-input{display:block;width:100%;background:var(--secondary-background-color,#f0f2ef);color:var(--primary-text-color,#18221c);border:0;border-bottom:1px solid var(--divider-color,#a5afa5);padding:14px 13px;min-height:50px;border-radius:11px 11px 0 0;font:inherit}.sp-editor ha-selector{display:block;width:100%;--mdc-theme-primary:var(--primary-color,#0b7457)}.sp-fallback{display:none}.sp-no-native .sp-fallback{display:block}.sp-no-native ha-selector{display:none}.sp-row{border-bottom:1px solid var(--divider-color,#e3e7e3);padding:13px 0;display:flex;align-items:center;justify-content:space-between;gap:15px}.sp-row label{flex:1}.sp-row input[type=checkbox]{width:18px;height:18px;accent-color:var(--primary-color,#0c7157)}.sp-muted{font-size:12px;line-height:1.5;color:var(--secondary-text-color,#5e6c62)}.sp-panel{border:1px solid var(--divider-color,#e0e5de);border-radius:14px;padding:14px;margin:15px 0}.sp-action{background:var(--secondary-background-color,#eff2ee);border:1px solid var(--divider-color,#dbe2db);color:var(--primary-text-color,#18221c);padding:10px 14px;border-radius:14px;font:inherit;cursor:pointer}.sp-remove{background:none;border:0;color:var(--error-color,#bd4b42);cursor:pointer;font:inherit}.sp-arrayitem{border-bottom:1px solid var(--divider-color,#e0e5df);padding:16px 0}.sp-arrayhead{display:flex;align-items:center;justify-content:space-between}.sp-secret{border:1px solid var(--divider-color,#e0e5de);border-radius:14px;padding:15px;margin-top:15px}.sp-errors{color:var(--error-color,#bd4b42);font-size:12px}.sp-actions{display:flex;gap:10px;flex-wrap:wrap}.sp-tiny{font-size:11px;color:var(--secondary-text-color,#55665a);margin:9px 0}.sp-input:focus-visible,.sp-action:focus-visible,.sp-tab:focus-visible{outline:2px solid var(--primary-color,#0b7457);outline-offset:2px}.sp-more{margin:19px 0 10px;border-bottom:1px solid var(--divider-color,#dfe5df);padding:0 0 11px}.sp-more summary{cursor:pointer;padding:13px 4px;color:var(--secondary-text-color,#56665d);font-size:13px;list-style:none}.sp-more summary:before{content:"▸";font-size:10px;margin-right:10px}.sp-more[open] summary:before{content:"▾"}.sp-more summary::-webkit-details-marker{display:none}.sp-more-body{padding:2px 0 8px}.sp-editor ha-selector{--mdc-theme-primary:var(--primary-color,#0c7157)}
`;
function spStateLabel(item, mode) {
  if (!spKnown(item)) return 'Non disponibile';
  if (mode === 'door' || mode === 'windows') return item.state === 'on' ? 'Aperta' : item.state === 'off' ? 'Chiusa' : item.state;
  if (mode === 'motion') return item.state === 'on' ? 'Movimento rilevato' : item.state === 'off' ? 'Nessun movimento' : item.state;
  return item.state;
}
function spHex(bytes) { return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(''); }
function spBytes(hex) { return new Uint8Array(hex.match(/.{2}/g).map(b => Number.parseInt(b, 16))); }
async function spPinDerive(pin, salt) {
  if (!globalThis.crypto?.subtle) throw new Error('La configurazione PIN richiede HTTPS (Web Crypto).');
  const key = await globalThis.crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  return spHex(new Uint8Array(await globalThis.crypto.subtle.deriveBits({name:'PBKDF2',salt:spBytes(salt),iterations:120000,hash:'SHA-256'},key,256)));
}
async function spPinMake(pin) {
  if (!globalThis.crypto?.getRandomValues) throw new Error('Generatore casuale sicuro non disponibile.');
  const salt = spHex(globalThis.crypto.getRandomValues(new Uint8Array(16)));
  return `pbkdf2-sha256:120000:${salt}:${await spPinDerive(pin,salt)}`;
}
async function spPinCheck(pin, secret) {
  if (!/^pbkdf2-sha256:120000:[0-9a-f]{32}:[0-9a-f]{64}$/.test(secret)) return false;
  const [, , salt, hash] = secret.split(':');
  const got = await spPinDerive(pin, salt);
  let mismatch = 0; for (let i=0;i<hash.length;i++) mismatch |= hash.charCodeAt(i) ^ got.charCodeAt(i);
  return mismatch === 0;
}

class SecurityPanelCard extends HTMLElement {
  static getStubConfig() { return spConfig(); }
  static getConfigElement() { return document.createElement(SP_EDITOR_TAG); }
  constructor() {
    super(); this.attachShadow({mode:'open'}); this._config=spConfig(); this._hass=null; this._modal=null;
    this._busy=false; this._error=''; this._lastRender=''; this._pin=''; this._pinFailures=0; this._pinCooldown=0;
    this._media=typeof window.matchMedia==='function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    this._onAppearance=()=>this._paint(); this._media?.addEventListener?.('change',this._onAppearance);
    this.shadowRoot.addEventListener('click',e=>this._click(e));
    this.shadowRoot.addEventListener('input',e=>this._input(e));
    this.shadowRoot.addEventListener('keydown',e=>{if(e.key==='Escape' && this._modal)this._closeModal();});
  }
  disconnectedCallback(){this._media?.removeEventListener?.('change',this._onAppearance);}
  setConfig(raw) { this._config=spConfig(raw); this._paint(); }
  set hass(hass) { this._hass=hass; this._paint(); }
  getCardSize(){return 7;}
  _entity(id){return id ? this._hass?.states?.[id] : undefined;}
  _theme(){return this._config.theme_mode==='auto'?(this._hass?.themes?.darkMode||this._media?.matches?'dark':'light'):this._config.theme_mode;}
  _selected(ids){return ids.map(id=>({id,item:this._entity(id)}));}
  _summary(group){
    const chosen=this._selected(this._config[group]); const usable=chosen.filter(x=>spKnown(x.item));
    const unavailable=chosen.length-usable.length; const active=usable.filter(x=>x.item.state==='on').length;
    return { chosen, usable, unavailable, active, inactive:usable.length-active };
  }
  _isOn(id, expected='on') {const item=this._entity(id);if(!spKnown(item))return null;if(item.state===expected)return true;return item.state==='on'||item.state==='off'?false:null;}
  _paint(){
    if(!this.isConnected)return;
    const cfg=this._config;
    const snapshots={cfg,theme:this._theme(),busy:this._busy,error:this._error,modal:this._modal,pinLen:this._pin.length};
    const ids=[cfg.alarm_entity,cfg.siren_entity,cfg.base_entity,cfg.nvr_state_entity,cfg.nvr_on_script,cfg.nvr_off_script,cfg.lock_entity,cfg.lock_battery_entity,cfg.door_entity,cfg.camera_entity,cfg.camera_battery_entity,cfg.recording_entity,cfg.camera_motion_entity,cfg.camera_person_entity,cfg.camera_last_event_entity,...cfg.windows,...cfg.motion].filter(Boolean);
    snapshots.states=ids.map(id=>{const s=this._entity(id);return [id,s?.state,s?.attributes?.friendly_name,s?.attributes?.supported_features,s?.attributes?.code_arm_required,s?.attributes?.code_format,s?.attributes?.battery_level]});
    const signature=JSON.stringify(snapshots);if(signature===this._lastRender)return;this._lastRender=signature;
    this.setAttribute('data-theme',this._theme());
    const unit=(s,valid)=>`<span class="sp-status ${valid ? 'ok':''}"></span>${spEscape(s)}`;
    const alarm=this._entity(cfg.alarm_entity);const aState=spKnown(alarm)?alarm.state:'unknown';
    const aLabel={disarmed:'Disinserito',armed_home:'Inserito · Casa',armed_away:'Inserito · Fuori casa',pending:'In attesa',arming:'Inserimento in corso',triggered:'ALLARME ATTIVO',disarming:'Disinserimento in corso'}[aState] || (spKnown(alarm)?aState:'Non disponibile');
    const alarmTriggered=aState==='triggered';
    const statusSiren=this._entity(cfg.siren_entity);const sirenState=this._isOn(cfg.siren_entity);
    const sirenLabel=!cfg.siren_entity?null:sirenState===null?(spKnown(statusSiren)?`Sirena: ${statusSiren.state}`:'Non disponibile'):sirenState?'Sirena attiva':'Sirena inattiva';
    const bs=this._entity(cfg.base_entity);const baseHealthy=cfg.base_ok_state && spKnown(bs)?bs.state===cfg.base_ok_state:null;
    const baseLabel=!cfg.base_entity?null:!spKnown(bs)?'Centrale non disponibile':baseHealthy===true?'Centrale operativa':baseHealthy===false?'Verificare centrale':`Centrale: ${bs.state}`;
    const lock=this._entity(cfg.lock_entity);const lockState=spKnown(lock)?lock.state:'unknown';const lockStatus={locked:'Bloccata',unlocked:'Sbloccata',locking:'Blocco in corso',unlocking:'Sblocco in corso',jammed:'Bloccata · Errore'}[lockState]||(spKnown(lock)?lockState:'Non disponibile');
    const lb=spPercent(this._entity(cfg.lock_battery_entity));
    const nvr=this._isOn(cfg.nvr_state_entity,cfg.nvr_active_state);
    const nvrStatus=!cfg.nvr_state_entity?'Stato non monitorato':nvr===null?(spKnown(this._entity(cfg.nvr_state_entity))?`Stato: ${this._entity(cfg.nvr_state_entity).state}`:'Stato non disponibile'):nvr?'NVR attivo':'NVR disattivato';
    const record=this._isOn(cfg.recording_entity,cfg.recording_active_state);
    const cam=this._entity(cfg.camera_entity);const cb=spPercent(this._entity(cfg.camera_battery_entity));
    const recLabel=!cfg.recording_entity?'Registrazione non monitorata':record===null?'Registrazione: dato non disponibile':record?'In registrazione':'Non in registrazione';
    const cameraMotion=this._isOn(cfg.camera_motion_entity);
    const cameraPerson=this._isOn(cfg.camera_person_entity);
    const wd=this._summary('windows');const mo=this._summary('motion');
    const doorState=spSensorState(this._entity(cfg.door_entity));
    const disabled=!cfg.controls_enabled||this._busy;
    const btn=(label,act,icon,off=false)=>`<button type="button" class="sp-button" data-action="${act}" ${off?'disabled':''}>${spIcon(icon)}${label}</button>`;
    const display=(k,name,icon,text,highlight=false)=>`<button type="button" class="sp-sensor ${highlight&&cfg.alert_highlight?'sp-focus':''} ${highlight&&cfg.alert_highlight&&cfg.alert_animation?'sp-pulse':''}" data-action="detail-${k}" aria-label="${spEscape(name)}: ${spEscape(text)}. Visualizza dettagli"><span class="sp-sensor-orb">${spIcon(icon)}</span><span class="sp-sensor-text"><span class="sp-name">${spEscape(name)}</span><span class="sp-sub">${spEscape(text)}</span></span>${spIcon('chevron')}</button>`;
    const modes=[['disarmed','Disattiva','shieldoff'],['armed_home','Casa','home'],['armed_away','Fuori casa','shield']].map(([state,text,icon])=>{
      const action=state==='disarmed'?'disarm':state==='armed_home'?'arm-home':'arm-away';
      const supported=state==='armed_home'?(!spKnown(alarm)||!!((Number(alarm.attributes?.supported_features)||0)&1)):state==='armed_away'?(!spKnown(alarm)||!!((Number(alarm.attributes?.supported_features)||0)&2)):true;
      return `<button type="button" data-action="${action}" class="sp-mode ${aState===state?'selected':''}" ${disabled||!spKnown(alarm)||!supported?'disabled':''}>${spIcon(icon)}${text}</button>`;
    }).join('');
    const alarmMini=[sirenLabel?`<span class="sp-pill ${sirenState?'sp-critical':''}">${spIcon('siren')}${spEscape(sirenLabel)}</span>`:'',baseLabel?`<span class="sp-pill ${baseHealthy===false?'sp-critical':''}">${spIcon('circle')}${spEscape(baseLabel)}</span>`:''].filter(Boolean).join('');
    const nvrBtns=nvr===true?btn('Disattiva','nvr-off','power',disabled||!cfg.nvr_off_script||!this._entity(cfg.nvr_off_script)):nvr===false?btn('Attiva','nvr-on','power',disabled||!cfg.nvr_on_script||!this._entity(cfg.nvr_on_script)):`${btn('Attiva','nvr-on','power',disabled||!cfg.nvr_on_script||!this._entity(cfg.nvr_on_script))}${btn('Disattiva','nvr-off','power',disabled||!cfg.nvr_off_script||!this._entity(cfg.nvr_off_script))}`;
    const lockCan=lockState==='locked'||lockState==='unlocked';const lockAction=lockState==='locked'?'unlock':'lock';
    let extras='';
    if(cfg.show_door)extras+=display('door',cfg.door_name||'Porta', 'door',cfg.door_entity?spStateLabel(this._entity(cfg.door_entity),'door'):'Da configurare',doorState==='active');
    if(cfg.show_windows)extras+=display('windows',cfg.windows_name||'Finestre','window',cfg.windows.length?`${wd.active} aperte · ${wd.inactive} chiuse${wd.unavailable?` · ${wd.unavailable} n/d`:''}`:'Da configurare',wd.active>0);
    if(cfg.show_motion)extras+=display('motion',cfg.motion_name||'Volumetrico','motion',!cfg.motion.length?'Da configurare':mo.active?`${mo.active} con movimento${mo.unavailable?` · ${mo.unavailable} n/d`:''}`:mo.unavailable?`Nessun movimento · ${mo.unavailable} n/d`:'Nessun movimento',mo.active>0);
    if(cfg.show_camera)extras+=display('camera',cfg.camera_name||'Spioncino','eye',!cfg.camera_entity?'Da configurare':!spKnown(cam)?'Camera non disponibile':`${cameraPerson===true?'Persona rilevata':cameraMotion===true?'Movimento rilevato':record===true?'REC attiva':record===false?'Non registra':cfg.recording_entity?'Registrazione n/d':'Video'}${cb!==null?` · ${cb}%`:''}`,record===true||cameraMotion===true||cameraPerson===true);
    const notes=this._error?`<div class="sp-note error" role="alert">${spEscape(this._error)}</div>`:(!cfg.controls_enabled?'<div class="sp-note">Modalità sola lettura. I comandi si abilitano dall’editor della card.</div>':'');
    this.shadowRoot.innerHTML=`<style>${SP_STYLE}</style><div class="sp-shell">
      <header class="sp-header"><div class="sp-eyebrow">${spEscape(cfg.eyebrow)}</div><div class="sp-title">${spEscape(cfg.title)}<b>.</b></div></header>
      <section class="sp-row ${alarmTriggered||sirenState===true?'sp-alarm-focus':''}"><div class="sp-main"><div class="sp-orb">${spIcon('shield')}</div><div class="sp-meta"><div class="sp-name">${spEscape(cfg.alarm_name||'Allarme')}</div><div class="sp-sub">${unit(aLabel,aState==='armed_home'||aState==='armed_away')}</div></div></div><div class="sp-actions">${modes}</div>${alarmMini?`<div class="sp-mini">${alarmMini}</div>`:''}</section>
      <section class="sp-row"><div class="sp-main"><div class="sp-orb">${spIcon('video')}</div><div class="sp-meta"><div class="sp-name">${spEscape(cfg.nvr_name||'Videosorveglianza')}</div><div class="sp-sub">${unit(nvrStatus,nvr===true)}</div></div><div class="sp-buttons">${nvrBtns}</div></div></section>
      <section class="sp-row"><div class="sp-main"><div class="sp-orb">${spIcon(lockState==='unlocked'?'unlock':'lock')}</div><div class="sp-meta"><div class="sp-name">${spEscape(cfg.lock_name||'Serratura')}</div><div class="sp-sub">${unit(lockStatus,lockState==='locked')}${lb!==null?` · ${lb}%`:''}</div></div>${btn(lockAction==='unlock'?'Sblocca':'Blocca',lockAction,lockAction==='unlock'?'unlock':'lock',disabled||!lockCan)}</div></section>
      ${extras?`<div class="sp-section">ACCESSI E SENSORI</div><div class="sp-extras">${extras}</div>`:''}${notes}</div>${this._modal?this._modalMarkup():''}`;
    const inpt=this.shadowRoot.querySelector('[data-alarm-code]');if(inpt && this._modal?.type==='alarm-code')inpt.value=this._modal.code||'';
  }
  _modalMarkup(){
    const modal=this._modal;
    const h=(name)=>`<div class="sp-dialoghead"><strong>${spEscape(name)}</strong><button type="button" class="sp-close" data-action="close" aria-label="Chiudi">${spIcon('x')}</button></div>`;
    let content='';
    if(modal.type==='group'){
      const grp=modal.group;const list=grp==='door'?[this._config.door_entity].filter(Boolean):this._config[grp];
      const mode=grp==='door'?'door':grp==='windows'?'windows':'motion';
      content=h({door:'Porta',windows:'Finestre',motion:'Volumetrico'}[grp])+`<div class="sp-sub">${grp==='motion'?'Sensori di movimento · sola lettura':'Tocca un’entità per aprire i dettagli Home Assistant.'}</div>`;
      content+=list.length?list.map(id=>{const item=this._entity(id);const n=item?.attributes?.friendly_name||id;return `<button type="button" class="sp-item" data-more-info="${spEscape(id)}">${spIcon(grp==='motion'?'motion':grp==='windows'?'window':'door')}<div class="sp-meta"><div class="sp-name">${spEscape(n)}</div><div class="sp-entity">${spEscape(id)}</div></div><div class="sp-small">${spEscape(spStateLabel(item,mode))}</div></button>`;}).join(''):'<div class="sp-sub">Nessuna entità configurata.</div>';
    }else if(modal.type==='camera'){
      const cfg=this._config;
      const motion=this._isOn(cfg.camera_motion_entity), person=this._isOn(cfg.camera_person_entity);
      const last=this._entity(cfg.camera_last_event_entity);
      const notice=(label,entity,on,positive,negative)=>`<div class="sp-event ${on===true?'active-accent':''}">${spIcon(on===true?'alert':'circle')}<div><strong>${spEscape(label)}</strong><div class="sp-small">${!entity?'Non monitorato':on===null?'Stato non disponibile':on?spEscape(positive):spEscape(negative)}</div></div></div>`;
      content=h('Spioncino')+`<div class="sp-sub">${spEscape(modal.status)}</div>`+
        `<div class="sp-event-location">${spIcon('eye')} Area monitorata: ${spEscape(cfg.camera_location_name || 'Davanti alla porta')}</div>`+
        notice('Movimento',cfg.camera_motion_entity,motion,'Movimento rilevato','Nessun movimento rilevato')+
        notice('Persone',cfg.camera_person_entity,person,'Persona rilevata','Nessuna persona rilevata')+
        (cfg.camera_last_event_entity?`<div class="sp-event-location">${spIcon('circle')} Ultimo evento segnalato: ${spEscape(spKnown(last)?last.state:'Non disponibile')}</div>`:'')+
        `<div class="sp-camera">${spIcon('video')}<div class="sp-small">Per il video e i controlli usa i dettagli nativi di Home Assistant.</div></div>${modal.camera?`<button type="button" class="sp-wide" data-more-info="${spEscape(modal.camera)}">Apri videocamera</button>`:''}`;
    }else if(modal.type==='pin'){
      const len=8;const dotCount=Math.max(4, Math.min(len, this._pin.length || 4));
      content=h('PIN di conferma')+`<div class="sp-sub">${spEscape(modal.label)}. Il PIN è una conferma visuale, non un controllo di accesso.</div><div class="sp-dots">${Array.from({length:dotCount},(_,i)=>`<span class="sp-pin-dot ${i<this._pin.length?'full':''}"></span>`).join('')}</div><div class="sp-pad">${['1','2','3','4','5','6','7','8','9','','0','del'].map(x=>x?`<button type="button" data-key="${x}" aria-label="${x==='del'?'Cancella':x}">${x==='del'?'⌫':x}</button>`:'<span></span>').join('')}</div><button type="button" class="sp-wide" data-action="verify-pin" ${this._pin.length<4||this._busy?'disabled':''}>Conferma</button>`;
    }else if(modal.type==='alarm-code'){
      content=h('Codice allarme')+`<div class="sp-sub">Inserisci il codice del pannello allarme. Non viene salvato.</div><input class="sp-input" type="password" inputmode="numeric" autocomplete="off" aria-label="Codice allarme" data-alarm-code/><button type="button" class="sp-wide" data-action="send-alarm" ${this._busy?'disabled':''}>Conferma</button>`;
    }else if(modal.type==='confirm'){
      content=h('Conferma comando')+`<div class="sp-sub">${spEscape(modal.message)}</div><button type="button" class="sp-wide" data-action="confirm-operation" ${this._busy?'disabled':''}>Conferma</button>`;
    }
    if(modal.error)content+=`<div class="sp-error" role="alert">${spEscape(modal.error)}</div>`;
    return `<div class="sp-backdrop" data-backdrop="1"><div class="sp-dialog" role="dialog" aria-modal="true" aria-label="${spEscape(modal.type)}">${content}</div></div>`;
  }
  _closeModal(){this._modal=null;this._pin='';this._lastRender='';this._paint();}
  _open(modal){this._modal=modal;this._pin='';this._lastRender='';this._paint();}
  async _run(domain,service,data){
    if(this._busy||!this._config.controls_enabled)return;
    this._busy=true;this._error='';this._lastRender='';this._paint();
    try{await this._hass.callService(domain,service,data);this._closeModal();}
    catch(e){this._error=`Comando non riuscito: ${spText(e?.message||'Errore Home Assistant',180)}`;this._closeModal();}
    finally{this._busy=false;this._lastRender='';this._paint();}
  }
  _alarmAction(action){
    const id=this._config.alarm_entity;
    if(!id||!spKnown(this._entity(id)))return;
    const map={disarm:'alarm_disarm','arm-home':'alarm_arm_home','arm-away':'alarm_arm_away'};
    if(!map[action])return;
    const needCode=action==='disarm'?this._config.alarm_disarm_code:(this._config.alarm_arm_code||this._entity(id)?.attributes?.code_arm_required===true);
    const perform={domain:'alarm_control_panel',service:map[action],data:{entity_id:id}};
    if(needCode)this._open({type:'alarm-code',operation:perform,code:''});else this._run(perform.domain,perform.service,perform.data);
  }
  _click(e){
    if(e.target?.dataset?.backdrop==='1'){this._closeModal();return;}
    const more=e.target.closest('[data-more-info]');if(more){const id=more.getAttribute('data-more-info');if(!this._entity(id))return;this._closeModal();this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId:id},bubbles:true,composed:true}));return;}
    const keypad=e.target.closest('[data-key]');if(keypad&&this._modal?.type==='pin'){
      const k=keypad.dataset.key;this._pin=k==='del'?this._pin.slice(0,-1):(this._pin+k).slice(0,8);this._lastRender='';this._paint();return;
    }
    const btn=e.target.closest('[data-action]');if(!btn)return;const a=btn.dataset.action; if(a==='close'){this._closeModal();return;}
    if(a.startsWith('detail-')){
      const group=a.slice(7);if(group==='camera'){
        const cam=this._entity(this._config.camera_entity);this._open({type:'camera',camera:spKnown(cam)?this._config.camera_entity:'',status:this._config.recording_entity?(this._isOn(this._config.recording_entity,this._config.recording_active_state)===true?'Registrazione attiva':'Stato registrazione disponibile nel pannello'):'Stato registrazione non monitorato'});
      }else this._open({type:'group',group});return;
    }
    if(!this._config.controls_enabled||this._busy)return;
    if(['disarm','arm-home','arm-away'].includes(a)){this._alarmAction(a);return;}
    if(a==='nvr-on'||a==='nvr-off'){
      const id=this._config[a==='nvr-on'?'nvr_on_script':'nvr_off_script'];
      if(id&&this._entity(id))this._run('script','turn_on',{entity_id:id});return;
    }
    if(a==='lock'){const id=this._config.lock_entity; if(id&&this._entity(id))this._run('lock','lock',{entity_id:id});return;}
    if(a==='unlock'){
      const id=this._config.lock_entity;if(!id||this._entity(id)?.state!=='locked')return;
      const op={domain:'lock',service:'unlock',data:{entity_id:id}};
      if(this._config.lock_pin_enabled){if(!this._config.lock_pin_hash){this._error='Configura prima un PIN di conferma nell’editor.';this._lastRender='';this._paint();return;}this._open({type:'pin',label:'Sblocca serratura',operation:op});}
      else if(this._config.lock_confirm_direct)this._open({type:'confirm',message:'Vuoi sbloccare la serratura?',operation:op});
      else this._run(op.domain,op.service,op.data);
      return;
    }
    if(a==='confirm-operation'&&this._modal?.type==='confirm'){const o=this._modal.operation;this._run(o.domain,o.service,o.data);return;}
    if(a==='send-alarm'&&this._modal?.type==='alarm-code'){
      const v=this.shadowRoot.querySelector('[data-alarm-code]')?.value||'';
      if(!v.trim()){this._modal.error='Inserisci il codice allarme.';this._lastRender='';this._paint();return;}
      const o=this._modal.operation;this._run(o.domain,o.service,{...o.data,code:v});return;
    }
    if(a==='verify-pin'&&this._modal?.type==='pin'){
      if(Date.now()<this._pinCooldown){this._modal.error='Troppi tentativi. Riprova più tardi.';this._lastRender='';this._paint();return;}
      if(this._busy)return;const op=this._modal.operation;this._busy=true;this._lastRender='';this._paint();
      spPinCheck(this._pin,this._config.lock_pin_hash).then(ok=>{
        this._busy=false;
        if(ok){this._pinFailures=0;this._run(op.domain,op.service,op.data);}else{
          this._pinFailures++;if(this._pinFailures>=5){this._pinCooldown=Date.now()+60000;this._pinFailures=0;}
          this._pin='';if(this._modal)this._modal.error='PIN non corretto.';this._lastRender='';this._paint();
        }
      }).catch(()=>{this._busy=false;this._pin='';if(this._modal)this._modal.error='Verifica PIN non disponibile in questa connessione.';this._lastRender='';this._paint();});
    }
  }
  _input(e){if(e.target.matches('[data-alarm-code]')&&this._modal?.type==='alarm-code')this._modal.code=e.target.value;}
}

class SecurityPanelCardEditor extends HTMLElement {
  constructor(){
    super();this.attachShadow({mode:'open'});this._config=spConfig();this._hass=null;this._tab='allarme';this._loading=false;
    this._notice=''; this._nativeTried=false;this._details={};
    this.shadowRoot.addEventListener('click',e=>this._click(e));
    this.shadowRoot.addEventListener('change',e=>this._change(e));
  }
  set hass(hass){this._hass=hass;this.shadowRoot.querySelectorAll('ha-selector').forEach(x=>x.hass=hass);}
  setConfig(raw){
    const cfg=spConfig(raw);if(JSON.stringify(cfg)===JSON.stringify(this._config)&&this.shadowRoot.querySelector('.sp-editor'))return;
    this._config=cfg;this._render();
  }
  connectedCallback(){this._render();this._ensureNative();}
  async _ensureNative(){
    if(this._nativeTried)return;this._nativeTried=true;
    if(!customElements.get('ha-selector')){
      try{const h=await window.loadCardHelpers?.();await h?.importSelector?.();}catch(e){console.debug('[Security Panel] Native selector unavailable:',e);}
    }
    this._render();
  }
  _emit(){this.dispatchEvent(new CustomEvent('config-changed',{detail:{config:{...this._config}},bubbles:true,composed:true}));}
  _update(key,value){this._config=spConfig({...this._config,[key]:value});this._emit();this._render();}
  _label(t){return `<div class="sp-label">${spEscape(t)}</div>`;}
  _text(key,label,extra=''){
    return `<div class="sp-field">${this._label(label)}<input class="sp-input" data-text="${key}" type="text" maxlength="80" value="${spEscape(this._config[key])}"/>${extra?`<div class="sp-tiny">${spEscape(extra)}</div>`:''}</div>`;
  }
  _check(key,label,explain=''){
    return `<div class="sp-row"><label for="sp_${key}">${spEscape(label)}${explain?`<div class="sp-muted">${spEscape(explain)}</div>`:''}</label><input id="sp_${key}" data-check="${key}" type="checkbox" ${this._config[key]?'checked':''}/></div>`;
  }
  _selector(key,label,help=''){
    const list=SP_DOMAINS[key]||[];
    return `<div class="sp-field" data-select-area="${key}">${this._label(label)}<div data-slot="${key}"></div><div class="sp-fallback"><input type="text" class="sp-input" data-fallback="${key}" value="${spEscape(this._config[key])}" placeholder="${spEscape(list[0])}.nome"/></div>${help?`<div class="sp-tiny">${spEscape(help)}</div>`:''}</div>`;
  }
  _array(key,label){
    const items=this._config[key];const descriptions=items.map((id,i)=>{
      const name=this._hass?.states?.[id]?.attributes?.friendly_name||id;
      return `<div class="sp-arrayitem"><div class="sp-arrayhead"><strong>${i+1}. ${spEscape(name)}</strong><button type="button" class="sp-remove" data-remove="${key}" data-id="${spEscape(id)}">Rimuovi</button></div><div class="sp-muted">${spEscape(id)}</div></div>`;
    }).join('');
    return `<div class="sp-panel"><div class="sp-label">${spEscape(label)} (${items.length})</div>${descriptions}<div class="sp-field" data-array-slot="${key}"><div class="sp-muted">Cerca e aggiungi un sensore</div><div data-slot="add-${key}"></div><div class="sp-fallback"><input type="text" class="sp-input" data-addfallback="${key}" placeholder="binary_sensor.nome"/></div></div></div>`;
  }
  _more(key,body){
    return `<details class="sp-more" data-details="${key}" ${this._details[key]?'open':''}><summary>Altre opzioni</summary><div class="sp-more-body">${body}</div></details>`;
  }
  _render(){
    if(!this.isConnected)return;
    this.shadowRoot.querySelectorAll('details[data-details]').forEach(el=>{this._details[el.dataset.details]=el.open;});
    const c=this._config;
    // Le schede Configurazione, Visibilità e Layout sono fornite da Home Assistant.
    const tabs=[['allarme','Allarme'],['nvr','Videosorveglianza'],['serratura','Serratura'],['sensori','Sensori'],['aspetto','Aspetto'],['avanzate','Avanzate']];
    let body='';
    if(this._tab==='allarme'){
      body='<div class="sp-heading">Configurazione allarme</div><div class="sp-desc">Seleziona il pannello di allarme presente in Home Assistant.</div>'+
        this._selector('alarm_entity','Entità allarme')+
        this._text('alarm_name','Nome visualizzato')+
        this._more('alarm-more',this._selector('siren_entity','Entità stato sirena (facoltativa)')+
          this._selector('base_entity','Entità diagnostica centrale (facoltativa)')+
          (c.base_entity?this._text('base_ok_state','Stato che indica centrale operativa','Lascia vuoto per mostrare lo stato senza interpretarlo.'):'')+
          this._check('alarm_disarm_code','Richiedi codice allarme per disinserire','Il codice viene inviato al pannello e non è salvato.')+
          this._check('alarm_arm_code','Richiedi codice allarme anche per inserire'));
    }
    if(this._tab==='nvr'){
      body='<div class="sp-heading">Videosorveglianza</div><div class="sp-desc">Configura i due script indipendenti. Senza un sensore di stato reale saranno mostrati entrambi i pulsanti.</div>'+
        this._selector('nvr_on_script','Script attivazione NVR')+
        this._selector('nvr_off_script','Script disattivazione NVR')+
        this._text('nvr_name','Nome visualizzato')+
        this._more('nvr-more',this._selector('nvr_state_entity','Entità stato NVR (facoltativa)')+
          (c.nvr_state_entity?this._text('nvr_active_state','Valore che indica NVR attivo','Per switch e binary_sensor normalmente on.') : ''));
    }
    if(this._tab==='serratura'){
      body='<div class="sp-heading">Configurazione serratura</div><div class="sp-desc">Collega la serratura, scegli il nome e la conferma richiesta prima dello sblocco.</div>'+
        this._selector('lock_entity','Entità serratura')+
        this._text('lock_name','Nome visualizzato')+
        this._selector('lock_battery_entity','Entità batteria (facoltativa)')+
        (c.lock_pin_hash?`<div class="sp-row"><label>PIN visuale per sbloccare<div class="sp-muted">Configurato. Per sostituirlo o disattivarlo serve il PIN precedente nell’editor.</div></label><input type="checkbox" checked disabled aria-label="PIN configurato"/></div>`:
          this._check('lock_pin_enabled','Richiedi PIN visuale per sbloccare','È una conferma nell’interfaccia, non un’autenticazione.'))+
        (c.lock_pin_enabled||c.lock_pin_hash?`<div class="sp-secret"><div class="sp-label">PIN di conferma serratura</div><div class="sp-muted">Da 4 a 8 cifre. Non è salvato in chiaro, ma la verifica avviene nel browser e può essere aggirata da chi modifica la configurazione.</div>
          ${c.lock_pin_hash?'<div class="sp-label" style="margin-top:12px">PIN attuale</div><input type="password" autocomplete="off" inputmode="numeric" class="sp-input" data-oldpin placeholder="Inserisci PIN attuale" maxlength="8"/>':''}
          <div class="sp-label" style="margin-top:12px">${c.lock_pin_hash?'Nuovo PIN':'Scegli il PIN'}</div><input type="password" autocomplete="new-password" inputmode="numeric" placeholder="4–8 cifre" minlength="4" maxlength="8" class="sp-input" data-newpin/>
          <button type="button" data-set-pin class="sp-action" style="margin-top:12px">${c.lock_pin_hash?'Cambia PIN':'Imposta PIN'}</button> ${c.lock_pin_hash?'<button type="button" class="sp-remove" data-clear-pin>Disattiva PIN</button>':''}<div class="sp-tiny">${c.lock_pin_hash?'Modifica protetta dal PIN corrente (solo a livello dell’interfaccia).':'PIN non configurato: lo sblocco con PIN resterà bloccato.'}</div></div>`:this._check('lock_confirm_direct','Richiedi conferma per sblocco diretto'));
    }
    if(this._tab==='sensori'){
      body='<div class="sp-heading">Accessi e sensori</div><div class="sp-desc">Seleziona le entità da visualizzare. Finestre e Volumetrico apriranno gli elenchi dei sensori.</div>'+
        this._check('show_door','Mostra porta')+(c.show_door?this._selector('door_entity','Entità porta')+this._text('door_name','Nome visualizzato porta'):'')+
        this._check('show_windows','Mostra finestre')+(c.show_windows?this._array('windows','Finestre monitorate')+this._text('windows_name','Nome visualizzato finestre'):'')+
        this._check('show_motion','Mostra volumetrico','Sola visualizzazione dello stato')+(c.show_motion?this._array('motion','Sensori di movimento')+this._text('motion_name','Nome visualizzato volumetrico'):'')+
        this._check('show_camera','Mostra spioncino digitale')+(c.show_camera?this._selector('camera_entity','Entità videocamera')+this._text('camera_name','Nome visualizzato spioncino')+
        this._more('camera-more',this._selector('camera_battery_entity','Batteria spioncino (facoltativa)')+
          this._selector('recording_entity','Entità stato registrazione (facoltativa)')+
          (c.recording_entity?this._text('recording_active_state','Valore che indica registrazione attiva','Per binary_sensor e switch normalmente on.') : '')+
          this._selector('camera_motion_entity','Sensore movimento davanti alla porta (facoltativo)')+
          this._selector('camera_person_entity','Sensore rilevamento persona (facoltativo)')+
          this._selector('camera_last_event_entity','Ultimo evento registrato dal dispositivo (facoltativo)')+
          this._text('camera_location_name','Area monitorata','Etichetta descrittiva, ad esempio Davanti alla porta o Pianerottolo.')):'');
    }
    if(this._tab==='aspetto'){
      body='<div class="sp-heading">Aspetto Edera</div><div class="sp-desc">Colori e tipografia coerenti con la dashboard Edera, in Light e Dark.</div>'+
        this._text('eyebrow','Intestazione superiore')+this._text('title','Titolo')+
        `<div class="sp-field">${this._label('Tema')}<select class="sp-input" data-choice="theme_mode"><option value="auto" ${c.theme_mode==='auto'?'selected':''}>Automatico (Home Assistant)</option><option value="light" ${c.theme_mode==='light'?'selected':''}>Light Edera</option><option value="dark" ${c.theme_mode==='dark'?'selected':''}>Dark Edera</option></select></div>`+
        this._check('alert_highlight','Evidenzia eventi con verde Edera','I riquadri con porte aperte, movimento e registrazione diventano verdi.');
    }
    if(this._tab==='avanzate'){
      body='<div class="sp-heading">Avanzate</div><div class="sp-desc">Inizialmente il pannello è in sola lettura. I comandi si abilitano soltanto dopo la verifica delle entità.</div>'+
        this._check('controls_enabled','Abilita i comandi reali','Allarme, script NVR e serratura. Non cambia le autorizzazioni di Home Assistant.')+
        this._check('alert_animation','Animazioni di attenzione','Disattivabili. Le preferenze di movimento ridotto vengono sempre rispettate.')+
        '<div class="sp-panel sp-muted">Il PIN visuale della serratura non impedisce comandi da altre dashboard o API già autorizzate. Il codice dell’allarme viene verificato dall’integrazione del pannello.</div>';
    }
    this.shadowRoot.innerHTML=`<style>${SP_EDITOR_CSS}</style><div class="sp-editor"><div class="sp-tabs">${tabs.map(([id,label])=>`<button type="button" class="sp-tab ${this._tab===id?'active':''}" data-tab="${id}">${label}</button>`).join('')}</div>${body}${this._notice?`<div class="sp-errors" role="alert">${spEscape(this._notice)}</div>`:''}</div>`;
    const hasNative=!!customElements.get('ha-selector');
    this.shadowRoot.querySelector('.sp-editor').classList.toggle('sp-no-native',!hasNative);
    if(!hasNative)return;
    this.shadowRoot.querySelectorAll('[data-slot]').forEach(slot=>{
      const tag=slot.getAttribute('data-slot');const isAdd=tag.startsWith('add-');const key=isAdd?tag.slice(4):tag;
      const ds=SP_DOMAINS[key];if(!ds)return;
      const selector=document.createElement('ha-selector');selector.hass=this._hass;
      selector.selector={entity:{domain:ds.length===1?ds[0]:ds}};
      selector.value=isAdd?'':c[key]||'';
      selector.setAttribute('aria-label',isAdd?`Aggiungi ${key}`:key);
      selector.addEventListener('value-changed',e=>{
        e.stopPropagation();if(!e.detail||!Object.prototype.hasOwnProperty.call(e.detail,'value'))return;
        const id=spEntity(e.detail.value,ds);
        if(isAdd){if(id&&!this._config[key].includes(id))this._update(key,[...this._config[key],id]);}
        else this._update(key,id);
      });
      slot.appendChild(selector);
    });
  }
  _click(e){
    const tab=e.target.closest('[data-tab]');if(tab){this._tab=tab.dataset.tab;this._notice='';this._render();return;}
    const remove=e.target.closest('[data-remove]');if(remove){const key=remove.dataset.remove;this._update(key,this._config[key].filter(x=>x!==remove.dataset.id));return;}
    if(e.target.closest('[data-clear-pin]')){
      const old=this.shadowRoot.querySelector('[data-oldpin]')?.value||'';
      if(!old){this._notice='Inserisci il PIN attuale per disattivarlo.';this._render();return;}
      this._notice='Verifica PIN in corso…';
      spPinCheck(old,this._config.lock_pin_hash).then(ok=>{
        if(!ok){this._notice='PIN attuale non corretto.';this._render();return;}
        this._config=spConfig({...this._config,lock_pin_hash:'',lock_pin_enabled:false,lock_confirm_direct:true});
        this._notice='PIN visuale disattivato. Lo sblocco diretto richiede conferma.';this._emit();this._render();
      }).catch(()=>{this._notice='Verifica PIN non disponibile.';this._render();});
      return;
    }
    if(e.target.closest('[data-set-pin]')){
      const pin=this.shadowRoot.querySelector('[data-newpin]')?.value||'';
      if(!/^\d{4,8}$/.test(pin)){this._notice='Il PIN deve contenere da 4 a 8 cifre.';this._render();return;}
      const old=this.shadowRoot.querySelector('[data-oldpin]')?.value||'';
      if(this._config.lock_pin_hash&&!old){this._notice='Inserisci il PIN attuale prima di cambiarlo.';this._render();return;}
      this._notice='Verifica in corso…';
      const verify=this._config.lock_pin_hash?spPinCheck(old,this._config.lock_pin_hash):Promise.resolve(true);
      verify.then(ok=>{if(!ok){this._notice='PIN attuale non corretto.';this._render();return;}return spPinMake(pin).then(hash=>{this._notice='PIN impostato.';this._update('lock_pin_hash',hash);});}).catch(e=>{this._notice=spText(e.message);this._render();});
    }
  }
  _change(e){
    const t=e.target;
    if(t.dataset.text)this._update(t.dataset.text,t.value);
    if(t.dataset.check){if(t.dataset.check==='lock_pin_enabled'&&!t.checked&&this._config.lock_pin_hash){this._notice='Disattiva il PIN inserendo prima il codice attuale.';this._render();return;}this._update(t.dataset.check,t.checked);}
    if(t.dataset.choice)this._update(t.dataset.choice,t.value);
    if(t.dataset.fallback){const key=t.dataset.fallback;const id=spEntity(t.value,SP_DOMAINS[key]);this._update(key,id);}
    if(t.dataset.addfallback){const key=t.dataset.addfallback;const id=spEntity(t.value,SP_DOMAINS[key]);if(id&&!this._config[key].includes(id))this._update(key,[...this._config[key],id]);}
  }
}

if(!customElements.get(SP_TAG)) customElements.define(SP_TAG,SecurityPanelCard);
if(!customElements.get(SP_EDITOR_TAG)) customElements.define(SP_EDITOR_TAG,SecurityPanelCardEditor);
if(typeof window!=='undefined'){
  window.customCards=window.customCards||[];
  if(!window.customCards.some(c=>c.type===SP_TAG))window.customCards.push({type:SP_TAG,name:'Security Panel Card',description:'Pannello sicurezza Edera: allarme, videosorveglianza, serratura e sensori.',preview:true});
}
