/**
 * In un contesto reale si potrebbero implementare più di 2 livelli di accesso 
 * Magari inserendo un controllo sun un determinato campo degli header tipo x-client
 * Dove ad un dato x-client spetta l'accesso solo a determinate risorse o dove le quey vengano
 * Filtrate inserendo solo i dati relativi al punto vendita identificato dal campo.
 * O ancora si potrebbe pensare di creare due utenti di admin, e non solo uno in modo 
 * Da permettere diversi livelli di accesso in base alle informazioni da controllare
 */

const jwt = require("jsonwebtoken");
require('dotenv').config();
const pool = require('../database/db');
const format = require('pg-format');

const authAdminToken = async (req, res, next) => {

  let token = '';
  let resDb;
  const authHeader = req.headers["authorization"];

  if(authHeader)
    token = authHeader.split(" ")[1];
  else
    unauthorized('Token not found', res);

  if (!token) 
    unauthorized('Token not found', res);

  try {

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    let user = decoded.user;

    let query = "SELECT type FROM users WHERE card_id = %L";
    query = format(query, user);

    try {

      resDb = await pool.query(query);
      console.log(resDb.rows[0].type);

      if (resDb.rows[0].type == 1)
        next();
      else
        unauthorized('Invalid Token', res);

    } catch (error) {
      res.status(500).send("Internal serve error");
    }

  } catch (error) {

    unauthorized('Invalid Token', res);

  }
};


const authOperatorToken = async (req, res, next) => {

  let token = '';
  const authHeader = req.headers["authorization"];

  if(authHeader)
    token = authHeader.split(" ")[1];
  else
    unauthorized('Token not found', res);

  if (!token) 
    unauthorized('Token not found', res);

  try {

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    let user = decoded.user;

    let query = "SELECT type FROM users WHERE card_id = %L";
    query = format(query, user);
    let resDb = await pool.query(query);
    console.log(resDb.rows[0].type);

    if (resDb.rows[0].type == 1 || resDb.rows[0].type == 2)
      next();
    else
      unauthorized('Invalid Token', res);

  } catch (error) {

    unauthorized('Invalid Token', res);

  }
};


const authUserToken = async (req, res, next) => {

  let token = '';
  const authHeader = req.headers["authorization"];

  if(authHeader)
    token = authHeader.split(" ")[1];
  else
    unauthorized('Token not found', res);

  if (!token) 
    unauthorized('Token not found', res);

  try {

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    let user = decoded.user;

    if (user) { //Si potrebbe pensare di escludere l'utente admin '00000000'
      req.user = user;
      next();
    } else
      unauthorized('Invalid Token', res);

  } catch (error) {

    unauthorized('Invalid Token', res);

  }

}

const unauthorized = (msg,res) => {
  res.status(403).json({
    errors: [
      {
        message: `Unauthorized: ${msg}`,
      },
    ],
  });
}

module.exports = { authAdminToken, authUserToken, authOperatorToken };
