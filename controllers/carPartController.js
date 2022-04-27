const express = require('express');
const router = express.Router();
const routeRoot = '/';
const sqlModel = require('../models/carPartModelMysql.js');

/**
 * POST controller method that allows the user to create cars via the request body
 * @param {*} request 
 * @param {*} response 
 */
async function createPart(request, response){
    let number = request.body.partNumber;
    let partName = request.body.name;
    if (sqlModel.checkConnection(response)){
        sqlModel.addCarPart(number, partName)
        .then(part => response.status(201).render('home.hbs', {message: `Created part: Part #${part.partNumber}, ${part.name}`}))
        .catch(err => response.status(404).render('home.hbs', {message: err}))
    }
    else {
        response.status(500).render('error.hbs', {message: "Error connecting to database."});
    }

}
/**
 * GET controller method that allows the user to retrieve the part with the given part number
 * @param {*} request 
 * @param {*} response 
 */
async function getPartByNumber(request, response){
    let number = request.params.partNumber;

    if (sqlModel.checkConnection(response)){
        sqlModel.findCarPartByNumber(number)
        .then(part => {
            if (part.length == 0)
                response.status(404).render('home.hbs', {message: `Could not find any parts with part number \'${number}\'`});
            else{
                let output = {part};
                response.status(200).render('home.hbs', output);
            }
        })
        .catch(err => { response.status(404).render('error.hbs', {message: `There was an error while trying to find car parts: ${err.message}` })})
    }
    else {
        response.status(500).render('error.hbs', {message: `There was an error connecting to the database.` });
    }

}
/**
 * GET controller method that allows the user to retrieve an array of all parts in the database
 * @param {*} request 
 * @param {*} response 
 */
async function getAllCarParts(request, response){
    if (sqlModel.checkConnection(response)){
        sqlModel.findAllCarParts()
        .then(part => {
            if (part.length == 0)
                response.status(404).render('listCars.hbs', {message: "No results"})
            else{
                let output = {part}
                response.status(200).render('home.hbs', output)
            }  
        })
        .catch(err => { response.status(404).render('error.hbs', {message: `There was an error while trying to find car parts: ${err.message}` })})
    }
    else {
        response.status(500).render('error.hbs', {message: "Error connecting to database."});
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
    if (sqlModel.checkConnection(response)){
        if (await sqlModel.verifyCarPartExists(partNumber)){
            sqlModel.updateCarPartName(partNumber, newName)
            .then(part => response.status(200).render('home.hbs', {message:`Updated part name with part number ${part.partNumber} to ${part.name}`}))
            .catch(err => response.status(404).send(err));
        }
        else
            response.status(404).render('home.hbs', {message:"Could not find part with Part #" + partNumber});
    }
    else {
        response.status(500).send("Error connecting to database.");
    }

    
}
/**
 * DELETE controller method that allows the user to delete a specific car given it's id
 * @param {*} request 
 * @param {*} response 
 */
async function deletePart(request, response){
    let partNumber = request.params.partNumber;
    if (sqlModel.checkConnection(response)){
        if (await sqlModel.verifyCarPartExists(partNumber)){
            sqlModel.deleteCarPart(partNumber)
            .then(part => response.status(202).render('home.hbs', {message: `Deleted part with part number ${part.partNumber}`}))
            .catch(err => response.status(404).send(err));
        }
        else
            response.status(404).render('home.hbs', {message:"Could not find part with part number: " + partNumber});
    }
    else {
        response.status(500).send("Error connecting to database.");
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