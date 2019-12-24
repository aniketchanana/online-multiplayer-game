const express = require('express');
const app = express();
require('./mongoose');
const User = require('./models/User');
const path = require("path");
const session = require('express-session');
const auth = require('./utils/auth');

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'../../gaming-arena/public')))

app.use(session({secret: "#$%^&*#$%^&*(key",resave:true,saveUninitialized:true}));

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
    const userid = req.params.id
    try{
        let user = await User.findById(userid);
        res.status(200).send({
            name:user.name
        })
    }catch(e){
        res.status(404).send("user not found");
    }
})

app.listen(port,()=>{
    console.log("application is runnig at port " + port);
})