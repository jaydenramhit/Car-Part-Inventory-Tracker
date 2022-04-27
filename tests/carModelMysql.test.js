const { test, expect } = require('@jest/globals');
const model = require('../models/carModelMysql.js');

var connection;

/* Data to be used to generate random pokemon for testing */
const carData = [
    { model: 'Camry', brand: 'Toyota', modelYear: 2003, price: 6000 },
    { model: 'Charger', brand: 'Dodge', modelYear: 2006, price: 13999.99 },
    { model: 'Fusion', brand: 'Ford', modelYear: 2001, price: 7000 },
    { model: 'Civic', brand: 'Honda', modelYear: 2004, price: 5000 },
    { model: 'Altima', brand: 'Nissan', modelYear: 2007, price: 10099.99 },
    { model: 'Accord', brand: 'Honda', modelYear: 2008, price: 5000 },
]


const generateCarData = () =>
{ 
    // Added these lines so that the carData array is not modified by Array.splice();
    let tmpArray = carData.slice();
    return tmpArray.splice(Math.floor((Math.random() * carData.length)), 1)[0]
};

/* Make sure the database is empty before each test.  This runs before each test.  See https://jestjs.io/docs/api */
beforeEach(async () => {
    try {
        connection = await model.initialize("car_testDb", true); // Passing true means it'll use the test table
    } catch (err) {  console.error(err) }
});

/** addCar tests */
/* #region   */
test("addCar successfully wrote to table", async () => {
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    let result = await connection.query("select * from car");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0][0].model).toBe(generatedCar.model);
    expect(result[0][0].brand).toBe(generatedCar.brand);
    expect(result[0][0].modelYear).toBe(generatedCar.modelYear);
    expect(result[0][0].price).toBe(generatedCar.price);
})

test("addCar failed to write to table due to incorrect price", async () => {
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, NaN);
    let result = await connection.query("select * from car");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].length).toBe(0);
})

test("addCar failed to write to table due to incorrect brand", async () => {
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, "Not a real brand", generatedCar.modelYear, generatedCar.price);
    let result = await connection.query("select * from car");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].length).toBe(0);
})

test("addCar failed to write to table due to incorrect model", async () => {
    let generatedCar = generateCarData();
    await model.addCar("THIS SHOULD FAIL!", generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    let result = await connection.query("select * from car");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].length).toBe(0);
})

test("addCar successfully wrote to table with missing year and price", async () => {
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, generatedCar.brand, null, null);
    let result = await connection.query("select * from car");
    expect(Array.isArray(result)).toBe(true);
    expect(result[0][0].model).toBe(generatedCar.model);
    expect(result[0][0].brand).toBe(generatedCar.brand);
    expect(result[0][0].modelYear).toBe(null);
    expect(result[0][0].price).toBe(null);
})

/* #endregion */
/** deleteCar tests */
/* #region   */

test("deleteCar successfully deleted car from table", async () => {
   
    let generatedCar1 = generateCarData();
    let generatedCar2 = generateCarData();
    let generatedCar3 = generateCarData();
    let generatedCar4 = generateCarData();
    let generatedCar5 = generateCarData();
    await model.addCar(generatedCar1.model, generatedCar1.brand, generatedCar1.modelYear, generatedCar1.price);
    await model.addCar(generatedCar2.model, generatedCar2.brand, generatedCar2.modelYear, generatedCar2.price);
    await model.addCar(generatedCar3.model, generatedCar3.brand, generatedCar3.modelYear, generatedCar3.price);
    await model.addCar(generatedCar4.model, generatedCar4.brand, generatedCar4.modelYear, generatedCar4.price);
    await model.addCar(generatedCar5.model, generatedCar5.brand, generatedCar5.modelYear, generatedCar5.price);

    let before = await connection.query("select * from car");
    expect(Array.isArray(before)).toBe(true);
    expect(before[0].length).toBe(5);
    let id = before[0][0].id + 2; // Gets the id in the middle of the table no matter what the starting id is
    await model.deleteCar(id);

    let after = await connection.query("select * from car");
    expect(Array.isArray(after)).toBe(true);
    expect(after[0].length).toBe(4);
    expect(after[0][0].model).toBe(generatedCar1.model);
    expect(after[0][0].brand).toBe(generatedCar1.brand);
    expect(after[0][0].modelYear).toBe(generatedCar1.modelYear);
    expect(after[0][0].price).toBe(generatedCar1.price);

    expect(after[0][1].model).toBe(generatedCar2.model);
    expect(after[0][1].brand).toBe(generatedCar2.brand);
    expect(after[0][1].modelYear).toBe(generatedCar2.modelYear);
    expect(after[0][1].price).toBe(generatedCar2.price);

    expect(after[0][2].model).toBe(generatedCar4.model);
    expect(after[0][2].brand).toBe(generatedCar4.brand);
    expect(after[0][2].modelYear).toBe(generatedCar4.modelYear);
    expect(after[0][2].price).toBe(generatedCar4.price);

    expect(after[0][3].model).toBe(generatedCar5.model);
    expect(after[0][3].brand).toBe(generatedCar5.brand);
    expect(after[0][3].modelYear).toBe(generatedCar5.modelYear);
    expect(after[0][3].price).toBe(generatedCar5.price);
    
})

test("deleteCar failed to delete car from table", async () => {
   
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);

    await model.deleteCar(-1);

    let after = await connection.query("select * from car");
    expect(Array.isArray(after)).toBe(true);
    expect(after[0].length).toBe(1);
    expect(after[0][0].model).toBe(generatedCar.model);
    expect(after[0][0].brand).toBe(generatedCar.brand);
    expect(after[0][0].modelYear).toBe(generatedCar.modelYear);
    expect(after[0][0].price).toBe(generatedCar.price);
    
})

test("findCarByModel successfully found cars from table", async () => {
   
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar("Blah", generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar("Blah", generatedCar.brand, generatedCar.modelYear, generatedCar.price);  
     

    let result = await model.findCarByModel(generatedCar.model);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);

    // Remove id property from object to compare
    result.forEach(function(car) {delete car.id})

    expect(result[0]).toEqual(generatedCar);
    expect(result[1]).toEqual(generatedCar);
    expect(result[2]).toEqual(generatedCar);
    expect(result[3]).toEqual(generatedCar);
    expect(result[4]).toEqual(generatedCar);
    
})

test("findCarByModel failed to find cars from table", async () => {
   
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);


    let result = await model.findCarByModel("NON EXISTANT");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    
})

test("findCarByBrand successfully found cars from table", async () => {
   
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price); 
    await model.addCar(generatedCar.model, "Acura", generatedCar.modelYear, generatedCar.price); 
    await model.addCar(generatedCar.model, "Acura", generatedCar.modelYear, generatedCar.price); 

    let result = await model.findCarByBrand(generatedCar.brand);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);

    // Remove id property from object to compare
    result.forEach(function(car) {delete car.id})

    expect(result[0]).toEqual(generatedCar);
    expect(result[1]).toEqual(generatedCar);
    expect(result[2]).toEqual(generatedCar);
    expect(result[3]).toEqual(generatedCar);
    expect(result[4]).toEqual(generatedCar);
    
})

test("findCarByBrand failed to find cars from table", async () => {
   
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price); 

    let result = await model.findCarByBrand("NON EXISTANT");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    
})

test("updateCarPrice successfully updated car price from table", async () => {
   
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    let before = await connection.query("select * from car;")
   
    let price = 11111.11

    await model.updateCarPrice(before[0][0].id, price);
    let after = await connection.query("select * from car;")

    expect(Array.isArray(after)).toBe(true);
    expect(after.length).toBe(2);
    expect(after[0][0].price).toBe(price);
    expect(after[0][1].price).toBe(generatedCar.price);
    
})

test("updateCarPrice failed to update car price from table", async () => {
   
    let generatedCar = generateCarData();
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    await model.addCar(generatedCar.model, generatedCar.brand, generatedCar.modelYear, generatedCar.price);
    let before = await connection.query("select * from car;")
   
    let price = 11111.11

    await model.updateCarPrice(-1, price);
    let after = await connection.query("select * from car;")

    expect(Array.isArray(after)).toBe(true);
    expect(after.length).toBe(2);
    expect(after[0][0].price).toBe(generatedCar.price);
    expect(after[0][1].price).toBe(generatedCar.price);
    
})




afterEach(async () => {

    await connection.end();

});