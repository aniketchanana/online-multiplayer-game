const express = require('express');
const app = express();
const http = require('http');
const socketio = require("socket.io");
require('./mongoose');
const User = require('./models/User');
const path = require("path");
const session = require('express-session');
const auth = require('./utils/auth');
const server = http.createServer(app);
const io = socketio(server);
const uuid = require('uuid');
const createUser = require('./utils/createuser');
const {tictactoe,users,toggleAvailability} = require('./utils/tictactoeusers');
const {allPlayers,addPlayer,getMatch} = require('./utils/allPlayers')
app.use(express.static(path.join(__dirname,"../build")));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'./public')))
let RedisStore = require("connect-redis")(session);
var mongoose = require('mongoose');
var sessionMiddleware = session({
    secret: 'some secret',
    key: 'express.sid',
    resave: true,
    httpOnly: true,
    secure: true,
    ephemeral: true,
    saveUninitialized: true,
  });
app.use(sessionMiddleware);


const port = process.env.PORT || 3000;


app.post('/user',async function(req,res){
    try{
        const result = await new User(req.body).save();
        console.log(result);
        res.status(200).send({
            id:result.id
        })
    }catch(e){
        console.log(e.message);
        res.status(500).send(e.message);
    }
})

app.post('/user/login',async function(req,res){
    try{
        const {email,password} = req.body;
        const user = await User.findByCredentials(email,password);
        req.session.login = true
        req.session._id = user._id.toString();
        res.send({
            userId : req.session._id
        })
    }catch(e){
        res.status(400).send("Error while logging in");
    }
})

app.get('/user/:id',auth,async function(req,res){
    const userid = req.params.id;
    try{
        let user = await User.findById(userid);
        res.status(200).send({
            name:user.name
        })
    }catch(e){
        res.status(404).send("user not found");
    }
})

app.get('/checkauth',auth,function(req,res){
    try{
        res.status(200).send({
            userid:req.session._id 
        });
    }catch(e){
        res.status(400).send("User not logged in");
    }
})
app.post('/logout',auth,function(req,res){
    req.session.destroy(function(){
        console.log("user logged out.")
     });
    res.status(200).send("Logged out");
})

app.get('/tictactoe',auth,function(req,res){
    console.log(req.query);
    res.sendFile(path.join(__dirname,'../build/tictactoe.html'));
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../build/index.html'))
})


io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection",(socket)=>{
    // const {login,_id} = socket.client.request.session;
    // if(login == undefined || login !== true)
    // return ;
    // const {username,userid} = socket.handshake.query; 
    // console.log(uuid());
    console.log("user connected");

    socket.on("tic-tac-toe",({userid,username},callback)=>{
        const user = createUser(userid,username,socket.id);
        let present = false;
        for(let i=0;i<users.length;i++)
        {
            if(users[i].userid === userid)
            present=true
        }
        if(present)
        {
            return ;
        }

        if(users.length !== 0)
        {
            let player = Math.floor(Math.random()*users.length)
            const playingroom = users[player].uniqueid;
            users.splice(player,1);

            addPlayer(user,playingroom,socket.id)

            socket.join(playingroom);
            io.to(playingroom).emit("roomdata",{playingroom,players:getMatch(playingroom)})
        }
        else
        {
            tictactoe(user);
            addPlayer(user,socket.id,socket.id)
            socket.join(user.uniqueid);
        }
    })

    socket.on("sendmessage",({room,message})=>{
        socket.broadcast.to(room).emit("recievemessage",message);
    })

    socket.on('disconnect',function(message){
        let room ;
        console.log("player has left")
        for(let i=0;i<allPlayers.length;i++)
        {
            if(allPlayers[i].socketid === socket.id)
            {
                room = allPlayers[i].connectedroom;
                allPlayers.splice(i, 1);
            }
        }
        io.to(room).emit("close","exit")
    })

    socket.on("change",(message)=>{
        let status = isWinner(message.game);

        //-1 still playing game
        //0 win
        //1 draw
        if(status == -1)
        {
            io.to(message.room).emit("change",{game:message.game});
        }
        else if(status == 0)
        {
            io.to(message.room).emit("winner",{game:message.game,winner:message.username})
        }
        else if(status == 1)
        {
            io.to(message.room).emit("draw",{game:message.game,winner:message.username})
        }
    })
})

server.listen(port,()=>{
    console.log("application is runnig at port " + port);
})



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