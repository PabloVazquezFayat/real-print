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

//Login user or admin
router.post('/login', passport.authenticate('local', {failureRedirect: '/'}),
  async (req, res, next)=>{
    try{
      if(req.user.type === 'admin'){
        res.redirect('/adminDashboard');
        return;
      }else{
        res.redirect('/profile');
        return;
      }
    }catch(error){
      next(error);
    }
    res.redirect('/');
  }
);

//Log out user
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/');
});

//Get user profile if user is already logged in
router.get('/profile', ensureLogin.ensureLoggedIn('/'), (req, res, next)=>{
  if(req.user.type === 'user'){
    return res.render('profile', {message: req.user.type});
  }else{
    res.redirect('/');
  }
});

router.get('/adminDashboard', ensureLogin.ensureLoggedIn('/'), (req, res, next)=>{
  if(req.user.type === 'admin'){
    return res.render('adminDashboard', {message: req.user.type});
  }else{
    res.redirect('/');
  }
});

module.exports = router;