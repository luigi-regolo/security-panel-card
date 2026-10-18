[![TikTok | Segui](assets/tiktok-segui.svg)](https://www.tiktok.com/@luigi.regolo)

# Security Panel Card

**Un pannello di sicurezza moderno per Home Assistant**, che riunisce allarme, videosorveglianza, serratura intelligente, porte, finestre, sensori di movimento e spioncino digitale in un'unica scheda.

Security Panel Card è una custom card per le dashboard Home Assistant, progettata con un'interfaccia minimal, controlli intuitivi e una grafica adattiva ispirata ai temi Edera Light e Dark.

La card è indipendente dai produttori: utilizza le entità e gli script già configurati in Home Assistant.

## Anteprima

<p align="center">
  <img src="assets/security-panel-light.png" alt="Security Panel Card — Edera Light" width="620" />
</p>

Anteprima dimostrativa con valori fittizi, senza dati di installazioni reali.

## Funzionalità

### Allarme

- Inserimento in modalità Casa o Fuori casa, se supportato dall'entità `alarm_control_panel`.
- Disinserimento tramite pannello di controllo.
- Richiesta del codice allarme, quando necessaria.
- Visualizzazione dello stato della sirena.
- Monitoraggio dello stato della centrale, se disponibile.
- Consultazione dell’**ultimo allarme scattato** in un popup dedicato, con data e ora tratte dalla cronologia di Home Assistant (se disponibile).
- **Controllo manuale della sirena facoltativo**, tramite un’entità `siren.*` o `switch.*` selezionata separatamente da quella dello stato. L’accensione richiede una conferma esplicita; nessuna sirena viene attivata automaticamente.
- Avviso rosso **Allarme scattato** solo quando il pannello segnala effettivamente `triggered`; nessun comando automatico viene eseguito.

### Videosorveglianza

- Attivazione tramite script Home Assistant.
- Disattivazione tramite script indipendente.
- Visualizzazione facoltativa dello stato effettivo dell'NVR.

Se non viene configurato un sensore di stato, la card mostra entrambi i comandi senza presumere che il registratore sia acceso o spento. Un comando inviato non equivale alla conferma del suo completamento.

### Serratura intelligente

- Visualizzazione dello stato bloccata/sbloccata.
- Comandi di blocco e sblocco.
- Percentuale batteria, quando disponibile.
- Sblocco diretto con conferma facoltativa.
- Tastierino PIN visuale opzionale.
- Richiesta del PIN corrente nell'editor per modificarlo o disattivarlo.

**Importante:** il PIN visuale è una conferma nel browser, non un sistema di autenticazione o controllo accessi. Un utente già autorizzato a usare i servizi Home Assistant può aggirarlo utilizzando altre interfacce. Non affidarsi a questa funzione per proteggere fisicamente una porta.

### Porte e finestre

- Stato aperto o chiuso della porta.
- Conteggio delle finestre aperte e chiuse.
- Apertura dei dettagli delle singole entità, con nomi leggibili senza ID tecnici.
- Ultima apertura in minuti/ore/giorni e data esatta quando la cronologia Home Assistant è disponibile.
- Evidenziazione degli stati attivi con il verde Edera.
- Segnalazione dei sensori non disponibili, senza considerarli chiusi.

### Sensori di movimento

- Monitoraggio di uno o più sensori volumetrici.
- Indicazione del movimento rilevato.
- Elenco dei sensori configurati.
- Funzionamento esclusivamente in lettura.

### Spioncino digitale

- Ultima fotografia tramite entità `image.*` (senza flusso videocamera).
- Visualizzazione dello snapshot usando la risorsa locale di Home Assistant.
- Percentuale della batteria, se disponibile.
- Ultimo movimento rilevato, ricavato dal sensore dedicato e dalla cronologia, quando disponibile.
- Stato registrazione facoltativo (In registrazione/Non in registrazione/Non disponibile), senza deduzioni basate sul movimento.
- Etichetta **Batteria** accanto alla percentuale.
- Nome personalizzabile dell'area monitorata.

L'ultima rilevazione di movimento è mostrata soltanto se esiste un timestamp attendibile (entità opzionale o cronologia disponibile). Non viene inferita automaticamente una persona dal movimento.

## Design Edera

Security Panel Card offre tre modalità: **Auto** (segue Home Assistant), **Light** (fondo chiaro e riquadri grigio-verde), **Dark** (fondo quasi nero e riquadri antracite).

Gli elementi utilizzano bordi arrotondati, icone native Material Design Icons di Home Assistant e tipografia coerente con Home Assistant. **Il titolo e il punto verde Edera restano gli elementi identificativi della card**, mentre i testi interni usano pesi più leggeri. Gli stati attivi possono essere evidenziati con un verde Edera pieno. Nella sezione allarme **solo il pulsante selezionato** cambia colore: Disinserito neutro, Casa verde Edera e Fuori casa blu petrolio. Il contenitore dell’allarme resta neutro. Il rosso compare soltanto quando l’entità `alarm_control_panel` segnala lo stato `triggered`: appare un avviso ben visibile **«Allarme scattato»**, senza attribuire cause o identificare sensori non verificati. Finestre aperte e sensori di movimento attivi rimangono verdi Edera, non rossi. Le animazioni sono facoltative e rispettano le preferenze di movimento ridotto del dispositivo.

## Configurazione visuale

La card dispone di un editor grafico organizzato in sei sezioni:

| Sezione | Configurazione |
| --- | --- |
| Allarme | Pannello, stato sirena, comando sirena facoltativo, centrale e richiesta codice |
| Videosorveglianza | Script attivazione, script disattivazione e stato NVR |
| Serratura | Entità `lock`, batteria e conferma PIN |
| Sensori | Porta, finestre, volumetrico e spioncino |
| Aspetto | Titolo, tema ed evidenziazione degli stati |
| Avanzate | Abilitazione comandi e animazioni |

Le entità vengono selezionate dall'installazione Home Assistant tramite l'editor visuale, senza configurazione YAML obbligatoria. Le entità singole possono essere rimosse con il pulsante **X** vicino al selettore; nelle liste di finestre e sensori ogni riga ha una X dedicata. Le funzionalità aggiuntive sono facoltative: ogni utente può mostrare soltanto gli elementi desiderati.

### Abilitazione dei comandi reali

Per sicurezza, la card parte in modalità **sola lettura**. Per utilizzare i comandi dopo aver controllato che le entità siano corrette:

1. Aprire la dashboard in modalità modifica e selezionare **Modifica scheda** per Security Panel Card.
2. Nell'editor aprire la sezione **Avanzate**.
3. Attivare **Abilita i comandi reali** e salvare la card.
4. Verificare il funzionamento dei comandi desiderati, con cautela.

I comandi non si eseguono da soli e richiedono i permessi Home Assistant già esistenti. **Per usare anche la sirena manuale**, aprire **Allarme → Altre opzioni**, abilitare *Consenti controllo manuale sirena* e scegliere una specifica entità comandabile `siren.*` o `switch.*`. Attivare i comandi reali non abilita automaticamente la sirena manuale. Il comando *Attiva sirena* richiede conferma, mentre il comando *Spegni sirena* è disponibile quando la sirena è accesa. Un sensore `binary_sensor.*` mostra soltanto lo stato e non permette di comandare la sirena.

## Installazione tramite HACS

Security Panel Card si installa tramite HACS, aggiungendo il repository come archivio personalizzato. Non è necessario copiare manualmente il JavaScript in Home Assistant.

[![Apri Security Panel Card in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=luigi-regolo&repository=security-panel-card&category=plugin)

Il pulsante apre la procedura in Home Assistant attraverso My Home Assistant. L'aggiunta dell'archivio e l'installazione richiedono comunque la conferma dell'utente; il pulsante non significa che la card sia presente nel catalogo predefinito HACS.

1. Aprire HACS in Home Assistant.
2. Selezionare il menu **⋮ → Archivi personalizzati**.
3. Inserire il repository: `https://github.com/luigi-regolo/security-panel-card`.
4. Selezionare la categoria **Dashboard**.
5. Aggiungere l'archivio e installare Security Panel Card.
6. Ricaricare la pagina di Home Assistant.
7. Aggiungere Security Panel Card alla dashboard e configurare le entità dall'editor grafico.

Se la risorsa non viene registrata automaticamente, verificare nelle risorse della dashboard che sia presente il modulo `/hacsfiles/security-panel-card/security-panel-card.js`.

Queste istruzioni verranno validate nella prova di aggiornamento in Home Assistant. Il repository personalizzato HACS non implica l'inclusione nel catalogo ufficiale HACS.

## Sicurezza e privacy

Security Panel Card utilizza le entità, le autorizzazioni e i servizi disponibili in Home Assistant.

- I comandi reali sono disabilitati per impostazione predefinita.
- Nessuna password amministratore Home Assistant viene richiesta o memorizzata dalla card.
- Il codice dell'allarme viene inserito al momento dell'utilizzo e inviato all'integrazione, senza salvarlo nella configurazione.
- Il PIN visuale della serratura non viene salvato in chiaro: viene conservato un valore derivato con salt, ma la verifica resta locale al browser ed è aggirabile da utenti Home Assistant già autorizzati.
- Non sono presenti telemetria, pubblicità, servizi di analisi o dipendenze JavaScript remote nella card.
- I dispositivi e le loro integrazioni possono utilizzare servizi cloud indipendenti dalla card.

**Security Panel Card non è un sistema antintrusione certificato.** La sicurezza effettiva dipende dalle autorizzazioni Home Assistant, dal pannello allarme e dai dispositivi integrati. La consultazione dell’ultimo allarme e degli orari storici usa solo la cronologia locale di Home Assistant quando viene aperto il dettaglio; non contatta servizi esterni. Il Recorder conserva per impostazione predefinita 10 giorni di cronologia dettagliata e può escludere entità. Il codice sorgente è fornito senza garanzie aggiuntive rispetto a quanto previsto dalla licenza.

## Compatibilità

La card utilizza domini Home Assistant standard, tra cui `alarm_control_panel`, `script`, `lock`, `siren`, `switch`, `image`, `binary_sensor`, `sensor`, e le entità compatibili effettivamente disponibili nella tua istanza. Nessun produttore è obbligatorio. Alcuni stati potrebbero non essere esposti dall'integrazione usata.

## Segnalazioni e contributi

Problemi e suggerimenti possono essere condivisi tramite la sezione Issues del repository GitHub.

Prima di pubblicare screenshot, log o configurazioni, rimuovere credenziali, PIN, token, identificativi personali, indirizzi e altri dati privati.

## Licenza

**GNU GPL-3.0-only.** Vedere il file [LICENSE](LICENSE).
