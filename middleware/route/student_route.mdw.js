module.exports = function (app) {
  app.use("/login", require("../../routes/login.route"));
  app.use("/dashboard", require("../../routes/student/dashboard.route"));
  app.use(
    "/submit/subject",
    require("../../routes/student/submit_subject.route")
  );
  app.use("/education", require("../../routes/student/education.route"));
  app.use("/profile", require("../../routes/student/profile.route"));
};
