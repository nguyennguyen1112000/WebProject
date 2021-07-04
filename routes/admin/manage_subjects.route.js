const express = require("express");
const Schema = require("mongoose");
const teachers = require("../../model/teachers.model");
const router = express.Router();
const {
  mutipleMongooseToObject,
  singleMongooseToObject,
} = require("../../utils/mongoose");
const mongoose = require("../../utils/mongoose");
const ModuleService = require("../../utils/module.service");
const RegisterSubjectService = require("../../utils/register_subject.service");
const SubjectService = require("../../utils/subject.service");
let moduleService = new ModuleService();
let registerSubjectService = new RegisterSubjectService();
const subjectService = new SubjectService();

router.get("/list", async function (req, res) {
  try {
    const list = await subjectService.all();
    res.render("admin/manage_subject/subjects_list", {
      list: mutipleMongooseToObject(list),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/students_list/:MaHP", async function (req, res) {
  try {
    const result = await subjectService.detail(req.params);
    res.render("admin/manage_subject/subjects_students_list", {
      detail: singleMongooseToObject(result),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/add", async function (req, res) {
  try {
    const tea = await teachers.find({});
    const mods = await moduleService.all();
    res.render("admin/manage_subject/subjects_add", {
      list_GV: mutipleMongooseToObject(tea),
      list_MonHoc: mutipleMongooseToObject(mods),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/add", async function (req, res) {
  try {
    let obj = req.body;
    var GVLyThuyet, GVThucHanh;
    if (typeof obj.GVLyThuyet == "string") GVLyThuyet = [obj.GVLyThuyet];
    else GVLyThuyet = obj.GVLyThuyet;
    if (typeof obj.GVThucHanh == "string") GVThucHanh = [obj.GVThucHanh];
    else GVThucHanh = obj.GVThucHanh;
    GVLyThuyet.forEach((gv) => new Schema.Types.ObjectId(gv));
    GVThucHanh.forEach((gv) => new Schema.Types.ObjectId(gv));
    if (obj.LichHocTH) {
      if (!Array.isArray(obj.LichHocTH)) {
        obj.LichHocTH = [obj.LichHocTH];
      }
      obj.LichHocTH = obj.LichHocTH.map((item) => {
        return { ThoiGian: item };
      });
    }
    await subjectService.add(obj);
    res.render("admin/manage_subject/subjects_add");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/edit", async function (req, res) {
  try {
    const list = await subjectService.all();
    res.render("admin/manage_subject/subjects_edit", {
      list: mutipleMongooseToObject(list),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/edit/:MaHP", async function (req, res) {
  const condition = req.params;
  const obj = await subjectService.detail(condition);
  const tea = await teachers.find({});
  const mods = await moduleService.all();
  try {
    res.render("admin/manage_subject/subjects_edit_info", {
      detail: singleMongooseToObject(obj),
      list_GV: mutipleMongooseToObject(tea),
      list_mod: mutipleMongooseToObject(mods),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/students_list/edit/:MaHP", async function (req, res) {
  try {
    condition = req.params;
    const subject = await subjectService.detail(condition);
    const { SoNhomTH } = subject;
    res.render("admin/manage_subject/subjects_students_list_edit", {
      list: mongoose.singleMongooseToObject(subject),
      ThucHanh: { SoNhomTH: SoNhomTH },
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/edit", async function (req, res) {
  try {
    condition = { MaHP: req.body.MaHP };
    let obj = req.body;
    var GVLyThuyet, GVThucHanh;
    if (typeof obj.GVLyThuyet == "string") GVLyThuyet = [obj.GVLyThuyet];
    else GVLyThuyet = obj.GVLyThuyet;
    if (typeof obj.GVThucHanh == "string") GVThucHanh = [obj.GVThucHanh];
    else GVThucHanh = obj.GVThucHanh;
    GVLyThuyet.forEach((gv) => new Schema.Types.ObjectId(gv));
    GVThucHanh.forEach((gv) => new Schema.Types.ObjectId(gv));
    if (obj.LichHocTH) {
      if (!Array.isArray(obj.LichHocTH)) {
        obj.LichHocTH = [obj.LichHocTH];
      }
      obj.LichHocTH = obj.LichHocTH.map((item) => {
        return { ThoiGian: item };
      });
    }
    await subjectService.update(condition, obj);
    res.json({ success: "Cập nhật học phần thành công!" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/add_students/:MaHP", async function (req, res) {
  condition = req.params;
  data = req.body;
  try {
    await subjectService.addStudent(req.body, req.params);
    res.json({ success: "Thành công" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/open", async function (req, res) {
  try {
    res.render("admin/subject_open/subjects_open");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/open/edit/:MaDKHP", async function (req, res) {
  try {
    condition = req.params;
    const result = await registerSubjectService.detail(condition);
    const subjects = await subjectService.byCondition(condition);
    res.render("admin/subject_open/subjects_open_edit", {
      detail: singleMongooseToObject(result),
      list: mutipleMongooseToObject(subjects),
      empty: subjects.length === 0,
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/open/step2", async function (req, res) {
  try {
    if (req.session.DKHP) {
      condition = { MaDKHP: req.session.DKHP.MaDKHP };
      const result = await subjectService.byCondition(condition);
      res.render("admin/subject_open/subjects_open_step2", {
        list: mutipleMongooseToObject(result),
        empty: result.length == 0,
      });
    } else {
      res.redirect("/subjects/open");
    }
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/open/step2", async function (req, res) {
  try {
    req.session.DKHP = JSON.parse(JSON.stringify(req.body));
    condition = { MaDKHP: req.body.MaDKHP };
    const result = await subjectService.byCondition(condition);
    res.render("admin/subject_open/subjects_open_step2", {
      list: mutipleMongooseToObject(result),
      empty: result.length == 0,
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/open/reset", async function (req, res) {
  try {
    req.session.DKHP = null;
    res.redirect("/subjects/open");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/open/finish", async function (req, res) {
  try {
    ss = req.session.DKHP;
    await registerSubjectService.add(ss);
    req.session.DKHP = null;
    res.redirect(`/subjects/open/detail/${ss.MaDKHP}`);
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/open/detail/:MaDKHP", async function (req, res) {
  try {
    condition = req.params;
    const result = await registerSubjectService.detail(condition);
    const subjects = await subjectService.byCondition(condition);
    res.render("admin/subject_open/subjects_open_detail", {
      detail: singleMongooseToObject(result),
      list: mutipleMongooseToObject(subjects),
      empty: subjects.length === 0,
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/open/list", async function (req, res) {
  try {
    const results = await registerSubjectService.all();
    res.render("admin/subject_open/subjects_open_list", {
      list: mutipleMongooseToObject(results),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

//DELETE
router.delete("/delete_students/:MaHP", async function (req, res) {
  condition = req.params;
  data = req.body;
  try {
    await subjectService.deleteStudent(condition, data);
    res.json({ success: "Thành công" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/delete/:MaHP", async function (req, res) {
  try {
    const condition = req.params;
    await subjectService.delete(condition);
    res.json({ succ: "Xóa học phần thành công" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

//Kiểm tra
router.post("/check/DKHP/:MaDKHP", async function (req, res) {
  try {
    const result = await registerSubjectService.detail(req.params);
    if (result == null) res.json({ exist: false });
    else res.json({ exist: true });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
module.exports = router;
