# Claranet_Interview

##PROGETTO
L'idea è quella di un progetto gestionale che permetta, ad un proprietario di una catena di ristoranti che utilizzano carte di fidelizzazione,
di ottenere in tempo reale statistiche sul consumo da parte dei clienti e sulle perdite da parte dei punti vendita.
Nello specifico gli end-point che andrò ad implementare sono 3:
- Il login per garantire unicamente l'autenticazione dell'amministratore o amministratori che possono accedere alle informazioni statistiche
- Un end-point che fornisce dati statistici inerenti alla spesa media dei clienti nei punti ristoro, al tempo medio trascorso tra una visita e l'altra e alle votazioni medie ricevute
- Un end-point che restituirà dati relativi ai consumi, 

##SCELTA DELLE TECNOLOGIE
- Docker per permettere di scrivere codice trasportabile ed eseguibile ovunque
- Postgresql come database
- NodeJS insieme ad Express per scrivere il back-end


##STRUTTURA DEL PROGETTO
- ./test contiene i file con le richieste di test

