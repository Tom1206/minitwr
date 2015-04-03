var mongoose = require('mongoose');

module.exports = mongoose.model('Tweet',{
	nickname: String,
	tweet: String,
	date: String,
	diese: String
});
