const category = require('../model/Category.model')
const { mutipleMongooseToObject } = require('../utils/mongoose')
module.exports = function(app) {
    app.use(async function(req, res, next) {
        var temp;
        category.find({}, function(err, categ) {
            res.locals.category = mutipleMongooseToObject(categ);
            next();
        });

    })
  



}