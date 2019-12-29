const uuid = require('uuid');
function createUser(userid,username,uniqueid,available = true){
    return {
        userid,
        username,
        uniqueid
    }
}

module.exports = createUser;