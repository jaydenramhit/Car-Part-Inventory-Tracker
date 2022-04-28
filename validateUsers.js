const validator = require("./node_modules/validator/validator.js");
const model = require("./models/userModel");
function isValidUsername(name)
{
    if (name.length > 15)
        throw new model.UserLoginError("Username must be 15 or less characters.");
    else
        return true;
    if (name.length < 6)
        throw new model.UserLoginError("Username must be 6 characters or more.");
    else
        return true;
}