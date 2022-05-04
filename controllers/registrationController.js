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
    let confirmPassword = request.body.confirmPassword;

    if (password != confirmPassword){
        response.status(404).render('signup.hbs', {alertMessage: "The passwords you have entered are not the same."});
    }

    try {
        await userModel.addUser(username, password)
        response.cookie("username", username);
        response.status(201).cookie("justRegistered", "true").redirect('/')// Need cookie or session to pass this message to /
    } catch(error) {
            if (error instanceof DatabaseConnectionError){
                response.status(500).render('signup.hbs', {alertMessage: "Error while connecting to database."});
            }
            else if (error instanceof userModel.UserLoginError)
                response.status(404).render('signup.hbs', {alertMessage: error.message});
            else {
                response.status(500).render('error.hbs', {message: `Unexpected error while trying to register user: ${error.message}`});
            }
    }
}

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

async function showSignup(request, response){
    response.status(201).render('signup.hbs');
}
router.get('/users', showUsers);
router.get('/users/signup', showSignup)
router.post("/users/signup", createUser)
module.exports = {
    router,
    routeRoot
}