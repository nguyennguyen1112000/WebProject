const express = require("express");
const router = express.Router();
const admins = require("../../model/admin.model");

router.get("/profile", async function (req, res) {
  try {
    res.render("admin/profile/profile");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/dashboard", async function (req, res) {
  try {
    res.render("admin/dashboard/dashboard");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/profile", async function (req, res) {
  try {
    let info = new admins(req.body);
    await info.save();
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

module.exports = router;
