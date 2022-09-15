# Claranet_Interview

## PROGETTO
L'idea è quella di un progetto che permetta, ad un proprietario di una catena di fast food che utilizzano carte di fidelizzazione,
di ottenere in tempo reale statistiche sul consumo da parte dei clienti e sulle perdite da parte dei punti vendita.
Inoltre il progetto finale dovrebbe permettere anche la registrazione e l'accesso di utenti identificati attraverso il numero della carta di fidelizzazione.
Ogni singolo utente quindi potrà accedere alle proprie offerte e tramite l'app o la carta potrà registrare i suoi acquisti nei punti vendita.
Nello specifico gli end-point che andrò ad implementare sono 3:
- Il login per garantire unicamente l'autenticazione dell'amministratore o amministratori che possono accedere alle informazioni statistiche e o degli utenti che possono accedere alle loro informazioni.
- Un end-point che fornisce dati statistici inerenti alla spesa media dei clienti nei punti ristoro, al tempo medio trascorso tra una visita e l'altra e alle votazioni medie ricevute
- Un end-point che restituirà dati relativi ai consumi per ogni centro e divisi in base alle date.In modo da visualizzare il margine di guadagno lordo giornaliero. 

## SCELTA DELLE TECNOLOGIE E DEGLI USI
- Docker per permettere di scrivere codice trasportabile ed eseguibile ovunque
- Postgresql come database
- NodeJS insieme ad Express per scrivere il back-end
- La libreria pg-format per includere i dati passati dalle richieste nelle query senza incorrere in problemi di SQL injection


## STRUTTURA DEL PROGETTO
- [./test] file con le richieste http di test
- [./src/routes] file dedicati alle routes divisi per competenze
- [./src/controller] implementazione della logica dei controller che risponodono alle chiamate
- [./src/database] modulo per creare il pool connesso al db (volontariamente lasciato aperto)
- [./src/middleware] funzione richiamate per controllare i permessi di accesso alle risorse
- [./src/services] moduli con funzionalità di servizio riusabili


## NOTE
- Il database è stato creato a scopo di test, ma non vi è stata una progettazione vera e propria, quindi mancano componenti quali trigger che lo rendano in grado di aggiornare le tabelle dinamicamente in base a certi cambiamenti