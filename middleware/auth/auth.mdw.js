module.exports = {
  Auth: function (req, res, next) {
    if (req.session.admin === false) {
      return res.redirect("/login/admin");
    }
    next();
  },
  StudentAuth: function (req, res, next) {
    if (req.session.student === false) {
      return res.redirect("/login/student");
    }
    next();
  },
  Logged: function (req, res, next) {
    console.log(req.session.admin);
    if (req.session.admin === true) {
      return res.redirect("/students/upload");
    }
    next();
  },
  LoggedStudent: function (req, res, next) {
    if (req.session.student === true) {
      return res.redirect("/dashboard");
    }
    next();
  },
};
