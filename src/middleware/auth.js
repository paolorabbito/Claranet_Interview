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

const authAdminToken = async (req, res, next) => {

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

    if (user === '00000000')
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

module.exports = { authAdminToken, authUserToken };
