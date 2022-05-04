const validator = require("validator/validator");
const model = require("./models/userModel");
const bcrypt = require('bcrypt');
const res = require("express/lib/response");
const saltRounds = 10;




function isValidUsername(name)
{
    if (name.length > 15)
        return false;

    if (name.length < 6)
        return false;

    return true;
}

function isValidPassword(password){
    if (!validator.isStrongPassword(password))
       return false;
    return true;
}

async function hashPassword(password){
    console.log("test2")
    let hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function validateLogin(plain, hash){
    const result = await bcrypt.compare(plain, hash[0].password)
    return result;
}
module.exports = {
    isValidUsername,
    isValidPassword,
    hashPassword,
    validateLogin
}