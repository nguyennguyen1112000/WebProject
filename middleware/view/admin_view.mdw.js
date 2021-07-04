const exphbs = require("express-handlebars");
module.exports = function (app) {
  app.engine(
    "hbs",
    exphbs({
      defaultLayout: "main.hbs",
      extname: ".hbs",
      layoutsDir: "views/_admin_view/_layouts",
      partialsDir: "views/_admin_view/_partials",
      helpers: require("../other.mdw").helpers,
    })
  );
  app.set("view engine", "hbs");
};
