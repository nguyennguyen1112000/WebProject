const category = require('../model/Category.model')
const { mutipleMongooseToObject } = require('../utils/mongoose')
module.exports = function(app) {
    app.use(async function(req, res, next) {
        var temp;
        category.find({}, function(err, categ) {
            res.locals.category = mutipleMongooseToObject(categ)
            next()
        });

    })
    app.use(async function(req, res, next) {
        if(req.session.admin == undefined) req.session.admin = false
        res.locals.admin = req.session.admin
        next()

    })
    app.use(async function(req, res, next) {
        if(req.session.DKHP == undefined) req.session.DKHP=null
        res.locals.DKHP = req.session.DKHP
        if(req.session.DKHP != null)  res.locals.step_on = true
        else res.locals.step_on = false
        next()

    })
  



}