const validator = require("validator/validator");
const model = require("./models/userModel");
const bcrypt = require('bcrypt');
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
module.exports = {
    isValidUsername,
    isValidPassword,
    hashPassword
}