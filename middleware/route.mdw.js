module.exports = function (app) {

    app.use('/students', require('../routes/mange_students.route'));
    app.use('/modules', require('../routes/mange_modules.route'));
}
