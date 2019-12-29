let users = [];

function tictactoe(newuser){
    // let res = users.every((user)=>{
    //     return user.userid !== newuser.userid
    // })
    // if(res)
    users.push(newuser);
}

function toggleAvailability(index){
    users[index].available = !users[index].available;
}
module.exports = {tictactoe,users,toggleAvailability};