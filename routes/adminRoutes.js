const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Admin = require('../models/admin/Admin');
const ensureLogin = require('connect-ensure-login');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Get admin page
router.get('/admin', (req, res, next) => {
  res.render('admin');
});

//Create new admin
router.post('/createAdmin', ensureLogin.ensureLoggedIn('/admin'), async (req, res, next)=>{
  
  try{

    const pass = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassWord =  bcrypt.hashSync(pass, salt);

    let newAdmin = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassWord,
    };

    const email = await Admin.findOne({email: req.body.email});

    if(email){
      req.flash('error', 'This Admin already exists');
      res.redirect('/admin');
      return;
    }

    const admin = await Admin.create(newAdmin);

    if(admin){
      console.log('Created user', req.body);
      req.logIn(admin, (error, user)=>{
        res.redirect('/adminDashboard');
      });
    }
  }catch(error){
    console.log(error);
    next(error);
  }

});

//Login admin
router.post('/adminLogin', passport.authenticate('local', {
  successRedirect: "/adminDashboard",
  failureRedirect: "/admin",
  failureFlash: true,
  passReqToCallback: true
}));

//Log out user
router.get('/adminLogout', (req, res, next)=>{
  req.logout();
  res.redirect('/admin');
});

//Get admin dashboard if user is already logged in
router.get('/adminDashboard', ensureLogin.ensureLoggedIn('/admin'), (req, res, next)=>{
  console.log('You sir are logged in as Admin');
  res.render('adminDashboard', {message: 'You sir are logged in as Admin!'});
});

module.exports = router;