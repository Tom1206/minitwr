var mongoose = require('mongoose');

module.exports = mongoose.model('msg',{
	id1: String,
  id2: String,
	date: String,
	msg: [{user: String, message: String, date: String}]
});
