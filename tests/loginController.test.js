const app = require("../app"); 
const supertest = require("supertest");
const testRequest = supertest(app); 
const dbName = "car_testDb";
const model = require("../models/userModel.js");

var connection;
beforeEach(async () => { connection = await model.initializeUserModel(dbName, true);});
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

test("Successful login using valid credentials", async () => {
    let user1 = userData.at(0);
    await model.addUser(user1.username, user1.password);

    let result = await model.validateLogin(user1.username, user1.password)

    expect(result).toBe(true);
})

test("Unsuccessful login using invalid password", async () => {
    let user1 = userData.at(0);
    await model.addUser(user1.username, user1.password);

    let result = await model.validateLogin(user1.username, user1.password+"1")

    expect(result).toBe(false);
})

// test("Unsuccessful login using invalid username", async () => {
//     let user1 = userData.at(0);
//     await model.addUser(user1.username, user1.password);

//     let result = await model.validateLogin(user1.username+"1", user1.password)

//     expect(result).toBe(null);
// })