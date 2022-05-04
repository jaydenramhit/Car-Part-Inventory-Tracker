
const { test, expect } = require('@jest/globals');
const logger = require('../logger.js');
const model = require('../models/carPartModelMysql.js');

var connection;

/* Data to be used to generate random pokemon for testing */
const carData = [
    { partNumber: 1, name: 'Muffler', condition: "New", image: null},
    { partNumber: 2, name: 'Windshield', condition: "New", image: null},
    { partNumber: 3, name: 'Side mirror', condition: "", image: null},
    { partNumber: 4, name: 'Spoiler', condition: "Used", image: null},
    { partNumber: 5, name: 'Hubcap', condition: "New", image: null},
    { partNumber: 6, name: 'Tires', condition: "Used", image: null},
]


/* Make sure the database is empty before each test.  This runs before each test.  See https://jestjs.io/docs/api */
beforeEach(async () => {
    try {
        connection = await model.initialize("car_testDb", true); // Passing true means it'll use the test table
    } catch (err) {  console.error(err) }
});

/** addCar tests */
/* #region   */
test("addCarPart successfully wrote to table", async () => {
    let generatedCar = carData.at(0);
    await model.addCarPart(generatedCar.partNumber, generatedCar.name, generatedCar.condition, generatedCar.image);
    let result = await connection.query("select * from carPart");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0][0].partNumber).toBe(generatedCar.partNumber);
    expect(result[0][0].name).toBe(generatedCar.name);
    expect(result[0][0].condition).toBe(generatedCar.condition);
})

test("addCarPart failed to write to table due to part number", async () => {
    let generatedCar = carData.at(0);
    try {
        await model.addCarPart('abc', generatedCar.name);
    }
    catch (error){ 
        logger.error(error)
    }
    
    let result = await connection.query("select * from carPart");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].length).toBe(0);
})

test("addCarPart failed to write to table due to incorrect name", async () => {
    let generatedCar = carData.at(0);
    try {
        await model.addCarPart(generatedCar.partNumber, "%$^&$#^&$@323");
    }
    catch (error){
        logger.error(error)
    }
    
    let result = await connection.query("select * from carPart");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].length).toBe(0);
})

/* #endregion */
/** deleteCar tests */
/* #region   */

test("deleteCar successfully deleted car from table", async () => {
   
    let generatedCar1 = carData.at(0);
    let generatedCar2 = carData.at(1);
    let generatedCar3 = carData.at(2);
    let generatedCar4 = carData.at(3);
    let generatedCar5 = carData.at(4);
    await model.addCarPart(generatedCar1.partNumber, generatedCar1.name);
    await model.addCarPart(generatedCar2.partNumber, generatedCar2.name);
    await model.addCarPart(generatedCar3.partNumber, generatedCar3.name);
    await model.addCarPart(generatedCar4.partNumber, generatedCar4.name);
    await model.addCarPart(generatedCar5.partNumber, generatedCar5.name);

    let before = await connection.query("select * from carPart");
    expect(Array.isArray(before)).toBe(true);
    expect(before[0].length).toBe(5);
    let partNumber = before[0][0].partNumber + 2; // Gets the id in the middle of the table no matter what the starting id is
    await model.deleteCarPart(partNumber);

    let after = await connection.query("select * from carPart");
    expect(Array.isArray(after)).toBe(true);
    expect(after[0].length).toBe(4);
    expect(after[0][0].partNumber).toBe(generatedCar1.partNumber);
    expect(after[0][0].name).toBe(generatedCar1.name);

    expect(after[0][1].partNumber).toBe(generatedCar2.partNumber);
    expect(after[0][1].name).toBe(generatedCar2.name);

    expect(after[0][2].partNumber).toBe(generatedCar4.partNumber);
    expect(after[0][2].name).toBe(generatedCar4.name);

    expect(after[0][3].partNumber).toBe(generatedCar5.partNumber);
    expect(after[0][3].name).toBe(generatedCar5.name);   
})

test("deleteCar failed to delete car from table", async () => {
   
    let generatedCar = carData.at(0);
    await model.addCarPart(generatedCar.partNumber, generatedCar.name);

    await model.deleteCarPart(-1);

    let after = await connection.query("select * from carPart");
    expect(Array.isArray(after)).toBe(true);
    expect(after[0].length).toBe(1);
    expect(after[0][0].partNumber).toBe(generatedCar.partNumber);
    expect(after[0][0].name).toBe(generatedCar.name);
    
})

test("findCarPartByNumber successfully found cars from table", async () => {
    let generatedCar1 = carData.at(0);
    let generatedCar2 = carData.at(1);
    let generatedCar3 = carData.at(2);
    let generatedCar4 = carData.at(3);
    let generatedCar5 = carData.at(4);
    await model.addCarPart(generatedCar1.partNumber, generatedCar1.name, generatedCar1.condition, generatedCar1.image);
    await model.addCarPart(generatedCar2.partNumber, generatedCar2.name, generatedCar2.condition, generatedCar2.image);
    await model.addCarPart(generatedCar3.partNumber, generatedCar3.name, generatedCar3.condition, generatedCar3.image);
    await model.addCarPart(generatedCar4.partNumber, generatedCar4.name, generatedCar4.condition, generatedCar4.image);
    await model.addCarPart(generatedCar5.partNumber, generatedCar5.name, generatedCar5.condition, generatedCar5.image);

    let result = await model.findCarPartByNumber(generatedCar1.partNumber);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(generatedCar1); 
})

test("findCarPartByNumber failed to find cars from table", async () => {
   
    let generatedCar = carData.at(0);
    await model.addCarPart(generatedCar.partNumber, generatedCar.name);

    let result = await model.findCarPartByNumber(9999999999);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    
})


test("updateCarPartName successfully updated part name from table", async () => {
   
    let generatedCar1 = carData.at(0);
    let generatedCar2 = carData.at(1);
    await model.addCarPart(generatedCar1.partNumber, generatedCar1.name);
    await model.addCarPart(generatedCar2.partNumber, generatedCar2.name);
    let before = await connection.query("select * from carPart;")
   
    let name = "new name"

    await model.updateCarPartName(before[0][0].partNumber, name);
    let after = await connection.query("select * from carPart;")

    expect(Array.isArray(after)).toBe(true);
    expect(after.length).toBe(2);
    expect(after[0][0].name).toBe(name);
    expect(after[0][1].name).toBe(generatedCar2.name);
    
})

test("updateCarPartName failed to update part name from table due to incorrect number", async () => {
   
    let generatedCar1 = carData.at(0);
    let generatedCar2 = carData.at(1);
    await model.addCarPart(generatedCar1.partNumber, generatedCar1.name);
    await model.addCarPart(generatedCar2.partNumber, generatedCar2.name);
    let before = await connection.query("select * from carPart;")
   
    let name = "name"
    await model.updateCarPartName(-1, name);
    let after = await connection.query("select * from carPart;")

    expect(Array.isArray(after)).toBe(true);
    expect(after.length).toBe(2);
    expect(after[0][0].name).toBe(generatedCar1.name);
    expect(after[0][1].name).toBe(generatedCar2.name);
    
})

test("updateCarPartName failed to update part name from table due to incorrect name", async () => {
   
    let generatedCar1 = carData.at(0);
    let generatedCar2 = carData.at(1);
    await model.addCarPart(generatedCar1.partNumber, generatedCar1.name);
    await model.addCarPart(generatedCar2.partNumber, generatedCar2.name);
    let before = await connection.query("select * from carPart;")
   
    let name = "#@%%%3"
    try 
    {
        await model.updateCarPartName(before[0][0].partNumber, name);
    }
    catch (error){
        logger.error(error);
    }
    let after = await connection.query("select * from carPart;")

    expect(Array.isArray(after)).toBe(true);
    expect(after.length).toBe(2);
    expect(after[0][0].name).toBe(generatedCar1.name);
    expect(after[0][1].name).toBe(generatedCar2.name);
    
})


afterEach(async () => {

    await connection.end();

});