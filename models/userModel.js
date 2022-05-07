const mysql = require('mysql2/promise');
const validUtils = require('../validateUtils.js');
const userUtils = require('../userUtils.js');
const logger = require('../logger');
const { DatabaseConnectionError } = require('./carPartModelMysql.js');
var connection;

// docker run -p 10000:3306 --name carPartSqlDb -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=carPart_db -d mysql:5.7

//#region Initializing

/**
 * Initializes a connection to database for user model.
 * @param {*} dbname The database name.
 * @param {*} reset True if a new database connection to the database; otherwise false.
 * @returns The connection to the database.
 */
async function initializeUserModel(dbname, reset){

    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            port: '10000',
            password: 'pass',
            database: dbname
        })
    
        // Dropping the tables if resetting them
        if (reset) {
            // Dropping the Users table
            let dropQuery = "DROP TABLE IF EXISTS Users";
            await connection.execute(dropQuery);
            logger.info("User table dropped");
            // .then(console.log("User table dropped")).catch((error) => { console.error(error) });
    
            // Dropping the Roles table
            dropQuery = "DROP TABLE IF EXISTS Roles";
            await connection.execute(dropQuery);
            logger.info("Roles table dropped");
            // .then(console.log("Roles table dropped")).catch((error) => { console.error(error) });
        }
        
        // Creating the Roles table
        const createRoleStatement = `CREATE TABLE IF NOT EXISTS Roles(roleID int, rolename VARCHAR(50), PRIMARY KEY (roleID))`
        await connection.execute(createRoleStatement);
        logger.info("Roles table created/exists");
        // .then(logger.info("Role table created/exists")).catch((error) => { logger.error(error) });
    
        // Ignoring invalid data into Roles table
        let insertDefaultRoles = 'INSERT IGNORE INTO Roles(roleID, rolename) values (1, "admin");';
        await connection.execute(insertDefaultRoles);
        logger.info("Roles table created/exists");
        // .then(logger.info("Role table created/exists")).catch((error) => { logger.error(error) });
    
        // Ignoring invalid data into Roles table
        insertDefaultRoles = 'INSERT IGNORE INTO Roles(roleID, rolename) values (2, "guest");';
        await connection.execute(insertDefaultRoles);
        logger.info("Roles table created/exists");
        // .then(logger.info("Role table created/exists")).catch((error) => { logger.error(error) });
    
        // Creating the Users table
        const createTableStatement = `CREATE TABLE IF NOT EXISTS Users(id int AUTO_INCREMENT, username VARCHAR(15), password varchar(128), roleID int, PRIMARY KEY (id), FOREIGN KEY (roleID) REFERENCES Roles(roleID))`
        await connection.execute(createTableStatement);
        logger.info("Users table created/exists");
        // .then(logger.info("User part table created/exists")).catch((error) => { logger.error(error) });

        return connection;
    
    } catch (err) {
        logger.error(err);
        throw new DatabaseConnectionError();
    }
}

//#endregion

//#region Connection

/**
 * Gets the connection to the database.
 * @returns The connection to the database.
 */
async function getConnection(){
    return connection;
}

//#endregion

/**
 * Adds a user to the database with the given username and password.
 * @param {string} username The username of the user.
 * @param {string} password The password of the user.
 */
async function addUser(username, password) {

    // Checks if the user already exists in the database
    if (await userExists(username)){
        logger.error("User NOT ADDED due to already existing in database");
        throw new UserLoginError("Username already exists.");
    }
    // Checks for valid username
    if (userUtils.isValidUsername(username)) {

        // Checks for valid password
        if (userUtils.isValidPassword(password)){
            try {
                let hashedPassword = await userUtils.hashPassword(password);
                let insertQuery = `INSERT INTO Users(username, password, roleID) values ('${username}', '${hashedPassword}', '2');`

                await connection.execute(insertQuery);
                logger.info("User added successfully to the database");
            }
            catch (err) {
                logger.error(err)
                throw new DatabaseConnectionError();
            }
        }
        // Invalid password
        else{
            logger.error("User NOT ADDED due to invalid password");
            throw new UserLoginError("Password must be 8 or more characters and include an uppercase character, lowercase character, number and symbol.");
        }
    }
    // Invalid username
    else{
        logger.error("User NOT ADDED due to invalid username");
        throw new UserLoginError("Username must be between 6 and 15 characters");
    }
}

/**
 * Gets a list of all the users in the database.
 * @returns A list of all the users in the database.
 */
async function showAllUsers(){
    try {
        const queryStatement = "SELECT username, rolename FROM Users INNER JOIN Roles ON Users.roleID = Roles.roleID;";
        let userArray = await connection.query(queryStatement);
        logger.info("Successfully retrieved all users from the database");
        
        return userArray[0];
    }
    catch(error){
        logger.error(error);
        throw new DatabaseConnectionError();
    }
}

/**
 * Gets the role id of the given user. 
 * @param {string} username The username of the user.
 * @returns The role id of the user. 
 */
async function getRole(username){
    // First checks if the user actually exists in the database
    if (await userExists(username)){
        const queryStatement = `SELECT Users.roleID FROM Users INNER JOIN Roles on Users.roleID = Roles.roleID where username = '${username}'`;
        let result = await connection.query(queryStatement);
        let toReturn = result[0];

        logger.info(`Successfully retrieved the role id of the user (${username})`);

        return toReturn[0].roleID;
    }
    else{
        // todo
    }
}

//#region Validating

/**
 * Checks if the specified user already exists as a user in the database.
 * @param {*} username The username of the user.
 * @returns True if the user already exists in the database; otherwise false.
 */
 async function userExists(username){
    try {
        const findUser = `SELECT username FROM Users where username = '${username}'`;
        const [userArray, fields] = await connection.query(findUser);

        if (userArray.length != 0){
            logger.info(`User ${username} EXISTS in the database`);  
            return true;
        }
        else{
            logger.info(`User ${username} DOES NOT EXIST in the database`);   
            return false;
        }
    }
    catch (err){
        logger.error(err)
        throw new DatabaseConnectionError();
    }
}

// ******************************************
async function validateLogin(username, password){
    // First checks if the user actually exists in the database
    if (await userExists(username)){
        const queryStatement = `SELECT password FROM Users where username = '${username}'`;
        let result = await connection.query(queryStatement);
        return userUtils.validateLogin(password, result[0])
    }
    else{
        // show message about username not found
    }
}

//#endregion


/**
 * Error representing a user login error.
 */
class UserLoginError extends Error {}


module.exports = {
    UserLoginError,
    userExists,
    initializeUserModel,
    getConnection,
    addUser,
    showAllUsers,
    validateLogin,
    getRole
}