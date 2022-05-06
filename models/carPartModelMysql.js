const mysql = require('mysql2/promise');
const validUtils = require('../validateUtils.js');
const logger = require('../logger');


var connection;
// docker run -p 10000:3306 --name carPartSqlDb -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=carPart_db -d mysql:5.7
/**
 * Initializes connection to database.
 * If test is true, it initializes a test table instead of using current table.
 * @param {boolean} test 
 */
async function initialize(dbname, reset){
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            port: '10000',
            password: 'pass',
            database: dbname
        })
    
        if (reset)
            resetTable();
    
        const createTableStatement = 'CREATE TABLE IF NOT EXISTS carPart(partNumber int, name VARCHAR(100), `condition` VARCHAR(50), image VARCHAR(2000), PRIMARY KEY (partNumber))'
        await connection.execute(createTableStatement)
        logger.info("Car part table created/exists");
        return connection
    }
    catch (error){
        logger.error(error.message);
        throw new DatabaseConnectionError();
    }
  
}

async function getConnection(){
    return connection;
}
async function resetTable(){
    const dropQuery = "DROP TABLE IF EXISTS carPart";
       await connection.execute(dropQuery).then(logger.info("Car part table dropped"))
           .catch((error) => { logger.error(error) });
}
/**
 * Adds carPart to table.
 * @param {string}} model 

 */
async function addCarPart(partNumber, name, condition, image){ 
    if (!validUtils.isValid(name) || !validUtils.isPartNumber(partNumber)) {
        throw new InvalidInputError();
    }
    try {
        const addStatement = 'INSERT INTO carPart(partNumber, name, `condition`' + `, image) values ('${partNumber}', '${name}', '${condition}', '${image}');`;
        await connection.execute(addStatement)
        logger.info("Successful add.");
        return { "partNumber": partNumber, "name": name, "condition": condition, "image": image,  };           
    }
    catch(error){
        logger.error(error);
        throw new DatabaseConnectionError();
    }


}
/**
 * Returns an array of carParts that match the given model. Check findCarPart method.
 * @param {string} partNumber 
 */
async function findCarPartByNumber(partNumber){
    if (!validUtils.isPartNumber(partNumber))
        throw new InvalidInputError();
    try {
        const queryStatement = `SELECT * FROM carPart WHERE partNumber= '${partNumber}';`;
        let carPartArray = await connection.query(queryStatement)
        logger.info("Successful search.");
        return carPartArray[0];
    }
    catch(error){
        logger.error(error);
        throw new DatabaseConnectionError();
    }
}

/**
 * Used to verify if the carPart exists in the database
 * @param {integer} partNumber 
 * @returns 
 */
async function verifyCarPartExists(partNumber){
    if (!validUtils.isPartNumber(partNumber))
        throw new InvalidInputError();
    try {
        if ((await findCarPartByNumber(partNumber)).length != 0){
            return true;
        }
    }
    catch(error){
        logger.error(error);
        throw new DatabaseConnectionError();
    }
    return false;
}
/**
 * Returns all parts that exist in the database;
 * @returns Array of car parts
 */
async function findAllCarParts(){
    try {
        const queryStatement = "SELECT * FROM carPart;";
        let carPartArray = await connection.query(queryStatement)
        logger.info("Successful search.");
        return carPartArray[0];
    }
    catch(error){
        logger.error(error);
        throw new DatabaseConnectionError();
    }
}

/**
 * Updates the carPart name associated with the given partNumber in the table.
 * @param {integer} partNumber 
 * @param {double} name 
 */
async function updateCarPartName(partNumber, name){
    if (!validUtils.isValid(name) || !validUtils.isPartNumber(partNumber))
        throw new InvalidInputError();
    try {
        const addStatement = `UPDATE carPart SET name = '${name}' WHERE partNumber = ${partNumber};`;
        await connection.query(addStatement)
        logger.info("Successful update.");
        return { "partNumber": partNumber, "name": name };
    }
    catch(error){
        logger.error(error);
        throw new DatabaseConnectionError();
    }
}

/**
 * Removes the first carPart found that is associated with the given part number in the table.
 * @param {int} partNumber  
 */
 async function deleteCarPart(partNumber){
    if (!validUtils.isPartNumber(partNumber))
        throw new InvalidInputError();
    try {
        const addStatement = `DELETE FROM carPart where partNumber = ${partNumber};`;
        await connection.execute(addStatement)
        logger.info("Successful delete.");
        return {"partNumber": partNumber }
    }
    catch(error){
        logger.error(error);
        throw new DatabaseConnectionError();
    }

}

function checkConnection(res){
    if (connection.connection._closing){
        res.status(500);
        return false;
    }
    return true;
}

class DatabaseConnectionError extends Error {}
class InvalidInputError extends Error {} 

module.exports = {
    initialize,
    getConnection,
    addCarPart,
    findCarPartByNumber,
    updateCarPartName,
    deleteCarPart,
    findAllCarParts,
    verifyCarPartExists,
    checkConnection,
    DatabaseConnectionError,
    InvalidInputError
}