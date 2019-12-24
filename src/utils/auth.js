function auth(req,res,next){
    if(req.session.login == 1){
        next();
    }
    else{
        console.log("user is not logged in")
        res.status(400).send("User is not logged in");
    }
}

module.exports = auth;