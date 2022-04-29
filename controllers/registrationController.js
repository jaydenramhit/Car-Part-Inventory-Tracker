const express = require('express');
const { DatabaseConnectionError } = require('../models/carPartModelMysql');
const router = express.Router();
const routeRoot = '/';
const userModel = require('../models/userModel');

/**
 * POST method that allows the creation of a user
 * @param {*} request 
 * @param {*} response 
 */
async function createUser(request, response){
    let username = request.body.username;
    let password = request.body.password;

    try {
        await userModel.addUser(username, password)
        response.status(201).render('home.hbs', {successMessage: `Congrats ${username} you have been registered!`})
    } catch(error) {
            if (error instanceof DatabaseConnectionError){
                response.status(500).render('signup.hbs', {alertMessage: "Error connecting to database."});
            }
            else if (error instanceof userModel.UserLoginError)
                response.status(404).render('signup.hbs', {alertMessage: error.message});
            else {
                response.status(500).render('error.hbs', {message: `Unexpected error while trying to register user: ${error.message}`});
            }
    }
}

async function showSignup(request, response){
    response.status(201).render('signup.hbs');
}
router.get('/users/signup', showSignup)
router.post("/users/signup", createUser)
module.exports = {
    router,
    routeRoot
}