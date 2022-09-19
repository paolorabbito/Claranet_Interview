const pool = require('../database/db');
const format = require('pg-format');
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { serviceError } = require('../services/queryService');

/**
 * Usata da me perinserire utenti di test del DB
 * @param {*} req 
 * @param {*} res 
 */
exports.signup = async (req, res) => {

  //Potrebbero essere un unico oggetto
  const saltRounds = 10;
  const user = req.body.user;
  const password = req.body.password;
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const city = req.body.city;
  const age = req.body.age;
  const gender = req.body.gender; //Facoltativo
 

  if (!user || !password) 
    return serviceError(400, "User or password not present!", res);
  

  if (name && surname && email && city && age) {

    let query = '';

    bcrypt.hash(password, saltRounds, async (err, hash) => { //ERRORE CONCETTUALE
      query = format(`INSERT INTO users (card_id, password, type) VALUES (%L, %L, %L)`, user, hash, 3);
      
      try {
        await pool.query(query);

        query = `INSERT INTO registry (card, name, surname, email, age, city, gender) VALUES (%L, %L, %L, %L, %L, %L, %L)`
        query = format(query, user, name, surname, email, age, city, gender);
        try {
          await pool.query(query);

          res.status(200).json({
            operation: [
              {
                message: "Signed up correctly!",
              },
            ],
          });
        } catch (error) {
          return serviceError(500, "Can not insert values into database!", res);
        }

      } catch (error) {
        return serviceError(500, "Can not insert values into database!", res);
      }
    });

  } else {
    return serviceError(400, "Some values are missing!", res);
  }


  

}

/**
 * Autenticazione e invio del jwt in risposta
 * @param {*} req 
 * @param {*} res 
 */
exports.login = async (req, res) => {

  const user = req.body.user;
  const password = req.body.password;
  let dbRes;

  if (!user || !password) 
    return serviceError(400, "Invalid credentials", res);
    
  let query = format(`SELECT * FROM users WHERE card_id = %L`, user); 
  try {
    dbRes = await pool.query(query);

    let userData = dbRes.rows[0];

    if(userData) {

      const level = userData.type

      bcrypt.compare(password, userData.password, async (err, result) => {

        if (result) {

          const accessToken = await jwt.sign(
            { 
              user,
              level          
            },
            process.env.JWT_SECRET,
            { expiresIn: "3600s" }
          );

          const refreshToken = await jwt.sign(
            { 
              user,
              level         
            },
            process.env.REFRESH_SECRET,
            { expiresIn: "1h" }
          );

          res.status(200).json({
            user,
            level,
            accessToken,
            refreshToken
          });

        } else {
          return serviceError(401, "Wrong password!", res);
        }
      });

    }
  } catch (error) {
    return serviceError(500, "Internal server error!", res);
  }
}

/**
 * Richiesta refresh token
 * @param {*} req 
 * @param {*} res
 */
exports.refresh = async (req, res) => {

  let refreshToken = '';
  const authHeader = req.headers["authorization"];

  if (authHeader)
    refreshToken = authHeader.split(" ")[1];
  else
    return serviceError(403, `Forbidden: Refresh Token not found!`, res);
    
  try {
    const decoded = await jwt.verify(refreshToken, process.env.REFRESH_SECRET);


    if (decoded && decoded.user) {

      const user = decoded.user;
      const level = decoded.level;

      const accessToken = await jwt.sign(
        { 
          user,
          level
        },
        process.env.JWT_SECRET,
        { expiresIn: "3600s" }
      );

      const refreshToken = await jwt.sign(
        { 
          user,
          level
        },
        process.env.REFRESH_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        user,
        level,
        accessToken,
        refreshToken
      });

    } else {
      return serviceError(403, `Unauthorized: Refresh Token not valid!`, res);
    }

  } catch (error) {
    return serviceError(500, "Internal server error!", res);
  }
}