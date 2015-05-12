// check auth.
exports.auth = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
};
