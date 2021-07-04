const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const admin = require("../model/admin.model");
const {
  mutipleMongooseToObject,
  singleMongooseToObject,
} = require("../utils/mongoose");
const ModulesModel = require("../utils/module.service");
const RegisterSubjectService = require("../utils/register_subject.service");
const AccountService = require("../utils/account.service");
const AdminService = require("../utils/admin.service");
let accountService = new AccountService();
const adminService = new AdminService();
const registerSubjectService = new RegisterSubjectService();

router.get("/admin", async function (req, res) {
  try {
    res.render("guest/login", {
      layout: false,
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/student", async function (req, res) {
  try {
    res.render("student/login", {
      layout: false,
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/student", async function (req, res) {
  try {
    const { TenDangNhap, MatKhau } = req.body;
    const account = await accountService.Login(TenDangNhap, MatKhau);
    if (!account)
      res.render("guest/login", {
        layout: false,
        err: { err: "Tên đăng nhập hoặc mật khẩu không chính xác" },
      });
    else {
      req.session.student = true;
      req.session.studentAcc = account;
      console.log(req.session.studentAcc);
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/out", async function (req, res) {
  req.session.admin = false;
  req.session.adminAcc = undefined;
  res.render("guest/login", { layout: false });
});

router.post("/admin", async function (req, res) {
  try {
    const { TenDangNhap, MatKhau } = req.body;
    const admin = await adminService.Login(TenDangNhap, MatKhau);
    if (!admin)
      res.render("guest/login", {
        layout: false,
        err: { err: "Tên đăng nhập hoặc mật khẩu không chính xác" },
      });
    else {
      req.session.admin = true;
      req.session.adminAcc = admin;
      res.redirect("/students/upload");
    }
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
module.exports = router;
