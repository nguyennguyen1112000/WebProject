const express = require("express");
const router = express.Router();
const {
  mutipleMongooseToObject,
  singleMongooseToObject,
} = require("../../utils/mongoose");
const AccountService = require("../../utils/account.service");
let accountService = new AccountService();

router.get("/manage", async function (req, res) {
  try {
    const results = await accountService.all();
    res.render("admin/account/accounts", {
      list: mutipleMongooseToObject(results),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

module.exports = router;
