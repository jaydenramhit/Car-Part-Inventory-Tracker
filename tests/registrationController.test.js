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

test("GET /users fail case due to no users", async () => {
    let testResponse = await testRequest.get('/users');
    expect(testResponse.status).toBe(404);
}) 

test("POST /users/signup success case", async () => {
    let randomUser = userData.at(Math.random() * 6);
    let testResponse = await testRequest.post('/users/signup').send(randomUser);
    expect(testResponse.status).toBe(201);
    
    let result = await connection.execute("select username from Users;")
    expect(result[0].length).toBe(1);
    expect(result[0][0].username).toEqual(randomUser.username);
})

test("POST /users/signup fail case due to short username", async () => {
    let badUser = {username: "admin", password: "dANNjdnsu8*&*&832" };
    let testResponse = await testRequest.post('/users/signup').send(badUser);
    expect(testResponse.status).toBe(404);
    
    let result = await connection.execute("select username from Users;")
    expect(result[0].length).toBe(0);
})

test("POST /users/signup fail case due to long username", async () => {
    let badUser = {username: "THISISAREALLLLLYLONGUSERNAME", password: "dANNjdnsu8*&*&832" };
    let testResponse = await testRequest.post('/users/signup').send(badUser);
    expect(testResponse.status).toBe(404);
    
    let result = await connection.execute("select username from Users;")
    expect(result[0].length).toBe(0);
})

test("POST /users/signup fail case due to weak password", async () => {
    let badUser = {username: "GoodUsername", password: "password" };
    let testResponse = await testRequest.post('/users/signup').send(badUser);
    expect(testResponse.status).toBe(404);
    
    let result = await connection.execute("select username from Users;")
    expect(result[0].length).toBe(0);
})

test("POST /users/signup fail case due to dropped table", async () => {
    await connection.execute("DROP TABLE Users;");
    let randomUser = userData.at(Math.random() * 6);

    let testResponse = await testRequest.post('/users/signup').send(randomUser);
    expect(testResponse.status).toBe(500);

})