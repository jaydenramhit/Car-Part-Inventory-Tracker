const app = require("../app"); 
const supertest = require("supertest");
const testRequest = supertest(app); 
const dbName = "car_testDb";
const model = require("../models/projectModel.js");
const cookieParser = require('cookie-parser');
app.use(cookieParser())

var connection;
beforeEach(async () => { connection = await model.initializeProjectModel(dbName, true);});

const projectData = [
    { name: 'First Project', description: 'Test Description' },
    { name: 'Second Project', description: 'Test Description' },
    { name: 'Third Project', description: 'Test Description' },
    { name: 'Fourth Project', description: 'Test Description' },
    { name: 'Fifth Project', description: 'Test Description'},
    { name: 'Sixth Project', description: 'Test Description' },
]

test("GET /projects success case", async () => {
    let testResponse = await testRequest.get('/projects');
    expect(testResponse.status).toBe(201);

})
