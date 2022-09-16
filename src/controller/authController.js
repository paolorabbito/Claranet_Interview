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
  const gender = req.body.gender;
 

  if (!user || !password) 
    res.status(400).json({
      errors: [
        {
          message: "User or password not present!",
        },
      ],
    });

  let query = '';

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    query = format(`INSERT INTO users (card_id, password, type) VALUES (%L, %L, %L)`, user, hash, 3);
    console.log(query)
    try {
      await pool.query(query);
      if(name && surname && email && city && age) {
        query = `INSERT INTO registry (card, name, surname, email, age, city, gender) VALUES (%L, %L, %L, %L, %L, %L, %L)`
        query = format(query, user, name, surname, email, age, city, gender);
        try {
          console.log(query)
          await pool.query(query);
          res.status(200).json({
            errors: [
              {
                message: "Signed up correctly!",
              },
            ],
          });
        } catch (error) {
          res.status(500).send(error);
        }
      } else {
        res.status(400).json({
          errors: [
            {
              message: "Some values are missing!",
            },
          ],
        });
      }


    } catch (error) {
      res.status(500).send(error);
    }
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
  let dbRes;

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
  try {
    dbRes = await pool.query(query);

    let userData = dbRes.rows[0];

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
  } catch (error) {
    res.status(500).send(error);
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

      let user = decoded.user;

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