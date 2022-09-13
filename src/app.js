const express = require('express');
const rateLimit = require("express-rate-limit");
require('dotenv').config();
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const app = express();

const PORT = process.env.PORT || 3000;

//Limitare le richieste da un singolo terminale potrebbe aiutare nel tentativo di mitigare un ddos attack
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10 // limit each IP to 100 requests per windowMs
});


app.use(limiter);


app.use(express.json())

app.use('/', apiRouter);
app.use('/', authRouter);

app.listen(PORT, () => console.log('Listening on port 3000'));