const mongoose = require('mongoose');

const connectionURL = "mongodb://localhost:27017/game";

mongoose.connect(connectionURL,{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true});