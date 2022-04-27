
const validator = require("./node_modules/validator/validator.js");

/**
 * Validates that car part name is an alphanumeric string
 * @param {*} name 
 * @returns true or false
 */
function isValid(name){
    try {
        if (validator.isAlphanumeric(name))
            return true;
        else
            throw new Error("Invalid input, check that all fields are alpha numeric where applicable.")
    }
    catch(error){
        console.error(error.message);
    }  
}

module.exports = {
    isValid,
}
