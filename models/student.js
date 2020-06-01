var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var schema = new Schema({
    fullname : {type:String, require:true},
    email : {type:String, require:true},
    phone: {type:String, require:true},
    contactPreference: {type:String, require:true},
    creation_dt : {type:Date, require:true},
});

module.exports = mongoose.model('Student', schema);