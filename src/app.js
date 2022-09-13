const express = require('express');
const rateLimit = require("express-rate-limit");
require('dotenv').config();
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const app = express();

const PORT = process.env.PORT || 3000;

//Limitare le richieste da un singolo terminale potrebbe aiutare nel tentativo di mitigare un ddos attack
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 10 // limite richieste per finestra
});


app.use(limiter);
app.use(express.json())

//Routes da utilizzare con divisione tra il modulo di autenticazione e quello degli end-point
app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => console.log('Listening on port 3000'));