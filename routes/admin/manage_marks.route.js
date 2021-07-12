const express = require("express");
const router = express.Router();
const subjects = require("../../model/subjects.model");
const teachers = require("../../model/teachers.model");
const StudentService = require("../../utils/student.service");
const studentService = new StudentService();
const reader = require("xlsx");
const {
  mutipleMongooseToObject,
  singleMongooseToObject,
} = require("../../utils/mongoose");
const mongoose = require("../../utils/mongoose");
const SubjectService = require("../../utils/subject.service");
let subjectService = new SubjectService();
const { upload, parseFile } = require("../../utils/file.service");
router.get("/list_bySubject", async function (req, res) {
  const subject = await subjectService.all();
  try {
    res.render("admin/manage_marks/marks_list_bySubject", {
      list: mutipleMongooseToObject(subject),
    });
  } catch (err) {}
});

router.get("/list_byStudent", async function (req, res) {
  try {
    const students = await studentService.all();
    res.render("admin/manage_marks/marks_list_byStudent", {
      list: mutipleMongooseToObject(students),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/students/:MSSV", async function (req, res) {
  const result = await studentService.detail(req.params);
  res.render("admin/manage_marks/marks_students", {
    student: singleMongooseToObject(result),
  });
});
router.get("/subjects/:MaHP", async function (req, res) {
  try {
    condition = req.params;
    const result = await subjectService.detail(condition);
    res.render("admin/manage_marks/marks_subjects", {
      HocPhan: mongoose.singleMongooseToObject(result),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/update/subject/:MaHP", async function (req, res) {
  try {
    condition = req.params;
    finish = req.query.finish;
    data = req.body.data;
    await subjectService.updateMark(data, condition, finish);
    res.json({ mess: "Đã lưu cập nhật điểm" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/update/student/:MSSV", async function (req, res) {
  condition = req.params;
  data = req.body.data;
  await studentService.updateMarks(condition, data);
  res.json({ mess: "Đã lưu cập nhật" });
});

router.get("/upload", async function (req, res) {
  try {
    const subject = await subjectService.all();
    res.render("admin/manage_marks/marks_list_bySubject_upload", {
      list: mutipleMongooseToObject(subject),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/upload/:MaHP", async function (req, res) {
  try {
    condition = req.params;
    result = await subjectService.detail(condition);
    res.render("admin/manage_marks/marks_upload", {
      list: singleMongooseToObject(result),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/upload/:MaHP", upload, async function (req, res) {
  try {
    console.log(req.params);
    if (req.query.update) {
      condition = req.params;
      finish = req.query.finish;
      data = req.body.data;
      await subjectService.updateMark(data, condition, finish);
      res.json({ succ: "Cập nhật điểm thành công" });
    } else {
      if (req.file == undefined) {
        res.render("admin/manage_marks/marks_upload", {
          msg: "Error: No File Selected!",
        });
      } else {
        filepath = `resources/uploads/${req.file.filename}`;
        const file = reader.readFile(filepath);
        const data = parseFile(file);
        const results = await subjectService.detail(req.params);
        docs = JSON.parse(JSON.stringify(results));
        console.log(req.params);
        docs.DSSinhVien.forEach((obj) => {
          data.forEach((dt) => {
            if (obj.SinhVien.MSSV == dt.MSSV) {
              if (obj.DiemTK != dt.DiemTK) {
                obj.Difference = false;
                obj.GhiChu = `Điểm cũ: ${obj.DiemTK}`;
              } else obj.Difference = true;
              obj.DiemTK = dt.DiemTK;
            }
          });
        });
        res.render("admin/manage_marks/marks_upload", {
          list: JSON.parse(JSON.stringify(docs)),
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
