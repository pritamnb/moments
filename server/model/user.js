const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    mobile : {
        type : String,
        required : true
    },
    createdOn : {
        type : Date,
        required : true
    }
});

userSchema.methods.generateAuthToken = function(){
    const info = {
        exp : Math.floor(Date.now() / 1000) + (60 * 60 * 24),  //1 day
        Data : {
            userId : this._id,
            firstName : this.firstName,
            lastName : this.lastName,
            email : this.email,
            mobile : this.mobile
        }
    }
    return jwt.sign(info,process.env.JWTSECRET);
}


const User = mongoose.model("user",userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;