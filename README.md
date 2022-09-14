# Claranet_Interview

## PROGETTO
L'idea è quella di un progetto gestionale che permetta, ad un proprietario di una catena di ristoranti che utilizzano carte di fidelizzazione,
di ottenere in tempo reale statistiche sul consumo da parte dei clienti e sulle perdite da parte dei punti vendita.
Inoltre il progetto finale dovrebbe permettere anche la registrazione e l'accesso di utenti identificati attraverso il numero della carta di fidelizzazione.
Ogni singolo utente quindi potrà accedere alle proprie offerte e tramite l'app o la carta potrà registrare i suoi acquisti nei punti vendita.
Nello specifico gli end-point che andrò ad implementare sono 3:
- Il login per garantire unicamente l'autenticazione dell'amministratore o amministratori che possono accedere alle informazioni statistiche
- Un end-point che fornisce dati statistici inerenti alla spesa media dei clienti nei punti ristoro, al tempo medio trascorso tra una visita e l'altra e alle votazioni medie ricevute
- Un end-point che restituirà dati relativi ai consumi, 

## SCELTA DELLE TECNOLOGIE E DEGLI USI
- Docker per permettere di scrivere codice trasportabile ed eseguibile ovunque
- Postgresql come database
- NodeJS insieme ad Express per scrivere il back-end
- È stato implementato un pool che non chiude la connessione al db volontariamente


## STRUTTURA DEL PROGETTO
- [./test] file con le richieste http di test
- [./src/routes] file dedicati alle routes divisi per competenze
- [./src/controller] implementazione della logica dei controller che risponodono alle chiamate
- [./src/database] modulo per creare il pool connesso al db (volontariamente lasciato aperto)
- [./src/middleware] funzione richiamate per controllare i permessi di accesso alle risorse
