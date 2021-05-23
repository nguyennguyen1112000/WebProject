module.exports = function (app) {

    app.use('/students', require('../routes/manage_students.route'));
    app.use('/modules', require('../routes/manage_modules.route'));
    app.use('/subjects', require('../routes/manage_subjects.route'));
    app.use('/marks', require('../routes/manage_marks.route'));
    app.use('/login', require('../routes/login.route'));
    app.use('/account', require('../routes/manage_accounts.route'));


    
}
