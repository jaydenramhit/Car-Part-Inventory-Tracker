'use strict';

const express = require('express');
const router = express.Router();
const routeRoot = '/';
const sqlModel = require('../models/carPartModelMysql.js');
const validUtils = require('../validateUtils.js');
const partsModel = require('../models/carPartModelMysql');
const usersModel = require('../models/userModel');
const projectModel = require('../models/projectModel');

/**
 * POST controller method that allows the user to create projects
 * @param {*} request 
 * @param {*} response 
 */
 async function createProject(request, response){
    let name = request.body.name;
    let description = request.body.description;
    let userId = await usersModel.getUserByName(request.cookies.username);
    try {
        let projectId = await projectModel.addProject(name, description)
        await projectModel.addUserToProject(projectId, userId);
        const pageData = {
            alertOccurred: true,
            alertMessage: "You have successfully added a project!",
            alertLevel: 'success',
            alertLevelText: 'success',
            alertHref: 'exclamation-triangle-fill',
            titleName: 'Create a Project',
            pathNameForActionForm: 'projects',
            projects: await partsModel.getAllProjects()
        }
    
        response.status(201).render('projects.hbs', pageData);
    } catch(error) {
        const pageData = {
            alertOccurred: true,
            alertMessage: "",
            alertLevel: 'danger',
            alertLevelText: 'Danger',
            alertHref: 'exclamation-triangle-fill',
            titleName: 'Create a Project',
            pathNameForActionForm: 'projects',
            projects: await partsModel.getAllProjects()
        }
            if (error instanceof sqlModel.DatabaseConnectionError){
                pageData.alertMessage = "Error connecting to database."
                response.status(500).render('projects.hbs', pageData);
            }
            else if (error instanceof sqlModel.InvalidInputError){
                pageData.alertMessage = "Invalid input, check that all fields are alpha numeric where applicable.";
                response.status(404).render('projects.hbs', pageData);
            }
            else {
                pageData.alertMessage = `Unexpected error while trying to create project: ${error.message}`;
                response.status(500).render('projects.hbs', pageData);
            }
    }

}

/**
 * Renders the projects page with the given data. 
 * @param {*} request 
 * @param {*} response 
 */
 async function showProjects(request, response){
    // Page data 
    const pageData = {
        alertOccurred: false,
        showTable: true,
        tableMessage: "You do not have any projects.",
        titleName: 'Create a Project',
        pathNameForActionForm: 'projects',
        projects: await projectModel.getAllProjects(request.cookies.username)
    }
    if (pageData.projects.length == 0)
        pageData.showTable = false;
    response.status(201).render('projects.hbs', pageData);
}

module.exports = {
    router,
    routeRoot
}


router.post("/projects", createProject)
router.get("/projects", showProjects)