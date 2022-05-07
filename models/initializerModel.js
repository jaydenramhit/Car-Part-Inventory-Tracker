const model = require('./carPartModelMysql.js');
const users = require('./userModel')

/**
 * Initializes the model and user model.
 * @param {*} dbname The database file name for the Car Part Inventory.
 * @param {*} reset True if creating a new database, otherwise false.
 * @param {*} app The app module.
 * @param {*} port The port of the website (for localhost).
 */
function initialize(dbname, reset, app, port){
    // Initialize the model
    model.initialize(dbname, reset)
        // Then initialize the model for the users
        .then(users.initializeUserModel(dbname, reset))
        // Then listen to the port
        .then(app.listen(port));
}


module.exports = {initialize};