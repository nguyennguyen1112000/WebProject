const express = require("express");
const router = express.Router();
const {
  mutipleMongooseToObject,
  singleMongooseToObject,
} = require("../../utils/mongoose");
router.get("/register/subject", async function (req, res) {
  try {
    res.render("student/register_subjects");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/", async function (req, res) {
  try {
    res.render("student/dashboard");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

module.exports = router;
