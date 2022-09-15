const format = require('pg-format');
const xlsx = require('xlsx');

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
    
    if(req.query.exports)
        params.filter.exports = true;
    else
        params.filter.exports = false;

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

    query += `s.date = %L `;
    query = format(query, filter);
    return query;

}

const jsonToExcel = (jsonInput, ) => {

    const workSheet = xlsx.utils.json_to_sheet(jsonInput);
    const workBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workBook, workSheet, "data");
    xlsx.write(workBook, { bookType: 'xlsx', type: "buffer" });
    xlsx.write(workBook, { bookType: "xlsx", type: "binary" });
    xlsx.writeFile(workBook, "data.xlsx");

}

module.exports = { setParams, queryPagination, cityFilter, dateFilter, jsonToExcel }