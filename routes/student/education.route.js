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
    const student = req.session.studentAcc;
    const id = student.SinhVien;
    const results = await studentService.education(id,req.query.filter);
    var filter = await studentService.filterEducation(id);
    filter = filter.map((obj) => {
      return { filter: obj };
    });
    res.render("student/education", {
      list: mutipleMongooseToObject(results),
      filters: filter,
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

module.exports = router;
