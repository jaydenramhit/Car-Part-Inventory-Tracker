const express = require('express');
const { DatabaseConnectionError } = require('../models/carPartModelMysql');
const router = express.Router();
const routeRoot = '/';
const userModel = require('../models/userModel');
const uuid = require('uuid');
const sessions = {};

/**
 * Handles the request for logging in a user and forms the appropriate response.
 * @param {*} request 
 * @param {*} response 
 */
async function loginUser(request, response){
    let username = request.body.username;
    let password = request.body.password;

    // let result = await userModel.validateLogin(username, password);

    // if(result === true){
    //     response.status(201).render('home.hbs', {successMessage: `Congrats ${username} you have successfully logged in!`})
    //     // Create a session object that will expire in 2 minutes
    //     const sessionId = createSession(username, 2);
    //     // Save cookie that will expire.
    //     response.cookie("sessionId", sessionId, { expires: sessions[sessionId].expiresAt }); 
    //     response.redirect('/');
    // }
    // else{
    //     response.status(404).render('signup.hbs', {alertMessage: error.message});
    // }

    try {
        let result = await userModel.validateLogin(username, password);

        if (result === true){
            // Create a session object that will expire in 2 minutes
            const sessionId = createSession(username, 2);
            // Save cookie that will expire.
            response.cookie("sessionId", sessionId, { expires: sessions[sessionId].expiresAt }); 
            response.cookie("userRole", await userModel.getRole(username));
            response.status(201).render('home.hbs', {successMessage: `${username} has successfully logged in!`});
        }
        else{
            // Error data for when an error occurs
            const errorData = {
                errorOccurred: true,
                errorMessage: "Invalid username or password.",
                titleName: 'Log In',
                pathNameForActionForm: 'login',
                showConfirmPassword: false
            }

            response.status(404).render('loginsignup.hbs', errorData);
        }
            
    } catch(error) {
            if (error instanceof DatabaseConnectionError){
                // Error data for when an error occurs
                const errorData = {
                    errorOccurred: true,
                    errorMessage: "Error while connecting to database.",
                    titleName: 'Log In',
                    pathNameForActionForm: 'login',
                    showConfirmPassword: false
                }

                response.status(500).render('loginsignup.hbs', errorData);
            }
            else if (error instanceof userModel.UserLoginError){
                // Error data for when an error occurs
                const errorData = {
                    errorOccurred: true,
                    errorMessage: error.message,
                    titleName: 'Log In',
                    pathNameForActionForm: 'login',
                    showConfirmPassword: false
                }

                response.status(404).render('loginsignup.hbs', errorData);
            }
            else {
                response.status(500).render('error.hbs', {message: `Unexpected error while trying to register user: ${error.message}`});
            }
    }

}

class Session {
    constructor(username, expiresAt) {
            this.username = username
            this.expiresAt = expiresAt
    }

    isExpired() {
            this.expiresAt < (new Date())
    }
}

function createSession(username, numMinutes) {
    // Generate a random UUID as the sessionId
    const sessionId = uuid.v4()
    // Set the expiry time as numMinutes (in milliseconds) after the current time
    const expiresAt = new Date(Date.now() + numMinutes * 60000);

    // Create a session object containing information about the user and expiry time
    const thisSession = new Session(username, expiresAt);

    // Add the session information to the sessions map, using sessionId as the key
    sessions[sessionId] = thisSession;
    return sessionId;
}

async function showLogin(request, response){
    // Page data 
    const pageData = {
        titleName: 'Log In',
        pathNameForActionForm: 'login',
        showConfirmPassword: false
    }

    response.status(201).render('loginsignup.hbs', pageData);
}

router.get('/users/login', showLogin)
router.post("/users/login", loginUser)


module.exports = {
    router,
    routeRoot
}

