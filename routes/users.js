let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');

let response = {};

router.get('/register', function(req, res){
	res.render('register.html');
});

router.get('/login', function(req, res){
	res.render('login.html');
});

router.post('/register', function(req, res){
	let name = req.body.name;
	let email = req.body.email;
	let username = req.body.username;
	let password = req.body.password;
	let password2 = req.body.password2;

	req.checkBody('name', 'Nome é obrigatório').notEmpty();
	req.checkBody('email', 'Email é obrigatório').notEmpty();
	req.checkBody('email', 'Email invalido').isEmail();
	req.checkBody('username', 'Username é obrigatório').notEmpty();
	req.checkBody('password', 'Senha vazia').notEmpty();
	req.checkBody('password2', 'Senhas são diferentes').equals(req.body.password);

	let errors = req.validationErrors();
	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		let newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		console.log('Usuário registrado');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});


module.exports = router;
