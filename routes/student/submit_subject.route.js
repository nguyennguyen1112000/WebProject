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
    const result = await registerSubjectService.inProgress();
    res.render("student/submit_subject", {
      detail: singleMongooseToObject(result),
      empty: result === null,
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/history", async function (req, res) {
  try {
    const result = await registerSubjectService.inProgress();
    res.render("student/subject_history");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/result", async function (req, res) {
  try {
    const result = await registerSubjectService.inProgress();
    res.render("student/subject_result");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/manage", async function (req, res) {
  try {
    res.render("student/subject_manage");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/:MaDKHP", async function (req, res) {
  try {
    const result = await registerSubjectService.detail(req.params);
    let subjects = await subjectService.byCondition(req.params);
    const student = req.session.studentAcc.SinhVien;
    registered = subjects.filter((obj) =>
      subjectService.containStudent(obj, student)
    );
    subjects = subjects.filter(
      (obj) => !subjectService.containStudent(obj, student)
    );
    res.render("student/submit_subject_detail", {
      detail: singleMongooseToObject(result),
      list: mutipleMongooseToObject(subjects),
      subjects: mutipleMongooseToObject(registered),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/:MaDKHP", async function (req, res) {
  try {
    const student = req.session.studentAcc.SinhVien;
    await studentService.submitSubject(req.body, student);
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
module.exports = router;
