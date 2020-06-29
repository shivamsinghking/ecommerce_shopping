var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var Userschema = new Schema({
    email:{type:String, required:true},
  password :{type:String, required:true},
  
});

Userschema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null)
};
Userschema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User',Userschema);