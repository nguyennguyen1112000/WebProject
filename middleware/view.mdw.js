const exphbs = require('express-handlebars');
module.exports = function(app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        layoutsDir: 'views/_layouts',
        partialsDir: 'views/_partials',
        helpers: 
            require("./other.mdw").helpers

        ,

    }));
    app.set('view engine', 'hbs');
}