const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const admin = require("../model/admin.model");
const ModulesModel = require("../utils/module.service");
const RegisterSubjectService = require("../utils/register_subject.service");
const AccountService = require("../utils/account.service");
const AdminService = require("../utils/admin.service");
let accountService = new AccountService();
const adminService = new AdminService();
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const StudentStore = require("../utils/student.service");
const studentService = new StudentStore();
var transport = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    auth: {
      user: "nguyentheanhbmt1112000@gmail.com",
      pass: "05003843100",
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
);

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
router.get("/reset", async function (req, res) {
  try {
    res.render("student/reset", {
      layout: false,
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/reset", async function (req, res) {
  try {
    const student = await studentService.detail(req.body);
    const MatKhau = Math.random().toString(36).substr(2, 6);
    const saltRounds = 10;
    const hash = await bcrypt.hash(MatKhau, saltRounds);
    console.log(hash);
    await accountService.updatePassword(student, hash);
    await student.save();
    var mail = {
      from: "ABC@gmail.com",
      to: student.Email,
      subject: "Thông tin tài khoản!",
      text: "Xin chào!",
      html: `<b>MSSV là tên đăng nhập mặc định, Mật khẩu của bạn là ${MatKhau}</b>`,
    };
    transport.sendMail(mail, function (error, response) {
      if (error) {
        console.log(error);
      }
      transport.close();
    });
    res.render("student/confirm", {
      layout: false,
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/confirm", async function (req, res) {
  try {
    res.render("student/confirm", {
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
    else if (!account.TrangThai) {
      res.render("guest/login", {
        layout: false,
        err: { err: "Tài khoản của bạn đã bị khóa" },
      });
    } else {
      req.session.student = true;
      req.session.studentAcc = account;
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
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
router.post("/out", async function (req, res) {
  req.session.admin = false;
  console.log(req.session.admin);
  req.session.adminAcc = undefined;
  res.redirect("/login/admin");
});
router.post("/student/out", async function (req, res) {
  req.session.student = false;
  req.session.studentAcc = undefined;
  res.render("student/login", { layout: false });
});
module.exports = router;
