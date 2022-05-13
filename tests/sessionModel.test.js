var connection;

const model = require('../models/carPartModelMySql');
const dbName = "car_testDb"; 
const home = "http://localhost:1339/"; // or /home depending on your endpoint


beforeEach(async()=> {
    jest.setTimeout(5000)
    await model.initialize(dbName, true);
    // load home page and wait until it is fully loaded
    await page.goto(home, {waitUntil: "domcontentloaded"});
})

afterEach(async () => {
    connection = await model.getConnection();
    if (connection) {
        await connection.close();
    } 
});