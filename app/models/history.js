// app/models/history.js

var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
	text : String,
	date : Date,
	user_id : String
})
module.exports = mongoose.model('History', historySchema);