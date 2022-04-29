const app = require("../app"); 
const supertest = require("supertest");
const testRequest = supertest(app); 
const dbName = "car_testDb";
const model = require("../models/userModel.js");

var connection;
beforeEach(async () => { connection = await model.initialize(dbName, true);});
afterEach(async () => {
    if (connection)
        await connection.end();
})

const userData = [
    { username: 'username1', password: 'P@ssW0rd!'},
    { username: 'username2', password: '#@ijdsAd2'},
    { username: 'username3', password: 'T#E2ST!'},
    { username: 'username4', password: 'thisisAP@ssw0Rd'},
    { username: 'username5', password: 'testPassword#23'},
    { username: 'username6', password: 'H3||oW0rld'},
]

test("GET /users success case", async () => {
    let testResponse = await testRequest.get('/');
    expect(testResponse.status).toBe(404);
}) 
