const mysql = require('mysql2/promise');
const validUtils = require('../validateUtils.js');
var connection;
// docker run -p 10000:3306 --name carPartSqlDb -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=carPart_db -d mysql:5.7
/**
 * Initializes connection to database.
 * If test is true, it initializes a test table instead of using current table.
 * @param {boolean} test 
 */
async function initialize(dbname, reset){
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        port: '10000',
        password: 'pass',
        database: dbname
    })


    if (reset) {
        const dropQuery = "DROP TABLE IF EXISTS carPart";
        await connection.execute(dropQuery).then(console.log("Car table dropped"))
            .catch((error) => { console.error(error) });
    }

    const createTableStatement = `CREATE TABLE IF NOT EXISTS carPart(partNumber int, name VARCHAR(100), PRIMARY KEY (partNumber))`
    await connection.execute(createTableStatement).then(console.log("Car part table created/exists")).catch((error) => { console.error(error) });
    return connection
}

async function getConnection(){
    return connection;
}
/**
 * Adds carPart to table.
 * @param {string}} model 

 */
async function addCarPart(partNumber, name){
    if (validUtils.isValid(name))
    {
        const addStatement = `INSERT INTO carPart(partNumber, name) values ('${partNumber}', '${name}');`;
        await connection.execute(addStatement).then(console.log("Successful add.")).catch((error) => { console.error(error) });
        return { "partNumber": partNumber, "name": name };
    }

}
/**
 * Returns an array of carParts that match the given model. Check findCar method.
 * @param {string} model 
 */
async function findCarPartByNumber(partNumber){
    return findCarPart("partNumber", partNumber);
}

/**
 * Used to verify if the carPart exists in the database
 * @param {integer} partNumber 
 * @returns 
 */
async function verifyCarPartExists(partNumber){
    if ((await findCarPart("partNumber", partNumber)).length != 0){
        return true;
    }
    return false;
}

/**
 * findCar is a private method used to retrieve carPart from specified table, finding specified parameter given its value.
 * @param {string} table 
 * @param {string} property 
 * @param {value} value
 */
// Using this method, you can implement other methods that select by the other properties (year and price). For now model and brand is good.
async function findCarPart(property, value){
    const queryStatement = `SELECT * FROM carPart WHERE ${property} = '${value}';`;
    let carPartArray = await connection.query(queryStatement).then(console.log("Successful search.")).catch((error) => { console.error(error) });
    return carPartArray[0];
}

async function findAllCarParts(){
    const queryStatement = "SELECT * FROM carPart;";
    let carPartArray = await connection.query(queryStatement).then(console.log("Successful search.")).catch((error) => { console.error(error) });
    return carPartArray[0];
}

/**
 * Updates the carPart name associated with the given partNumber in the table.
 * @param {integer} partNumber 
 * @param {double} name 
 */
async function updateCarPartName(partNumber, name){
    const addStatement = `UPDATE carPart SET name = '${name}' WHERE partNumber = ${partNumber};`;
    await connection.query(addStatement).then(console.log("Successful update.")).catch((error) => { console.error(error.message) });
    return { "partNumber": partNumber, "name": name };
}

/**
 * Removes the first carPart found that is associated with the given part number in the table.
 * @param {int} partNumber  
 */
 async function deleteCarPart(partNumber){
    const addStatement = `DELETE FROM carPart where partNumber = ${partNumber};`;
    await connection.execute(addStatement).then(console.log("Successful delete.")).catch((error) => { console.error(error) });
    return {"partNumber": partNumber }
}

function checkConnection(res){
    if (connection.connection._closing){
        res.status(500);
        return false;
    }
    return true;
}

class DatabaseConnectionError extends Error {}

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
    DatabaseConnectionError
}