var mongoose = require('mongoose');

module.exports = mongoose.model('Tweet',{
	id: String,
	nickname: String,
	tweet: String,
	date: String,
	location: String,
	diese: String
});
