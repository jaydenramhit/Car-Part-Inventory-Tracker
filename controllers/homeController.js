'use strict';

const express = require('express');
const router = express.Router();
const routeRoot = '/';
const partController = require('./carPartController');
const logger = require('../logger');

/**
 * GET controller method that outputs the home view
 * @param {*} request 
 * @param {*} response 
 */
function sendHome(request, response) {  
    // Getting the values
    const justRegistered = request.cookies.justRegistered;

    // If the user just registered
    if (justRegistered == 'true'){
        const username = request.cookies.username;
        response.cookie ('justRegistered', 'false');
        logger.info(`COOKIE CREATED for user ${username}, rendering home page -- sendHome`);

        const pageData = {
            display_signup: "block",
            display_login: "block",
            logInlogOutText: "Log In",
            endpointLogInLogOut: "login"
        }

        response.status(200).render('home.hbs', pageData);
        // response.cookie ('justRegistered', 'false');
    }
    else {
        const pageData = {
            display_signup: "block",
            display_login: "block",
            logInlogOutText: "Log In",
            endpointLogInLogOut: "login"
        }

        logger.info(`RENDERING home page -- sendHome`);
        response.status(200).render('home.hbs', pageData);
    }     
}

/**
 * Form POST method that displays a form based on the user's selection
 * @param {*} request 
 * @param {*} response 
 */
function showForm(request, response) {
    // Gets the choice value for the button that was clicked
    switch (request.body.choice) {
            // Case of adding a car part
            case 'add':
                logger.info(`SWITCH CASE add -- showForm`);
                showAddForm(response);
                break;

            // Case of finding a car part
            case 'show':
                logger.info(`SWITCH CASE show (find) -- showForm`);
                showListOneForm(response);
                break;

            // Case of getting all car parts
            case 'list':
                logger.info(`SWITCH CASE list (all) -- showForm`);
                response.redirect('/parts')
                break;

            // Case of updating a car part
            case 'edit':
                logger.info(`SWITCH CASE update -- showForm`);
                showEditForm(response);
                break;

            // Case of deleting a car part
            case 'delete':
                logger.info(`SWITCH CASE delete -- showForm`);
                showDeleteForm(response);
                break;

            // Default case
            default:
                logger.info(`SWITCH CASE default -- showForm`);
                response.render('home.hbs'); 
            }
}
/**
 * Displays the add car part form
 * @param {*} response 
 */
function showAddForm(response) {
    const pageData = {
        showForm: true,
        endpoint: "/parts",
        method: "post",
        legend: "Please enter details for new car part: ",
        formfields: [{ field: "partNumber", pretty: "Part Number", type: "number", required: "required"},
        { field: "name", pretty: "Part Name", required: "required"}, { field: "condition", pretty: "Condition"}, {field: "image", pretty: "Image URL"}]
    }

    logger.info(`RENDERING home page WITH ADDING form -- showAddForm`);
    response.render('home.hbs', pageData);
}

/**
 * Displays the show car part form
 * @param {*} response 
 */
function showListOneForm(response) {
    const pageData = {
        showForm:true,
        endpoint: "/parts",
        submitfn: "this.action = this.action + '/'+ this.partNumber.value",
        method: "GET",          
        methodOverride:"GET",       
        legend:"Please enter the part number to display: ",
        formfields: [{field:"partNumber", pretty:"Original Part Number", type: "number"}],
        display_signup: "block",
        display_login: "block",
        logInlogOutText: "Log In",
        endpointLogInLogOut: "login"
    };

    logger.info(`RENDERING home page WITH FIND form -- showListOneForm`);
    response.render('home.hbs',pageData);
}

/**
 * Displays the update car part form
 * @param {*} response 
 */
function showEditForm(response) {
    const pageData = {
        showForm:true,
        endpoint: "/parts",
        submitfn: "this.action = this.action + '/'+ this.partNumber.value",
        method: "post",          
        methodOverride:"PUT",       
        legend:"Please enter the new part name for the part that should to be changed: ",
        formfields: [{field:"partNumber", pretty:"Original Part Number", type: "number"}, 
                     {field:"name", pretty:"New Part Name"}],
        display_signup: "block",
        display_login: "block",
        logInlogOutText: "Log In",
        endpointLogInLogOut: "login"
    };

    logger.info(`RENDERING home page WITH UPDATE form -- showEditForm`);
    response.render('home.hbs',pageData);
}

/**
 * Displays the delete car part form
 * @param {*} response 
 */
function showDeleteForm(response) {
    const pageData = {
        showForm:true,
        endpoint: "/parts",
        submitfn: "this.action = this.action + '/'+ this.partNumber.value",
        method: "post",          
        methodOverride:"DELETE",       
        legend:"Please enter the part number of the part that should be deleted:",
        formfields: [{field:"partNumber", pretty:"Part Number", type: "number"}],
        display_signup: "block",
        display_login: "block",
        logInlogOutText: "Log In",
        endpointLogInLogOut: "login"
    };

    logger.info(`RENDERING home page WITH DELETE form -- showDeleteForm`);
    response.render('home.hbs',pageData);
}

router.get('/', sendHome);
router.post('/', showForm);


module.exports = {
    router,
    routeRoot
}
