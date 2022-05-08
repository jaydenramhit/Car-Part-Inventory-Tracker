'use strict';

const express = require('express');
const router = express.Router();
const routeRoot = '/';
const logger = require('../logger');

/**
 * Renders the about page.
 * @param {*} request 
 * @param {*} response 
 */
function showAbout(request, response) {
    logger.info(`RENDERING about page -- showAbout`);
    response.status(200).render('about.hbs');
}

router.get('/about', showAbout);


module.exports = {
    router,
    routeRoot
}
