const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email address");
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.includes("password"))
            {
                throw new Error("Please choose some other password");
            }
            else if(value.length < 8)
            {
                throw new Error("Password length must be greater that 8");
            }
        }
    }
},{
    timestamps:true
})

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email});
    if(!user){
        throw new Error("User dosenot exist")
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("Unable to login");
    }
    return user;
}

userSchema.pre('save',async function(next){
    let user = this;
    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password,8);
    }
    if(user.isModified("name"))
    {
        user.name = user.name.slice(0,1).toUpperCase()+user.name.slice(1,user.name.length);
    }
    next();
})

const User = mongoose.model('user',userSchema);

module.exports = User;