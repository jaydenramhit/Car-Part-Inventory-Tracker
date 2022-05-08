'use strict';

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

    // Making sure the password and confirmed password match
    if (password != confirmPassword){
        // Error data for when an error occurs
        const errorData = {
            alertOccurred: true,
            alertMessage: "The passwords you have entered are not the same.",
            alertLevel: 'danger',
            alertLevelText: 'Danger',
            alertHref: 'exclamation-triangle-fill',
            titleName: 'Sign Up',
            pathNameForActionForm: 'signup',
            showConfirmPassword: true,
            oppositeFormAction: 'login',
            oppositeFormName: 'Log in',
            dontHaveAccountText: "Already have an account?"
        }
        
        response.status(404).render('loginsignup.hbs', errorData);
    }
    // If both passwords match
    else{
        try {
            await userModel.addUser(username, password);

            // Save cookie that will expire.
            response.cookie("username", username);
            response.cookie("justRegistered", "true");
                // .redirect('/')// Need cookie or session to pass this message to /

            // Render the home page
            response.status(201).
                render('home.hbs', {successMessage: `Congrats ${username} you have been registered!`}) // Need cookie or session to pass this message to /
        } catch(error) {

            // Error data for when an error occurs
            const errorData = {
                alertOccurred: true,
                alertMessage: "",
                alertLevel: 'danger',
                alertLevelText: 'Danger',
                alertHref: 'exclamation-triangle-fill',
                titleName: 'Sign Up',
                pathNameForActionForm: 'signup',
                showConfirmPassword: true,
                oppositeFormAction: 'login',
                oppositeFormName: 'Log in',
                dontHaveAccountText: "Already have an account?"
            }

            // If the error is an instance of the DatabaseConnectionError error
            if (error instanceof DatabaseConnectionError){
                errorData.alertMessage = "Error while connecting to database.";
                
                response.status(500).render('loginsignup.hbs', {alertMessage: "Error while connecting to database."});
            }
            // If the error is an instance of the UserLoginError error
            else if (error instanceof userModel.UserLoginError){
                errorData.alertMessage = error.message;

                response.status(404).render('loginsignup.hbs', errorData);
            }
            // If any other error occurs
            else {
                response.status(500).render('error.hbs', {message: `Unexpected error while trying to register user: ${error.message}`});
            }
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
        // If the error is an instance of the DatabaseConnectionError error
        if (error instanceof DatabaseConnectionError){
            response.status(404).render('users.hbs', {alertMessage: "Error while connecting to database."})
        }
         // If any other error occurs
        else{
            response.status(500).render('error.hbs', {message: `Unexpected error while trying to register user: ${error.message}`});
        }
    }
}

/**
 * Renders the signup page with the given data. 
 * @param {*} request 
 * @param {*} response 
 */
async function showSignup(request, response){
    // Page data 
    const pageData = {
        alertOccurred: false,
        titleName: 'Sign Up',
        pathNameForActionForm: 'signup',
        showConfirmPassword: true,
        oppositeFormAction: 'login',
        oppositeFormName: 'Log in',
        dontHaveAccountText: "Already have an account?"
    }

    response.status(201).render('loginsignup.hbs', pageData);
}

router.get('/users', showUsers);
router.get('/users/signup', showSignup)
router.post("/users/signup", createUser)


module.exports = {
    router,
    routeRoot
}