const pool = require('../database/db');
const format = require('pg-format');
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Usata da me perinserire utenti di test del DB
 * @param {*} req 
 * @param {*} res 
 */
exports.signup = async (req, res) => {
    const saltRounds = 10;
    const user = req.body.user;
    const password = req.body.password;
    let query = '';

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        query = format(`INSERT INTO users (card_id, password) VALUES (%L, %L)`, user, hash);
        console.log(query)
        let dbRes = await pool.query(query);
        return res.send(dbRes);
    });
    
}

/**
 * Autenticazione e invio del jwt in risposta
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.login = async (req, res) => {

    const user = req.body.user;
    const password = req.body.password;

    if (!user) {
        return res.status(400).json({
          errors: [
            {
              message: "Invalid credentials",
            },
          ],
        });
    }
       
    let query = format(`SELECT * FROM users WHERE card_id = %L`, user); //Sanifica i parametri che andranno nella query
    let tmp = await pool.query(query);
    let userData = tmp.rows[0];

    bcrypt.compare(password, userData.password, async (err, result) => {

        if(result) {

            const accessToken = await jwt.sign(
                { user },
                process.env.JWT_SECRET,
                { expiresIn: "3600s"}
            );

            const refreshToken = await jwt.sign(
              { user },
              process.env.REFRESH_SECRET,
              { expiresIn: "1h"}
          );
            
            res.json({
              user,
              accessToken,
              refreshToken
            });
            
        } else {
            return res.status(401).json({
                errors: [
                  {
                    message: "Wrong password!",
                  },
                ],
              });;
        }
    }); 
}

/**
 * Richiesta refresh token
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.refresh = async (req, res) => {

  let refreshToken = '';
  const authHeader = req.headers["authorization"];

  if(authHeader)
    refreshToken = authHeader.split(" ")[1];
  else
    res.status(403).json({
      errors: [
        {
          message: `Unauthorized: Refresh Token not found`,
        },
      ],
    });


  try {
    const decoded = await jwt.verify(refreshToken, process.env.REFRESH_SECRET);


    if(decoded && decoded.user) {

      let user = decoded.user;

      const accessToken = await jwt.sign(
          { user },
          process.env.JWT_SECRET,
          { expiresIn: "3600s"}
      );

      const refreshToken = await jwt.sign(
        { user },
        process.env.REFRESH_SECRET,
        { expiresIn: "1h"}
    );
      
    return res.json({
      user,
      accessToken,
      refreshToken
    });

  }
    
  } catch (error) {

    return res.status(403).json({
      errors: [
        {
          message: `Unauthorized: Refresh Token not valid`,
        },
      ],
    });

  }
}