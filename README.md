# Security Panel Card

[![TikTok | Segui](assets/tiktok-segui.svg)](https://www.tiktok.com/@luigi.regolo)
[![Latest Release](https://img.shields.io/github/v/release/luigi-regolo/security-panel-card?style=flat-square&label=release)](https://github.com/luigi-regolo/security-panel-card/releases/latest)
[![License: GPL-3.0-only](https://img.shields.io/badge/license-GPL--3.0--only-blue?style=flat-square)](LICENSE)
[![HACS](https://img.shields.io/badge/HACS-Repository-41BDF5?style=flat-square)](https://my.home-assistant.io/redirect/hacs_repository/?owner=luigi-regolo&repository=security-panel-card&category=plugin)
[![GitHub Stars](https://img.shields.io/github/stars/luigi-regolo/security-panel-card?style=flat-square)](https://github.com/luigi-regolo/security-panel-card/stargazers)

## Overview

**Security Panel Card** is a custom security dashboard card for Home Assistant, designed with a minimalist, responsive interface inspired by the Edera Light and Dark visual styles.

It brings together alarm controls, video surveillance, smart locks, doors, windows, motion sensors, and digital peephole information in a single dashboard card.

The card uses entities and services already configured in Home Assistant. It is not tied to a specific device manufacturer and does not require a dedicated account, paid API, or subscription.

## Preview

<p align="center">
  <img src="assets/security-panel-light.png" alt="Security Panel Card — Edera Light preview" width="300" />
  <img src="assets/security-panel-dark.png" alt="Security Panel Card — Edera Dark preview" width="300" />
  <img src="assets/security-panel-popup.png" alt="Security Panel Card — windows details popup" width="300" />
</p>

*Security Panel Card in Edera Light and Dark modes, and the windows details popup. The previews use demonstration values and do not display private installation data.*

## Features

- **Alarm control:** Arm Home or Away, disarm, display the current alarm state, and request an alarm code when required by the integration.
- **Alarm history:** View the most recent confirmed triggered event found in the available Home Assistant history, including its date and time.
- **Siren status:** Monitor an optional siren entity. Separate manual siren control can be enabled for a supported `siren.*` or `switch.*` entity, with confirmation before activation.
- **Control panel status:** Display an optional status entity for the security system.
- **Video surveillance:** Run separate Home Assistant scripts to enable or disable cameras or an NVR. Without a status entity, the card shows "Stato non rilevato" and keeps both buttons available; with an optional status entity, it shows the current state and the relevant button.
- **Smart lock:** Display lock status, optional battery information, and lock/unlock controls with optional confirmation or visual PIN.
- **Doors and windows:** Monitor opening states, count open and closed windows, and inspect individual sensors.
- **Motion sensors:** Display movement detected by configured sensors without automatically executing commands.
- **Digital peephole:** Show the latest image from an `image.*` entity, optional battery level, recording status, and available movement information.
- **Summary at a glance:** A header indicator reports triggered alarms, unavailable data, open doors or windows, or that everything is closed.
- **Edera appearance:** Automatic, Light, and Dark themes, a compact layout that adapts to the card width, rounded elements, and native Home Assistant icons.
- **Visual configuration:** Configure supported entities, display options, and optional features through the dashboard editor.

Alarm-triggered warnings are shown in red only when the alarm panel reports `triggered`. Active door, window, and motion sensor states highlight the sensor icon in the Edera green.

Missing or unavailable entity information is not treated as a confirmed safe state, and the header summary reports it as unavailable data.

## Installation

### HACS (Recommended)

Install Security Panel Card directly from the default HACS catalog.

[![Open Security Panel Card in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=luigi-regolo&repository=security-panel-card&category=plugin)

1. Open **HACS** in Home Assistant.
2. Search for **Security Panel Card**.
3. Select **Security Panel Card** from the results.
4. Click **Download** to install the card.
5. Reload your dashboard if necessary.
6. Add **Security Panel Card** to your dashboard and configure it using the visual editor.

### Alternative: Custom repository

If you prefer to add the repository manually:

1. Open **HACS** and select **Custom repositories** from the menu.
2. Enter `https://github.com/luigi-regolo/security-panel-card`.
3. Select **Dashboard** as the repository type and add it.
4. Find **Security Panel Card** in HACS and download it.

### Manual installation

1. Download `dist/security-panel-card.js` from this repository.
2. Copy the JavaScript file to the `www` directory of your Home Assistant configuration.
3. In Home Assistant, open **Settings → Dashboards → Resources**.
4. Add `/local/security-panel-card.js` as a **JavaScript module**.
5. Reload the dashboard and add the custom card.

If the `www` directory was newly created, Home Assistant may require a restart before the file is accessible.

## Configuration and Usage

### Visual editor

Open a dashboard in edit mode, add **Security Panel Card**, and configure the available sections:

- **Alarm:** Alarm panel entity, optional siren and control panel status, and alarm code options.
- **Video Surveillance:** Activation and deactivation scripts, optional NVR status entity, and expected active state.
- **Smart Lock:** Lock entity, battery sensor, confirmation behavior, and optional visual PIN.
- **Sensors:** Door, windows, motion sensors, and digital peephole entities.
- **Appearance:** Card title, display names, Edera theme, and visual state highlighting.
- **Advanced:** Real command permissions and optional attention animations.

The editor uses native Home Assistant entity selectors where available. Entities can be cleared individually, and configured window or motion sensor rows can be removed separately.

No YAML configuration is required for normal setup.

### Example YAML configuration

```yaml
type: custom:security-panel-card
theme_mode: auto
alarm_entity: alarm_control_panel.example
controls_enabled: false
```

Replace `alarm_control_panel.example` with an actual alarm panel entity from your Home Assistant installation.

This example keeps all real commands disabled.

### Main configuration options

| Option | Description |
|---|---|
| `theme_mode` | `auto`, `light`, or `dark`. |
| `title` | Main card title. |
| `alarm_entity` | Home Assistant alarm control panel entity. |
| `nvr_on_script` / `nvr_off_script` | Optional NVR activation and deactivation scripts. |
| `nvr_state_entity` | Optional independent status entity for cameras or NVR, for example an input boolean updated by your scripts. |
| `lock_entity` | Smart lock entity. |
| `lock_battery_entity` | Optional lock battery sensor. |
| `door_entity` | Optional door contact sensor. |
| `windows` / `motion` | Lists of window and motion sensors. |
| `image_entity` | Digital peephole's latest image entity. |
| `recording_entity` | Optional independent recording status entity. |
| `controls_enabled` | Enables real commands; disabled by default. |
| `siren_manual_enabled` | Optional manual siren control, separately configured. |
| `alert_animation` | Optional attention animations. |

Additional settings are available in the visual editor.

### Enabling real commands

**Security Panel Card operates in read-only mode by default.**

To enable supported controls:

1. Open the dashboard editor and select Security Panel Card.
2. Open **Advanced** (`Avanzate`).
3. Enable **Real Commands** (`Abilita i comandi reali`).
4. Verify the selected entities before using any command.

These settings do not grant additional Home Assistant permissions.

Manual siren control must also be enabled separately under **Alarm → More options**, with a supported controllable entity selected. Activating the siren requires explicit confirmation.

### Optional visual lock PIN

The lock PIN is an optional browser-side confirmation feature.

When enabled, a salted PBKDF2-SHA256 derived value is stored instead of the plaintext PIN. Secure browser cryptographic functionality is required.

**Important:** The visual PIN is not an authentication system and must not be relied upon for physical access security. Users already authorized to control the lock through Home Assistant may use other interfaces or services.

## Compatibility and Requirements

Security Panel Card requires:

- Home Assistant with support for custom JavaScript dashboard cards.
- Compatible Home Assistant entities for the functions being configured.
- HACS only when using the HACS installation method.

Supported entity domains include `alarm_control_panel`, `script`, `lock`, `siren`, `switch`, `image`, `binary_sensor`, and `sensor`, along with other compatible entities supported by individual settings.

Optional historical information requires accessible Home Assistant history/Recorder data. Historical results depend on retention settings, entity exclusions, and available records.

No specific minimum Home Assistant version has been independently verified for this repository.

The card does not require a dedicated paid service or additional remote JavaScript libraries.

## Privacy and Security

Security Panel Card operates through Home Assistant entities, services, and the permissions of the authenticated user.

- Real commands are disabled by default.
- Alarm codes are requested when needed and are not stored in the card configuration.
- No Home Assistant administrator password is requested by the card.
- The optional lock PIN provides only local interface confirmation.
- The card does not include advertising, analytics, telemetry, or user-tracking services.
- Camera and sensor information is obtained through Home Assistant.
- Device integrations may independently communicate with their manufacturers' cloud services.

**Security Panel Card is not a certified intrusion detection or access control system.** Its security depends on Home Assistant permissions, configured integrations, and the connected devices.

Unknown, unavailable, or missing information must not be interpreted as confirmation that a property or device is secure.

## Releases

Published versions are available through [GitHub Releases](https://github.com/luigi-regolo/security-panel-card/releases).

## Copyright & License

Copyright © 2026 luigi-regolo.

Original project created and maintained by **luigi-regolo**.

Licensed under the **GNU General Public License version 3 only (GPL-3.0-only)**.

See the [LICENSE](LICENSE) file for the complete license terms.

The software is provided without warranty to the extent permitted by applicable law.
