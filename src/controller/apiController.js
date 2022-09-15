const pool = require('../database/db');
const services = require('../services/queryService');
require("dotenv").config();
const fileSystem = require('fs');
const path = require('path');

const getStatsProduct = async (req, res) => {

    let params = {
        pagination: {},
        filter: {}
    };

    services.setParams(params, req);

    let query = `SELECT sp.city, p.description, (p.production_cost*s.in) as cash_out, (p.selling_cost*s.out) as cash_in, s.in, s.out, s.date
                 FROM product as p
                 INNER JOIN sales as s on p.id = s.product_id
                 INNER JOIN sales_point as sp on sp.id = s.sales_point `;

    if(Object.keys(params.filter).length !== 0) {

        if((Object.keys(params.filter).length == 1 && !params.filter.exports) || Object.keys(params.filter).length >= 1)
            query += `WHERE `;

        if(params.filter.salesPoint)
            query = services.cityFilter(query, params.filter.salesPoint);

        if(Object.keys(params.filter).length>=2) {
            query += ' AND ';
        }
        
        if(params.filter.salesDate)
            query = services.dateFilter(query, params.filter.salesDate);

    }
    query += ` ORDER BY s.date `;
    query = services.queryPagination(query, params);
    console.log(query);


    let resDb = await pool.query(query);

    if(params.filter.exports) {

        services.jsonToExcel(resDb.rows);
        let filePath = path.join(__dirname, '../../data.xlsx');
        let stat = fileSystem.statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'text/xlsx');
        res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
        res.download(filePath);
    }
    
    res.json(resDb.rows);

}


const getUserInfo = async (req, res) => {
    const user = req.user;
    let query = `SELECT * `;
    console.log(user);
}

module.exports = {getUserInfo, getStatsProduct};