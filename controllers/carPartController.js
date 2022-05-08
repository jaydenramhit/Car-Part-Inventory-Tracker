const express = require('express');
const router = express.Router();
const routeRoot = '/';
const sqlModel = require('../models/carPartModelMysql.js');
const validUtils = require('../validateUtils.js');

/**
 * POST controller method that allows the user to create parts via the request body
 * @param {*} request 
 * @param {*} response 
 */
async function createPart(request, response){
    let number = request.body.partNumber;
    let partName = request.body.name;
    let image = request.body.image;
    let condition = request.body.condition;

    if (!validUtils.isURL(image))
        image = null;
    
    if (validUtils.stringIsEmpty(condition))
        condition = "unknown";
        
    try {
        await sqlModel.addCarPart(number, partName, image, condition)
        response.status(201).render('home.hbs', {message: `Created part: Part #${number}, ${partName}, Condition: ${condition}`})
    } catch(error) {
            if (error instanceof sqlModel.DatabaseConnectionError){
                response.status(500).render('home.hbs', {message: "Error connecting to database."});
            }
            else if (error instanceof sqlModel.InvalidInputError)
                response.status(404).render('home.hbs', {message: "Invalid input, check that all fields are alpha numeric where applicable. Ensure the url is a valid image url"});
            else {
                response.status(500).render('error.hbs', {message: `Unexpected error while trying to add part: ${error.message}`});
            }
    }

}
/**
 * GET controller method that allows the user to retrieve the part with the given part number
 * @param {*} request 
 * @param {*} response 
 */
async function getPartByNumber(request, response){
    let number = request.params.partNumber;
    try {
        await sqlModel.findCarPartByNumber(number).then(part => {
            if (part.length == 0)
                response.status(404).render('home.hbs', {message: `Could not find any parts with part number \'${number}\'`});
            else{
                let output = {part, showList: true};
                response.status(200).render('home.hbs', output);

            }
        })
    }
    catch(error){
        if (error instanceof sqlModel.DatabaseConnectionError){
            response.status(500).render('home.hbs', {message: "Error connecting to database."});
        }
        else if (error instanceof sqlModel.InvalidInputError)
            response.status(404).render('home.hbs', {message: "Invalid input, check that all fields are alpha numeric where applicable."});
        else {
            response.status(500).render('error.hbs', {message: `Unexpected error while trying to show part: ${error.message}`});
        }
    }
}
/**
 * GET controller method that allows the user to retrieve an array of all parts in the database
 * @param {*} request 
 * @param {*} response 
 */
async function getAllCarParts(request, response){
    try {
        await sqlModel.findAllCarParts()
        .then(part => {
            if (part.length == 0)
                response.status(404).render('home.hbs', {message: "No results"})
            else{
                for (let i = 0; i < part.length; i++){
                      if (part[i].image == 'null' || part[i].image == null || part[i.image == ''])
                        delete part[i].image;
                  }
                let output = {part, showList: true}
                response.status(200).render('home.hbs', output)
            }  
        })
    }
    catch(error){
        if (error instanceof sqlModel.DatabaseConnectionError){
            response.status(500).render('home.hbs', {message: "Error connecting to database."});
        }
        else if (error instanceof sqlModel.InvalidInputError)
            response.status(404).render('home.hbs', {message: "Invalid input, check that all fields are alpha numeric where applicable."});
        else {
            response.status(500).render('error.hbs', {message: `Unexpected error while trying to show part: ${error.message}`});
        }
    }
}
/**
 * PUT controller method that allows the user to specify a part number, and update it's name
 * @param {*} request 
 * @param {*} response 
 */
async function updatePartName(request, response){
    let newName = request.body.name;
    let partNumber = request.params.partNumber;
    try {
        if (!await sqlModel.verifyCarPartExists(partNumber))
            response.status(404).render('home.hbs', {message:`Could not find part #${partNumber}`});
        else
            await sqlModel.updateCarPartName(partNumber, newName)
                .then(part => response.status(200).render('home.hbs', {message:`Updated part name with part number ${part.partNumber} to ${part.name}`}))
    }
    catch(error){
        if (error instanceof sqlModel.DatabaseConnectionError){
            response.status(500).render('home.hbs', {message: "Error connecting to database."});
        }
        else if (error instanceof sqlModel.InvalidInputError)
            response.status(404).render('home.hbs', {message: "Invalid input, check that all fields are alpha numeric where applicable."});
        else {
            response.status(500).render('error.hbs', {message: `Unexpected error while trying to show part: ${error.message}`});
        }
    }   
}
/**
 * DELETE controller method that allows the user to delete a specific part given it's part number
 * @param {*} request 
 * @param {*} response 
 */
async function deletePart(request, response){
    let partNumber = request.params.partNumber;
    try {
        if (await sqlModel.verifyCarPartExists(partNumber))
            await sqlModel.deleteCarPart(partNumber)
            .then(part => response.status(202).render('home.hbs', {message: `Deleted part with part number ${part.partNumber}`}))
        else
        response.status(404).render('home.hbs', {message:`Could not find part #${partNumber}`});
    }
    catch (error){
        if (error instanceof sqlModel.DatabaseConnectionError){
            response.status(500).render('home.hbs', {message: "Error connecting to database."});
        }
        else if (error instanceof sqlModel.InvalidInputError)
            response.status(404).render('home.hbs', {message: "Invalid input, check that all fields are alpha numeric where applicable."});
        else {
            response.status(500).render('error.hbs', {message: `Unexpected error while trying to show part: ${error.message}`});
        }
    }
}

router.post("/parts", createPart)
router.get("/parts/:partNumber", getPartByNumber)
router.get("/parts", getAllCarParts)
router.put("/parts/:partNumber", updatePartName)
router.delete("/parts/:partNumber", deletePart)
router.get("/", getAllCarParts)

module.exports = {
    router,
    routeRoot
}