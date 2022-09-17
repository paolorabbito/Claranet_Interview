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
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const city = req.body.city;
  const age = req.body.age;
  const gender = req.body.gender; //Facoltativo
 

  if (!user || !password) {
    res.status(400).json({
      errors: [
        {
          message: "User or password not present!",
        },
      ],
    });
  }

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
          res.status(500).json({
          errors: [
            {
              message: "Can not insert values into database!",
            },
          ],
        });
        }

      } catch (error) {
        res.status(500).json({
          errors: [
            {
              message: "Internal server error!",
            },
          ],
        });
      }
    });

  } else {
    res.status(400).json({
      errors: [
        {
          message: "Some values are missing!",
        },
      ],
    });
  }


  

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
  let dbRes;

  if (!user || !password) {
    return res.status(400).json({
      errors: [
        {
          message: "Invalid credentials",
        },
      ],
    });
  }

  let query = format(`SELECT * FROM users WHERE card_id = %L`, user); 
  try {
    dbRes = await pool.query(query);

    let userData = dbRes.rows[0];

    if(userData) {

      bcrypt.compare(password, userData.password, async (err, result) => {

        if (result) {

          const accessToken = await jwt.sign(
            { user },
            process.env.JWT_SECRET,
            { expiresIn: "3600s" }
          );

          const refreshToken = await jwt.sign(
            { user },
            process.env.REFRESH_SECRET,
            { expiresIn: "1h" }
          );

          res.status(200).json({
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
          });
        }
      });

    }
  } catch (error) {
    res.status(500).json({
      errors: [
        {
          message: "Internal server error!",
        },
      ],
    });
  }
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

  if (authHeader)
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


    if (decoded && decoded.user) {

      const user = decoded.user;

      const accessToken = await jwt.sign(
        { user },
        process.env.JWT_SECRET,
        { expiresIn: "3600s" }
      );

      const refreshToken = await jwt.sign(
        { user },
        process.env.REFRESH_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        user,
        accessToken,
        refreshToken
      });

    } else {

      return res.status(403).json({
        errors: [
          {
            message: `Unauthorized: Refresh Token not valid`,
          },
        ],
      });

    }

  } catch (error) {

    return res.status(500).json({
      errors: [
        {
          message: `Internal server error!`,
        },
      ],
    });

  }
}