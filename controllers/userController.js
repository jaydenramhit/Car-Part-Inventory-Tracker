const express = require('express');
const { DatabaseConnectionError } = require('../models/carPartModelMysql');
const router = express.Router();
const routeRoot = '/';
const userModel = require('../models/userModel');

/**
 * GET method that lists all users in the database
 * @param {*} request 
 * @param {*} response 
 */
async function showUsers(request, response){
    try {
        await userModel.showAllUsers()
        .then(users => {
            if (users.length == 0)
                response.status(404).render('users.hbs', {alertMessage: "No results"})
            else{
                let output = {users}
                response.status(200).render('users.hbs', output)
            }  
        })
    }
    catch (error){
        if (error instanceof DatabaseConnectionError){
            response.status(404).render('users.hbs', {alertMessage: "Error while connecting to database."})
        }
        else
            response.status(500).render('error.hbs', {message: `Unexpected error while trying to register user: ${error.message}`});
    }
}

router.get('/users', showUsers);
module.exports = {
    router,
    routeRoot
}