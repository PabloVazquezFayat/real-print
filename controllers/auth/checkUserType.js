const express = require('express');

exports.checkUserType = async (req, res , next, routes) => {
  try{
    if(req.user.type === 'admin'){
      res.redirect(routes.admin);
      return;
    }else{
      res.redirect(routes.user);
      return;
    }
  }catch(error){
    next(error);
  }
  res.redirect(routes.failure);
}; 

exports.admin = async (req, res, next, routes) => {
  try{
    if(req.user.type === 'admin'){
      return res.render(routes.admin, {message: req.user.type});
    }else{
      return res.redirect(routes.failure);
    }
  }catch(error){
    next(error)
  }
}

exports.user = async (req, res, next, routes) => {
  try{
    if(req.user.type === 'user'){
      return res.render(routes.user, {message: req.user.type});
    }else{
      res.redirect(routes.failure);
    }
  }catch(error){
    next(error);
  }
}