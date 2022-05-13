const res = require('express/lib/response');
const logger = require('../logger.js');
const model = require('../models/projectModel.js');
const users = require('../models/userModel');
const initializer = require('../models/initializerModel')

var connection;

const projectData = [
    { name: 'First Project', description: 'Test Description' },
    { name: 'Second Project', description: 'Test Description' },
    { name: 'Third Project', description: 'Test Description' },
    { name: 'Fourth Project', description: 'Test Description' },
    { name: 'Fifth Project', description: 'Test Description'},
    { name: 'Sixth Project', description: 'Test Description' },
]


/* Make sure the database is empty before each test.  This runs before each test.  See https://jestjs.io/docs/api */
beforeEach(async () => {
    try {
        connection = await model.initializeProjectModel("car_testDb", true) // Passing true means it'll use the test table
    } catch (err) {  console.error(err) }
});

afterEach(async () => {
    connection = await model.getConnection();
    if (connection) {
        await connection.close();
    } 
});
/** addCar tests */
/* #region   */
test("addProject successfully wrote to table", async () => {
    let project1 = projectData.at(0);
    let project2 = projectData.at(5);
    let project3 = projectData.at(3);

    await model.addProject(project1.name, project1.description);
    await model.addProject(project2.name, project2.description);
    await model.addProject(project3.name, project3.description);

    let result = await connection.query("select name from Project");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].length).toBe(3);
    expect(result[0][0].name).toBe(project1.name);
    expect(result[0][1].name).toBe(project2.name);
    expect(result[0][2].name).toBe(project3.name);

})

test("addProject with User successfully wrote to table", async () => {
    let project1 = projectData.at(0);
    let project2 = projectData.at(5);
    let project3 = projectData.at(3);

    let proj1 = await model.addProject(project1.name, project1.description);
    let proj2 = await model.addProject(project2.name, project2.description);
    let proj3 = await model.addProject(project3.name, project3.description);
    let userAddStatement = 'INSERT INTO Users (username, password) values ("FirstUser", "AVeryStrongPassword123!")';
    await connection.execute(userAddStatement);
    userAddStatement = 'INSERT INTO Users (username, password) values ("SecondUser", "AVeryStrongPassword123!")';
    await connection.execute(userAddStatement);
    userAddStatement = 'INSERT INTO Users (username, password) values ("ThirdUser", "AVeryStrongPassword123!")';
    await connection.execute(userAddStatement);

    await model.addUserToProject(proj1, 1);
    await model.addUserToProject(proj1, 2);
    await model.addUserToProject(proj1, 3);

    let result = await connection.query("select name from Project");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].length).toBe(3);
    expect(result[0][0].name).toBe(project1.name);
    expect(result[0][1].name).toBe(project2.name);
    expect(result[0][2].name).toBe(project3.name);

    result = await connection.query("select projectId from Project");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].length).toBe(3);
    expect(result[0][0].projectId).toBe(proj1);
    expect(result[0][1].projectId).toBe(proj2);
    expect(result[0][2].projectId).toBe(proj3);
})

