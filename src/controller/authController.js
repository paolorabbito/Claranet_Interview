const pool = require('../database/db');
const format = require('pg-format');
require("dotenv").config();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');


exports.signup = async (req, res) => {
    const saltRounds = 10;
    const user = req.body.user;
    const password = req.body.password;
    let query = '';

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        query = format(`INSERT INTO users (card_id, password) VALUES (%L, %L)`, user, hash);
        console.log(query)
        let dbRes = await pool.query(query);
        res.send(dbRes);
    });
    
}


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
       
    let query = format(`SELECT * FROM users WHERE card_id = %L`, user);
    let tmp = await pool.query(query);
    let userData = tmp.rows[0];

    bcrypt.compare(password, userData.password, async (err, result) => {

        if(result) {

            const accessToken = await JWT.sign(
                { user },
                process.env.JWT_SECRET,
                { expiresIn: "3600s"}
            );

            const refreshToken = await JWT.sign(
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