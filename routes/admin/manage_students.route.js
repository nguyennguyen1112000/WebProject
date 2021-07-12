const express = require("express");
const router = express.Router();
const {
  mutipleMongooseToObject,
  singleMongooseToObject,
} = require("../../utils/mongoose");
const reader = require("xlsx");
const StudentService = require("../../utils/student.service");
const studentService = new StudentService();
const majors = require("../../model/major.model");
const { upload, parseFile } = require("../../utils/file.service");

let provinces = [
  { province: "An Giang" },
  { province: "Bà Rịa - Vũng Tàu" },
  { province: "Bắc Giang" },
  { province: "Bắc Kạn" },
  { province: "Bạc Liêu" },
  { province: "Bắc Ninh" },
  { province: "Bến Tre" },
  { province: "Bình Định" },
  { province: "Bình Dương" },
  { province: "Bình Phước" },
  { province: "Bình Thuận" },
  { province: "Cà Mau" },
  { province: "Cao Bằng" },
  { province: "Đắk Lắk" },
  { province: "Đắk Nông" },
  { province: "Điện Biên" },
  { province: "Đồng Nai" },
  { province: "Đồng Tháp" },
  { province: "Gia Lai" },
  { province: "Hà Giang" },
  { province: "Hà Nam" },
  { province: "Hà Tĩnh" },
  { province: "Hải Dương" },
  { province: "Hậu Giang" },
  { province: "Hòa Bình" },
  { province: "Hưng Yên" },
  { province: "Khánh Hòa" },
  { province: "Kiên Giang" },
  { province: "Kon Tum" },
  { province: "Lai Châu" },
  { province: "Lâm Đồng" },
  { province: "Lạng Sơn" },
  { province: "Lào Cai" },
  { province: "Long An" },
  { province: "Nam Định" },
  { province: "Nghệ An" },
  { province: "Ninh Bình" },
  { province: "Ninh Thuận" },
  { province: "Phú Thọ" },
  { province: "Quảng Bình" },
  { province: "Quảng Nam" },
  { province: "Quảng Ngãi" },
  { province: "Quảng Ninh" },
  { province: "Quảng Trị" },
  { province: "Sóc Trăng" },
  { province: "Sơn La" },
  { province: "Tây Ninh" },
  { province: "Thái Bình" },
  { province: "Thái Nguyên" },
  { province: "Thanh Hóa" },
  { province: "Thừa Thiên Huế" },
  { province: "Tiền Giang" },
  { province: "Trà Vinh" },
  { province: "Tuyên Quang" },
  { province: "Vĩnh Long" },
  { province: "Vĩnh Phúc" },
  { province: "Yên Bái" },
  { province: "Phú Yên" },
  { province: "Cần Thơ" },
  { province: "Đà Nẵng" },
  { province: "Hải Phòng" },
  { province: "Hà Nội" },
  { province: "TP HCM" },
];
router.post("/delete", async function (req, res) {
  try {
    console.log(12)
    await studentService.deleteAll();
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});


router.get("/upload", async function (req, res) {
  try {
    res.render("admin/manage_student/students_upload");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/add-new", async function (req, res) {
  try {
    const major = await majors.find({});
    res.render("admin/manage_student/students_add_new", {
      provinces: provinces,
      majors: mutipleMongooseToObject(major),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/find", async function (req, res) {
  try {
    if (req.query.text_search == undefined) {
      res.render("admin/manage_student/students_find");
    } else {
      const students = await studentService.find({
        $text: { $search: req.query.text_search },
      });
      res.render("admin/manage_student/students_find", {
        list: mutipleMongooseToObject(students),
        empty: students.length == 0,
      });
    }
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.get("/edit-info/:MSSV", async function (req, res) {
  const condition = req.params;
  try {
    let student = await studentService.detail(condition);
    let major = await majors.find({});
    res.render("admin/manage_student/students_edit_detail", {
      detail: singleMongooseToObject(student),
      province: provinces,
      majors: mutipleMongooseToObject(major),
    });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/edit-info", async function (req, res) {
  try {
    if (req.query.text_search == undefined) {
      res.render("admin/manage_student/students_edit_info");
    } else {
      const students = await studentService.find({
        $text: { $search: req.query.text_search },
      });
      res.render("admin/manage_student/students_edit_info", {
        list: mutipleMongooseToObject(students),
        empty: students.length == 0,
      });
    }
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.get("/search/:id", async function (req, res) {
  try {
    const found = await studentService.detail({
      $text: { $search: req.params.id },
    });
    if (!found) res.json({ mess: "MSSV không hợp lệ!" });
    else res.json({ name: found.HoLot + " " + found.Ten });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
router.post("/add-new", async function (req, res) {
  try {
    const result = await studentService.addOne(req.body);
    if (result == false) res.json({ err: "Sinh viên này đã tồn tại" });
    else res.json({ succ: "Thêm thành công sinh viên" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/update", async function (req, res) {
  try {
    condition = { MSSV: req.body.MSSV };
    await studentService.patch(condition, req.body);
    res.json({ succ: "Cập nhật thành công!" });
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/upload/save", async function (req, res) {
  try {
    filepath = req.body.path;
    const file = reader.readFile(filepath);
    const data = parseFile(file);
    await studentService.addList(data);
    res.render("admin/manage_student/students_upload");
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});

router.post("/upload", upload, (req, res) => {
  try {
    if (req.file == undefined) {
      res.render("admin/students_upload", {
        msg: "Error: No File Selected!",
      });
    } else {
      filepath = `resources/uploads/${req.file.filename}`;
      const file = reader.readFile(filepath);
      const data = parseFile(file);
      res.render("admin/manage_student/students_upload", {
        list: data,
        file: { file_path: `resources/uploads/${req.file.filename}` },
      });
    }
  } catch (err) {
    console.error(err);
    res.send("View error log at server console.");
  }
});
module.exports = router;
