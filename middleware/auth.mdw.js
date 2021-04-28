module.exports = function auth(req, res, next) {
    if (req.session.admin === false) {
      return res.redirect('/login/admin');
    }
  
    next();
  }
 