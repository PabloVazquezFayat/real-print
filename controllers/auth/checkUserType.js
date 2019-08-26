exports.checkUserType = (req, res, next, routes)=>{
  if(req.user.type === 'admin'){
    res.redirect(routes.admin);
    next();
  }else{
    res.redirect(routes.user);
    next();
  }
}

exports.admin = async (req, res, next, routes) => {
  if(req.user.type === 'admin'){
    res.render(routes.admin, {message: req.user.type});
  }else{
    res.redirect(routes.failure);
    next();
  }
}

exports.user = async (req, res, next, routes) => {
  if(req.user.type === 'user'){
    res.render(routes.user, {message: req.user.type});
  }else{
    res.redirect(routes.failure);
    next();
  }
}
