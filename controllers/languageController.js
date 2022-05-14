'use strict';

const express = require('express');
const router = express.Router();
const routeRoot = '/';
const partController = require('./carPartController');
const logger = require('../logger');

function setLanguage(request, response){
    const lang = request.body.language;
    if (lang) {
        response.cookie('language', lang);
    }
    response.redirect("/");
};

router.post('/language', setLanguage);

module.exports = {
    routeRoot,
    router
}