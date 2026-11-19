/**
 * Security Panel Card — Home Assistant dashboard card. Version 1.3
 * Copyright (c) 2026 luigi-regolo. SPDX-License-Identifier: GPL-3.0-only.
 * No external scripts, fonts, analytics or assets.
 * The optional lock PIN is a CLIENT-SIDE UI confirmation only, NOT access control.
 */
const SP_VERSION = '1.3';
const SP_TAG = 'security-panel-card';
const SP_EDITOR_TAG = 'security-panel-card-editor';
/* ---------------------------------------------------------------- languages */
// Italian, English, German and French. The language follows the Home Assistant user; English is the fallback.
const SP_LANGS = [['it', 'Italiano'], ['en', 'English'], ['de', 'Deutsch'], ['fr', 'Français']];
const SP_LOCALE = { it: 'it-IT', en: 'en-GB', de: 'de-DE', fr: 'fr-FR' };
// Every text is [it, en, de, fr].
const SP_STR = {
  // default names (a saved value equal to the Italian default is shown translated)
  title_def: ['Sicurezza', 'Security', 'Sicherheit', 'Sécurité'],
  alarm: ['Allarme', 'Alarm', 'Alarm', 'Alarme'],
  nvr: ['Videosorveglianza', 'Video surveillance', 'Videoüberwachung', 'Vidéosurveillance'],
  lock: ['Serratura', 'Smart lock', 'Türschloss', 'Serrure'],
  door: ['Porta', 'Door', 'Tür', 'Porte'],
  windows: ['Finestre', 'Windows', 'Fenster', 'Fenêtres'],
  motion: ['Volumetrico', 'Motion sensors', 'Bewegungsmelder', 'Détecteurs de mouvement'],
  camera: ['Spioncino', 'Peephole', 'Türspion', 'Judas'],
  camera_digital: ['Spioncino digitale', 'Digital peephole', 'Digitaler Türspion', 'Judas numérique'],
  loc_def: ['Davanti alla porta', 'In front of the door', 'Vor der Tür', 'Devant la porte'],
  // states
  s_disarmed: ['Disinserito', 'Disarmed', 'Unscharf', 'Désarmé'],
  s_home: ['Inserito · Casa', 'Armed · Home', 'Scharf · Zuhause', 'Armé · Maison'],
  s_away: ['Inserito · Fuori casa', 'Armed · Away', 'Scharf · Abwesend', 'Armé · Absent'],
  s_pending: ['In attesa', 'Pending', 'Ausstehend', 'En attente'],
  s_arming: ['Inserimento in corso', 'Arming', 'Wird scharf geschaltet', 'Armement en cours'],
  s_trig: ['ALLARME ATTIVO', 'ALARM TRIGGERED', 'ALARM AUSGELÖST', 'ALARME DÉCLENCHÉE'],
  s_disarming: ['Disinserimento in corso', 'Disarming', 'Wird unscharf geschaltet', 'Désarmement en cours'],
  na: ['Non disponibile', 'Unavailable', 'Nicht verfügbar', 'Indisponible'],
  siren_s: ['Sirena: {s}', 'Siren: {s}', 'Sirene: {s}', 'Sirène : {s}'],
  siren_on: ['Sirena attiva', 'Siren on', 'Sirene aktiv', 'Sirène active'],
  siren_off: ['Sirena inattiva', 'Siren off', 'Sirene inaktiv', 'Sirène inactive'],
  base_na: ['Centrale non disponibile', 'Base station unavailable', 'Zentrale nicht verfügbar', 'Centrale indisponible'],
  base_ok: ['Centrale operativa', 'Base station OK', 'Zentrale in Betrieb', 'Centrale opérationnelle'],
  base_chk: ['Verificare centrale', 'Check base station', 'Zentrale prüfen', 'Vérifier la centrale'],
  base_s: ['Centrale: {s}', 'Base station: {s}', 'Zentrale: {s}', 'Centrale : {s}'],
  l_locked: ['Bloccata', 'Locked', 'Verriegelt', 'Verrouillée'],
  l_unlocked: ['Sbloccata', 'Unlocked', 'Entriegelt', 'Déverrouillée'],
  l_locking: ['Blocco in corso', 'Locking', 'Wird verriegelt', 'Verrouillage en cours'],
  l_unlocking: ['Sblocco in corso', 'Unlocking', 'Wird entriegelt', 'Déverrouillage en cours'],
  l_jammed: ['Bloccata · Errore', 'Jammed', 'Blockiert', 'Coincée'],
  bat: ['Batteria {n}%', 'Battery {n}%', 'Batterie {n} %', 'Batterie {n} %'],
  nvr_none: ['Stato non rilevato', 'State not detected', 'Status nicht erfasst', 'État non détecté'],
  nvr_s: ['Stato: {s}', 'State: {s}', 'Status: {s}', 'État : {s}'],
  nvr_mon: ['Monitorato', 'Monitored', 'Überwacht', 'Surveillé'],
  nvr_nomon: ['Non monitorato', 'Not monitored', 'Nicht überwacht', 'Non surveillé'],
  rec_none: ['Registrazione non monitorata', 'Recording not monitored', 'Aufzeichnung nicht überwacht', 'Enregistrement non surveillé'],
  rec_na: ['Registrazione: dato non disponibile', 'Recording: no data', 'Aufzeichnung: keine Daten', 'Enregistrement : donnée indisponible'],
  rec_on: ['In registrazione', 'Recording', 'Nimmt auf', 'En enregistrement'],
  rec_off: ['Non in registrazione', 'Not recording', 'Keine Aufzeichnung', 'Pas d’enregistrement'],
  // header summary
  sum_trig: ['Allarme scattato', 'Alarm triggered', 'Alarm ausgelöst', 'Alarme déclenchée'],
  sum_miss_1: ['{n} dato non disponibile', '{n} item unavailable', '{n} Wert nicht verfügbar', '{n} donnée indisponible'],
  sum_miss_n: ['{n} dati non disponibili', '{n} items unavailable', '{n} Werte nicht verfügbar', '{n} données indisponibles'],
  sum_door: ['porta aperta', 'door open', 'Tür offen', 'porte ouverte'],
  sum_win_1: ['{n} finestra aperta', '{n} window open', '{n} Fenster offen', '{n} fenêtre ouverte'],
  sum_win_n: ['{n} finestre aperte', '{n} windows open', '{n} Fenster offen', '{n} fenêtres ouvertes'],
  sum_ok: ['Tutto chiuso', 'All closed', 'Alles geschlossen', 'Tout fermé'],
  // buttons
  b_disarm: ['Disattiva', 'Disarm', 'Unscharf', 'Désarmer'],
  b_home: ['Casa', 'Home', 'Zuhause', 'Maison'],
  b_away: ['Fuori casa', 'Away', 'Abwesend', 'Absent'],
  b_on: ['Attiva', 'Turn on', 'Einschalten', 'Activer'],
  b_off: ['Disattiva', 'Turn off', 'Ausschalten', 'Désactiver'],
  b_unlock: ['Sblocca', 'Unlock', 'Entriegeln', 'Déverrouiller'],
  b_lock: ['Blocca', 'Lock', 'Verriegeln', 'Verrouiller'],
  b_siren_on: ['Attiva sirena', 'Sound siren', 'Sirene einschalten', 'Activer la sirène'],
  b_siren_off: ['Spegni sirena', 'Silence siren', 'Sirene ausschalten', 'Éteindre la sirène'],
  siren_manual: ['Controllo manuale sirena', 'Manual siren control', 'Manuelle Sirenensteuerung', 'Commande manuelle de la sirène'],
  last_alarm: ['Ultimo allarme: {ago}', 'Last alarm: {ago}', 'Letzter Alarm: {ago}', 'Dernière alarme : {ago}'],
  last_alarm_q: ['Ultimo allarme: consulta storico', 'Last alarm: view history', 'Letzter Alarm: Verlauf ansehen', 'Dernière alarme : voir l’historique'],
  // tiles
  cfg_needed: ['Da configurare', 'Not configured', 'Nicht konfiguriert', 'À configurer'],
  st_open: ['Aperta', 'Open', 'Offen', 'Ouverte'],
  st_closed: ['Chiusa', 'Closed', 'Geschlossen', 'Fermée'],
  st_motion: ['Movimento rilevato', 'Motion detected', 'Bewegung erkannt', 'Mouvement détecté'],
  st_nomotion: ['Nessun movimento', 'No motion', 'Keine Bewegung', 'Aucun mouvement'],
  win_open_1: ['{n} aperta', '{n} open', '{n} offen', '{n} ouverte'],
  win_open_n: ['{n} aperte', '{n} open', '{n} offen', '{n} ouvertes'],
  win_closed_1: ['{n} chiusa', '{n} closed', '{n} geschlossen', '{n} fermée'],
  win_closed_n: ['{n} chiuse', '{n} closed', '{n} geschlossen', '{n} fermées'],
  nd: ['n/d', 'n/a', 'k. A.', 'n/d'],
  nd_n: ['{n} n/d', '{n} n/a', '{n} k. A.', '{n} n/d'],
  mo_active: ['{n} con movimento', '{n} with motion', '{n} mit Bewegung', '{n} avec mouvement'],
  img_cfg: ['Immagine da configurare', 'Image not configured', 'Bild nicht konfiguriert', 'Image à configurer'],
  img_na: ['Immagine non disponibile', 'Image unavailable', 'Bild nicht verfügbar', 'Image indisponible'],
  mv_ago: ['Movimento {ago}', 'Motion {ago}', 'Bewegung {ago}', 'Mouvement {ago}'],
  rec: ['REC', 'REC', 'REC', 'REC'],
  rec_inactive: ['REC inattiva', 'REC off', 'REC aus', 'REC inactif'],
  rec_nd: ['REC n/d', 'REC n/a', 'REC k. A.', 'REC n/d'],
  mv_nd: ['Movimento n/d', 'Motion n/a', 'Bewegung k. A.', 'Mouvement n/d'],
  tile_bat: ['Batteria {n}%', 'Battery {n}%', 'Batterie {n} %', 'Batterie {n} %'],
  d_door: ['Dettagli porta', 'Door details', 'Türdetails', 'Détails de la porte'],
  d_windows: ['Dettagli finestre', 'Window details', 'Fensterdetails', 'Détails des fenêtres'],
  d_motion: ['Dettagli movimento', 'Motion details', 'Bewegungsdetails', 'Détails du mouvement'],
  d_camera: ['Apri dettagli immagini', 'Open image details', 'Bilddetails öffnen', 'Ouvrir les détails de l’image'],
  d_default: ['Visualizza dettagli', 'View details', 'Details anzeigen', 'Voir les détails'],
  sec_access: ['ACCESSI E SENSORI', 'ACCESS AND SENSORS', 'ZUGÄNGE UND SENSOREN', 'ACCÈS ET CAPTEURS'],
  note_ro: ['Modalità sola lettura. I comandi si abilitano dall’editor della card.', 'Read-only mode. Commands are enabled in the card editor.', 'Schreibgeschützter Modus. Befehle werden im Karteneditor aktiviert.', 'Mode lecture seule. Les commandes s’activent dans l’éditeur de la carte.'],
  trig_t: ['Allarme scattato', 'Alarm triggered', 'Alarm ausgelöst', 'Alarme déclenchée'],
  trig_n: ['Il pannello Home Assistant segnala un allarme attivo. Verifica la situazione.', 'Home Assistant reports an active alarm. Check the situation.', 'Home Assistant meldet einen aktiven Alarm. Bitte die Lage prüfen.', 'Home Assistant signale une alarme active. Vérifiez la situation.'],
  // time
  t_now: ['adesso', 'now', 'jetzt', 'maintenant'],
  t_min: ['{n} min fa', '{n} min ago', 'vor {n} Min.', 'il y a {n} min'],
  t_h_1: ['{n} ora fa', '{n} hour ago', 'vor {n} Std.', 'il y a {n} h'],
  t_h_n: ['{n} ore fa', '{n} hours ago', 'vor {n} Std.', 'il y a {n} h'],
  t_d_1: ['{n} giorno fa', '{n} day ago', 'vor {n} Tag', 'il y a {n} jour'],
  t_d_n: ['{n} giorni fa', '{n} days ago', 'vor {n} Tagen', 'il y a {n} jours'],
  // popups
  p_sensor: ['Sensore', 'Sensor', 'Sensor', 'Capteur'],
  p_close: ['Chiudi', 'Close', 'Schließen', 'Fermer'],
  p_confirm: ['Conferma', 'Confirm', 'Bestätigen', 'Confirmer'],
  p_del: ['Cancella', 'Delete', 'Löschen', 'Effacer'],
  p_sub_tap: ['Tocca un’entità per aprire i dettagli Home Assistant.', 'Tap an entity to open its Home Assistant details.', 'Entität antippen, um die Home-Assistant-Details zu öffnen.', 'Touchez une entité pour ouvrir ses détails Home Assistant.'],
  p_sub_motion: ['Sensori di movimento · sola lettura', 'Motion sensors · read only', 'Bewegungsmelder · nur lesen', 'Détecteurs de mouvement · lecture seule'],
  p_last_open: ['Ultima apertura', 'Last opened', 'Zuletzt geöffnet', 'Dernière ouverture'],
  p_last_motion: ['Ultimo movimento', 'Last motion', 'Letzte Bewegung', 'Dernier mouvement'],
  p_unavail: ['non disponibile', 'unavailable', 'nicht verfügbar', 'indisponible'],
  p_none: ['Nessuna entità configurata.', 'No entities configured.', 'Keine Entitäten konfiguriert.', 'Aucune entité configurée.'],
  ah_title: ['Ultimo allarme', 'Last alarm', 'Letzter Alarm', 'Dernière alarme'],
  ah_strong: ['Ultimo allarme scattato', 'Last alarm triggered', 'Zuletzt ausgelöster Alarm', 'Dernière alarme déclenchée'],
  ah_loading: ['Consultazione cronologia…', 'Checking history…', 'Verlauf wird abgefragt…', 'Consultation de l’historique…'],
  ah_none: ['Nessun evento disponibile nella cronologia consultata', 'No event available in the history checked', 'Kein Ereignis im abgefragten Verlauf', 'Aucun événement dans l’historique consulté'],
  ah_now: ['Il pannello segnala attualmente un allarme scattato.', 'The panel currently reports a triggered alarm.', 'Das Bedienfeld meldet derzeit einen ausgelösten Alarm.', 'Le panneau signale actuellement une alarme déclenchée.'],
  ah_only: ['La card mostra soltanto eventi registrati dall’entità allarme.', 'The card only shows events recorded by the alarm entity.', 'Die Karte zeigt nur Ereignisse der Alarm-Entität.', 'La carte n’affiche que les événements enregistrés par l’entité d’alarme.'],
  ah_cause: ['La causa non viene dedotta da sirena o sensori.', 'The cause is not inferred from the siren or sensors.', 'Die Ursache wird nicht aus Sirene oder Sensoren abgeleitet.', 'La cause n’est pas déduite de la sirène ni des capteurs.'],
  ah_rec: ['Gli eventi storici dipendono dalla disponibilità del Recorder Home Assistant.', 'Historical events depend on the Home Assistant Recorder being available.', 'Verlaufsdaten hängen vom Home-Assistant-Recorder ab.', 'Les événements passés dépendent de la disponibilité du Recorder Home Assistant.'],
  cam_last_img: ['Ultima immagine rilevata', 'Latest detected image', 'Zuletzt erkanntes Bild', 'Dernière image détectée'],
  cam_alt: ['Ultima immagine rilevata davanti alla porta', 'Latest image detected in front of the door', 'Zuletzt erkanntes Bild vor der Tür', 'Dernière image détectée devant la porte'],
  cam_noimg: ['Immagine non disponibile. Seleziona un’entità image.* nell’editor.', 'Image unavailable. Select an image.* entity in the editor.', 'Bild nicht verfügbar. Wähle im Editor eine image.*-Entität.', 'Image indisponible. Sélectionnez une entité image.* dans l’éditeur.'],
  cam_motion: ['Ultimo movimento rilevato', 'Last motion detected', 'Letzte erkannte Bewegung', 'Dernier mouvement détecté'],
  cam_notavail: ['Non disponibile negli eventi recenti', 'Not available in recent events', 'In den letzten Ereignissen nicht verfügbar', 'Indisponible dans les événements récents'],
  cam_rec: ['Stato registrazione', 'Recording status', 'Aufzeichnungsstatus', 'État de l’enregistrement'],
  cam_bat: ['Batteria', 'Battery', 'Batterie', 'Batterie'],
  pin_title: ['PIN di conferma', 'Confirmation PIN', 'Bestätigungs-PIN', 'PIN de confirmation'],
  pin_sub: ['{l}. Il PIN è una conferma visuale, non un controllo di accesso.', '{l}. The PIN is a visual confirmation, not access control.', '{l}. Die PIN ist nur eine optische Bestätigung, keine Zugriffskontrolle.', '{l}. Le PIN est une simple confirmation visuelle, pas un contrôle d’accès.'],
  pin_unlock: ['Sblocca serratura', 'Unlock the lock', 'Schloss entriegeln', 'Déverrouiller la serrure'],
  ac_title: ['Codice allarme', 'Alarm code', 'Alarmcode', 'Code d’alarme'],
  ac_sub: ['Inserisci il codice del pannello allarme. Non viene salvato.', 'Enter the alarm panel code. It is not saved.', 'Code der Alarmzentrale eingeben. Er wird nicht gespeichert.', 'Saisissez le code du panneau d’alarme. Il n’est pas enregistré.'],
  cf_title: ['Conferma comando', 'Confirm command', 'Befehl bestätigen', 'Confirmer la commande'],
  cf_siren: ['Vuoi attivare manualmente la sirena? Potrebbe produrre un suono forte.', 'Sound the siren manually? It may be very loud.', 'Sirene manuell einschalten? Sie kann sehr laut sein.', 'Activer manuellement la sirène ? Elle peut être très forte.'],
  cf_unlock: ['Vuoi sbloccare la serratura?', 'Unlock the lock?', 'Schloss entriegeln?', 'Déverrouiller la serrure ?'],
  e_cmd: ['Comando non riuscito: {m}', 'Command failed: {m}', 'Befehl fehlgeschlagen: {m}', 'Échec de la commande : {m}'],
  e_ha: ['Errore Home Assistant', 'Home Assistant error', 'Home-Assistant-Fehler', 'Erreur Home Assistant'],
  e_nopin: ['Configura prima un PIN di conferma nell’editor.', 'Set a confirmation PIN in the editor first.', 'Lege zuerst im Editor eine Bestätigungs-PIN fest.', 'Configurez d’abord un PIN de confirmation dans l’éditeur.'],
  e_nocode: ['Inserisci il codice allarme.', 'Enter the alarm code.', 'Alarmcode eingeben.', 'Saisissez le code d’alarme.'],
  e_many: ['Troppi tentativi. Riprova più tardi.', 'Too many attempts. Try again later.', 'Zu viele Versuche. Bitte später erneut versuchen.', 'Trop de tentatives. Réessayez plus tard.'],
  e_badpin: ['PIN non corretto.', 'Incorrect PIN.', 'Falsche PIN.', 'PIN incorrect.'],
  e_pinna: ['Verifica PIN non disponibile in questa connessione.', 'PIN check unavailable on this connection.', 'PIN-Prüfung über diese Verbindung nicht verfügbar.', 'Vérification du PIN indisponible sur cette connexion.'],
  e_https: ['PIN disponibile solo in una connessione HTTPS affidabile. Su HTTP scegli la conferma senza PIN.', 'The PIN needs a trusted HTTPS connection. On HTTP, choose confirmation without a PIN.', 'Die PIN ist nur mit einer vertrauenswürdigen HTTPS-Verbindung verfügbar. Bei HTTP die Bestätigung ohne PIN wählen.', 'Le PIN nécessite une connexion HTTPS fiable. En HTTP, choisissez la confirmation sans PIN.'],
  rec_unk: ['Stato non interpretabile', 'State not interpretable', 'Status nicht interpretierbar', 'État non interprétable'],
  e_rand: ['Generatore casuale sicuro non disponibile.', 'Secure random generator unavailable.', 'Sicherer Zufallsgenerator nicht verfügbar.', 'Générateur aléatoire sécurisé indisponible.'],
  // editor
  t_alarm: ['Allarme', 'Alarm', 'Alarm', 'Alarme'],
  t_modules: ['Moduli', 'Modules', 'Module', 'Modules'],
  t_look: ['Aspetto', 'Appearance', 'Darstellung', 'Apparence'],
  t_adv: ['Avanzate', 'Advanced', 'Erweitert', 'Avancé'],
  secs: ['Sezioni', 'Sections', 'Abschnitte', 'Sections'],
  al_head: ['Configurazione allarme', 'Alarm setup', 'Alarm-Einrichtung', 'Configuration de l’alarme'],
  al_desc: ['Seleziona il pannello di allarme presente in Home Assistant.', 'Select the alarm panel from Home Assistant.', 'Wähle die Alarmzentrale aus Home Assistant.', 'Sélectionnez le panneau d’alarme de Home Assistant.'],
  e_alarm_entity: ['Entità allarme', 'Alarm entity', 'Alarm-Entität', 'Entité d’alarme'],
  e_name: ['Nome visualizzato', 'Display name', 'Anzeigename', 'Nom affiché'],
  e_show_alarm: ['Mostra il pannello allarme', 'Show the alarm panel', 'Alarmfeld anzeigen', 'Afficher le panneau d’alarme'],
  e_show_alarm_h: ['Disattivalo per usare solo gli altri moduli.', 'Turn it off to use only the other modules.', 'Ausschalten, um nur die anderen Module zu nutzen.', 'Désactivez-le pour n’utiliser que les autres modules.'],
  e_more: ['Altre opzioni', 'More options', 'Weitere Optionen', 'Autres options'],
  e_siren_state: ['Entità stato sirena (facoltativa)', 'Siren status entity (optional)', 'Sirenen-Statusentität (optional)', 'Entité d’état de la sirène (facultatif)'],
  e_siren_manual: ['Consenti controllo manuale sirena', 'Allow manual siren control', 'Manuelle Sirenensteuerung erlauben', 'Autoriser la commande manuelle de la sirène'],
  e_siren_manual_h: ['Facoltativo. Richiede anche Abilita i comandi reali in Avanzate.', 'Optional. Also needs Enable real commands in Advanced.', 'Optional. Erfordert auch „Echte Befehle aktivieren“ unter Erweitert.', 'Facultatif. Nécessite aussi « Activer les commandes réelles » dans Avancé.'],
  e_siren_ctl: ['Entità comando sirena (siren.* o switch.*)', 'Siren control entity (siren.* or switch.*)', 'Sirenen-Steuerentität (siren.* oder switch.*)', 'Entité de commande de la sirène (siren.* ou switch.*)'],
  e_siren_ctl_h: ['Non selezionare binary_sensor: serve un dispositivo comandabile. L’attivazione richiede conferma.', 'Do not pick a binary_sensor: a controllable device is needed. Turning it on needs confirmation.', 'Keinen binary_sensor wählen: Es wird ein steuerbares Gerät benötigt. Das Einschalten erfordert eine Bestätigung.', 'Ne choisissez pas un binary_sensor : il faut un appareil commandable. L’activation demande une confirmation.'],
  e_base: ['Entità diagnostica centrale (facoltativa)', 'Base station diagnostic entity (optional)', 'Diagnose-Entität der Zentrale (optional)', 'Entité de diagnostic de la centrale (facultatif)'],
  e_base_ok: ['Stato che indica centrale operativa', 'State meaning the base station is OK', 'Status für „Zentrale in Betrieb“', 'État indiquant que la centrale est opérationnelle'],
  e_base_ok_h: ['Lascia vuoto per mostrare lo stato senza interpretarlo.', 'Leave empty to show the state without interpreting it.', 'Leer lassen, um den Status ohne Deutung anzuzeigen.', 'Laissez vide pour afficher l’état sans l’interpréter.'],
  e_disarm_code: ['Richiedi codice allarme per disinserire', 'Ask for the alarm code to disarm', 'Alarmcode zum Entschärfen verlangen', 'Demander le code d’alarme pour désarmer'],
  e_disarm_code_h: ['Il codice viene inviato al pannello e non è salvato.', 'The code is sent to the panel and is not saved.', 'Der Code wird an die Zentrale gesendet und nicht gespeichert.', 'Le code est envoyé au panneau et n’est pas enregistré.'],
  e_arm_code: ['Richiedi codice allarme anche per inserire', 'Ask for the alarm code to arm as well', 'Alarmcode auch zum Scharfschalten verlangen', 'Demander aussi le code d’alarme pour armer'],
  mo_head: ['Moduli', 'Modules', 'Module', 'Modules'],
  mo_desc: ['Ogni modulo funziona anche da solo. Attiva quelli che ti servono e ordinali.', 'Each module also works on its own. Turn on the ones you need and order them.', 'Jedes Modul funktioniert auch einzeln. Aktiviere die benötigten und ordne sie.', 'Chaque module fonctionne aussi seul. Activez ceux dont vous avez besoin et ordonnez-les.'],
  m_on: ['Mostra il modulo', 'Show module', 'Modul anzeigen', 'Afficher le module'],
  mv_up: ['Sposta su {n}', 'Move {n} up', '{n} nach oben', 'Monter {n}'],
  mv_dn: ['Sposta giù {n}', 'Move {n} down', '{n} nach unten', 'Descendre {n}'],
  h_nvr: ['Configura i due script indipendenti. Senza un sensore di stato reale saranno mostrati entrambi i pulsanti.', 'Set up the two independent scripts. Without a real status sensor both buttons are shown.', 'Richte die beiden unabhängigen Skripte ein. Ohne echten Statussensor werden beide Schaltflächen angezeigt.', 'Configurez les deux scripts indépendants. Sans capteur d’état réel, les deux boutons sont affichés.'],
  e_nvr_on: ['Script attivazione NVR', 'NVR turn-on script', 'NVR-Einschaltskript', 'Script d’activation du NVR'],
  e_nvr_off: ['Script disattivazione NVR', 'NVR turn-off script', 'NVR-Ausschaltskript', 'Script de désactivation du NVR'],
  e_nvr_state: ['Entità stato NVR (facoltativa)', 'NVR status entity (optional)', 'NVR-Statusentität (optional)', 'Entité d’état du NVR (facultatif)'],
  e_nvr_val: ['Valore che indica NVR attivo', 'Value meaning NVR is active', 'Wert für „NVR aktiv“', 'Valeur indiquant que le NVR est actif'],
  e_nvr_val_h: ['Per switch e binary_sensor normalmente on.', 'For switches and binary sensors it is usually on.', 'Bei Schaltern und Binärsensoren normalerweise on.', 'Pour les interrupteurs et capteurs binaires, c’est normalement on.'],
  h_lock: ['Collega la serratura, scegli il nome e la conferma richiesta prima dello sblocco.', 'Link the lock, choose its name and the confirmation required before unlocking.', 'Verknüpfe das Schloss, wähle den Namen und die Bestätigung vor dem Entriegeln.', 'Associez la serrure, choisissez son nom et la confirmation requise avant le déverrouillage.'],
  e_lock: ['Entità serratura', 'Lock entity', 'Schloss-Entität', 'Entité de la serrure'],
  e_lock_bat: ['Entità batteria (facoltativa)', 'Battery entity (optional)', 'Batterie-Entität (optional)', 'Entité de la batterie (facultatif)'],
  pin_row: ['PIN visuale per sbloccare', 'Visual PIN to unlock', 'Optische PIN zum Entriegeln', 'PIN visuel pour déverrouiller'],
  pin_set: ['Configurato. Per sostituirlo o disattivarlo serve il PIN precedente nell’editor.', 'Set. Replacing or turning it off needs the previous PIN in the editor.', 'Festgelegt. Zum Ersetzen oder Deaktivieren wird im Editor die bisherige PIN benötigt.', 'Configuré. Pour le remplacer ou le désactiver, le PIN précédent est requis dans l’éditeur.'],
  pin_set_aria: ['PIN configurato', 'PIN set', 'PIN festgelegt', 'PIN configuré'],
  pin_req: ['Richiedi PIN visuale per sbloccare', 'Ask for the visual PIN to unlock', 'Optische PIN zum Entriegeln verlangen', 'Demander le PIN visuel pour déverrouiller'],
  pin_req_h: ['È una conferma nell’interfaccia, non un’autenticazione.', 'It is a confirmation in the interface, not authentication.', 'Es ist eine Bestätigung in der Oberfläche, keine Authentifizierung.', 'C’est une confirmation dans l’interface, pas une authentification.'],
  pin_box: ['PIN di conferma serratura', 'Lock confirmation PIN', 'Bestätigungs-PIN des Schlosses', 'PIN de confirmation de la serrure'],
  pin_box_h: ['Da 4 a 8 cifre. La verifica è solo visuale. Per impostarlo occorre una connessione HTTPS: non si memorizzano PIN in chiaro.', '4 to 8 digits. The check is visual only. Setting it needs an HTTPS connection: PINs are never stored in plain text.', '4 bis 8 Ziffern. Die Prüfung ist rein optisch. Zum Festlegen ist eine HTTPS-Verbindung nötig: PINs werden nie im Klartext gespeichert.', '4 à 8 chiffres. La vérification est uniquement visuelle. Il faut une connexion HTTPS pour le définir : les PIN ne sont jamais stockés en clair.'],
  pin_no_http: ['PIN non disponibile tramite HTTP: apri Home Assistant con un indirizzo HTTPS affidabile oppure utilizza la conferma senza PIN.', 'PIN not available over HTTP: open Home Assistant with a trusted HTTPS address or use confirmation without a PIN.', 'PIN über HTTP nicht verfügbar: Öffne Home Assistant über eine vertrauenswürdige HTTPS-Adresse oder nutze die Bestätigung ohne PIN.', 'PIN indisponible en HTTP : ouvrez Home Assistant avec une adresse HTTPS fiable ou utilisez la confirmation sans PIN.'],
  pin_cur: ['PIN attuale', 'Current PIN', 'Aktuelle PIN', 'PIN actuel'],
  pin_cur_ph: ['Inserisci PIN attuale', 'Enter current PIN', 'Aktuelle PIN eingeben', 'Saisissez le PIN actuel'],
  pin_new: ['Nuovo PIN', 'New PIN', 'Neue PIN', 'Nouveau PIN'],
  pin_choose: ['Scegli il PIN', 'Choose the PIN', 'PIN wählen', 'Choisissez le PIN'],
  pin_ph: ['4–8 cifre', '4–8 digits', '4–8 Ziffern', '4 à 8 chiffres'],
  pin_btn_set: ['Imposta PIN', 'Set PIN', 'PIN festlegen', 'Définir le PIN'],
  pin_btn_change: ['Cambia PIN', 'Change PIN', 'PIN ändern', 'Changer le PIN'],
  pin_btn_off: ['Disattiva PIN', 'Turn PIN off', 'PIN deaktivieren', 'Désactiver le PIN'],
  pin_tip_set: ['Modifica protetta dal PIN corrente (solo nell’interfaccia).', 'Changes are protected by the current PIN (interface only).', 'Änderungen sind durch die aktuelle PIN geschützt (nur in der Oberfläche).', 'Modification protégée par le PIN actuel (interface uniquement).'],
  pin_tip_none: ['Se non puoi utilizzare HTTPS, disattiva il PIN visuale e usa la conferma semplice.', 'If you cannot use HTTPS, turn the visual PIN off and use the simple confirmation.', 'Falls HTTPS nicht möglich ist, die optische PIN ausschalten und die einfache Bestätigung nutzen.', 'Si vous ne pouvez pas utiliser HTTPS, désactivez le PIN visuel et utilisez la confirmation simple.'],
  e_confirm_direct: ['Richiedi conferma per sblocco diretto', 'Ask for confirmation before unlocking', 'Bestätigung vor dem Entriegeln verlangen', 'Demander une confirmation avant le déverrouillage'],
  n_pin_old_off: ['Inserisci il PIN attuale per disattivarlo.', 'Enter the current PIN to turn it off.', 'Aktuelle PIN zum Deaktivieren eingeben.', 'Saisissez le PIN actuel pour le désactiver.'],
  n_checking: ['Verifica PIN in corso…', 'Checking the PIN…', 'PIN wird geprüft…', 'Vérification du PIN en cours…'],
  n_pin_wrong: ['PIN attuale non corretto.', 'Current PIN is incorrect.', 'Aktuelle PIN ist falsch.', 'Le PIN actuel est incorrect.'],
  n_pin_off_done: ['PIN visuale disattivato. Lo sblocco diretto richiede conferma.', 'Visual PIN turned off. Direct unlocking needs confirmation.', 'Optische PIN deaktiviert. Direktes Entriegeln erfordert eine Bestätigung.', 'PIN visuel désactivé. Le déverrouillage direct demande une confirmation.'],
  n_check_na: ['Verifica PIN non disponibile.', 'PIN check unavailable.', 'PIN-Prüfung nicht verfügbar.', 'Vérification du PIN indisponible.'],
  n_pin_digits: ['Il PIN deve contenere da 4 a 8 cifre.', 'The PIN must have 4 to 8 digits.', 'Die PIN muss 4 bis 8 Ziffern haben.', 'Le PIN doit contenir de 4 à 8 chiffres.'],
  n_pin_need_old: ['Inserisci il PIN attuale prima di cambiarlo.', 'Enter the current PIN before changing it.', 'Vor dem Ändern die aktuelle PIN eingeben.', 'Saisissez le PIN actuel avant de le changer.'],
  n_verifying: ['Verifica in corso…', 'Checking…', 'Prüfung läuft…', 'Vérification en cours…'],
  n_pin_done: ['PIN impostato.', 'PIN set.', 'PIN festgelegt.', 'PIN défini.'],
  n_pin_http: ['PIN disponibile solo con HTTPS affidabile. Su HTTP usa lo sblocco con conferma senza PIN.', 'The PIN needs a trusted HTTPS connection. On HTTP use unlocking with confirmation and no PIN.', 'Die PIN ist nur mit vertrauenswürdigem HTTPS verfügbar. Bei HTTP das Entriegeln mit Bestätigung ohne PIN nutzen.', 'Le PIN nécessite un HTTPS fiable. En HTTP, utilisez le déverrouillage avec confirmation sans PIN.'],
  n_pin_off_first: ['Disattiva il PIN inserendo prima il codice attuale.', 'Turn the PIN off by entering the current code first.', 'Die PIN erst nach Eingabe des aktuellen Codes deaktivieren.', 'Désactivez le PIN en saisissant d’abord le code actuel.'],
  e_door: ['Entità porta', 'Door entity', 'Tür-Entität', 'Entité de la porte'],
  e_windows: ['Finestre monitorate', 'Monitored windows', 'Überwachte Fenster', 'Fenêtres surveillées'],
  e_motion: ['Sensori di movimento', 'Motion sensors', 'Bewegungsmelder', 'Détecteurs de mouvement'],
  e_motion_h: ['Sola visualizzazione dello stato.', 'Status display only.', 'Nur Statusanzeige.', 'Affichage de l’état uniquement.'],
  e_add_sensor: ['Cerca e aggiungi un sensore', 'Search and add a sensor', 'Sensor suchen und hinzufügen', 'Rechercher et ajouter un capteur'],
  e_remove: ['Rimuovi {n}', 'Remove {n}', '{n} entfernen', 'Retirer {n}'],
  e_add: ['Aggiungi {n}', 'Add {n}', '{n} hinzufügen', 'Ajouter {n}'],
  e_img: ['Ultima immagine rilevata (image.*)', 'Latest detected image (image.*)', 'Zuletzt erkanntes Bild (image.*)', 'Dernière image détectée (image.*)'],
  e_cam_bat: ['Batteria spioncino (facoltativa)', 'Peephole battery (optional)', 'Batterie des Türspions (optional)', 'Batterie du judas (facultatif)'],
  e_rec: ['Stato registrazione (facoltativo)', 'Recording status (optional)', 'Aufzeichnungsstatus (optional)', 'État d’enregistrement (facultatif)'],
  e_rec_val: ['Stato che indica la registrazione attiva', 'State meaning recording is on', 'Status für „Aufzeichnung aktiv“', 'État indiquant l’enregistrement actif'],
  e_rec_val_h: ['Per binary_sensor o switch normalmente on.', 'For a binary_sensor or switch it is usually on.', 'Bei binary_sensor oder Schalter normalerweise on.', 'Pour un binary_sensor ou un interrupteur, c’est normalement on.'],
  e_cam_motion: ['Sensore movimento davanti alla porta (facoltativo)', 'Motion sensor in front of the door (optional)', 'Bewegungssensor vor der Tür (optional)', 'Capteur de mouvement devant la porte (facultatif)'],
  e_cam_ts: ['Timestamp ultimo movimento (facoltativo, sensor/input_datetime)', 'Last-motion timestamp (optional, sensor/input_datetime)', 'Zeitstempel der letzten Bewegung (optional, sensor/input_datetime)', 'Horodatage du dernier mouvement (facultatif, sensor/input_datetime)'],
  e_area: ['Area monitorata', 'Monitored area', 'Überwachter Bereich', 'Zone surveillée'],
  lk_eyebrow: ['Intestazione superiore', 'Top label', 'Obere Beschriftung', 'Étiquette supérieure'],
  lk_title: ['Titolo', 'Title', 'Titel', 'Titre'],
  lk_show_eb: ['Mostra l’intestazione superiore', 'Show the top label', 'Obere Beschriftung anzeigen', 'Afficher l’étiquette supérieure'],
  lk_show_ti: ['Mostra il titolo', 'Show the title', 'Titel anzeigen', 'Afficher le titre'],
  lk_title_h: ['Vuoto: usa il titolo predefinito nella lingua scelta.', 'Empty: uses the default title in the chosen language.', 'Leer: verwendet den Standardtitel in der gewählten Sprache.', 'Vide : utilise le titre par défaut dans la langue choisie.'],
  lk_theme: ['Tema', 'Theme', 'Design', 'Thème'],
  th_auto: ['Automatico (Home Assistant)', 'Automatic (Home Assistant)', 'Automatisch (Home Assistant)', 'Automatique (Home Assistant)'],
  lang: ['Lingua', 'Language', 'Sprache', 'Langue'],
  lang_auto: ['Automatica (Home Assistant)', 'Automatic (Home Assistant)', 'Automatisch (Home Assistant)', 'Automatique (Home Assistant)'],
  lang_h: ['Automatica segue la lingua dell’utente in Home Assistant. Se la lingua non è disponibile si usa l’inglese.', 'Automatic follows the user’s language in Home Assistant. If the language is not available, English is used.', 'Automatisch folgt der Sprache des Benutzers in Home Assistant. Ist die Sprache nicht verfügbar, wird Englisch verwendet.', 'Automatique suit la langue de l’utilisateur dans Home Assistant. Si la langue n’est pas disponible, l’anglais est utilisé.'],
  lk_hl: ['Evidenzia eventi con verde Edera', 'Highlight events in Edera green', 'Ereignisse in Edera-Grün hervorheben', 'Mettre les événements en vert Edera'],
  lk_hl_h: ['I riquadri con porte aperte, movimento e registrazione diventano verdi.', 'Tiles with open doors, motion and recording turn green.', 'Kacheln mit offenen Türen, Bewegung und Aufzeichnung werden grün.', 'Les tuiles avec portes ouvertes, mouvement et enregistrement deviennent vertes.'],
  ad_desc: ['Inizialmente il pannello è in sola lettura. I comandi si abilitano soltanto dopo la verifica delle entità.', 'The panel starts read-only. Commands are enabled only after you have checked the entities.', 'Das Bedienfeld startet schreibgeschützt. Befehle werden erst nach Prüfung der Entitäten aktiviert.', 'Le panneau démarre en lecture seule. Les commandes ne s’activent qu’après vérification des entités.'],
  ad_cmd: ['Abilita i comandi reali', 'Enable real commands', 'Echte Befehle aktivieren', 'Activer les commandes réelles'],
  ad_cmd_h: ['Allarme, script NVR e serratura. Non cambia le autorizzazioni di Home Assistant.', 'Alarm, NVR scripts and lock. It does not change Home Assistant permissions.', 'Alarm, NVR-Skripte und Schloss. Die Home-Assistant-Berechtigungen bleiben unverändert.', 'Alarme, scripts NVR et serrure. Les autorisations de Home Assistant ne changent pas.'],
  ad_anim: ['Animazioni di attenzione', 'Attention animations', 'Aufmerksamkeitsanimationen', 'Animations d’attention'],
  ad_anim_h: ['Disattivabili. Le preferenze di movimento ridotto vengono sempre rispettate.', 'Can be turned off. Reduced-motion preferences are always respected.', 'Abschaltbar. Die Einstellung „Bewegung reduzieren“ wird immer beachtet.', 'Désactivables. La préférence de réduction des animations est toujours respectée.'],
  ad_note: ['Il PIN visuale della serratura non impedisce comandi da altre dashboard o API già autorizzate. Il codice dell’allarme viene verificato dall’integrazione del pannello.', 'The lock’s visual PIN does not block commands from other dashboards or already-authorised APIs. The alarm code is verified by the panel integration.', 'Die optische PIN des Schlosses verhindert keine Befehle von anderen Dashboards oder bereits autorisierten APIs. Der Alarmcode wird von der Integration der Zentrale geprüft.', 'Le PIN visuel de la serrure n’empêche pas les commandes depuis d’autres tableaux de bord ou API déjà autorisées. Le code d’alarme est vérifié par l’intégration du panneau.']
};
let SP_CUR = 'en';
function spBaseLang(h) {
  const l = h && ((h.locale && h.locale.language) || h.language);
  return typeof l === 'string' ? l.toLowerCase().split(/[-_]/)[0] : 'en';
}
function spPickLang(cfgLang, h) {
  const l = cfgLang && cfgLang !== 'auto' ? cfgLang : spBaseLang(h);
  return SP_LANGS.some(x => x[0] === l) ? l : 'en';
}
function T(key, vars) {
  const row = SP_STR[key];
  if (!row) return key;
  const idx = Math.max(0, SP_LANGS.findIndex(x => x[0] === SP_CUR));
  let text = row[idx] != null ? row[idx] : row[1];
  if (vars) text = text.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  return text;
}
function TP(key, n, vars) { return T(key + (n === 1 ? '_1' : '_n'), { n, ...vars }); }
// A saved value equal to the original Italian default means "default": it follows the language.
const SP_IT_DEFAULTS = { title: 'title_def', alarm_name: 'alarm', nvr_name: 'nvr', lock_name: 'lock', door_name: 'door', windows_name: 'windows', motion_name: 'motion', camera_name: 'camera', camera_location_name: 'loc_def' };
function spName(cfg, key) {
  const v = cfg[key];
  const k = SP_IT_DEFAULTS[key];
  return !v || (k && v === SP_STR[k][0]) ? T(k) : v;
}

const SP_MOD_ORDER = ['nvr', 'lock', 'door', 'windows', 'motion', 'camera'];
const SP_MOD_FLAG = { nvr: 'show_nvr', lock: 'show_lock', door: 'show_door', windows: 'show_windows', motion: 'show_motion', camera: 'show_camera' };
const SP_DOMAINS = {
  alarm_entity: ['alarm_control_panel'],
  nvr_on_script: ['script'], nvr_off_script: ['script'],
  nvr_state_entity: ['switch', 'binary_sensor', 'input_boolean', 'sensor'],
  lock_entity: ['lock'], lock_battery_entity: ['sensor'],
  door_entity: ['binary_sensor'],
  camera_entity: ['camera'], image_entity: ['image'], camera_battery_entity: ['sensor'],
  recording_entity: ['binary_sensor', 'switch', 'sensor'],
  camera_motion_entity: ['binary_sensor'], camera_person_entity: ['binary_sensor'], camera_last_event_entity: ['sensor','input_datetime'],
  siren_entity: ['siren', 'binary_sensor', 'switch', 'sensor'], siren_control_entity: ['siren', 'switch'],
  base_entity: ['binary_sensor', 'sensor', 'switch'],
  windows: ['binary_sensor'], motion: ['binary_sensor'],
};
const SP_RERENDER = ['siren_manual_enabled','base_entity','nvr_state_entity','recording_entity','lock_pin_enabled','language','order'];
const SP_DEFAULTS = Object.freeze({
  title: '', eyebrow: 'SECURITY PANEL CARD', show_eyebrow: true, show_title: true, theme_mode: 'auto', language: 'auto',
  alarm_name: '', nvr_name: '', lock_name: '',
  door_name: '', windows_name: '', motion_name: '', camera_name: '',
  controls_enabled: false,
  alarm_entity: '', alarm_disarm_code: true, alarm_arm_code: false,
  siren_entity: '', siren_control_entity: '', siren_manual_enabled: false, base_entity: '', base_ok_state: '',
  nvr_on_script: '', nvr_off_script: '', nvr_state_entity: '', nvr_active_state: 'on',
  lock_entity: '', lock_battery_entity: '', lock_pin_enabled: false, lock_pin_hash: '', lock_confirm_direct: true,
  door_entity: '', windows: [], motion: [], camera_entity: '', image_entity: '', camera_battery_entity: '',
  recording_entity: '', recording_active_state: 'on',
  camera_motion_entity: '', camera_person_entity: '', camera_last_event_entity: '', camera_location_name: '',
  show_alarm: true, show_nvr: true, show_lock: true,
  show_door: false, show_windows: false, show_motion: false, show_camera: false,
  order: SP_MOD_ORDER,
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
  cfg.language = SP_LANGS.some(l => l[0] === cfg.language) ? cfg.language : 'auto';
  const ord = Array.isArray(cfg.order) ? cfg.order.filter((k, i, a) => SP_MOD_ORDER.includes(k) && a.indexOf(k) === i) : [];
  cfg.order = [...ord, ...SP_MOD_ORDER.filter(k => !ord.includes(k))];
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
const SP_ICONS=Object.freeze({
  shield:'shield-lock-outline', shieldoff:'shield-off-outline', home:'shield-home-outline',
  video:'cctv', power:'power', lock:'lock-outline', unlock:'lock-open-outline',
  door:'door-closed', window:'window-closed-variant', motion:'motion-sensor', eye:'doorbell-video',
  chevron:'chevron-right', x:'close', back:'arrow-left', battery:'battery', alert:'alert',
  siren:'alarm-light', circle:'check-circle-outline', settings:'cog-outline', backspace:'backspace-outline', image:'image-outline', info:'information-outline', expand:'arrow-expand'
});
function spIcon(name){return `<ha-icon class="sp-icon" icon="mdi:${SP_ICONS[name]||'checkbox-marked-circle-outline'}"></ha-icon>`;}
function spStateIcon(id, fallback){return id && /^[a-z0-9_]+\.[a-z0-9_]+$/.test(id)
  ? `<ha-state-icon class="sp-icon" data-sp-state-icon="${spEscape(id)}"></ha-state-icon>` : spIcon(fallback);}
function spImageUrl(entity){
  const url=entity?.attributes?.entity_picture;
  if(typeof url!=='string' || !url.startsWith('/') || url.startsWith('//') || url.includes('\\') || /[\x00-\x1f]/.test(url))return '';
  const version=typeof entity.state==='string'?encodeURIComponent(entity.state.slice(0,100)):'';
  return version?`${url}${url.includes('?')?'&':'?'}sp_v=${version}`:url;
}
function spTimeInfo(iso,now=Date.now()){
  if(!iso)return null;
  const ms=Date.parse(iso);if(!Number.isFinite(ms)||ms>now+60000)return null;
  const difference=Math.max(0,now-ms), mins=Math.floor(difference/60000);
  const ago=mins<1?T('t_now'):mins<60?T('t_min',{n:mins}):mins<1440?TP('t_h',Math.floor(mins/60)):mins<10080?TP('t_d',Math.floor(mins/1440)):null;
  const exact=new Intl.DateTimeFormat(SP_LOCALE[SP_CUR]||'en-GB',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(ms));
  return { ago:ago||exact,exact,ms };
}
function spLatestActive(history, fromMs){
  if(!Array.isArray(history))return null;
  let best=null;
  for(const row of history){
    if(!Array.isArray(row))continue;
    for(let i=1;i<row.length;i++){
      if(row[i]?.state==='on' && row[i-1]?.state!=='on'){
        const time=row[i].last_changed||row[i].last_updated;
        const ms=Date.parse(time);
        if(Number.isFinite(ms)&&ms>=fromMs&&(!best||ms>Date.parse(best)))best=time;
      }
    }
  }
  return best;
}


function spLatestTransition(history, expectedState, fromMs) {
  if (!Array.isArray(history)) return null;
  let latest = null;
  for (const row of history) {
    if (!Array.isArray(row)) continue;
    for (let i = 1; i < row.length; i++) {
      if (row[i]?.state !== expectedState || row[i-1]?.state === expectedState) continue;
      const date = row[i].last_changed || row[i].last_updated;
      const ms = Date.parse(date);
      if (Number.isFinite(ms) && ms >= fromMs && (!latest || ms > Date.parse(latest))) latest = date;
    }
  }
  return latest;
}

const SP_STYLE = `
:host{display:block;box-sizing:border-box;font-family:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif));font-size:14px;color:var(--sp-text)}
*,*:before,*:after{box-sizing:border-box}
:host([data-theme="light"]){--sp-bg:#fafbf9;--sp-tile:#f0f2ef;--sp-circle:#ffffff;--sp-line:#e0e5df;--sp-text:#18221c;--sp-muted:#56675c;--sp-button:#e5eae5;--sp-accent:#0a7156;--sp-red:#ae4742;--sp-away:#246a83;--sp-amber:#8a5a00;--sp-amber-bg:#f6ead0}
:host([data-theme="dark"]){--sp-bg:#101211;--sp-tile:#191c1a;--sp-circle:#282b29;--sp-line:#2b302c;--sp-text:#f5f7f4;--sp-muted:#bbc5bd;--sp-button:#282d29;--sp-accent:#0e795d;--sp-red:#e85e64;--sp-away:#246a83;--sp-amber:#e8b04d;--sp-amber-bg:#3a2d12}
:host([data-theme="light"]) .active-accent{color:#fff}
*{-webkit-tap-highlight-color:transparent}button{font:inherit;color:inherit;cursor:pointer}button:disabled{opacity:.45;cursor:not-allowed}button:focus-visible,input:focus-visible{outline:2px solid var(--sp-accent);outline-offset:2px}
.sp-icon{width:21px;height:21px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;line-height:1;--mdc-icon-size:21px}.sp-cq{container-type:inline-size}.sp-shell{position:relative;padding:14px;background:var(--sp-bg);border:1px solid var(--sp-line);border-radius:26px;min-width:0}
.sp-header{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px 12px;margin:2px 4px 12px}.sp-header>.sp-chip:only-child{margin-left:auto}.sp-eyebrow{color:var(--sp-muted);font-size:10px;letter-spacing:1.7px;font-weight:750;margin-bottom:7px}.sp-title{font-size:25px;line-height:1.14;font-weight:780;letter-spacing:-.7px;overflow-wrap:anywhere}.sp-title b{color:var(--sp-accent);font-weight:800}
.sp-row{border:1px solid var(--sp-line);background:var(--sp-tile);border-radius:22px;padding:10px;min-width:0}
.sp-row.sp-alarm{margin-bottom:8px}.sp-devs+.sp-extras,.sp-extras+.sp-devs{margin-top:8px}
.sp-chip{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:5px 10px;font-size:11.5px;font-weight:650;line-height:1.2;background:var(--sp-button);color:var(--sp-text);max-width:100%}
.sp-chip .sp-icon{width:14px;height:14px;--mdc-icon-size:14px}.sp-chip.ok .sp-icon{color:var(--sp-accent)}
.sp-chip.warn{background:var(--sp-amber-bg);color:var(--sp-amber)}.sp-chip.crit{background:#b83a42;color:#fff}.sp-chip .sp-status{margin:0}
.sp-devs{display:grid;grid-template-columns:minmax(0,1fr);gap:8px}
/* Only the currently selected alarm MODE is tinted; the alarm section itself stays neutral. */
.sp-mode.selected.sp-mode-home{background:var(--sp-accent);border-color:var(--sp-accent);color:#fff}
.sp-mode.selected.sp-mode-away{background:var(--sp-away);border-color:var(--sp-away);color:#fff}
.sp-mode.selected:disabled{opacity:1}
/* A red alarm banner appears only when alarm_control_panel state is triggered. */
.sp-trigger-alert{display:flex;align-items:center;gap:10px;margin:0 0 10px;padding:11px 13px;border-radius:16px;background:#b83a42;color:#fff}
.sp-trigger-alert .sp-icon{width:22px;height:22px;--mdc-icon-size:22px}
.sp-trigger-text{min-width:0;flex:1}
.sp-trigger-alert strong{display:block;font-size:14px;line-height:1.3}
.sp-trigger-alert .sp-trigger-note{display:block;margin-top:3px;font-size:11px;color:#fff;line-height:1.45}
.sp-row.sp-alarm-triggered{border-color:#b83a42;box-shadow:inset 0 0 0 1px #b83a42}
.sp-row.sp-alarm-triggered .sp-sub .sp-status{background:#b83a42}
.sp-main{display:flex;align-items:center;gap:11px;min-height:44px}.sp-orb{flex:none;width:43px;height:43px;border-radius:50%;background:var(--sp-circle);display:grid;place-items:center}.sp-meta{flex:1;min-width:0}.sp-name{font-size:14px;font-weight:600;line-height:1.3}.sp-sub{font-size:12px;color:var(--sp-muted);margin-top:3px;line-height:1.45;overflow-wrap:anywhere}.sp-status{display:inline-block;width:7px;height:7px;border-radius:50%;background:#8f9990;margin-right:5px;vertical-align:1px}.sp-status.ok{background:var(--sp-accent)}.sp-status.error{background:var(--sp-red)}.sp-status.warn{background:var(--sp-amber)}.sp-status.unk{background:transparent;box-shadow:inset 0 0 0 1.5px #8f9990}
/* Compact Home Assistant card previews use the card's actual width, not the browser viewport. */
.sp-device-main{display:flex;align-items:center;flex-wrap:wrap;gap:8px 10px}
.sp-device-info{display:flex;align-items:center;gap:10px;flex:1 1 150px;min-width:0}.sp-device-info .sp-orb{width:38px;height:38px}.sp-device-info .sp-orb .sp-icon{width:19px;height:19px;--mdc-icon-size:19px}
.sp-device-info .sp-meta{min-width:0}
.sp-device-info .sp-name,.sp-device-info .sp-sub{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;overflow-wrap:normal}.sp-device-info .sp-sub{font-size:11.5px;margin-top:1px}
.sp-device-main>.sp-button,.sp-device-main>.sp-buttons{margin-left:auto}
.sp-device-main .sp-buttons{align-items:center;flex-wrap:nowrap;min-width:0}
.sp-device-main .sp-orb .sp-icon{display:flex;align-items:center;justify-content:center}
.sp-amain{display:flex;flex-direction:column;gap:10px}.sp-ahead{display:flex;align-items:center;gap:10px;min-width:0}.sp-ahead .sp-orb{width:40px;height:40px}.sp-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.sp-mode{border:1px solid transparent;border-radius:14px;background:var(--sp-button);min-height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-size:11px;line-height:1.2}.sp-mode .sp-icon{width:19px;height:19px;--mdc-icon-size:19px}.sp-mode.selected{background:var(--sp-circle);border-color:var(--sp-line);font-weight:600}
.sp-button{border:1px solid var(--sp-line);background:var(--sp-circle);padding:9px 12px;border-radius:999px;font-size:12px;font-weight:550;line-height:1.2;display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;flex:none;min-height:36px}.sp-button .sp-icon{width:16px;height:16px;--mdc-icon-size:16px}.sp-buttons{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.sp-mini{border-top:1px solid var(--sp-line);margin-top:10px;padding-top:9px;display:flex;align-items:center;gap:6px 12px;flex-wrap:wrap}.sp-pill.sp-warn{color:var(--sp-amber)}.sp-pill{display:inline-flex;gap:5px;align-items:center;min-height:17px;line-height:1.3;color:var(--sp-muted);font-size:11px}.sp-pill .sp-icon{width:14px;height:14px;--mdc-icon-size:14px;display:block}.sp-critical{color:var(--sp-red)!important}.sp-focus{border-color:var(--sp-accent)!important;box-shadow:inset 0 0 0 1px var(--sp-accent)}.sp-alarm-focus{border-color:var(--sp-red)!important}.sp-pulse{animation:sp-breathe 2.5s ease-in-out infinite}@keyframes sp-breathe{0%,100%{box-shadow:inset 0 0 0 1px var(--sp-accent)}50%{box-shadow:inset 0 0 0 2px var(--sp-accent)}}.sp-section{color:var(--sp-muted);font-weight:700;font-size:10px;letter-spacing:1.7px;margin:14px 4px 8px}
.sp-extras{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:1fr;gap:8px}.sp-sensor{width:100%;text-align:left;min-width:0;border:1px solid var(--sp-line);background:var(--sp-tile);padding:8px 10px;border-radius:20px;display:flex;align-items:center;min-height:58px}.sp-sensor-main{display:flex;align-items:center;gap:9px;min-width:0;width:100%}.sp-sensor-orb{width:34px;height:34px;flex:none;border-radius:50%;background:var(--sp-circle);display:grid;place-items:center}.sp-sensor-orb .sp-icon{width:18px;height:18px;--mdc-icon-size:18px}.sp-sensor-text{flex:1;display:block;min-width:0}.sp-sensor .sp-name{display:block;font-size:12.5px;line-height:1.3;white-space:normal;overflow-wrap:anywhere}.sp-sensor .sp-sub{display:block;font-size:11px;line-height:1.3;white-space:normal;overflow-wrap:anywhere}.sp-sensor-main>.sp-icon:last-child{width:15px;height:15px;--mdc-icon-size:15px;flex:none;color:var(--sp-muted)}.sp-sensor.sp-focus{border-color:var(--sp-accent)!important}.sp-sensor.sp-focus .sp-sensor-orb{background:var(--sp-accent)}.sp-sensor.sp-focus .sp-sensor-orb .sp-icon{color:#fff}.sp-sensor.sp-pulse{animation:sp-breathe 2.5s ease-in-out infinite}.sp-sensor:active,.sp-button:active,.sp-mode:active{transform:scale(.99)}
.sp-note{border:1px solid var(--sp-line);border-radius:12px;margin-top:12px;padding:9px 11px;color:var(--sp-muted);font-size:11px}.sp-note.error{color:var(--sp-red)}.sp-small{font-size:11px;color:var(--sp-muted)}.sp-spinner{opacity:.6}
.sp-backdrop{position:fixed;inset:0;background:#0009;z-index:999;display:flex;align-items:center;justify-content:center;overscroll-behavior:contain;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left))}.sp-dialog{width:min(390px,100%);max-height:min(88vh,680px);max-height:min(88dvh,680px);display:flex;flex-direction:column;overflow:hidden;background:var(--sp-bg);color:var(--sp-text);border:1px solid var(--sp-line);border-radius:26px;box-shadow:0 18px 60px #0005}.sp-dialoghead{flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 16px 12px 18px;background:var(--sp-bg);border-bottom:1px solid var(--sp-line)}.sp-dialoghead strong{flex:1;min-width:0;font-size:17px;font-weight:600;line-height:1.3;overflow-wrap:anywhere}.sp-dbody{overflow-y:auto;overscroll-behavior:contain;padding:12px 18px 18px;min-width:0}.sp-close{display:flex;justify-content:center;align-items:center;flex:none;line-height:0;padding:0;border:1px solid var(--sp-line);background:var(--sp-tile);color:var(--sp-text);width:40px;height:40px;border-radius:50%;margin:0}.sp-close .sp-icon{width:18px;height:18px;--mdc-icon-size:18px;display:block;margin:0}.sp-dialog .sp-sub{margin:2px 0 14px}.sp-item{display:flex;width:100%;align-items:center;gap:8px;border:1px solid var(--sp-line);border-radius:14px;background:var(--sp-tile);padding:12px;margin-top:7px;text-align:left}.sp-item .sp-meta{min-width:0}.sp-entity{font-size:10px;color:var(--sp-muted);overflow-wrap:anywhere}.sp-dots{display:flex;gap:12px;justify-content:center;min-height:14px;padding:12px 0 14px}.sp-pin-dot{width:12px;height:12px;border-radius:50%;border:1px solid var(--sp-muted)}.sp-pin-dot.full{background:var(--sp-text)}.sp-pad{display:grid;grid-template-columns:repeat(3,72px);gap:10px;justify-content:center;margin:4px 0 14px}.sp-pad button{width:72px;height:56px;border-radius:18px;border:1px solid var(--sp-line);background:var(--sp-tile);padding:0;display:flex;align-items:center;justify-content:center;line-height:1;color:var(--sp-text);font-size:24px;font-weight:500}
.sp-pad button:active{background:var(--sp-line)}
.sp-pad .sp-bk{border-color:transparent;background:transparent}.sp-pad .sp-bk .sp-icon{width:26px;height:26px;--mdc-icon-size:26px}.sp-pad .sp-bk:disabled{opacity:.35;cursor:default}
@media (max-height:720px){.sp-pad button{height:48px;font-size:22px}.sp-pad{gap:8px 10px}}
.sp-kerr{text-align:center;color:var(--sp-red);font-size:12.5px;font-weight:600;min-height:18px;margin:2px 0 6px}
.sp-toast{position:absolute;z-index:3;left:12px;right:12px;top:12px;padding:9px 11px;border-radius:12px;background:var(--sp-bg);border:1px solid var(--sp-red);color:var(--sp-red);font-size:11px;line-height:1.4;box-shadow:0 6px 20px #0003}.sp-input{width:100%;border:1px solid var(--sp-line);border-bottom:1px solid var(--sp-muted);background:var(--sp-tile);color:var(--sp-text);font:inherit;font-size:18px;border-radius:10px 10px 0 0;padding:13px}.sp-wide{display:block;width:100%;border:0;border-radius:14px;margin-top:13px;padding:13px;background:var(--sp-accent);color:white;font-weight:730}.sp-wide .sp-icon{width:18px;height:18px;--mdc-icon-size:18px;margin-right:7px;color:#fff}.sp-wide:disabled{opacity:.4}.sp-error{font-size:12px;color:var(--sp-red);padding-top:8px}.sp-camera{margin:12px 0;border-radius:17px;background:var(--sp-tile);padding:15px;text-align:center}.sp-snapshot{display:block;width:100%;max-height:340px;object-fit:contain;border-radius:12px}.sp-snapshot-label{font-size:12px;color:var(--sp-muted);font-weight:650;margin-bottom:9px}.sp-camera .sp-icon{margin:auto}.sp-event,.sp-event-location{display:flex;gap:10px;align-items:center;border:1px solid var(--sp-line);background:var(--sp-tile);border-radius:14px;padding:11px 12px;margin-top:8px;font-size:12px}.sp-event .sp-small{margin-top:3px}.sp-event.active-accent{background:var(--sp-accent);color:#fff;border-color:var(--sp-accent)}.sp-event.active-accent .sp-small{color:#fff}.sp-event-location{font-size:11px;color:var(--sp-muted)}
.sp-event strong{font-weight:600}.sp-trigger-alert strong{font-weight:600}
.sp-history-trigger{display:inline-flex;align-items:center;gap:4px;margin-left:auto;padding:6px 2px;min-height:32px;text-align:left;background:none;border:0;font-size:11px;color:var(--sp-muted)}
.sp-history-trigger .sp-icon{width:15px;height:15px;--mdc-icon-size:15px}.sp-history-trigger span{flex:none}
.sp-siren-controls{display:flex;align-items:center;flex-wrap:wrap;gap:7px;margin-top:10px}.sp-siren-label{width:100%;font-size:11px;color:var(--sp-muted)}
@container (min-width:520px){.sp-devs{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width:560px){.sp-amain{flex-direction:row;align-items:center;justify-content:space-between}.sp-actions{width:min(340px,58%)}}
@container (min-width:680px){.sp-extras{grid-template-columns:repeat(4,minmax(0,1fr))}}
@container (max-width:420px){.sp-sensor-main>.sp-icon:last-child{display:none}.sp-device-info .sp-sub{white-space:normal;overflow:visible}.sp-sensor-main{gap:8px}.sp-sensor{padding:8px}.sp-button{font-size:11px;padding:7px 9px}.sp-mode{font-size:10px}}
@container (max-width:420px){.sp-title{font-size:23px}}
@container (max-width:340px){.sp-shell{padding:12px;border-radius:23px}.sp-title{font-size:21px}}
@media(max-width:420px){.sp-shell{border-radius:23px}}
.sp-dialog{width:min(390px,100%);height:min(calc(100vh - 40px),680px);height:min(calc(100dvh - 40px),680px);max-height:none}
.sp-dbody{flex:1 1 auto;min-height:0}
.sp-dialog.sp-t-pin,.sp-dialog.sp-t-alarm-code,.sp-dialog.sp-t-confirm{height:auto;max-height:min(88vh,680px);max-height:min(88dvh,680px)}
.sp-backdrop.sp-pop-wide .sp-dialog{width:min(1120px,calc(100vw - 32px));height:min(80vh,560px);height:min(80dvh,560px)}
.sp-backdrop.sp-pop-wide .sp-dialog.sp-t-pin,.sp-backdrop.sp-pop-wide .sp-dialog.sp-t-alarm-code,.sp-backdrop.sp-pop-wide .sp-dialog.sp-t-confirm{width:min(390px,100%);height:auto}
.sp-backdrop.sp-pop-wide .sp-dialog:not(.sp-t-pin):not(.sp-t-alarm-code):not(.sp-t-confirm) .sp-dbody{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0 12px;align-content:start}
.sp-backdrop.sp-pop-wide .sp-camera{grid-column:1/-1}
.sp-backdrop.sp-pop-wide .sp-dbody>.sp-sub,.sp-backdrop.sp-pop-wide .sp-dbody>.sp-small,.sp-backdrop.sp-pop-wide .sp-dbody>.sp-pop-full{grid-column:1/-1}
`;
const SP_EDITOR_CSS = `
:host{display:block;color:var(--primary-text-color,#19221E);font-family:var(--ha-font-family-body,Roboto,Arial,sans-serif)}
*{box-sizing:border-box}
.ed{font-size:14px}
button,input,select{font:inherit;color:inherit}
.tabs{display:flex;gap:5px;overflow-x:auto;padding-bottom:14px;border-bottom:1px solid var(--divider-color,#E1E5E1)}
.tab{border:0;background:none;color:var(--secondary-text-color,#68716C);border-radius:13px;padding:10px 13px;white-space:nowrap;cursor:pointer}
.tab[aria-pressed="true"]{color:var(--primary-text-color,#19221E);background:var(--secondary-background-color,#F1F3EF);font-weight:650}
.heading{font-size:21px;font-weight:500;margin:25px 0 9px}
.desc{color:var(--secondary-text-color,#68716C);font-size:13px;line-height:1.5;margin-bottom:20px}
.field{display:block;margin:18px 0}
.label{font-size:14px;margin-bottom:10px}
.input{display:block;width:100%;background:var(--secondary-background-color,#F1F3EF);color:var(--primary-text-color,#19221E);border:0;border-bottom:1px solid var(--divider-color,#E1E5E1);padding:14px 13px;min-height:50px;border-radius:11px 11px 0 0}
.row{border-bottom:1px solid var(--divider-color,#E1E5E1);padding:13px 0;display:flex;align-items:center;justify-content:space-between;gap:15px}
.row label{flex:1;min-width:0}
.row input[type=checkbox]{width:18px;height:18px;accent-color:var(--primary-color,#064E3B);flex:none}
.muted{font-size:12px;line-height:1.5;color:var(--secondary-text-color,#68716C)}
.tiny{font-size:11px;color:var(--secondary-text-color,#68716C);margin:9px 0}
.action{background:var(--secondary-background-color,#F1F3EF);border:1px solid var(--divider-color,#E1E5E1);color:var(--primary-text-color,#19221E);padding:5px 9px;min-width:34px;border-radius:10px;cursor:pointer}
.action:disabled{opacity:.45;cursor:not-allowed}
.mod{border-bottom:1px solid var(--divider-color,#E1E5E1);padding:16px 0}
.mh{display:flex;align-items:center;gap:10px}
.mh .nm{flex:1;min-width:0;font-weight:600;font-size:15px}
.ctl{display:flex;gap:6px;flex:none}
.mb{margin-top:10px}
.chk{display:flex;align-items:center;gap:10px;margin:8px 0;font-size:13px}
.chk input{width:18px;height:18px;accent-color:var(--primary-color,#064E3B)}
.errt{color:var(--error-color,#B3261E);font-size:12px;margin:6px 0 2px}
ha-selector{display:block;width:100%}
`;
// Smartphones (shorter screen side < 600 px) always get the tall single-column popup; tablets and desktop get the wide one.
function spWidePopup() {
  try { return Math.min(screen.width, screen.height) >= 600 && innerWidth >= 640 && innerHeight >= 600; } catch { return false; }
}
function spStateLabel(item, mode, ha) {
  if (!spKnown(item)) return T('na');
  // Home Assistant's own device-class wording when it is available in the same language.
  if (typeof ha === 'function') { const t = ha(item); if (t) return t; }
  if (mode === 'door' || mode === 'windows') return item.state === 'on' ? T('st_open') : item.state === 'off' ? T('st_closed') : item.state;
  if (mode === 'motion') return item.state === 'on' ? T('st_motion') : item.state === 'off' ? T('st_nomotion') : item.state;
  return item.state;
}
function spHex(bytes) { return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(''); }
function spBytes(hex) { return new Uint8Array(hex.match(/.{2}/g).map(b => Number.parseInt(b, 16))); }
async function spPinDerive(pin, salt) {
  if (!globalThis.crypto?.subtle) throw new Error(T('e_https'));
  const key = await globalThis.crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  return spHex(new Uint8Array(await globalThis.crypto.subtle.deriveBits({name:'PBKDF2',salt:spBytes(salt),iterations:120000,hash:'SHA-256'},key,256)));
}
async function spPinMake(pin) {
  if (!globalThis.crypto?.getRandomValues) throw new Error(T('e_rand'));
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
    this._lastActivities=new Map();this._historyRequests=new Set();this._historyVersion=0;
    this._lastAlarmEvent=null;this._alarmHistoryChecked='';this._alarmHistoryLoading=false;
    this._media=typeof window.matchMedia==='function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    this._onAppearance=()=>this._paint(); this._media?.addEventListener?.('change',this._onAppearance);
    this.shadowRoot.addEventListener('click',e=>this._click(e));
    this.shadowRoot.addEventListener('input',e=>this._input(e));
    this.shadowRoot.addEventListener('keydown',e=>{
      if(e.key==='Escape' && this._modal){this._closeModal();return;}
      const m=this._modal;if(!m||!(m.type==='pin'||(m.type==='alarm-code'&&!this._textCode())))return;
      if(/^[0-9]$/.test(e.key)){e.preventDefault();this._keyIn(e.key);}
      else if(e.key==='Backspace'){e.preventDefault();this._keyIn('del');}
      else if(e.key==='Enter'&&e.target?.tagName!=='BUTTON'){e.preventDefault();this.shadowRoot.querySelector('[data-action="verify-pin"],[data-action="send-alarm"]')?.click();}
    });
  }
  connectedCallback(){this._lastRender='';this._paint();}
  disconnectedCallback(){this._media?.removeEventListener?.('change',this._onAppearance);}
  setConfig(raw) { const prev=this._config.alarm_entity;this._config=spConfig(raw);if(prev!==this._config.alarm_entity){this._lastAlarmEvent=null;this._alarmHistoryChecked='';}this._paint(); }
  set hass(hass) { this._hass=hass; this._paint(); }
  getCardSize(){return 7;}
  _entity(id){return id ? this._hass?.states?.[id] : undefined;}
  // Home Assistant's own translated state text, only when it is in the language the card is showing.
  _ha(entity){
    try{if(typeof this._hass?.formatEntityState==='function'&&SP_CUR===spBaseLang(this._hass))return this._hass.formatEntityState(entity)||'';}catch{}
    return '';
  }
  _textCode(){return this._entity(this._config.alarm_entity)?.attributes?.code_format==='text';}
  _keyIn(k){
    const max=this._modal?.type==='pin'?8:12;
    this._pin=k==='del'?this._pin.slice(0,-1):(this._pin+k).slice(0,max);
    if(this._modal)this._modal.error='';
    this._lastRender='';this._paint();
  }
  _flashError(msg){
    this._error=msg;clearTimeout(this._errTimer);
    this._errTimer=setTimeout(()=>{this._error='';this._lastRender='';this._paint();},8000);
  }
  _keypad(){
    const key=k=>`<button type="button" data-key="${k}" aria-label="${k}">${k}</button>`;
    const dots=Math.max(4,this._pin.length);
    return `<div class="sp-dots">${Array.from({length:dots},(_,i)=>`<span class="sp-pin-dot ${i<this._pin.length?'full':''}"></span>`).join('')}</div><div class="sp-kerr" role="alert">${spEscape(this._modal?.error||'')}</div><div class="sp-pad">${['1','2','3','4','5','6','7','8','9'].map(key).join('')}<span></span>${key('0')}<button type="button" class="sp-bk" data-key="del" aria-label="${T('p_del')}" ${this._pin.length?'':'disabled'}>${spIcon('backspace')}</button></div>`;
  }
  _theme(){return this._config.theme_mode==='auto'?(this._hass?.themes?.darkMode||this._media?.matches?'dark':'light'):this._config.theme_mode;}
  _selected(ids){return ids.map(id=>({id,item:this._entity(id)}));}
  _summary(group){
    const chosen=this._selected(this._config[group]); const usable=chosen.filter(x=>spKnown(x.item));
    const unavailable=chosen.length-usable.length; const active=usable.filter(x=>x.item.state==='on').length;
    return { chosen, usable, unavailable, active, inactive:usable.length-active };
  }
  _isOn(id, expected='on') {const item=this._entity(id);if(!spKnown(item))return null;if(item.state===expected)return true;return item.state==='on'||item.state==='off'?false:null;}
  _lastActive(id){
    const entity=this._entity(id);
    if(spKnown(entity)&&entity.state==='on'&&spTimeInfo(entity.last_changed))return entity.last_changed;
    return this._lastActivities.get(id)||null;
  }
  async _loadLastActivities(ids){
    if(typeof this._hass?.callApi!=='function')return;
    const entities=Array.from(new Set(ids.filter(x=>spEntity(x,['binary_sensor'])))).slice(0,80);
    if(!entities.length)return;
    const key=entities.join(',');if(this._historyRequests.has(key))return;
    this._historyRequests.add(key);
    const now=Date.now(),from=now-10*86400000;
    const endpoint=`history/period/${new Date(from).toISOString()}?end_time=${encodeURIComponent(new Date(now).toISOString())}&filter_entity_id=${encodeURIComponent(entities.join(','))}&no_attributes=1&significant_changes_only=0`;
    try{
      const histories=await this._hass.callApi('GET',endpoint);
      if(Array.isArray(histories))for(const row of histories){
        const id=row?.[0]?.entity_id;
        if(!entities.includes(id))continue;
        const date=spLatestActive([row],from);
        if(date)this._lastActivities.set(id,date);
      }
    }catch{ /* History/Recorder may be disabled or not accessible. No fabricated timestamps. */ }
    finally{this._historyRequests.delete(key);this._historyVersion++;this._lastRender='';this._paint();}
  }
  async _loadLastAlarm(){
    const id=this._config.alarm_entity;
    if(!id||this._alarmHistoryLoading||this._alarmHistoryChecked===id)return;
    if(typeof this._hass?.callApi!=='function'){this._alarmHistoryChecked=id;this._lastRender='';this._paint();return;}
    this._alarmHistoryLoading=true;this._lastRender='';this._paint();
    const now=Date.now(),from=now-10*86400000;
    const endpoint=`history/period/${new Date(from).toISOString()}?end_time=${encodeURIComponent(new Date(now).toISOString())}&filter_entity_id=${encodeURIComponent(id)}&no_attributes=1&significant_changes_only=0`;
    try{
      const history=await this._hass.callApi('GET',endpoint);
      // The first historical state is context, not necessarily a transition inside the requested period.
      const latest=spLatestTransition(history,'triggered',from);
      if(this._config.alarm_entity===id && latest && (!this._lastAlarmEvent||Date.parse(latest)>Date.parse(this._lastAlarmEvent)))this._lastAlarmEvent=latest;
    }catch{ /* Recorder may be disabled, unavailable or inaccessible. */ }
    finally{if(this._config.alarm_entity===id)this._alarmHistoryChecked=id;this._alarmHistoryLoading=false;this._lastRender='';this._paint();}
  }
  _bindStateIcons(){this.shadowRoot.querySelectorAll('[data-sp-state-icon]').forEach(el=>{el.stateObj=this._entity(el.dataset.spStateIcon);el.hass=this._hass;});}
  _paint(){
    if(!this.isConnected)return;
    const cfg=this._config;SP_CUR=spPickLang(cfg.language,this._hass);
    const snapshots={cfg,lang:SP_CUR,theme:this._theme(),busy:this._busy,error:this._error,modal:this._modal,pinLen:this._pin.length,historyVersion:this._historyVersion};
    const ids=[cfg.alarm_entity,cfg.siren_entity,cfg.siren_control_entity,cfg.base_entity,cfg.nvr_state_entity,cfg.nvr_on_script,cfg.nvr_off_script,cfg.lock_entity,cfg.lock_battery_entity,cfg.door_entity,cfg.camera_entity,cfg.image_entity,cfg.camera_battery_entity,cfg.recording_entity,cfg.camera_motion_entity,cfg.camera_person_entity,cfg.camera_last_event_entity,...cfg.windows,...cfg.motion].filter(Boolean);
    snapshots.states=ids.map(id=>{const s=this._entity(id);return [id,s?.state,s?.attributes?.friendly_name,s?.attributes?.supported_features,s?.attributes?.code_arm_required,s?.attributes?.code_format,s?.attributes?.battery_level,s?.last_changed,s?.attributes?.entity_picture]});
    const signature=JSON.stringify(snapshots);if(signature===this._lastRender)return;this._lastRender=signature;
    this.setAttribute('data-theme',this._theme());
    const unit=(s,cls)=>`<span class="sp-status ${cls===true?'ok':cls||''}"></span>${spEscape(s)}`;
    const alarm=this._entity(cfg.alarm_entity);const aState=spKnown(alarm)?alarm.state:'unknown';
    const aLabel={disarmed:T('s_disarmed'),armed_home:T('s_home'),armed_away:T('s_away'),pending:T('s_pending'),arming:T('s_arming'),triggered:T('s_trig'),disarming:T('s_disarming')}[aState] || (spKnown(alarm)?(this._ha(alarm)||aState):T('na'));
    const alarmTriggered=aState==='triggered';
    if(alarmTriggered && spTimeInfo(alarm?.last_changed) && (!this._lastAlarmEvent||Date.parse(alarm.last_changed)>Date.parse(this._lastAlarmEvent)))this._lastAlarmEvent=alarm.last_changed;
    const statusSiren=this._entity(cfg.siren_entity);const sirenState=this._isOn(cfg.siren_entity);
    const sirenLabel=!cfg.siren_entity?null:sirenState===null?(spKnown(statusSiren)?T('siren_s',{s:this._ha(statusSiren)||statusSiren.state}):T('na')):sirenState?T('siren_on'):T('siren_off');
    const manualSiren=this._entity(cfg.siren_control_entity);
    const manualSirenKnown=spKnown(manualSiren) && ['on','off'].includes(manualSiren.state);
    const manualSirenDomain=cfg.siren_control_entity.split('.')[0];
    const bs=this._entity(cfg.base_entity);const baseHealthy=cfg.base_ok_state && spKnown(bs)?bs.state===cfg.base_ok_state:null;
    const baseLabel=!cfg.base_entity?null:!spKnown(bs)?T('base_na'):baseHealthy===true?T('base_ok'):baseHealthy===false?T('base_chk'):T('base_s',{s:this._ha(bs)||bs.state});
    const lock=this._entity(cfg.lock_entity);const lockState=spKnown(lock)?lock.state:'unknown';const lockStatus={locked:T('l_locked'),unlocked:T('l_unlocked'),locking:T('l_locking'),unlocking:T('l_unlocking'),jammed:T('l_jammed')}[lockState]||(spKnown(lock)?(this._ha(lock)||lockState):T('na'));
    const lb=spPercent(this._entity(cfg.lock_battery_entity));
    const nvr=this._isOn(cfg.nvr_state_entity,cfg.nvr_active_state);
    const nvrKnown=!!cfg.nvr_state_entity&&spKnown(this._entity(cfg.nvr_state_entity));
    const nvrStatus=!cfg.nvr_state_entity?T('nvr_none'):nvr===null?(nvrKnown?T('nvr_s',{s:this._entity(cfg.nvr_state_entity).state}):T('na')):nvr?T('nvr_mon'):T('nvr_nomon');
    const nvrDot=!cfg.nvr_state_entity?'unk':nvr===null?(nvrKnown?'unk':'warn'):nvr?'ok':'';
    const record=this._isOn(cfg.recording_entity,cfg.recording_active_state);
    const picture=this._entity(cfg.image_entity);const cb=spPercent(this._entity(cfg.camera_battery_entity));
    const recLabel=!cfg.recording_entity?T('rec_none'):record===null?T('rec_na'):record?T('rec_on'):T('rec_off');
    const cameraMotion=this._isOn(cfg.camera_motion_entity);
    const cameraPerson=this._isOn(cfg.camera_person_entity);
    const wd=this._summary('windows');const mo=this._summary('motion');
    const doorState=spSensorState(this._entity(cfg.door_entity));
    // Header summary: never reports "all closed" when data is missing or nothing is monitored.
    const missing=[cfg.show_alarm&&cfg.alarm_entity&&!spKnown(alarm),cfg.show_alarm&&cfg.base_entity&&!spKnown(bs),cfg.show_nvr&&cfg.nvr_state_entity&&!nvrKnown,cfg.show_lock&&cfg.lock_entity&&!spKnown(lock),cfg.show_door&&cfg.door_entity&&doorState==='unknown',cfg.show_windows&&wd.unavailable>0,cfg.show_motion&&mo.unavailable>0].filter(Boolean).length;
    const openParts=[cfg.show_door&&doorState==='active'?T('sum_door'):'',cfg.show_windows&&wd.active>0?TP('sum_win',wd.active):''].filter(Boolean);
    const summary=alarmTriggered?{k:'crit',t:T('sum_trig'),i:'alert'}
      :missing?{k:'warn',t:TP('sum_miss',missing),i:'alert'}
      :openParts.length?{k:'info',t:openParts.join(' · '),i:''}
      :((cfg.show_door&&cfg.door_entity)||(cfg.show_windows&&cfg.windows.length))?{k:'ok',t:T('sum_ok'),i:'circle'}:null;
    const chip=summary?`<span class="sp-chip ${summary.k}" role="status">${summary.i?spIcon(summary.i):'<span class="sp-status ok"></span>'}${spEscape(summary.t)}</span>`:'';
    const disabled=!cfg.controls_enabled||this._busy;
    const btn=(label,act,icon,off=false)=>`<button type="button" class="sp-button" data-action="${act}" ${off?'disabled':''}>${spIcon(icon)}${label}</button>`;
    const display=(k,name,icon,text,highlight=false,entityId='')=>{
      const detailLabels={door:T('d_door'),windows:T('d_windows'),motion:T('d_motion'),camera:T('d_camera')};
      const detailLabel=detailLabels[k]||T('d_default');
      return `<button type="button" class="sp-sensor ${highlight&&cfg.alert_highlight?'sp-focus':''} ${highlight&&cfg.alert_highlight&&cfg.alert_animation?'sp-pulse':''}" data-action="detail-${k}" aria-label="${spEscape(name)}: ${spEscape(text)}. ${detailLabel}"><span class="sp-sensor-main"><span class="sp-sensor-orb">${spStateIcon(entityId,icon)}</span><span class="sp-sensor-text"><span class="sp-name">${spEscape(name)}</span><span class="sp-sub">${spEscape(text)}</span></span>${spIcon('chevron')}</span></button>`;
    };
    const modes=[['disarmed',T('b_disarm'),'shieldoff'],['armed_home',T('b_home'),'home'],['armed_away',T('b_away'),'shield']].map(([state,text,icon])=>{
      const action=state==='disarmed'?'disarm':state==='armed_home'?'arm-home':'arm-away';
      const supported=state==='armed_home'?(!spKnown(alarm)||!!((Number(alarm.attributes?.supported_features)||0)&1)):state==='armed_away'?(!spKnown(alarm)||!!((Number(alarm.attributes?.supported_features)||0)&2)):true;
      return `<button type="button" data-action="${action}" class="sp-mode ${aState===state?'selected':''} ${state==='armed_home'?'sp-mode-home':state==='armed_away'?'sp-mode-away':''}" ${disabled||!spKnown(alarm)||!supported?'disabled':''}>${spIcon(icon)}${text}</button>`;
    }).join('');
    const alarmMini=[sirenLabel?`<span class="sp-pill ${sirenState?'sp-critical':''}">${spIcon('siren')}${spEscape(sirenLabel)}</span>`:'',baseLabel?`<span class="sp-pill ${baseHealthy===false?'sp-critical':!spKnown(bs)?'sp-warn':''}">${spIcon(!spKnown(bs)||baseHealthy===false?'alert':'circle')}${spEscape(baseLabel)}</span>`:''].filter(Boolean).join('');
    const lastAlarm=spTimeInfo(this._lastAlarmEvent);
    const historyLabel=lastAlarm?T('last_alarm',{ago:spEscape(lastAlarm.ago)}):T('last_alarm_q');
    const alarmHistory=cfg.alarm_entity?`<button class="sp-history-trigger" type="button" data-action="detail-alarm-history">${spIcon('alert')}<span>${historyLabel}</span>${spIcon('chevron')}</button>`:'';
    const sirenControl=cfg.siren_manual_enabled && cfg.siren_control_entity ?
      `<div class="sp-siren-controls"><span class="sp-siren-label">${T('siren_manual')}</span><button class="sp-button" type="button" data-action="siren-on" ${disabled||!manualSirenKnown||manualSiren.state!=='off'?'disabled':''}>${spIcon('siren')}${T('b_siren_on')}</button><button class="sp-button" type="button" data-action="siren-off" ${disabled||!manualSirenKnown||manualSiren.state!=='on'?'disabled':''}>${spIcon('power')}${T('b_siren_off')}</button></div>`:'';
    const nvrBtns=nvr===true?btn(T('b_off'),'nvr-off','power',disabled||!cfg.nvr_off_script||!this._entity(cfg.nvr_off_script)):nvr===false?btn(T('b_on'),'nvr-on','power',disabled||!cfg.nvr_on_script||!this._entity(cfg.nvr_on_script)):`${btn(T('b_on'),'nvr-on','power',disabled||!cfg.nvr_on_script||!this._entity(cfg.nvr_on_script))}${btn(T('b_off'),'nvr-off','power',disabled||!cfg.nvr_off_script||!this._entity(cfg.nvr_off_script))}`;
    const lockCan=lockState==='locked'||lockState==='unlocked';const lockAction=lockState==='locked'?'unlock':'lock';
    const tiles={};
    if(cfg.show_door)tiles.door=display('door',spName(cfg,'door_name'),'door',cfg.door_entity?spStateLabel(this._entity(cfg.door_entity),'door',e=>this._ha(e)):T('cfg_needed'),doorState==='active',cfg.door_entity);
    if(cfg.show_windows)tiles.windows=display('windows',spName(cfg,'windows_name'),'window',cfg.windows.length?`${TP('win_open',wd.active)} · ${TP('win_closed',wd.inactive)}${wd.unavailable?` · ${T('nd_n',{n:wd.unavailable})}`:''}`:T('cfg_needed'),wd.active>0);
    if(cfg.show_motion)tiles.motion=display('motion',spName(cfg,'motion_name'),'motion',!cfg.motion.length?T('cfg_needed'):mo.active?`${T('mo_active',{n:mo.active})}${mo.unavailable?` · ${T('nd_n',{n:mo.unavailable})}`:''}`:mo.unavailable?`${T('st_nomotion')} · ${T('nd_n',{n:mo.unavailable})}`:T('st_nomotion'),mo.active>0);
    if(cfg.show_camera){
      const latest=cfg.camera_last_event_entity?this._entity(cfg.camera_last_event_entity)?.state:this._lastActive(cfg.camera_motion_entity);
      const event=spTimeInfo(latest);
      tiles.camera=display('camera',spName(cfg,'camera_name'),'eye',!cfg.image_entity?T('img_cfg'):!spKnown(picture)?T('img_na'):`${event?T('mv_ago',{ago:event.ago}):cfg.recording_entity?(record===true?T('rec'):record===false?T('rec_inactive'):T('rec_nd')):T('mv_nd')}${cb!==null?` · ${T('tile_bat',{n:cb})}`:''}`,cameraMotion===true||cameraPerson===true||record===true);
    }
    const notes=!cfg.controls_enabled?`<div class="sp-note">${T('note_ro')}</div>`:'';
    const toast=this._error?`<div class="sp-toast" role="alert">${spEscape(this._error)}</div>`:'';
    const ae=this.shadowRoot.activeElement;
    const keepFocus=!ae?'':ae.classList?.contains('sp-close')?'.sp-close':ae.dataset?.action?`[data-action="${ae.dataset.action}"]`:ae.dataset?.key!==undefined?`[data-key="${ae.dataset.key}"]`:'';
    const keepScroll=this.shadowRoot.querySelector('.sp-dbody')?.scrollTop||0;
const alarmBanner=alarmTriggered?`<section class="sp-trigger-alert" role="alert" aria-live="polite">${spIcon('siren')}<div class="sp-trigger-text"><strong>${T('trig_t')}</strong><span class="sp-trigger-note">${T('trig_n')}</span></div></section>`:'';
    const alarmHtml=cfg.show_alarm?`${alarmBanner}
      <section class="sp-row sp-alarm ${alarmTriggered?'sp-alarm-triggered':''}"><div class="sp-amain"><div class="sp-ahead"><div class="sp-orb">${spIcon(aState==='disarmed'?'shieldoff':aState==='armed_home'?'home':'shield')}</div><div class="sp-meta"><div class="sp-name">${spEscape(spName(cfg,'alarm_name'))}</div><div class="sp-sub">${unit(aLabel,aState==='armed_home'||aState==='armed_away'?'ok':alarmTriggered?'error':!spKnown(alarm)?'warn':'')}</div></div></div><div class="sp-actions">${modes}</div></div>${sirenControl}${alarmMini||alarmHistory?`<div class="sp-mini">${alarmMini}${alarmHistory}</div>`:''}</section>`:'';
    const nvrHtml=`<section class="sp-row"><div class="sp-device-main"><div class="sp-device-info"><div class="sp-orb">${spIcon('video')}</div><div class="sp-meta"><div class="sp-name">${spEscape(spName(cfg,'nvr_name'))}</div><div class="sp-sub">${unit(nvrStatus,nvrDot)}</div></div></div><div class="sp-buttons">${nvrBtns}</div></div></section>`;
    const lockHtml=`<section class="sp-row"><div class="sp-device-main"><div class="sp-device-info"><div class="sp-orb">${spIcon(lockState==='unlocked'?'unlock':'lock')}</div><div class="sp-meta"><div class="sp-name">${spEscape(spName(cfg,'lock_name'))}</div><div class="sp-sub">${unit(lockStatus,lockState==='locked'?'ok':lockState==='jammed'?'error':!spKnown(lock)?'warn':'')}${lb!==null?` · ${T('bat',{n:lb})}`:''}</div></div></div>${btn(lockAction==='unlock'?T('b_unlock'):T('b_lock'),lockAction,lockAction==='unlock'?'unlock':'lock',disabled||!lockCan)}</div></section>`;
    // Modules are rendered in the configured order; neighbouring modules of the same kind share one grid.
    const kindOf={nvr:'row',lock:'row',door:'tile',windows:'tile',motion:'tile',camera:'tile'};
    let body='',run=[],runKind='',labelled=false;
    const flush=()=>{if(!run.length)return;
      if(runKind==='row')body+=`<div class="sp-devs">${run.join('')}</div>`;
      else{body+=`${labelled?'':`<div class="sp-section">${T('sec_access')}</div>`}<div class="sp-extras">${run.join('')}</div>`;labelled=true;}
      run=[];};
    for(const k of cfg.order){
      if(!cfg[SP_MOD_FLAG[k]])continue;
      const html=k==='nvr'?nvrHtml:k==='lock'?lockHtml:tiles[k];if(!html)continue;
      if(kindOf[k]!==runKind){flush();runKind=kindOf[k];}
      run.push(html);
    }
    flush();
    this.shadowRoot.innerHTML=`<style>${SP_STYLE}</style><div class="sp-cq"><div class="sp-shell">${toast}
      <header class="sp-header">${cfg.show_eyebrow||cfg.show_title?`<div>${cfg.show_eyebrow?`<div class="sp-eyebrow" ${cfg.show_title?'':'style="margin-bottom:0"'}>${spEscape(cfg.eyebrow)}</div>`:''}${cfg.show_title?`<div class="sp-title">${spEscape(spName(cfg,'title'))}<b>.</b></div>`:''}</div>`:''}${chip}</header>
      ${alarmHtml}${body}${notes}</div></div>${this._modal?this._modalMarkup():''}`;
    this._bindStateIcons();
    if(keepFocus&&!this._focusModal)this.shadowRoot.querySelector(keepFocus)?.focus?.();
    if(this._modal){const db=this.shadowRoot.querySelector('.sp-dbody');if(db&&keepScroll)db.scrollTop=keepScroll;this._lockScroll();if(this._focusModal){this._focusModal=false;this.shadowRoot.querySelector('.sp-close')?.focus?.();}}
    const inpt=this.shadowRoot.querySelector('[data-alarm-code]');if(inpt && this._modal?.type==='alarm-code')inpt.value=this._modal.code||'';
  }
  _modalMarkup(){
    const modal=this._modal;
    let title='';const h=(name)=>{title=name;return '';};
    let content='';
    if(modal.type==='group'){
      const grp=modal.group;const list=grp==='door'?[this._config.door_entity].filter(Boolean):this._config[grp];
      const mode=grp==='door'?'door':grp==='windows'?'windows':'motion';
      content=h({door:T('door'),windows:T('windows'),motion:T('motion')}[grp])+`<div class="sp-sub">${grp==='motion'?T('p_sub_motion'):T('p_sub_tap')}</div>`;
      content+=list.length?list.map(id=>{const item=this._entity(id);const n=item?.attributes?.friendly_name||T('p_sensor');const last=this._lastActive(id);const time=spTimeInfo(last);const t=grp==='motion'?T('p_last_motion'):T('p_last_open');return `<button type="button" class="sp-item" data-more-info="${spEscape(id)}">${spStateIcon(id,grp==='motion'?'motion':grp==='windows'?'window':'door')}<div class="sp-meta"><div class="sp-name">${spEscape(n)}</div><div class="sp-small">${spEscape(spStateLabel(item,mode,e=>this._ha(e)))}</div>${time?`<div class="sp-entity">${t}: ${spEscape(time.ago)} · ${spEscape(time.exact)}</div>`:`<div class="sp-entity">${t}: ${T('p_unavail')}</div>`}</div>${spIcon('chevron')}</button>`;}).join(''):`<div class="sp-sub">${T('p_none')}</div>`;
    }else if(modal.type==='alarm-history'){
      const current=this._entity(this._config.alarm_entity);
      const when=this._lastAlarmEvent;
      const time=spTimeInfo(when);
      content=h(T('ah_title'))+
        `<div class="sp-event">${spIcon('alert')}<div><strong>${T('ah_strong')}</strong><div class="sp-small">${this._alarmHistoryLoading?T('ah_loading'):time?`${spEscape(time.ago)} · ${spEscape(time.exact)}`:T('ah_none')}</div></div></div>`+
        `<div class="sp-sub">${current?.state==='triggered'?T('ah_now'):T('ah_only')} ${T('ah_cause')}</div>`+
        `<div class="sp-small">${T('ah_rec')}</div>`;
    }else if(modal.type==='camera'){
      const cfg=this._config;
      const picture=this._entity(cfg.image_entity);
      const imageUrl=spImageUrl(picture);
      const last=this._entity(cfg.camera_last_event_entity);
      const timestamp=cfg.camera_last_event_entity && spKnown(last)?last.state:this._lastActive(cfg.camera_motion_entity);
      const time=spTimeInfo(timestamp);
      const battery=spPercent(this._entity(cfg.camera_battery_entity));
      content=h(spName(cfg,'camera_name'))+
        `<div class="sp-camera"><div class="sp-snapshot-label">${T('cam_last_img')}</div>${imageUrl?`<img class="sp-snapshot" alt="${T('cam_alt')}" src="${spEscape(imageUrl)}"/>`:`<div class="sp-small">${T('cam_noimg')}</div>`}</div>`+
        `<div class="sp-event">${spIcon('motion')}<div><strong>${T('cam_motion')}</strong><div class="sp-small">${time?`${spEscape(time.ago)} · ${spEscape(time.exact)}`:T('cam_notavail')}</div></div></div>`+
        (cfg.recording_entity?`<div class="sp-event">${spIcon('video')}<div><strong>${T('cam_rec')}</strong><div class="sp-small">${spEscape(!spKnown(this._entity(cfg.recording_entity))?T('na'):this._isOn(cfg.recording_entity,cfg.recording_active_state)===true?T('rec_on'):this._isOn(cfg.recording_entity,cfg.recording_active_state)===false?T('rec_off'):T('rec_unk'))}</div></div></div>`:'')+
        (battery!==null?`<div class="sp-event">${spIcon('battery')}<div><strong>${T('cam_bat')}</strong><div class="sp-small">${battery}%</div></div></div>`:'')+
        (cfg.image_entity?`<button type="button" class="sp-wide" data-more-info="${spEscape(cfg.image_entity)}">${spIcon('expand')}${T('d_camera')}</button>`:'');
    }else if(modal.type==='pin'){
      content=h(T('pin_title'))+`<div class="sp-sub">${T('pin_sub',{l:spEscape(modal.label)})}</div>`+this._keypad()+`<button type="button" class="sp-wide" data-action="verify-pin" ${this._pin.length<4||this._busy?'disabled':''}>${T('p_confirm')}</button>`;
    }else if(modal.type==='alarm-code'){
      const text=this._textCode();
      content=h(T('ac_title'))+`<div class="sp-sub">${T('ac_sub')}</div>`+(text?`<input class="sp-input" type="password" autocomplete="off" aria-label="${T('ac_title')}" data-alarm-code/><div class="sp-kerr" role="alert">${spEscape(modal.error||'')}</div>`:this._keypad())+`<button type="button" class="sp-wide" data-action="send-alarm" ${this._busy||(!text&&!this._pin)?'disabled':''}>${T('p_confirm')}</button>`;
    }else if(modal.type==='confirm'){
      content=h(T('cf_title'))+`<div class="sp-sub">${spEscape(modal.message)}</div><button type="button" class="sp-wide" data-action="confirm-operation" ${this._busy?'disabled':''}>${T('p_confirm')}</button>`;
    }
    if(modal.error&&!['pin','alarm-code'].includes(modal.type))content+=`<div class="sp-error" role="alert">${spEscape(modal.error)}</div>`;
    return `<div class="sp-backdrop${spWidePopup()?' sp-pop-wide':''}" data-backdrop="1"><div class="sp-dialog sp-t-${modal.type}" role="dialog" aria-modal="true" aria-labelledby="sp-mt"><div class="sp-dialoghead"><strong id="sp-mt">${spEscape(title)}</strong><button type="button" class="sp-close" data-action="close" aria-label="${T('p_close')}">${spIcon('x')}</button></div><div class="sp-dbody">${content}</div></div></div>`;
  }
  _closeModal(){const key=this._opener;this._modal=null;this._pin='';this._opener='';this._lastRender='';this._paint();if(key)this.shadowRoot.querySelector(`[data-action="${key}"]`)?.focus?.();}
  _open(modal){this._opener=this._opener||this.shadowRoot.activeElement?.dataset?.action||'';this._focusModal=true;this._modal=modal;this._pin='';this._lastRender='';this._paint();}
  // While the popup is open the dashboard behind must not move: wheel and touch scrolling are
  // blocked outside the popup body and stopped at its edges (no scroll chaining).
  _lockScroll(){
    const backdrop=this.shadowRoot.querySelector('.sp-backdrop');if(!backdrop)return;
    const body=backdrop.querySelector('.sp-dbody');
    const atEdge=dy=>!body||(dy<0&&body.scrollTop<=0)||(dy>0&&body.scrollTop+body.clientHeight>=body.scrollHeight-1);
    backdrop.addEventListener('wheel',e=>{if(!body||!body.contains(e.target)||atEdge(e.deltaY))e.preventDefault();},{passive:false});
    let y=0;
    backdrop.addEventListener('touchstart',e=>{y=e.touches[0]?e.touches[0].clientY:0;},{passive:true});
    backdrop.addEventListener('touchmove',e=>{const dy=y-(e.touches[0]?e.touches[0].clientY:y);if(!body||!body.contains(e.target)||atEdge(dy))e.preventDefault();},{passive:false});
  }
  async _run(domain,service,data){
    if(this._busy||!this._config.controls_enabled)return;
    this._busy=true;this._error='';this._lastRender='';this._paint();
    try{await this._hass.callService(domain,service,data);this._closeModal();}
    catch(e){this._flashError(T('e_cmd',{m:spText(e?.message||T('e_ha'),180)}));this._closeModal();}
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
    const keypad=e.target.closest('[data-key]');if(keypad&&(this._modal?.type==='pin'||(this._modal?.type==='alarm-code'&&!this._textCode()))){this._keyIn(keypad.dataset.key);return;}
    const btn=e.target.closest('[data-action]');if(!btn)return;const a=btn.dataset.action; if(a==='close'){this._closeModal();return;}
    if(a==='detail-alarm-history'){this._open({type:'alarm-history'});this._loadLastAlarm();return;}
    if(a.startsWith('detail-')){
      const group=a.slice(7);if(group==='camera'){
        this._open({type:'camera'});this._loadLastActivities([this._config.camera_motion_entity]);
      }else{this._open({type:'group',group});if(['windows','door','motion'].includes(group))this._loadLastActivities(group==='door'?[this._config.door_entity]:this._config[group]);}return;
    }
    if(!this._config.controls_enabled||this._busy)return;
    if(['disarm','arm-home','arm-away'].includes(a)){this._alarmAction(a);return;}
    if(a==='siren-on'||a==='siren-off'){
      const cfg=this._config;
      if(!cfg.siren_manual_enabled||!cfg.siren_control_entity||!['siren','switch'].includes(cfg.siren_control_entity.split('.')[0]))return;
      const entity=this._entity(cfg.siren_control_entity);
      if(!spKnown(entity)||entity.state!==(a==='siren-on'?'off':'on'))return;
      const domain=cfg.siren_control_entity.split('.')[0];
      const op={domain,service:a==='siren-on'?'turn_on':'turn_off',data:{entity_id:cfg.siren_control_entity}};
      if(a==='siren-on')this._open({type:'confirm',message:T('cf_siren'),operation:op});
      else this._run(op.domain,op.service,op.data);
      return;
    }

    if(a==='nvr-on'||a==='nvr-off'){
      const id=this._config[a==='nvr-on'?'nvr_on_script':'nvr_off_script'];
      if(id&&this._entity(id))this._run('script','turn_on',{entity_id:id});return;
    }
    if(a==='lock'){const id=this._config.lock_entity; if(id&&this._entity(id))this._run('lock','lock',{entity_id:id});return;}
    if(a==='unlock'){
      const id=this._config.lock_entity;if(!id||this._entity(id)?.state!=='locked')return;
      const op={domain:'lock',service:'unlock',data:{entity_id:id}};
      if(this._config.lock_pin_enabled){if(!this._config.lock_pin_hash){this._flashError(T('e_nopin'));this._lastRender='';this._paint();return;}this._open({type:'pin',label:T('pin_unlock'),operation:op});}
      else if(this._config.lock_confirm_direct)this._open({type:'confirm',message:T('cf_unlock'),operation:op});
      else this._run(op.domain,op.service,op.data);
      return;
    }
    if(a==='confirm-operation'&&this._modal?.type==='confirm'){const o=this._modal.operation;this._run(o.domain,o.service,o.data);return;}
    if(a==='send-alarm'&&this._modal?.type==='alarm-code'){
      const v=this._textCode()?(this.shadowRoot.querySelector('[data-alarm-code]')?.value||''):this._pin;
      if(!v.trim()){this._modal.error=T('e_nocode');this._lastRender='';this._paint();return;}
      const o=this._modal.operation;this._run(o.domain,o.service,{...o.data,code:v});return;
    }
    if(a==='verify-pin'&&this._modal?.type==='pin'){
      if(Date.now()<this._pinCooldown){this._modal.error=T('e_many');this._lastRender='';this._paint();return;}
      if(this._busy)return;const op=this._modal.operation;this._busy=true;this._lastRender='';this._paint();
      spPinCheck(this._pin,this._config.lock_pin_hash).then(ok=>{
        this._busy=false;
        if(ok){this._pinFailures=0;this._run(op.domain,op.service,op.data);}else{
          this._pinFailures++;if(this._pinFailures>=5){this._pinCooldown=Date.now()+60000;this._pinFailures=0;}
          this._pin='';if(this._modal)this._modal.error=T('e_badpin');this._lastRender='';this._paint();
        }
      }).catch(()=>{this._busy=false;this._pin='';if(this._modal)this._modal.error=T('e_pinna');this._lastRender='';this._paint();});
    }
  }
  _input(e){if(e.target.matches('[data-alarm-code]')&&this._modal?.type==='alarm-code')this._modal.code=e.target.value;}
}

class SecurityPanelCardEditor extends HTMLElement {
  constructor(){
    super();this.attachShadow({mode:'open'});this._config=spConfig();this._hass=null;this._tab='allarme';
    this._notice='';this._nativeTried=false;
    this.shadowRoot.addEventListener('click',e=>this._click(e));
    this.shadowRoot.addEventListener('change',e=>this._change(e));
  }
  set hass(hass){const first=!this._hass;this._hass=hass;this.shadowRoot.querySelectorAll('ha-selector').forEach(x=>x.hass=hass);if(first&&this.isConnected)this._render();}
  setConfig(raw){
    const cfg=spConfig(raw);if(JSON.stringify(cfg)===JSON.stringify(this._config)&&this.shadowRoot.querySelector('.ed'))return;
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
  _update(key,value,rerender=false){this._config=spConfig({...this._config,[key]:value});this._emit();if(rerender)this._render();}
  _field(label,inner,help=''){return `<div class="field"><div class="label">${spEscape(label)}</div>${inner}${help?`<div class="tiny">${spEscape(help)}</div>`:''}</div>`;}
  _text(key,label,help=''){
    const value=SP_IT_DEFAULTS[key]?spName(this._config,key):this._config[key];
    return this._field(label,`<input class="input" data-text="${key}" type="text" maxlength="60" value="${spEscape(value)}"/>`,help);
  }
  _check(key,label,help=''){
    return `<div class="row"><label for="sp_${key}">${spEscape(label)}${help?`<div class="muted">${spEscape(help)}</div>`:''}</label><input id="sp_${key}" data-check="${key}" type="checkbox" ${this._config[key]?'checked':''}/></div>`;
  }
  _chk(key,label){
    return `<div class="chk"><input id="sp_${key}" data-check="${key}" type="checkbox" ${this._config[key]?'checked':''}/><label for="sp_${key}">${spEscape(label)}</label></div>`;
  }
  _selector(key,label,help=''){return this._field(label,`<div data-slot="${key}"></div>`,help);}
  _multi(key,label,help=''){return this._field(label,`<div data-multi="${key}"></div>`,help);}
  _alarmTab(c){
    return `<div class="heading">${T('al_head')}</div><div class="desc">${T('al_desc')}</div>`+
      this._selector('alarm_entity',T('e_alarm_entity'))+
      this._text('alarm_name',T('e_name'))+
      this._check('show_alarm',T('e_show_alarm'),T('e_show_alarm_h'))+
      this._check('controls_enabled',T('ad_cmd'),T('ad_cmd_h'))+
      this._check('alarm_disarm_code',T('e_disarm_code'),T('e_disarm_code_h'))+
      this._check('alarm_arm_code',T('e_arm_code'))+
      this._selector('siren_entity',T('e_siren_state'))+
      this._check('siren_manual_enabled',T('e_siren_manual'),T('e_siren_manual_h'))+
      (c.siren_manual_enabled?this._selector('siren_control_entity',T('e_siren_ctl'),T('e_siren_ctl_h')):'')+
      this._selector('base_entity',T('e_base'))+
      (c.base_entity?this._text('base_ok_state',T('e_base_ok'),T('e_base_ok_h')):'')+
      `<div class="tiny">${T('ad_note')}</div>`;
  }
  _lockPin(c){
    const noHttps=!globalThis.crypto?.subtle;
    const row=c.lock_pin_hash
      ?`<div class="row"><label>${T('pin_row')}<div class="muted">${T('pin_set')}</div></label><input type="checkbox" checked disabled aria-label="${spEscape(T('pin_set_aria'))}"/></div>`
      :this._check('lock_pin_enabled',T('pin_req'),T('pin_req_h'));
    const box=(c.lock_pin_enabled||c.lock_pin_hash)
      ?`<div class="field"><div class="label">${T('pin_box')}</div><div class="muted">${T('pin_box_h')}</div>${noHttps?`<div class="errt" role="alert">${T('pin_no_http')}</div>`:''}
          ${c.lock_pin_hash?`<div class="label" style="margin-top:12px">${T('pin_cur')}</div><input type="password" autocomplete="off" inputmode="numeric" class="input" data-oldpin placeholder="${spEscape(T('pin_cur_ph'))}" maxlength="8"/>`:''}
          <div class="label" style="margin-top:12px">${c.lock_pin_hash?T('pin_new'):T('pin_choose')}</div><input type="password" autocomplete="new-password" inputmode="numeric" placeholder="${spEscape(T('pin_ph'))}" minlength="4" maxlength="8" class="input" data-newpin/>
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button type="button" data-set-pin class="action">${c.lock_pin_hash?T('pin_btn_change'):T('pin_btn_set')}</button>${c.lock_pin_hash?`<button type="button" class="action" data-clear-pin>${T('pin_btn_off')}</button>`:''}</div><div class="tiny">${c.lock_pin_hash?T('pin_tip_set'):T('pin_tip_none')}</div></div>`
      :this._check('lock_confirm_direct',T('e_confirm_direct'));
    return row+box;
  }
  _moduleBody(k,c){
    if(k==='nvr')return this._selector('nvr_on_script',T('e_nvr_on'))+this._selector('nvr_off_script',T('e_nvr_off'))+this._selector('nvr_state_entity',T('e_nvr_state'))+(c.nvr_state_entity?this._text('nvr_active_state',T('e_nvr_val'),T('e_nvr_val_h')):'')+this._text('nvr_name',T('e_name'));
    if(k==='lock')return this._selector('lock_entity',T('e_lock'))+this._selector('lock_battery_entity',T('e_lock_bat'))+this._lockPin(c)+this._text('lock_name',T('e_name'));
    if(k==='door')return this._selector('door_entity',T('e_door'))+this._text('door_name',T('e_name'));
    if(k==='windows')return this._multi('windows',T('e_windows'))+this._text('windows_name',T('e_name'));
    if(k==='motion')return this._multi('motion',T('e_motion'))+this._text('motion_name',T('e_name'));
    return this._selector('image_entity',T('e_img'))+this._selector('camera_battery_entity',T('e_cam_bat'))+
      this._selector('recording_entity',T('e_rec'))+(c.recording_entity?this._text('recording_active_state',T('e_rec_val'),T('e_rec_val_h')):'')+
      this._selector('camera_motion_entity',T('e_cam_motion'))+this._selector('camera_last_event_entity',T('e_cam_ts'))+
      this._text('camera_location_name',T('e_area'))+this._text('camera_name',T('e_name'));
  }
  _modulesTab(c){
    const help={nvr:T('h_nvr'),lock:T('h_lock'),motion:T('e_motion_h')};
    return `<div class="heading">${T('mo_head')}</div><div class="desc">${T('mo_desc')}</div>`+c.order.map((k,i)=>{
      const name=T(k==='camera'?'camera_digital':k);
      return `<div class="mod"><div class="mh"><div class="nm">${spEscape(name)}</div><div class="ctl"><button type="button" class="action" data-move="${i}:-1" aria-label="${spEscape(T('mv_up',{n:name}))}" ${i===0?'disabled':''}>↑</button><button type="button" class="action" data-move="${i}:1" aria-label="${spEscape(T('mv_dn',{n:name}))}" ${i===c.order.length-1?'disabled':''}>↓</button></div></div>${help[k]?`<div class="muted" style="margin-top:6px">${spEscape(help[k])}</div>`:''}<div class="mb">${this._chk(SP_MOD_FLAG[k],T('m_on'))}${this._moduleBody(k,c)}</div></div>`;
    }).join('');
  }
  _lookTab(c){
    const opt=(v,label,cur)=>`<option value="${v}" ${cur===v?'selected':''}>${spEscape(label)}</option>`;
    return `<div class="heading">${T('t_look')}</div>`+
      this._text('eyebrow',T('lk_eyebrow'))+this._text('title',T('lk_title'),T('lk_title_h'))+
      this._check('show_eyebrow',T('lk_show_eb'))+this._check('show_title',T('lk_show_ti'))+
      this._field(T('lk_theme'),`<select class="input" data-choice="theme_mode">${opt('auto',T('th_auto'),c.theme_mode)}${opt('light','Light Edera',c.theme_mode)}${opt('dark','Dark Edera',c.theme_mode)}</select>`)+
      this._field(T('lang'),`<select class="input" data-choice="language">${opt('auto',T('lang_auto'),c.language)}${SP_LANGS.map(l=>opt(l[0],l[1],c.language)).join('')}</select>`,T('lang_h'))+
      this._check('alert_highlight',T('lk_hl'),T('lk_hl_h'))+
      this._check('alert_animation',T('ad_anim'),T('ad_anim_h'));
  }
  _render(){
    if(!this.isConnected)return;
    const c=this._config;SP_CUR=spPickLang(c.language,this._hass);
    const tabs=[['allarme',T('t_alarm')],['moduli',T('t_modules')],['aspetto',T('t_look')]];
    const body=this._tab==='allarme'?this._alarmTab(c):this._tab==='moduli'?this._modulesTab(c):this._lookTab(c);
    this.shadowRoot.innerHTML=`<style>${SP_EDITOR_CSS}</style><div class="ed"><div class="tabs" role="group" aria-label="${spEscape(T('secs'))}">${tabs.map(([id,label])=>`<button type="button" class="tab" data-tab="${id}" aria-pressed="${this._tab===id}">${spEscape(label)}</button>`).join('')}</div>${body}${this._notice?`<div class="errt" role="alert">${spEscape(this._notice)}</div>`:''}</div>`;
    if(!customElements.get('ha-selector'))return;
    const mount=(slot,key,multi)=>{
      const ds=SP_DOMAINS[key];if(!ds)return;
      const el=document.createElement('ha-selector');el.hass=this._hass;
      el.selector={entity:{domain:ds.length===1?ds[0]:ds,...(multi?{multiple:true}:{})}};
      el.value=multi?c[key]:(c[key]||undefined);el.required=false;
      el.addEventListener('value-changed',e=>{
        e.stopPropagation();if(!e.detail)return;
        if(multi)this._update(key,spList(e.detail.value,ds));
        else this._update(key,spEntity(e.detail.value,ds),SP_RERENDER.includes(key));
      });
      slot.appendChild(el);
    };
    this.shadowRoot.querySelectorAll('[data-slot]').forEach(s=>mount(s,s.dataset.slot,false));
    this.shadowRoot.querySelectorAll('[data-multi]').forEach(s=>mount(s,s.dataset.multi,true));
  }
  _click(e){
    const tab=e.target.closest('[data-tab]');if(tab){this._tab=tab.dataset.tab;this._notice='';this._render();return;}
    const mv=e.target.closest('[data-move]');if(mv){
      const [i,d]=mv.dataset.move.split(':').map(Number);const o=[...this._config.order];const j=i+d;
      if(j>=0&&j<o.length){[o[i],o[j]]=[o[j],o[i]];this._update('order',o,true);}
      return;
    }
    if(e.target.closest('[data-clear-pin]')){
      const old=this.shadowRoot.querySelector('[data-oldpin]')?.value||'';
      if(!old){this._notice=T('n_pin_old_off');this._render();return;}
      this._notice=T('n_checking');
      spPinCheck(old,this._config.lock_pin_hash).then(ok=>{
        if(!ok){this._notice=T('n_pin_wrong');this._render();return;}
        this._config=spConfig({...this._config,lock_pin_hash:'',lock_pin_enabled:false,lock_confirm_direct:true});
        this._notice=T('n_pin_off_done');this._emit();this._render();
      }).catch(()=>{this._notice=T('n_check_na');this._render();});
      return;
    }
    if(e.target.closest('[data-set-pin]')){
      const pin=this.shadowRoot.querySelector('[data-newpin]')?.value||'';
      if(!/^\d{4,8}$/.test(pin)){this._notice=T('n_pin_digits');this._render();return;}
      const old=this.shadowRoot.querySelector('[data-oldpin]')?.value||'';
      if(this._config.lock_pin_hash&&!old){this._notice=T('n_pin_need_old');this._render();return;}
      this._notice=T('n_verifying');
      const verify=this._config.lock_pin_hash?spPinCheck(old,this._config.lock_pin_hash):Promise.resolve(true);
      verify.then(ok=>{if(!ok){this._notice=T('n_pin_wrong');this._render();return;}return spPinMake(pin).then(hash=>{this._notice=T('n_pin_done');this._update('lock_pin_hash',hash,true);});}).catch(e=>{this._notice=spText(e.message);this._render();});
    }
  }
  _change(e){
    const t=e.target;
    if(t.dataset.text)this._update(t.dataset.text,t.value);
    if(t.dataset.check){
      const k=t.dataset.check;
      if(k==='lock_pin_enabled'&&t.checked&&!globalThis.crypto?.subtle){this._notice=T('n_pin_http');this._render();return;}
      if(k==='lock_pin_enabled'&&!t.checked&&this._config.lock_pin_hash){this._notice=T('n_pin_off_first');this._render();return;}
      this._update(k,t.checked,SP_RERENDER.includes(k));
    }
    if(t.dataset.choice)this._update(t.dataset.choice,t.value,t.dataset.choice==='language');
  }
}

if(!customElements.get(SP_TAG)) customElements.define(SP_TAG,SecurityPanelCard);
if(!customElements.get(SP_EDITOR_TAG)) customElements.define(SP_EDITOR_TAG,SecurityPanelCardEditor);
if(typeof window!=='undefined'){
  window.customCards=window.customCards||[];
  if(!window.customCards.some(c=>c.type===SP_TAG))window.customCards.push({type:SP_TAG,name:'Security Panel Card',description:'Modular Edera security panel: alarm, video surveillance, smart lock, doors, windows, motion sensors and digital peephole.',preview:true});
}
