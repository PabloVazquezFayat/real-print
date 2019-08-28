const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user/User');
const ensureLogin = require('connect-ensure-login');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const checkUser = require('../controllers/auth/checkUserType');

//Sign Up page
router.get('/signup', (req, res, next)=>{
  res.render('signup');
});

//Sign In page
router.get('/signin', (req, res, next)=>{
  res.render('signin');
});

//Create new user
router.post('/signupUser', async (req, res, next)=>{
  try{

    const pass = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassWord =  bcrypt.hashSync(pass, salt);

    let newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      postCode: req.body.postCode,
      password: hashedPassWord,
      mailingList:  req.body.mailingList
    };

    const email = await User.findOne({email: req.body.email});

    if(email){
      req.flash('error', 'This email is already in user, try again!');
      res.redirect('/');
      return;
    }

    const user = await User.create(newUser);

    if(user){
      console.log('Created user', req.body);
      req.logIn(user, (error, user)=>{
        res.redirect('/profile');
      });
    }
  }catch(error){
    console.log(error);
    next(error);
  }

});

//Authenticate and log in user or admin
router.post('/login', passport.authenticate('local', {failureRedirect: '/'}), (req, res, next)=>{
  checkUser.checkUserType(req, res, next, {
    admin: '/admin',
    user: '/profile',
  });
});

//Log out user or admin
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/');
});

//Check if user type is user before rendering route
router.get('/profile', ensureLogin.ensureLoggedIn('/'), (req, res, next)=>{
  checkUser.user(req, res, next, {
    user: 'profile',
    failure: '/'
  });
});

//Check if user is admin before rendering route
router.get('/admin', ensureLogin.ensureLoggedIn('/'), (req, res, next)=>{
  checkUser.admin(req, res, next, {
    admin: 'admin',
    failure: '/'
  });
});

module.exports = router;