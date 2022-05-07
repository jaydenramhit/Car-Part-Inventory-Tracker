var connection;
/* Data to be used to generate random pokemon for testing */
const userData = [
    { username: 'username1', password: 'P@ssW0rd!', confirmPassword: 'P@ssW0rd!'},
    { username: 'username2', password: '#@ijdsAd2', confirmPassword: '#@ijdsAd2'},
    { username: 'username3', password: 'T#E2ST!', confirmPassword: 'T#E2ST!'},
    { username: 'username4', password: 'thisisAP@ssw0Rd', confirmPassword: 'thisisAP@ssw0Rd'},
    { username: 'username5', password: 'testPassword#23', confirmPassword: 'testPassword#23'},
    { username: 'username6', password: 'H3||oW0rld', confirmPassword: 'H3||oW0rld'},
]
    
    /** Splice version: Ensures a Pokemon can only be added to the DB once. */
    // const generatePokemonData = () => pokemonData.splice(Math.floor((Math.random() * pokemonData.length)), 1)[0];
    
    // Slice version - Allows many tests without ever "running out" of generated pokemon
const generatePartData = () => {
    const index = Math.floor((Math.random() * carData.length));
    return carData.slice(index, index+1)[0];
}

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