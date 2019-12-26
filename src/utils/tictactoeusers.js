let users = [];

function tictactoe(user){
    users.push(user);
}

function toggleAvailability(index){
    users[index].available = !users[index].available;
}
module.exports = {tictactoe,users,toggleAvailability};