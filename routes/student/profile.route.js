const express = require("express");
const router = express.Router();
const Schema = require("mongoose");
const subjects = require("../../model/subjects.model");
const mongoose = require("../../utils/mongoose");
const RegisterSubjectService = require("../../utils/register_subject.service");
const registerSubjectService = new RegisterSubjectService();
const StudentService = require("../../utils/student.service");
const studentService = new StudentService();
const {
  mutipleMongooseToObject,
  singleMongooseToObject,
} = require("../../utils/mongoose");
const SubjectService = require("../../utils/subject.service");
const subjectService = new SubjectService();
router.get("/", async function (req, res) {
  try {
    const student = await studentService.findById(
      req.session.studentAcc.SinhVien
    );
    res.render("student/profile", {
      detail: singleMongooseToObject(student),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/residence", async function (req, res) {
  try {
    const results = await studentService.allResidence(
      req.session.studentAcc.SinhVien
    );
    res.render("student/residence", {
      list: mutipleMongooseToObject(results),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/residence", async function (req, res) {
  try {
    const id = req.session.studentAcc.SinhVien;
    await studentService.addResidence(id, req.body);
    res.redirect("/profile/residence");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/residence/update/:index", async function (req, res) {
  try {
    const index = req.params.index;
    const id = req.session.studentAcc.SinhVien;
    await studentService.updateResidence(id, req.body, index);
    res.json({ success: "Cập nhật thành công" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/residence/delete/:index", async function (req, res) {
  try {
    const index = req.params.index;
    const id = req.session.studentAcc.SinhVien;
    await studentService.deleteResidence(id, index);
    res.json({ success: "Xóa thành công" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
module.exports = router;
