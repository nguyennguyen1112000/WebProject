const { Auth, Logged } = require("../auth/auth.mdw");
module.exports = function (app) {
  app.use(
    "/students",
   
    require("../../routes/admin/manage_students.route")
  );
  app.use("/modules", Auth, require("../../routes/admin/manage_modules.route"));
  app.use(
    "/subjects",
    Auth,
    require("../../routes/admin/manage_subjects.route")
  );
  app.use("/marks", Auth, require("../../routes/admin/manage_marks.route"));
  app.use("/login",  require("../../routes/login.route"));
  app.use(
    "/account",
    Auth,
    require("../../routes/admin/manage_accounts.route")
  );
  app.use("/admin", Auth, require("../../routes/admin/admin.route"));
};
