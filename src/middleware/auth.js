/**
 * In un contesto reale si potrebbero implementare più di 3 livelli di accesso 
 * Magari inserendo un controllo su un determinato campo degli header tipo x-client
 * Dove ad un dato x-client spetta l'accesso solo a determinate risorse o dove le query vengano
 * Filtrate inserendo solo i dati relativi al punto vendita identificato dal campo.
 * O ancora si potrebbe pensare di creare due utenti di admin, e non solo uno in modo 
 * Da permettere diversi livelli di accesso in base alle informazioni da controllare
 */

const jwt = require("jsonwebtoken");
require('dotenv').config();
const { serviceError } = require('../services/queryService');


// 3 middleware e solo user codificato nel jwt

// const authAdminToken = async (req, res, next) => {

//   let token = '';
//   let resDb;
//   const authHeader = req.headers["authorization"];

//   if(authHeader)
//     token = authHeader.split(" ")[1];
//   else
//     serviceError(401, 'Unauthorized: Token not found', res);

//   if (!token) 
//     serviceError(401, 'Unauthorized: Token not found', res);

//   try {

//     const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//     let user = decoded.user;

//     if(user) {

//       let query = "SELECT type FROM users WHERE card_id = %L";
//       query = format(query, user);

//       try {

//         resDb = await pool.query(query);

//         if (resDb.rows[0].type == 1)
//           next();
//         else
//           serviceError(401, 'Unauthorized: Invalid token!', res);

//       } catch (error) {
//         serviceError(500, 'Internal server error!', res);
//       }
//     } else {
//       serviceError(401, 'Unauthorized: Invalid token!', res);
//     }
//   } catch (error) {

//     serviceError(401, 'Unauthorized: Invalid token!', res);

//   }
// };

// const authOperatorToken = async (req, res, next) => {

//   let token = '';
//   const authHeader = req.headers["authorization"];

//   if(authHeader)
//     token = authHeader.split(" ")[1];
//   else
//     serviceError(401, 'Unauthorized: Token not found', res);

//   if (!token) 
//     serviceError(401, 'Unauthorized: Token not found', res);

//   try {

//     const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//     let user = decoded.user;

//     let query = "SELECT type FROM users WHERE card_id = %L";
//     query = format(query, user);

//     try {

//       let resDb = await pool.query(query);

//       if (resDb.rows[0].type == 1 || resDb.rows[0].type == 2)
//         next();
//       else
//         serviceError(401, 'Unauthorized: Invalid token!', res);
      
//     } catch (error) {
//       serviceError(500, 'Internal server error!', res);
//     }
    

//   } catch (error) {

//     serviceError(401, 'Unauthorized: Invalid token!', res);

//   }
// };

// const authUserToken = async (req, res, next) => {

//   let token = '';
//   const authHeader = req.headers["authorization"];

//   if(authHeader)
//     token = authHeader.split(" ")[1];
//   else
//     serviceError(401, 'Unauthorized: Token not found', res);

//   if (!token) 
//     serviceError(401, 'Unauthorized: Token not found', res);

//   try {

//     const decoded = await jwt.verify(token, process.env.JWT_SECRET);
//     let user = decoded.user;

//     if (user) { //Si potrebbe pensare di escludere l'utente admin '00000000'
//       req.user = user;
//       next();
//     } else
//       serviceError(401, 'Unauthorized: Invalid token!', res);

//   } catch (error) {

//     serviceError(401, 'Unauthorized: Invalid token!', res);

//   }

// }

const authToken = (type) => {
  return async (req, res, next) => {
    let token = '';
    const authHeader = req.headers["authorization"];
  
    if(authHeader)
      token = authHeader.split(" ")[1];
    else
      serviceError(401, 'Unauthorized: Token not found', res);
  
    if (!token) 
      serviceError(401, 'Unauthorized: Token not found', res);
  
    try {
  
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const user = decoded.user;
      const level = decoded.level;

      console.log(type, level)
  
      if(user) {
  
        try {

          if (level <= type) {
            req.user = user;
            next();
          } else
            serviceError(401, 'Unauthorized: Invalid token!', res);
  
        } catch (error) {
          serviceError(500, 'Internal server error!', res);
        }
      } else {
        serviceError(401, 'Unauthorized: Invalid token!', res);
      }
    } catch (error) {
  
      serviceError(401, 'Unauthorized: Invalid token!', res);
  
    }
  }
};


module.exports = { authToken };
