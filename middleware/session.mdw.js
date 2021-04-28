var session = require('express-session')

module.exports = function(app) {
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }))
    app.use(function(req, res, next) {

        next();
    });
}