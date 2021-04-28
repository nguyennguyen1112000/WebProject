const exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
module.exports = function(app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        layoutsDir: 'views/_layouts',
        partialsDir: 'views/_partials',
        helpers: {
            section: hbs_sections(),

        },

    }));
    app.set('view engine', 'hbs');
}