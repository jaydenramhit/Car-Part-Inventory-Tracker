
const validator = require("./node_modules/validator/validator.js");

/**
 * Validates that car part name is an alphanumeric string
 * @param {*} name 
 * @returns true or false
 */
function isValid(name){
    if (validator.isAlphanumeric(name,  ['en-US'], {'ignore': ' _-'}))
        return true;
    else
        return false;

}

function isPartNumber(partNumber){ 
    if (validator.isNumeric(partNumber.toString()))
        return true;
    else
        return false;
}

module.exports = {
    isValid,
    isPartNumber
}
