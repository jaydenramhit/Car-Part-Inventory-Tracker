const app = require("../app"); 
const supertest = require("supertest");
const testRequest = supertest(app); 
const dbName = "car_testDb";
const model = require("../models/carModelMysql.js");

var connection;
beforeEach(async () => { connection = await model.initialize(dbName, true);});
afterEach(async () => {
    if (connection)
        await connection.end();
})

/* Data to be used to generate random car for testing */
const carData = [
    { model: 'Camry', brand: 'Toyota', modelYear: 2013, price: 4500.50 },
    { model: 'Impreza', brand: 'Subaru', modelYear: 2011, price: 3899.99 },
    { model: 'Corolla', brand: 'Toyota', modelYear: 2007, price: 1500 },
    { model: 'Civic', brand: 'Honda', modelYear: 2009, price: 2300 },
    { model: 'Malibu', brand: 'Chevrolet', modelYear: 2021, price: 22500.50 },
    { model: 'Focus', brand: 'Ford', modelYear: 2022, price: 25500.99 }
]
    
 /** Splice version: Ensures a car can only be added to the DB once. */
// const generateCarData = () => carData.splice(Math.floor((Math.random() * carData.length)), 1)[0];
    
// Slice version - Allows many tests without ever "running out" of generated pokemon
const generateCarData = () => {
    const index = Math.floor((Math.random() * carData.length));
    return carData.slice(index, index+1)[0];
}

test("GET / success case", async () => {
    let testResponse = await testRequest.get('/');
    expect(testResponse.status).toBe(200);
    expect(testResponse.text).toBe('Welcome to my page! - Joseph Ambayec');
}) 

test("GET random endpoint error case", async () => {
    let testResponse = await testRequest.get('/randomIncorrectEndpoint');
    expect(testResponse.status).toBe(404);
})

test("POST /cars success case", async () =>{
    let randomCar = generateCarData();
    let testResponse = await testRequest.post('/cars').send(randomCar);
    expect(testResponse.status).toBe(201);

    let result = await connection.execute("select brand, model, modelYear, price from car;")
    expect(result[0].length).toBe(1);
    expect(result[0][0]).toEqual(randomCar);
})

test("POST /cars fail case", async () =>{
    let testCar = generateCarData();
    let oldModel = testCar.model;
    testCar.model = "3*(&784723749as";
    let testResponse = await testRequest.post('/cars').send(testCar);
    expect(testResponse.status).toBe(404);
    
    let result = await connection.execute("select brand, model, modelYear, price from car;")
    expect(result[0].length).toBe(0);

    // Reset model
    testCar.model = oldModel;
})

test("GET /cars specific success case", async () => {
    let randomCar = generateCarData();
    let specificCar = { brand: "Abarth", model: "Ultra", modelYear: 2020, price: 69000 }
    model.addCar(randomCar.model, randomCar.brand, randomCar.modelYear, randomCar.price);
    model.addCar(specificCar.model, specificCar.brand, specificCar.modelYear, specificCar.price);

    let result = await connection.execute("select brand, model, modelYear, price from car;")
    expect(result[0].length).toBe(2);
    

    let testResponse = await testRequest.get("/cars/Abarth");
    expect(testResponse.status).toBe(200)
})

test("GET /cars specific fail case", async () => {
    let randomCar = generateCarData();
    await model.addCar(randomCar.model, randomCar.brand, randomCar.modelYear, randomCar.price);

    let result = await connection.execute("select brand, model, modelYear, price from car;")
    expect(result[0].length).toBe(1);
    
    let testResponse = await testRequest.get("/cars/TestBrand");
    expect(testResponse.status).toBe(404)
    expect(testResponse.text).toBe('No results');
})

test("GET /cars collection success case", async () => {
    let randomCar1 = generateCarData();
    let randomCar2 = generateCarData();
    let randomCar3 = generateCarData();

    let carArray = [
    await model.addCar(randomCar1.model, randomCar1.brand, randomCar1.modelYear, randomCar1.price),
    await model.addCar(randomCar2.model, randomCar2.brand, randomCar2.modelYear, randomCar2.price),
    await model.addCar(randomCar3.model, randomCar3.brand, randomCar3.modelYear, randomCar3.price)]

    let result = await connection.execute("select id, brand, model, modelYear, price from car;");
    expect(result[0].length).toBe(3);

    let testResponse = await testRequest.get("/cars");
    expect(testResponse.status).toBe(200);
    expect(testResponse.body).toEqual(result[0]);
})

test("GET /cars collection fail case", async () => {
    let result = await connection.execute("select id, brand, model, modelYear, price from car;");
    expect(result[0].length).toBe(0);

    let testResponse = await testRequest.get("/cars");
    expect(testResponse.status).toBe(404);
})

test("PUT /cars/id success case", async () => {
    let randomCar = generateCarData();
    await model.addCar(randomCar.model, randomCar.brand, randomCar.modelYear, randomCar.price);

    let before = await connection.execute("select brand, model, modelYear, price from car;");
    expect(before[0].length).toBe(1);

    let testResponse = await testRequest.put('/cars/1').send({ price: 0.01 } );
    expect(testResponse.status).toBe(200);

    let after = await connection.execute("select brand, model, modelYear, price from car;");
    expect(after[0].length).toBe(1);
    expect(after[0][0].price).toBe(0.01);
})

test("PUT /cars/id fail case", async () => {
    let randomCar = generateCarData();
    await model.addCar(randomCar.model, randomCar.brand, randomCar.modelYear, randomCar.price);

    let before = await connection.execute("select brand, model, modelYear, price from car;");
    expect(before[0].length).toBe(1);

    let testResponse = await testRequest.put('/cars/999').send({ price: 0.01 } );
    expect(testResponse.status).toBe(404);

    let after = await connection.execute("select brand, model, modelYear, price from car;");
    expect(after[0].length).toBe(1);
    expect(after[0][0].price).toBe(randomCar.price);
})

test("DELETE /cars/id success case", async () =>{
    let randomCar1 = generateCarData();
    let randomCar2 = generateCarData();

    await model.addCar(randomCar1.model, randomCar1.brand, randomCar1.modelYear, randomCar1.price);
    await model.addCar(randomCar2.model, randomCar2.brand, randomCar2.modelYear, randomCar2.price);

    let before = await connection.execute("select brand, model, modelYear, price from car;");
    expect(before[0].length).toBe(2);

    let testResponse = await testRequest.delete('/cars/1');
    expect(testResponse.status).toBe(202);
    
    let after = await connection.execute("select brand, model, modelYear, price from car;");
    expect(after[0].length).toBe(1);
})

test("DELETE /cars/id fail case", async () =>{
    let randomCar1 = generateCarData();
    let randomCar2 = generateCarData();

    await model.addCar(randomCar1.model, randomCar1.brand, randomCar1.modelYear, randomCar1.price);
    await model.addCar(randomCar2.model, randomCar2.brand, randomCar2.modelYear, randomCar2.price);

    let before = await connection.execute("select brand, model, modelYear, price from car;");
    expect(before[0].length).toBe(2);

    let testResponse = await testRequest.delete('/cars/3');
    expect(testResponse.status).toBe(404);
    
    let after = await connection.execute("select brand, model, modelYear, price from car;");
    expect(after[0].length).toBe(2);
})