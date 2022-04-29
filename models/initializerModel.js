const model = require('./carPartModelMysql.js');
const users = require('./userModel')

function initialize(dbname, reset, app, port){
    model.initialize(dbname, reset).then(users.initializeUserModel(dbname, reset)).then(app.listen(port));
}
module.exports = {initialize};