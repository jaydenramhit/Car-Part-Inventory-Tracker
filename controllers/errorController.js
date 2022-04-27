const express = require('express');
const router = express.Router();
const routeRoot = '/';

function sendError(request, response){
    response.status(404);
    response.render('home.hbs', {alertMessage: 'Invalid URL entered.  Please try again.'});
}
router.all('*', sendError);

module.exports = {
    router,
    routeRoot
}

