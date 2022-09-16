//TODO: [FIX] usare i path params per id specifico
const pool = require('../database/db');
const services = require('../services/queryService');
require("dotenv").config();
const fileSystem = require('fs');
const path = require('path');
const format = require('pg-format');

/**
 * Ritorna le statistiche di un determinato prodotto in un determinato giorno
 * (Quantità vendute, quantità prodotte/comprate, costi giornalieri e ricavi)
 * Il tutto paginato, e filtrabile per città/punto vendita o per data
 * Inoltre permette l'esportazione dei dati in excel
 * @param {*} req 
 * @param {*} res 
 */
const getProductStats = async (req, res) => {

    let params = {
        pagination: {},
        filter: {}
    };
    let resDb;

    services.setParams(params, req);

    let query = `SELECT sp.city, p.description, (p.production_cost*s.in) as cash_out, (p.selling_cost*s.out) as cash_in, s.in, s.out, s.date
                 FROM product as p
                 INNER JOIN sales as s on p.id = s.product_id
                 INNER JOIN sales_point as sp on sp.id = s.sales_point `;

    if (Object.keys(params.filter).length !== 0) {

        if (Object.keys(params.filter).length >= 1)
            query += `WHERE `;

        if (params.filter.salesPoint)
            query = services.filterByCity(query, params.filter.salesPoint);

        if (Object.keys(params.filter).length >= 2) {
            query += ' AND ';
        }

        if (params.filter.date)
            query = services.filterByDate(query, params.filter.date);

    }

    query += ` ORDER BY s.date `;
    query = services.queryPagination(query, params);
    console.log(query);
    try {
        resDb = await pool.query(query);

        if (params.exports) {

            services.jsonToExcel(resDb.rows);
            let filePath = path.join(__dirname, '../../public/file/data.xlsx');
            let stat = fileSystem.statSync(filePath);
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'text/xlsx');
            res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
            res.download(filePath);
        }

        res.status(200).json(resDb.rows);
    } catch (error) {
        res.status(500).send(error);
    }



}


const getProductAverage = async (req, res) => {

    let params = {
        pagination: {},
        filter: {}
    };
    let resDb;

    services.setParams(params, req);

    if (!params.filter.product)
        res.status(400).json({
            errors: [
              {
                message: "Product code is missing!",
              },
            ],
        });

    let query = `SELECT p.id,
                        AVG(s.in) as media_prodotti,
                        AVG(S.out) as media_venduti,
                        p.production_cost,
                        p.selling_cost       
                 FROM product as p
                 INNER JOIN sales as s on p.id = s.product_id
                 INNER JOIN sales_point as sp on sp.id = s.sales_point 
                 WHERE `;

    query = services.filterByProduct(query, params.filter.product); //TODO: CAMBIARE A PATH PARAMS

    if (params.filter.from) {
        query += ' AND ';
        query = services.filterFromDate(query, params.filter.from);
    }

    if (params.filter.to) {
        query += ' AND ';
        query = services.filterToDate(query, params.filter.to);
    }

    query += ` GROUP BY p.id `;

    console.log(query);
    try {
        resDb = await pool.query(query);

        let cashOutAvg = resDb.rows[0].media_prodotti * resDb.rows[0].production_cost;
        let cashInAvg = resDb.rows[0].media_venduti * resDb.rows[0].selling_cost;

        resToSend = {
            id: resDb.rows[0].id,
            productionAvg: resDb.rows[0].media_prodotti,
            salesAvg: resDb.rows[0].media_venduti,
            cashOutAvg: cashOutAvg,
            cashInAvg: cashInAvg,
            earn: cashInAvg - cashOutAvg
        }

        res.status(200).json(resToSend)
    } catch (error) {
        res.status(500).send(error);
    }


    ;
}


const getUserInfo = async (req, res) => {
    const user = req.user;
    let query = `SELECT * FROM checkout WHERE user_id = %L`;
    query = format(query, user);
    console.log(query)
    let resDb = await pool.query(query);

    res.status(200).json(resDb.rows);
}

module.exports = { getUserInfo, getProductStats, getProductAverage };