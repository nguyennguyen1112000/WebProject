const auth = require("../auth.mdw");
module.exports = function (app) {
  app.use(
    "/students",
    auth,
    require("../../routes/admin/manage_students.route")
  );
  app.use("/modules", auth, require("../../routes/admin/manage_modules.route"));
  app.use(
    "/subjects",
    auth,
    require("../../routes/admin/manage_subjects.route")
  );
  app.use("/marks", auth, require("../../routes/admin/manage_marks.route"));
  app.use("/login", require("../../routes/login.route"));
  app.use("/account", require("../../routes/admin/manage_accounts.route"));
  app.use("/admin", require("../../routes/admin/admin.route"));
};
