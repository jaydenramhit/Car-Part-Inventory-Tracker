const mysql = require('mysql2/promise');
const validUtils = require('../validateUtils.js');
const userUtils = require('../userUtils.js');
const logger = require('../logger');
const { DatabaseConnectionError } = require('./carPartModelMysql.js');
var connection;
// docker run -p 10000:3306 --name carPartSqlDb -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=carPart_db -d mysql:5.7
/**
 * Initializes connection to database.
 * If test is true, it initializes a test table instead of using current table.
 * @param {boolean} test 
 */
async function initializeUserModel(dbname, reset){
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        port: '10000',
        password: 'pass',
        database: dbname
    })


    if (reset) {
        let dropQuery = "DROP TABLE IF EXISTS Users";
        await connection.execute(dropQuery).then(console.log("User table dropped"))
            .catch((error) => { console.error(error) });
        dropQuery = "DROP TABLE IF EXISTS Roles";
        await connection.execute(dropQuery).then(console.log("Roles table dropped"))
            .catch((error) => { console.error(error) });
    }
    const createRoleeStatement = `CREATE TABLE IF NOT EXISTS Roles(roleID int, rolename VARCHAR(50), PRIMARY KEY (roleID))`
    await connection.execute(createRoleeStatement).then(logger.info("Role table created/exists")).catch((error) => { logger.error(error) });

    const createTableStatement = `CREATE TABLE IF NOT EXISTS Users(id int AUTO_INCREMENT, username VARCHAR(15), password varchar(128), roleID int, PRIMARY KEY (id), FOREIGN KEY (roleID) REFERENCES Roles(roleID))`
    await connection.execute(createTableStatement).then(logger.info("User part table created/exists")).catch((error) => { logger.error(error) });
    return connection
}

async function getConnection(){
    return connection;
}

async function userExists(username){
    try {
        const findUser = `SELECT username FROM Users where username = '${username}'`;
        let userArray = await connection.query(findUser).then(console.log("Found username")).catch((error) => { console.error(error) });
        if (userArray[0].length != 0)
            return true;
        else
            return false;
    }
    catch (err){
        logger.error(err)
        throw new DatabaseConnectionError();
    }
}

async function addUser(username, password) {

    if (await userExists(username))
        throw new UserLoginError("Username already exists.");
    if (userUtils.isValidUsername(username)) {
        if (userUtils.isValidPassword(password)){
            try {
                let hashedPassword = await userUtils.hashPassword(password);
                let insertQuery = `INSERT INTO Users(username, password) values ('${username}', '${hashedPassword}');`
                await connection.execute(insertQuery);
            }
            catch (err) {
                logger.error(err)
                throw new DatabaseConnectionError();
            }
        }
        else
            throw new UserLoginError("Password must be 8 or more characters and include an uppercase character, lowercase character, number and symbol.");
    }
    else
        throw new UserLoginError("Username must be between 6 and 15 characters");

}

class UserLoginError extends Error {}

module.exports = {
    UserLoginError,
    userExists,
    initializeUserModel,
    getConnection,
    addUser
}