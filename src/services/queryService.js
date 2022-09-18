/**
 * Qui sono state implementate delle piccole funzioni che rispecchiato delle richieste
 * In un contesto reale senza dilungarsi troppo sui dettagli.
 * Ovviamente in un contesto reale i filtri da implementare potrebbero essere di più
 * Si potrebbe avere la necessità di esportare i dati in più formati e non solo in excel
 * La paginazione potrebbe essere più dettagliate e quindi richiedere un conteggio totale degli
 * Elementi in modo da mostrare un contatore del tipo  "Visualizzati da 1 a 10 di 130 elementi"
 */

const format = require('pg-format');
const xlsx = require('xlsx');

const setParams = (params, req) => {

    if(req.query.page)  params.pagination.page = req.query.page
    else    params.pagination.page = 1;

    if(req.query.pageSize)  params.pagination.pageSize = req.query.pageSize;
    else    params.pagination.pageSize = 10;

    if(req.query.sort)  params.pagination.sort = req.query.sort;
    else    params.pagination.sort = 'DESC';

    if(req.query.salesPoint)    params.filter.salesPoint = req.query.salesPoint;

    if(req.query.date)  params.filter.date = req.query.date;

    if(req.query.from)  params.filter.from = req.query.from;

    if(req.query.to)    params.filter.to = req.query.to;
    
    if(req.query.product)   params.filter.product = req.query.product;

    if(req.query.exports)   params.exports = true;
    else    params.exports = false;

}

const queryPagination = (query, params) => {

    let pageSize = Number.parseInt(params.pagination.pageSize);
    let page = (Number.parseInt(params.pagination.page)-1)*pageSize;
    query += `LIMIT %L OFFSET %L`;
    query = format(query, pageSize, page);
    return query;

}

const filterByCity = (query, filter) => {

    query += `sp.id = %L `;
    query = format(query, filter);
    return query;

}

const filterByDate = (query, filter) => {

    query += `s.date = %L `;
    query = format(query, filter);
    return query;

}

/**
 * Non usati per via dei pochi dati di esempio nel database
 */
const filterFromDate = (query, filter) => {

    query += `s.date >= %L `;
    query = format(query, filter);
    return query;

}

const filterToDate = (query, filter) => {

    query += `s.date <= %L `;
    query = format(query, filter);
    return query;

}

const filterByProduct = (query, filter) => {

    query += `p.id = %L `;
    query = format(query, filter);
    return query;

}

const jsonToExcel = async (jsonInput) => { //Si potrebbe pensare di scrivere direttamente il file nello stream res e non salvarlo qual'ora non sia necessario

    let r = (Math.random() + 1).toString(36).substring(7);
    const workSheet = xlsx.utils.json_to_sheet(jsonInput);
    const workBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workBook, workSheet, `data${r}`);
    xlsx.write(workBook, { bookType: 'xlsx', type: "buffer" });
    xlsx.write(workBook, { bookType: "xlsx", type: "binary" });
    xlsx.writeFile(workBook, `public/file/data${r}.xlsx`);  
    return r;

}

const serviceError = (code, msg,res) => {
    res.status(code).json({
      errors: [
        {
          message: `${msg}`,
        },
      ],
    });
  }

module.exports = { setParams, queryPagination, filterByCity, filterByDate, filterByProduct, jsonToExcel, filterFromDate, filterToDate, serviceError }