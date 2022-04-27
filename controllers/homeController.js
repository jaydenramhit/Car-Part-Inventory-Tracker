const express = require('express');
const router = express.Router();
const routeRoot = '/';
const partController = require('./carPartController');

function sendWelcome(request, response) {
    response.status(200).render('home.hbs');
}
function showForm(request, response) {
    switch (request.body.choice) {
            case 'add':
                showAddForm(response);
                break;
            case 'show':
                showListOneForm(response);
                break;
            case 'list':
                response.redirect('/') // send user to right endpoint
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
function showAddForm(response) {
    const pageData = {
        showForm: true,
        endpoint: "/parts",
        method: "post",
        legend: "Please enter details for new car part: ",
        formfields: [{ field: "partNumber", pretty: "Part Number", type: "number" },
        { field: "name", pretty: "Part Name" }]
    }

    response.render('home.hbs', pageData);
}
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

router.get('/', sendWelcome);
router.post('/', showForm)
module.exports = {
    router,
    routeRoot
}
