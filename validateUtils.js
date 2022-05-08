
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

// https://thispointer.com/javascript-check-if-string-is-url/
function isURL(string) {
    const matchpattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
    return matchpattern.test(string);
  }

function stringIsEmpty(string){
    if (string == "")
        return true;
    else
        return false;
}

module.exports = {
    isValid,
    isPartNumber,
    isURL,
    stringIsEmpty
}
