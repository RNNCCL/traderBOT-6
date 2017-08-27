let express = require('express');
let router = express.Router();

let response = {};

router.get('/', ensureAuthenticated, function(req, res){
	response.user =  req.user;
	response.page = 'dashboard';
	res.render('index.html', response);
});

router.get('/prediction', ensureAuthenticated, function(req, res){
	response.page = 'prediction';
	res.render('prediction.html', response);
});

router.get('/bots', ensureAuthenticated, function(req, res){
	response.page = 'bots';
	console.log(req.session.cache);
	res.render('bots.html', response);
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;
