/**
 * Si è scelto di usare un pool piuttosto che una singola connessione
 * Da aprire e chiudere ad ogni richiesta solo per comodità
 * La scelta in un contesto reale ovviamente dipenderà da una serie di fattori
 * Ad esempio se l'api venisse implementate attraverso delle lambda ed api gateway
 * Si potrebbe pensare di aprire e chiudere una connessione direttamente nella lambda 
 * Stessa
 */


const { Pool } = require('pg')

const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DATABASE,
})

module.exports = pool;