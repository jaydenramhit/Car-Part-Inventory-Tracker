var connection;
/* Data to be used to generate random pokemon for testing */
const carData = [
    { partNumber: 1, name: 'Muffler'},
    { partNumber: 2, name: 'Windshield'},
    { partNumber: 3, name: 'Mirror'},
    { partNumber: 4, name: 'Spoiler'},
    { partNumber: 5, name: 'Hubcap'},
    { partNumber: 6, name: 'Tires'}
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
    jest.setTimeout(500000)
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
test("Add Parts UI test success", async() => {

      // Enter random pokemon name & type into the form
    const { partNumber, name } = generatePartData();
    await page.click('#add');
    await page.type('#partNumber', partNumber.toString());
    await page.type('#name', name);
   
       // click form's submit button and wait for new page to load
    await page.click('[type="submit"]', {waitUntil: 'domcontentloaded'});
    const text = await page.evaluate(() => document.body.textContent);
    const textLower = text.toLowerCase();
    
       // Verify successful outcome 
    expect(textLower).toContain('created'); // Part of message shown on success view
    expect(textLower).toContain(partNumber.toString());
    expect(textLower).toContain(name.toLowerCase());
    
}); 

test("Add Parts UI test fail", async() => {
  const { partNumber, name } = generatePartData();
  await page.click('#add');
  await page.type('#partNumber', partNumber.toString());
  await page.type('#name', '@@@@@@%%%^^^^&&&&*****!!!!');

  await page.click('[type="submit"]', {waitUntil: 'domcontentloaded'});
  const text = await page.evaluate(() => document.body.textContent);
  const textLower = text.toLowerCase();
  

  expect(textLower).toContain('invalid input');
  expect(textLower).toContain('alpha numeric');
  
}); 
    
test("List All Parts UI test success", async () => {
    let firstPart = carData.at(0);
    await model.addCarPart(firstPart.partNumber, firstPart.name)

    let secondPart = carData.at(2);
    await model.addCarPart(secondPart.partNumber, secondPart.name)

    let thirdPart = carData.at(1);
    await model.addCarPart(thirdPart.partNumber, thirdPart.name)

    let getPart = home + 'parts'
    await page.goto(getPart, {waitUntil: "domcontentloaded"});

    const text = await page.evaluate(() => document.body.textContent);
    const textLower = text.toLowerCase();
    
    expect(textLower).toContain(firstPart.partNumber.toString());
    expect(textLower).toContain(firstPart.name.toLowerCase());

    expect(textLower).toContain(secondPart.partNumber.toString());
    expect(textLower).toContain(secondPart.name.toLowerCase());

    expect(textLower).toContain(thirdPart.partNumber.toString());
    expect(textLower).toContain(thirdPart.name.toLowerCase());
})

test("Show Part UI test success case", async() => {
  const { partNumber, name } = generatePartData();
  await model.addCarPart(partNumber, name);
  await page.click("#show");
  await page.type('#partNumber', partNumber.toString());
 

  await page.click('[type="submit"]', {waitUntil: 'domcontentloaded'});
  const text = await page.evaluate(() => document.body.textContent);
  const textLower = text.toLowerCase();
  

  expect(textLower).toContain(partNumber.toString()); 
  expect(textLower).toContain(name.toLowerCase()); 


}); 

test("Show Part UI test fail case", async() => {
    const { partNumber, name } = generatePartData();
    await model.addCarPart(partNumber, name);
    await page.click("#show");
    await page.type('#partNumber', "99999999");
   
  
    await page.click('[type="submit"]', {waitUntil: 'domcontentloaded'});
    const text = await page.evaluate(() => document.body.textContent);
    const textLower = text.toLowerCase();
    
  
    expect(textLower).toContain("99999999"); 
    expect(textLower).toContain("could not find any parts with part number"); 
  
}); 

test("List all parts UI test success case", async() => {
    let firstPart = carData.at(0);
    await model.addCarPart(firstPart.partNumber, firstPart.name)

    let secondPart = carData.at(2);
    await model.addCarPart(secondPart.partNumber, secondPart.name)

    let thirdPart = carData.at(1);
    await model.addCarPart(thirdPart.partNumber, thirdPart.name)
  
    await page.click("#list");
    const text = await page.evaluate(() => document.body.textContent);
    const textLower = text.toLowerCase();
    
  
    expect(textLower).toContain(firstPart.partNumber.toString()); 
    expect(textLower).toContain(firstPart.name.toLowerCase()); 
    expect(textLower).toContain(secondPart.partNumber.toString()); 
    expect(textLower).toContain(secondPart.name.toLowerCase()); 
    expect(textLower).toContain(thirdPart.partNumber.toString()); 
    expect(textLower).toContain(thirdPart.name.toLowerCase()); 
  
}); 

test("List all parts UI test fail case", async() => {
    await page.click("#list");
    const text = await page.evaluate(() => document.body.textContent);
    const textLower = text.toLowerCase();
  
    expect(textLower).toContain("no results"); 
  
}); 

test("Update part UI test success case", async() => {
    let firstPart = carData.at(0);
    await model.addCarPart(firstPart.partNumber, firstPart.name)

    let secondPart = carData.at(2);
    await model.addCarPart(secondPart.partNumber, secondPart.name)

    let thirdPart = carData.at(1);
    await model.addCarPart(thirdPart.partNumber, thirdPart.name)
  
    await page.click("#update");
    await page.type('#partNumber', secondPart.partNumber.toString());
    await page.type('#name', "newname");
   
  
    await page.click('[type="submit"]', {waitUntil: 'domcontentloaded'});
    let text = await page.evaluate(() => document.body.textContent);
    let textLower = text.toLowerCase();
    
    expect(textLower).toContain("updated part name")
    expect(textLower).toContain(secondPart.partNumber.toString()); 
    expect(textLower).toContain("newname"); 

    await page.click('#list', {waitUntil: 'domcontentloaded'});
    text = await page.evaluate(() => document.body.textContent);
    textLower = text.toLowerCase();

    expect(textLower).toContain(firstPart.partNumber.toString()); 
    expect(textLower).toContain(firstPart.name.toLowerCase()); 
    expect(textLower).toContain(secondPart.partNumber.toString()); 
    expect(textLower).toContain("newname"); 
    expect(textLower).toContain(thirdPart.partNumber.toString()); 
    expect(textLower).toContain(thirdPart.name.toLowerCase()); 
  
}); 

test("Update part UI test fail case", async() => {
    let firstPart = carData.at(0);
    await model.addCarPart(firstPart.partNumber, firstPart.name)

    let secondPart = carData.at(2);
    await model.addCarPart(secondPart.partNumber, secondPart.name)

    let thirdPart = carData.at(1);
    await model.addCarPart(thirdPart.partNumber, thirdPart.name)
  
    await page.click("#update");
    await page.type('#partNumber', secondPart.partNumber.toString());
    await page.type('#name', "%%^^^^&&");
   
  
    await page.click('[type="submit"]', {waitUntil: 'domcontentloaded'});
    let text = await page.evaluate(() => document.body.textContent);
    let textLower = text.toLowerCase();
    
    expect(textLower).toContain('invalid input');
    expect(textLower).toContain('alpha numeric');

    await page.click('#list', {waitUntil: 'domcontentloaded'});
    text = await page.evaluate(() => document.body.textContent);
    textLower = text.toLowerCase();

    expect(textLower).toContain(firstPart.partNumber.toString()); 
    expect(textLower).toContain(firstPart.name.toLowerCase()); 
    expect(textLower).toContain(secondPart.partNumber.toString()); 
    expect(textLower).toContain(secondPart.name.toLowerCase()); 
    expect(textLower).toContain(thirdPart.partNumber.toString()); 
    expect(textLower).toContain(thirdPart.name.toLowerCase()); 
  
}); 

test("Delete part UI test success case", async() => {
    let firstPart = carData.at(0);
    await model.addCarPart(firstPart.partNumber, firstPart.name)

    let secondPart = carData.at(2);
    await model.addCarPart(secondPart.partNumber, secondPart.name)

    let thirdPart = carData.at(1);
    await model.addCarPart(thirdPart.partNumber, thirdPart.name)
  
    await page.click("#delete");
    await page.type('#partNumber', secondPart.partNumber.toString());
   
  
    await page.click('[type="submit"]', {waitUntil: 'domcontentloaded'});
    let text = await page.evaluate(() => document.body.textContent);
    let textLower = text.toLowerCase();
    
    expect(textLower).toContain("deleted part with part number")
    expect(textLower).toContain(secondPart.partNumber.toString()); 

    await page.click('#list', {waitUntil: 'domcontentloaded'});
    text = await page.evaluate(() => document.body.textContent);
    textLower = text.toLowerCase();

    expect(textLower).toContain(firstPart.partNumber.toString()); 
    expect(textLower).toContain(firstPart.name.toLowerCase()); 
    expect(textLower).toContain(thirdPart.partNumber.toString()); 
    expect(textLower).toContain(thirdPart.name.toLowerCase()); 
  
}); 

test("Delete part UI test fail case", async() => {
    let firstPart = carData.at(0);
    await model.addCarPart(firstPart.partNumber, firstPart.name)

    let secondPart = carData.at(2);
    await model.addCarPart(secondPart.partNumber, secondPart.name)

    let thirdPart = carData.at(1);
    await model.addCarPart(thirdPart.partNumber, thirdPart.name)
  
    await page.click("#delete");
    await page.type('#partNumber', "11111111");
   
  
    await page.click('[type="submit"]', {waitUntil: 'domcontentloaded'});
    let text = await page.evaluate(() => document.body.textContent);
    let textLower = text.toLowerCase();
    
    expect(textLower).toContain("could not find part")
    expect(textLower).toContain('11111111'); 

    await page.click('#list', {waitUntil: 'domcontentloaded'});
    text = await page.evaluate(() => document.body.textContent);
    textLower = text.toLowerCase();

    expect(textLower).toContain(firstPart.partNumber.toString()); 
    expect(textLower).toContain(firstPart.name.toLowerCase()); 
    expect(textLower).toContain(secondPart.partNumber.toString()); 
    expect(textLower).toContain(secondPart.name.toLowerCase()); 
    expect(textLower).toContain(thirdPart.partNumber.toString()); 
    expect(textLower).toContain(thirdPart.name.toLowerCase()); 
  
}); 
