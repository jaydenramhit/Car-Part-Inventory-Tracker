const app = require('./app.js');
const port = 1339;
const model = require('./models/carPartModelMysql.js');
//docker run -p 10000:3306 --name carPartSqlDb -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=carPart_db -d mysql:5.7
// also create a database called car_testDb
model.initialize('carPart_db', false)
    .then(
        app.listen(port) // Run the server
    );
