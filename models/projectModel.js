const mysql = require('mysql2/promise');
const validUtils = require('../validateUtils.js');
const logger = require('../logger');
const model = require('../models/carPartModelMysql')
var connection;
connection = model.getConnection();

async function addProject(name, description){
    try {
        const insertStatement = `INSERT INTO Project (name, description) values (${name, description})`;
        await connection.execute(insertStatement);
        const projectIdStatemnt = `SELECT scope_identity()`
        let projectId = await connection.execute(insertStatement);
        return projectId;
    }    
    catch (error) {
        logger.error(error);
        throw new DatabaseConnectionError();
    }
}
module.exports = {
    addProject
}