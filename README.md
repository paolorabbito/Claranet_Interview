# Claranet_Interview

## PROGETTO
L'idea è quella di un progetto che permetta, ad un proprietario di una catena di fast food che utilizzano carte di fidelizzazione,
di ottenere in tempo reale statistiche sul consumo da parte dei clienti e sulle perdite da parte dei punti vendita.
Inoltre il progetto finale dovrebbe permettere anche la registrazione e l'accesso di utenti identificati attraverso il numero della carta di fidelizzazione.
Ogni singolo utente quindi potrà accedere alle proprie offerte e tramite l'app o la carta potrà registrare i suoi acquisti nei punti vendita. 

## PUNTI CHIAVE SEGUITI
- Autenticazione su più livelli attraverso jwt
- Uso di middleware per limitare l'accesso alle risorse su più livelli
- Permettere all'utente di poter eliminare il proprio account poichè ormai richiesto dall'apple/play store
- Utilizzo di filtri e parametri per filtrare le informazioni richieste al back-end e permetterne una corretta paginazione
- Corretta formattazione delle query per evitare problemi di SQL injection
- Compartimentazione del codice in uno schema routing to controller
- Potenziale riusabilità del codice scritto nei services

## STRUTTURA DEL PROGETTO
- [./test] file con le richieste http per testare i vari end-point
- [./src/routes] file dedicati alle routes divisi per competenze
- [./src/controller] implementazione della logica dei controller che risponodono alle chiamate
- [./src/database] modulo per creare il pool connesso al db (volontariamente lasciato aperto)
- [./src/middleware] funzione richiamate per controllare i permessi di accesso alle risorse
- [./src/services] moduli con funzionalità di servizio riusabili

## END-POINT
- /auth/login - POST
    - body: { user: [string], password: [string]}
    - return: { user: [string], accessToken: [string], refreshToken: [string] }
- /auth/refresh - GET
    - header: Authorization Bearer [refreshToken: string]
    - return: { user: [string], accessToken: [string], refreshToken: [string] }
- /auth/signup - POST
    - header: Authorization Bearer [accesToken: string]
    - return: { user: [string], password: [string], name: [string], surname: [string], email: [string], city: [string], age: [number] }
- /api/stats/products - GET
    - header: Authorization Bearer [accessToken: string]
    - queryParams: [page, pageSize, exports, salesPoint, date]
    - return: { city: [string], description: [string], cash_out: [number], cash_in: [number], in: [number], out: [number], date: [date] } or data.xlsx in download
- /api/stats/products/:id/avg - GET
    - header: Authorization Bearer [accessToken: string]
    - queryParams: [page, pageSize, from, to]
    - return: { id: [number], productionAvg: [number], salesAvg: [number], cashOutAvg: [number], cashInAvg: [number], earn: [number] }
- /api/user/:id - DELETE
    - header: Authorization Bearer [accesToken: string]

## SCELTE DI SVILUPPO
- Il database è stato creato a scopo di test, ma non vi è stata una progettazione vera e propria, quindi mancano componenti quali trigger che lo rendano in grado di aggiornare le tabelle dinamicamente in base a certi cambiamenti
- Ho preferito filtrare i risultati generando query con più parametri in quanto il database di esempio risulta essere molto scarno e solo a fini di test
  in scenari reali si può valutare se preferire query più complesse per risparmiare memoria e velocizzare l'api o se preferire del condice in più per filtrare i risultati successivamente alla query
- Logicamente in un progetto reale la documentazione dei vari end point verrebbe scritta attraverso strumenti quali swagger in modo da avere una docs ordinata ed esaustiva per gli altri sviluppatori e per potenziali terze parti
- Non sono stati implementati dei test attraverso funzioni specifiche
- Ho utilizzato Docker per permettere di scrivere codice trasportabile ed eseguibile ovunque
- La libreria pg-format per includere i dati passati dalle richieste nelle query senza incorrere in problemi di SQL injection
- In un contesto reale il modulo delle risorse potrebbe essere anche staccato dal modulo sull'autenticazione in modo da utilizzare la stessa autenticazione su più servizi della stessa azienda