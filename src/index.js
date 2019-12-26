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
app.use(express.static(path.join(__dirname,"../build")));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(express.static(path.join(__dirname,'../build/index.html')))
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

app.post('/logout',auth,function(req,res){
    req.session.destroy(function(){
        console.log("user logged out.")
     });
    res.status(200).send("Logged out");
})
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../build/index.html'))
})

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection",(socket)=>{
    const {login,_id} = socket.client.request.session;
    if(login == undefined || login !== true)
    return ;
    // const {username,userid} = socket.handshake.query; 
    // console.log(uuid());
    console.log("user connected");

    socket.on("tic-tac-toe",({userid,username},callback)=>{
        console.log(users.length)
        if(users.length == 0)
        {
            const user = createUser(userid,username,uuid());
            tictactoe(user);
            socket.join(user.uniqueid);
        }
        else
        {
            let random = Math.floor(Math.random()*users.length);
            while(!users[random].available)
            {
                random = Math.floor(Math.random()*users.length);
            }
            toggleAvailability(random);
            const user = createUser(userid,username,users[random].uniqueid,false);
            tictactoe(user);
            socket.join(users[random].uniqueid);

            io.to(users[random].uniqueid).emit("ready","you are ready")
        }
        console.log(users);
    })
})

server.listen(port,()=>{
    console.log("application is runnig at port " + port);
})