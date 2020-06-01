var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var schema = new Schema({
    username : {type:String, require:true},
    email : {type:String, require:true},
    password : {type:String, require:true},
    creation_dt : {type:Date, require:true},
});

//hash password before saving it to database
schema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

//for login - compare password with the hashed password
schema.methods.isValid = function(hashedpassword){
    return bcrypt.compareSync(hashedpassword, this.password);
}

module.exports = mongoose.model('User', schema);