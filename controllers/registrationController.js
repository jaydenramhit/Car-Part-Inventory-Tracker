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
            errorOccurred: true,
            errorMessage: "The passwords you have entered are not the same.",
            titleName: 'Sign Up',
            pathNameForActionForm: 'signup',
            showConfirmPassword: true,
        }
        
        response.status(404).render('loginsignup.hbs', errorData);
    }
    else{
        try {
            await userModel.addUser(username, password);
            response.cookie("username", username);
            response.status(201)
                .cookie("justRegistered", "true");
                // .redirect('/')// Need cookie or session to pass this message to /
            response.render('home.hbs', {successMessage: `Congrats ${username} you have been registered!`}) // Need cookie or session to pass this message to /
        } catch(error) {
                if (error instanceof DatabaseConnectionError){
                    // Error data for when an error occurs
                    const errorData = {
                        errorOccurred: true,
                        errorMessage: "Error while connecting to database.",
                        titleName: 'Sign Up',
                        pathNameForActionForm: 'signup',
                        showConfirmPassword: true
                    }
                    
                    response.status(500).render('loginsignup.hbs', {alertMessage: "Error while connecting to database."});
                }
                else if (error instanceof userModel.UserLoginError){
                    // Error data for when an error occurs
                    const errorData = {
                        errorOccurred: true,
                        errorMessage: error.message,
                        titleName: 'Sign Up',
                        pathNameForActionForm: 'signup',
                        showConfirmPassword: true
                    }

                    response.status(404).render('loginsignup.hbs', errorData);
                }
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
        if (error instanceof DatabaseConnectionError){
            response.status(404).render('users.hbs', {alertMessage: "Error while connecting to database."})
        }
        else
            response.status(500).render('error.hbs', {message: `Unexpected error while trying to register user: ${error.message}`});
    }
}

async function showSignup(request, response){
    // Page data 
    const pageData = {
        titleName: 'Sign Up',
        pathNameForActionForm: 'signup',
        showConfirmPassword: true
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