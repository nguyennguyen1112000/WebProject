const express = require("express");
const router = express.Router();
const modules = require("../../model/modules.model");
const {
  mutipleMongooseToObject,
  singleMongooseToObject,
} = require("../../utils/mongoose");
const ModuleService = require("../../utils/module.service");
const MajorService = require("../../utils/major.service");
const SpecicalityService = require("../../utils/specicality.service");
const majorService = new MajorService();
const specialityService = new SpecicalityService();
const moduleService = new ModuleService();

router.get("/list", async function (req, res) {
  try {
    const results = await moduleService.all();
    res.render("admin/manage_module/modules_list", {
      list: mutipleMongooseToObject(results),
      empty: results.length == 0,
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/add", async function (req, res) {
  const results = await moduleService.all();
  const major = await majorService.all();
  try {
    res.render("admin/manage_module/modules_add", {
      list: mutipleMongooseToObject(results),
      Majors: mutipleMongooseToObject(major),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/edit", async function (req, res) {
  const results = await moduleService.all();
  const major = await majorService.all();
  try {
    res.render("admin/manage_module/modules_edit", {
      list: mutipleMongooseToObject(results),
      Majors: mutipleMongooseToObject(major),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/edit/:MaMonHoc", async function (req, res) {
  try {
    const conditon = req.params;
    const result = await moduleService.detail(conditon);
    const majors = await majorService.all();
    const specialities = await specialityService.byMajor(result.Nganh._id);
    res.render("admin/manage_module/modules_edit_detail", {
      detail: singleMongooseToObject(result),
      Majors: mutipleMongooseToObject(majors),
      Specicalities: mutipleMongooseToObject(specialities),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/byMajor", async function (req, res) {
  try {
    const speciality = await specialityService.byMajor(req.body);
    res.json(speciality);
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/add", async function (req, res) {
  try {
    let module = req.body;
    if (module.ChuyenNganh === "") module.ChuyenNganh = null;
    module.SoGioTC = {
      LyThuyet: +module.LyThuyet,
      ThucHanh: +module.ThucHanh,
      TuHoc: +module.TuHoc,
    };
    await moduleService.add(module);
    res.json({ succ: "Thành công" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/edit/:MaMonHoc", async function (req, res) {
  try {
    let update = req.body;
    if (update.ChuyenNganh === "") update.ChuyenNganh = null;
    update.SoGioTC = {
      LyThuyet: +update.LyThuyet,
      ThucHanh: +update.ThucHanh,
      TuHoc: +update.TuHoc,
    };
    await moduleService.patch(req.params, update);
    res.json({ succ: "Cập nhật thành công" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/delete/:MaMonHoc", async function (req, res) {
  try {
    console.log(req.params)
    await moduleService.delete(req.params);
    res.json({ succ: "Xóa môn học thành công" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
module.exports = router;
