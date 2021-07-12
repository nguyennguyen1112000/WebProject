const { mutipleMongooseToObject } = require("../utils/mongoose");
module.exports = function (app) {
  app.use(async function (req, res, next) {
    if (req.session.admin == undefined) req.session.admin = false;
    if (req.session.student == undefined) req.session.student = false;
    res.locals.admin = req.session.admin;
    res.locals.adminAcc = req.session.adminAcc;
    res.locals.student = req.session.student;
    res.locals.studentAcc = req.session.studentAcc;
    next();
  });
  app.use(async function (req, res, next) {
    if (req.session.confirm == undefined) req.session.confirm = null;
    if (req.session.DKHP == undefined) req.session.DKHP = null;
    res.locals.DKHP = req.session.DKHP;
    if (req.session.DKHP != null) res.locals.step_on = true;
    else res.locals.step_on = false;
    next();
  });
};
