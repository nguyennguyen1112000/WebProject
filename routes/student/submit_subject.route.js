const express = require("express");
const router = express.Router();
const Schema = require("mongoose");
const subjects = require("../../model/subjects.model");
const mongoose = require("../../utils/mongoose");
const RegisterSubjectService = require("../../utils/register_subject.service");
const registerSubjectService = new RegisterSubjectService();
const StudentService = require("../../utils/student.service");
const studentService = new StudentService();
const HistoryService = require("../../utils/history_subject.service");
const historyService = new HistoryService();
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
    const student = await studentService.findById(
      req.session.studentAcc.SinhVien
    );
    const results = await historyService.all(student.MSSV);
    res.render("student/subject_history", {
      list: mutipleMongooseToObject(results),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/result", async function (req, res) {
  try {
    const student = req.session.studentAcc;
    const id = student.SinhVien;
    const results = await studentService.education(id, req.query.filter);
    var filter = await studentService.filterEducation(id);
    filter = filter.map((obj) => {
      return { filter: obj };
    });
    res.render("student/subject_result", {
      list: mutipleMongooseToObject(results),
      filters: filter,
    });
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
    var forbidden = [];
    var passPrevious = [];
    var allowed = [];
    for (let i = 0; i < subjects.length; i++) {
      const check = await subjectService.forbiddenSubject(
        subjects[i],
        req.session.studentAcc.SinhVien
      );
      if (check) forbidden.push(subjects[i]);
    }

    for (let i = 0; i < subjects.length; i++) {
      const check = await subjectService.passPreviousModule(
        req.session.studentAcc.SinhVien,
        subjects[i]
      );
      if (!check) passPrevious.push(subjects[i]);
    }
    for (let i = 0; i < subjects.length; i++) {
      const check1 = await subjectService.passPreviousModule(
        req.session.studentAcc.SinhVien,
        subjects[i]
      );
      const check2 = !(await subjectService.forbiddenSubject(
        subjects[i],
        req.session.studentAcc.SinhVien
      ));
      const check3 = !subjectService.containStudent(subjects[i], student);
      if (check1 && check2 && check3) allowed.push(subjects[i]);
    }
    res.render("student/submit_subject_detail", {
      detail: singleMongooseToObject(result),
      list: mutipleMongooseToObject(allowed),
      subjects: mutipleMongooseToObject(registered),
      forbiddens: mutipleMongooseToObject(forbidden),
      previouss: mutipleMongooseToObject(passPrevious),
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
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/delete/:MaHP", async function (req, res) {
  try {
    const studentId = req.session.studentAcc.SinhVien;
    const student = await studentService.findById(studentId);
    const subject = await subjectService.detail(req.params);
    await subjectService.deleteStudent(req.params, { MSSV: student.MSSV });
    await historyService.add({
      SinhVien: student.MSSV,
      HocPhan: subject._id,
      TinhTrang: false,
    });
    res.json({ success: "Hủy học phần thành công" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
module.exports = router;
