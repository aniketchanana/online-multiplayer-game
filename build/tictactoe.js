var queryString = window.location.search;
const query = queryParams(queryString);
var messageBox = document.getElementById("text__message");
var allMessages = document.getElementById("messages");
var messageForm = document.getElementById("form")
let playing = false;
const socket = io();
let game = [];
let turn = false;
let sign = "";
for(let i=0;i<3;i++)
{
    game.push(["","",""])
}

function isWinner(feild){
    // check row wise

    for (let i = 0; i < 3; i++) {
        if (feild[i][0] === feild[i][1] && feild[i][1] === feild[i][2] && feild[i][0] !== "" && feild[i][1] !== "" && feild[i][2] !== "") {
            return 0;
        }
    }
    for (let i = 0; i < 3; i++) {
        if (feild[0][i] === feild[1][i] && feild[1][i] === feild[2][i] &&  feild[0][i] !== "" && feild[1][i] !== "" && feild[2][i] !== "") {
            return 0;
        }
    }
    if (feild[0][0] === feild[1][1] && feild[1][1] === feild[2][2] && feild[0][0] !== "" && feild[1][1] !== "" && feild[2][2] !== "") {
        return 0;
    }
    if (feild[0][2] === feild[1][1] && feild[1][1] === feild[2][0]  && feild[0][2] !== ""  && feild[1][1] !== ""  && feild[2][0] !== "") {
        return 0;
    }

    let count = 0;
    for(let i=0;i<3;i++)
    {
        for(let j=0;j<3;j++)
        {
            if(feild[i][j] !== "")
            count++;
        }
    }

    if(count === 9)
    return 1;

    return -1;
    //-1 still playing game
    //0 win
    //1 draw
}

function run(){
    if(!playing)
    {
        document.getElementById("gameboard").style.display = "none";
        document.getElementById("waiting").style.display = "flex";
        document.getElementById("waiting__message").innerHTML = "Waiting for other player to join";
    }
    else
    {
        document.getElementById("gameboard").style.display = "block"
        document.getElementById("waiting").style.display = "none";
    }
}
run();
function queryParams(queryString)
{
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for(let i=0;i<pairs.length;i++)
    {
        var [key,value] = pairs[i].split("=");
        query[key] = value
    }
    return query
}
function sentMessage(message)
{
    var div = document.createElement("div");
    div.className = "send"
    var span = document.createElement("span");
    span.className = "message__box";
    span.textContent = message
    div.appendChild(span);

    allMessages.appendChild(div);
}

function recieveMessage(message){
    var div = document.createElement("div");
    div.className = "recieve"
    var span = document.createElement("span");
    span.className = "message__box";
    span.textContent = message
    div.appendChild(span);

    allMessages.appendChild(div);
}



socket.emit("tic-tac-toe",query)

socket.on("roomdata",(message)=>{
    console.log(message);
    playing=true;
    run();
    window.sessionStorage.setItem("playingroom",message.playingroom);
    window.sessionStorage.setItem("player1",message.players[0].userid);
    window.sessionStorage.setItem("player2",message.players[1].userid);
    window.sessionStorage.setItem("player1name",message.players[0].username);
    window.sessionStorage.setItem("player2name",message.players[1].username);
    document.getElementById("status").textContent = `Now playing`;

    document.getElementById("player1").textContent = message.players[0].username;
    document.getElementById("player2").textContent = message.players[1].username;

    if(query.userid === message.players[0].userid)
    {
        turn = true;
        sign = "x";
    }
    else
    {
        sign = "o"
    }
})


messageForm.onsubmit = function(e){
    e.preventDefault();
    if(!playing)
    {
        messageBox.value = "";
        messageBox.focus();
        return;
    }
    socket.emit("sendmessage",{
        room:window.sessionStorage.getItem("playingroom"),
        message:messageBox.value
    })
    sentMessage(messageBox.value);
    messageBox.value = "";
    messageBox.focus();
}

socket.on("recievemessage",(message)=>{
    recieveMessage(message);
})


socket.on("disconnected",(message)=>{
    alert(message);
})

socket.on("close",(message)=>{
    window.location.reload();
    console.log(message);
})

let cells = document.getElementsByClassName("cell");
let arr = [[cells[0],cells[1],cells[2]],[cells[3],cells[4],cells[5]],[cells[6],cells[7],cells[8]]]


socket.on("change",(message)=>{
    //-1 still playing game
    //0 win
    //1 draw
    
    turn = !turn;
    let one = document.getElementById("player1");
    let two = document.getElementById("player2");

    one.getAttribute("class") === "active"?one.setAttribute("class",""):one.setAttribute("class","active");
    two.getAttribute("class") === "active"?two.setAttribute("class",""):two.setAttribute("class","active");

    refreshBoard(message.game)
    
})


function refreshBoard(game__update){
    game = game__update
    document.getElementById("game__board").parentElement.removeChild(document.getElementById("game__board"));
    let div = document.createElement("div");
    div.setAttribute("id","game__board")
    div.setAttribute("class","row game")
    for(let i=0;i<3;i++)
    {
        for(let j=0;j<3;j++)
        {
            let span = document.createElement("span");
            span.setAttribute("class","col-4 center cell")
            span.setAttribute("id",`${i}-${j}`)
            span.onclick = evthandler;
            // span.setAttribute("onclick",`evthandler()`)
            span.textContent = game[i][j];
            div.appendChild(span);
        }
    }
    // let cells = document.getElementsByClassName("cell");
    // console.log(cells)
    // let arr = [[cells[0],cells[1],cells[2]],[cells[3],cells[4],cells[5]],[cells[6],cells[7],cells[8]]]
    document.getElementById("here").appendChild(div);
    let result = isWinner(game);
    if(result == 1)
    {
        // socket.emit("result","Game Draw");
        alert("Game Draw");
        window.location.href="/";
        return ;
    }
    else if(result == 0 && turn == false)
    {
        // socket.emit("result",`${query.username} is winner`);
        alert(`${query.username} is winner`);
        window.location.href="/";
        return ;
    }
    else if(result === 0 && turn === true)
    {
        // socket.emit("result",`${window.sessionStorage.getItem("player2name")} is winner`)
        alert(`${window.sessionStorage.getItem("player1name")} is winner`);
        window.location.href="/";
        return ;
    }
}

function evthandler(e)
{
    let x = parseInt(e.target.getAttribute("id").split("-")[0]);
    let y = parseInt(e.target.getAttribute("id").split("-")[1]);
    if(game[x][y] !== "")
    {
        return ;
    }
    console.log(e)
    console.log(turn)
    if(!turn)
    {
        alert("opponent turn");
        return;
    }
    
    arr[x][y].textContent = sign;
    game[x][y] = sign.toString();
    console.log(game[x][y])
    socket.emit("change",{
        room:window.sessionStorage.getItem("playingroom"),
        game:game
    })
}

$(window).bind('beforeunload',function(){
    socket.emit("disconnect","player left");
 });
// window.onbeforeunload = function () {
//     return false;    
// }
