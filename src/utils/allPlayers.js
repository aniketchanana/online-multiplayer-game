//this file contains all the users with their respective rooms

let allPlayers = [];

function addPlayer(user,room,socketid){
    allPlayers.push({
        username:user.username,
        userid:user.userid,
        connectedroom:room,
        socketid,
    }) 
}

function getMatch(room){
    let players = [];
    for(let i=0;i<allPlayers.length;i++)
    {
        if(allPlayers[i].connectedroom === room)
        {
            players.push(allPlayers[i]);
        }
    }
    return players;
}

module.exports = {
    allPlayers,
    addPlayer,
    getMatch
}