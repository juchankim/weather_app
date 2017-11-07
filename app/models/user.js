// app/models/user.js

var mongoose = require('mongoose');
var crypto = require('crypto'); 

var userSchema = new mongoose.Schema({
    email : {
    	type: String,
    	unique: true,
    	required: true
    }, 
    name: {
    	type: String,
    	required: true
    },
    hists: [{
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'History'
    }]
    hash: String, // make sure that password is protected
    salt: String
})

userSchema.methods.setPassword = function(ps) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(ps, this.salt, 1000, 64).toString('hex');
}
userSchema.methods.validPassword = function(ps) {
  var hash = crypto.pbkdf2Sync(ps, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};


module.exports = mongoose.model('User', userSchema);