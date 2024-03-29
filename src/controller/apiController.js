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
const getProductsStats = async (req, res) => {

    let params = {
        pagination: {},
        filter: {}
    };
    let resDb;

    services.setParams(params, req);

    let query = `SELECT DISTINCT sp.city, p.description, (p.production_cost*s.in) as cash_out, (p.selling_cost*s.out) as cash_in, s.in, s.out, s.date
                 FROM product as p
                 INNER JOIN sales as s on p.id = s.product_id
                 INNER JOIN sales_point as sp on sp.id = s.sales_point `;

    if (Object.keys(params.filter).length !== 0) {

        if (Object.keys(params.filter).length >= 1) query += `WHERE `;

        if (params.filter.salesPoint) query = services.filterByCity(query, params.filter.salesPoint);

        if (Object.keys(params.filter).length >= 2) query += ' AND ';

        if (params.filter.date) query = services.filterByDate(query, params.filter.date);

    }

    query += ` ORDER BY s.date `;
    query = services.queryPagination(query, params);

    try {
        resDb = await pool.query(query);

        if(resDb.rowCount!=0) {
            if (params.exports) {
                let r = await services.jsonToExcel(resDb.rows);
                console.log(__dirname)
                let filePath = path.join(__dirname, `/../../public/file/data${r}.xlsx`);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=data${r}.xlsx`);
                res.status(200).download(filePath);
            } else {
                res.status(200).json(resDb.rows);
            }
        } else {
            return services.serviceError(404, "Can't find results!", res);
        }
    } catch (error) {
        console.log(error);
        return services.serviceError(500, "Internal server error!", res);
    }



}

/**
 * Ritorna le statistiche medie di un determinato prodotto in un determinato range
 * di date tra i vari punti vendita (produzione/vendità media e incassi/spese medie)
 * @param {*} req 
 * @param {*} res 
 */
const getProductAverage = async (req, res) => {

    const product = req.params['id'];
    
    if (!product) //NON NECESSARIO IN QUANTO LA RISORSA NON È RAGGIUNGIBILE SENCA UN PRODUCT
        services.serviceError(400, "Bad request: Product code is missing!", res);

    let params = {
        pagination: {},
        filter: {}
    };

    let resDb;

    services.setParams(params, req);

    let query = `SELECT p.id,
                        AVG(s.in) as media_prodotti,
                        AVG(S.out) as media_venduti,
                        p.production_cost,
                        p.selling_cost       
                 FROM product as p
                 INNER JOIN sales as s on p.id = s.product_id
                 INNER JOIN sales_point as sp on sp.id = s.sales_point 
                 WHERE p.id = %L `;

    query = format(query, product);

    if (params.filter.from) {
        query += ' AND ';
        query = services.filterFromDate(query, params.filter.from);
    }

    if (params.filter.to) {
        query += ' AND ';
        query = services.filterToDate(query, params.filter.to);
    }

    query += ` GROUP BY p.id `;

    try {
        resDb = await pool.query(query);

        if(resDb.rows[0]) {

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

            res.status(200).json(resToSend);
        } else {
            return services.serviceError(404, "Product not found!", res);
        }
    } catch (error) {
        console.log(error);
        return services.serviceError(500, "Internal server error!", res);
    }

}

const getUserInfo = async (req, res) => {
    const user = req.user;
    let query = `SELECT * FROM checkout WHERE user_id = %L`;
    query = format(query, user);
    console.log(query)
    let resDb = await pool.query(query);

    res.status(200).json(resDb.rows);
}

const deleteUserInfo = async (req, res) => {

    const user = req.user;

    if(user != req.params['id']) 
        return services.serviceError(400, "Bad request!", res);
        
    let query1 = `DELETE FROM users WHERE card_id = %L`;
    let query2 = `DELETE FROM registry WHERE card = %L`;
    query1 = format(query1, user);
    query2 = format(query2, user);

    try {
        await pool.query(query1);
        await pool.query(query2);
        res.status(200).send("User deleted succesfully");
    } catch (error) {
        console.log(error);
        return services.serviceError(500, "Internal server error!", res);
    }

}

module.exports = { getUserInfo, getProductsStats, getProductAverage, deleteUserInfo };