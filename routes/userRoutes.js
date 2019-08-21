const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user/User');
const ensureLogin = require('connect-ensure-login');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Create new user
router.post('/signup', async (req, res, next)=>{
  
  try{
    console.log(req.body);

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
      console.log('This email is already in user, try again!');
      res.redirect('/');
      return;
    }

    const user = await User.create(newUser);

    if(user){
      console.log('Created user', req.body);
      req.logIn(user, (error, user)=>{
        res.redirect('/profile');
      })
    }
  }catch(error){
    console.log(error);
    next(error);
  }

});

//Login user
router.post('/login', passport.authenticate('local', {
  successRedirect: "/profile",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));

//Log out user
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/');
});

//Get user profile if user is already logged in
router.get('/profile', ensureLogin.ensureLoggedIn('/'), (req, res, next)=>{
  console.log('You sir are logged in');
  res.render('profile', {message: 'You sir are logged in!'});
});

module.exports = router;