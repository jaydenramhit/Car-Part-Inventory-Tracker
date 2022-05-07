const app = require('./app.js');
const port = 1339;
const initializer = require('./models/initializerModel')

//docker run -p 10000:3306 --name carPartSqlDb -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=carPart_db -d mysql:5.7
// also create a database called car_testDb

// Retrieving the database name from args
let dbName = process.argv[2];

// If the database name is not specified, initialize it
if (!dbName) {
         dbName = 'carPart_db';
}


initializer.initialize(dbName, false, app, port);

