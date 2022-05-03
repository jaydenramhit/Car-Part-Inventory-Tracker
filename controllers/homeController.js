const express = require('express');
const router = express.Router();
const routeRoot = '/';
const partController = require('./carPartController');

/**
 * GET controller method that outputs the home view
 * @param {*} request 
 * @param {*} response 
 */
function sendHome(request, response) {
    response.status(200).render('home.hbs');    
}

/**
 * Form POST method that displays a form based on the user's selection
 * @param {*} request 
 * @param {*} response 
 */
function showForm(request, response) {
    switch (request.body.choice) {
            case 'add':
                showAddForm(response);
                break;
            case 'show':
                showListOneForm(response);
                break;
            case 'list':
                response.redirect('/parts')
                break;
            case 'edit':
                showEditForm(response);
                break;
            case 'delete':
                showDeleteForm(response);
                break;
            default:
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
        formfields: [{field:"partNumber", pretty:"Original Part Number", type: "number"}]
    };
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
                     {field:"name", pretty:"New Part Name"}]
    };
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
        formfields: [{field:"partNumber", pretty:"Part Number", type: "number"}]
    };
    response.render('home.hbs',pageData);
}

router.get('/', sendHome);
router.post('/', showForm)
module.exports = {
    router,
    routeRoot
}
