const express = require('express');
const router = express.Router();
const routeRoot = '/';

/**
 * Renders the about page.
 * @param {*} request 
 * @param {*} response 
 */
function showAbout(request, response) {
    response.status(200).render('about.hbs');
}

router.get('/about', showAbout);


module.exports = {
    router,
    routeRoot
}
