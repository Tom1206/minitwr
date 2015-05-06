var mongoose = require('mongoose');

module.exports = mongoose.model('msg',{
	id1: String,
  id2: String,
	msg: [{user: String, message: String}]
});
