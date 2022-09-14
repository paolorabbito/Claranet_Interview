const pool = require('../database/db');
const format = require('pg-format');
require("dotenv").config();

exports.getStatsProduct = async (req, res) => {

    let params = {
        pagination: {},
        filter: {}
    };

    setParams(params, req);

    let query = `SELECT sp.city, p.description, (p.production_cost*s.in) as cash_out, (p.selling_cost*s.out) as cash_in, s.in, s.out, s.date
                 FROM product as p
                 INNER JOIN sales as s on p.id = s.product_id
                 INNER JOIN sales_point as sp on sp.id = s.sales_point `;

    if(Object.keys(params.filter).length !== 0) {
        query += `WHERE `;

        if(params.filter.salesPoint)
            query = cityFilter(query, params.filter.salesPoint);

        console.log(Object.keys(params.filter).length)
        
        if(params.filter.salesDate)
            query = dateFilter(query, params.filter.salesDate);

    }
    query += ` ORDER BY s.date `;
    query = queryPagination(query, params);
    console.log(query);


    let resDb = await pool.query(query);
    
    res.json(resDb.rows);

}

 
const setParams = (params, req) => {

    if(req.query.page) 
        params.pagination.page = req.query.page
    else
        params.pagination.page = 1;

    if(req.query.pageSize)
        params.pagination.pageSize = req.query.pageSize;
    else    
        params.pagination.pageSize = 10;

    if(req.query.sort)
        params.pagination.sort = req.query.sort;
    else    
        params.pagination.sort = 'DESC';


    if(req.query.salesPoint)
        params.filter.salesPoint = req.query.salesPoint;

    if(req.query.salesDate)
        params.filter.salesDate = req.query.salesDate;

    console.log(params)

}

const queryPagination = (query, params) => {

    let pageSize = Number.parseInt(params.pagination.pageSize);
    let page = (Number.parseInt(params.pagination.page)-1)*pageSize;
    query += `LIMIT %L OFFSET %L`;
    query = format(query, pageSize, page);
    return query;

}

const cityFilter = (query, filter) => {

    query += `sp.id = %L `;
    query = format(query, filter);
    return query;

}

const dateFilter = (query, filter) => {

    query += `AND s.date = %L `;
    query = format(query, filter);
    return query;

}