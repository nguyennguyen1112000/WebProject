const express = require('express');
const router = express.Router();
const multer = require('multer');
const { route } = require('./dashboard.route');
const path = require('path');
const fs = require('fs')
const student = require('../model/students.model')
const { mutipleMongooseToObject, singleMongooseToObject } = require('../utils/mongoose');
const { find } = require('../model/students.model');
const auth = require('../middleware/auth.mdw')
//Đọc file excel
const reader = require('xlsx')
//Class student
const StudentModel = require('../utils/students')
let studentModel = new StudentModel()
//Ngành học
const majors = require('../model/major.model');
const Schema = require('mongoose');

const storage = multer.diskStorage({
    destination: './resources/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file_SV');

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if ( extname) {
        return cb(null, true);
    } else {
        cb('Error: Excel file Only!');
    }
}

let provinces = [{ province: "An Giang" }, { province: "Bà Rịa - Vũng Tàu" }, { province: "Bắc Giang" }, { province: "Bắc Kạn" }, { province: "Bạc Liêu" }, { province: "Bắc Ninh" }, { province: "Bến Tre" }, { province: "Bình Định" }, { province: "Bình Dương" },
{ province: "Bình Phước" }, { province: "Bình Thuận" }, { province: "Cà Mau" }, { province: "Cao Bằng" }, { province: "Đắk Lắk" }, { province: "Đắk Nông" }, { province: "Điện Biên" }, { province: "Đồng Nai" }, { province: "Đồng Tháp" }, { province: "Gia Lai" }, { province: "Hà Giang" },
{ province: "Hà Nam" }, { province: "Hà Tĩnh" }, { province: "Hải Dương" }, { province: "Hậu Giang" }, { province: "Hòa Bình" }, { province: "Hưng Yên" }, { province: "Khánh Hòa" }, { province: "Kiên Giang" }, { province: "Kon Tum" }, { province: "Lai Châu" }, { province: "Lâm Đồng" },
{ province: "Lạng Sơn" }, { province: "Lào Cai" }, { province: "Long An" }, { province: "Nam Định" }, { province: "Nghệ An" }, { province: "Ninh Bình" }, { province: "Ninh Thuận" }, { province: "Phú Thọ" }, { province: "Quảng Bình" }, { province: "Quảng Nam" }, { province: "Quảng Ngãi" },
{ province: "Quảng Ninh" }, { province: "Quảng Trị" }, { province: "Sóc Trăng" }, { province: "Sơn La" }, { province: "Tây Ninh" }, { province: "Thái Bình" }, { province: "Thái Nguyên" }, { province: "Thanh Hóa" }, { province: "Thừa Thiên Huế" }, { province: "Tiền Giang" },
{ province: "Trà Vinh" }, { province: "Tuyên Quang" }, { province: "Vĩnh Long" }, { province: "Vĩnh Phúc" }, { province: "Yên Bái" }, { province: "Phú Yên" }, { province: "Cần Thơ" }, { province: "Đà Nẵng" }, { province: "Hải Phòng" }, { province: "Hà Nội" }, { province: "TP HCM" }];
// Lưu danh sách sinh viên vào DB
router.post('/upload/save', async function (req, res) {
    try {
        filepath = req.body.path
        const file = reader.readFile(filepath)

        let data = []
        const sheets = file.SheetNames
        for (let i = 0; i < sheets.length; i++) {
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res)
            })
        }
        await studentModel.addList(data)
        res.render('admin/students_upload')
    }
    catch(err){
        console.error(err);
        res.send('View error log at server console.');
    }
})

router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('admin/students_upload', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('admin/students_upload', {
                    msg: 'Error: No File Selected!'
                });
            } else {

                  filepath = `resources/uploads/${req.file.filename}`
                  const file = reader.readFile(filepath)
  
                  let data = []  
                  const sheets = file.SheetNames
                  for(let i = 0; i < sheets.length; i++)
                  {
                     const temp = reader.utils.sheet_to_json(
                          file.Sheets[file.SheetNames[i]])
                     temp.forEach((res) => {
                        data.push(res)
                     })
                  }
                  res.render('admin/students_upload',{
                      list: data,
                      file: {file_path:`resources/uploads/${req.file.filename}`}
                  })
            }
        }
    });
})
router.get('/upload',auth, async function (req, res) {
    try {

        res.render('admin/students_upload');
    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

router.get('/add-new', async function (req, res) {
    try {
        const major = await majors.find({})
        res.render('admin/students_add_new', {
            provinces: provinces,
            majors: mutipleMongooseToObject(major),
        });
    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})


router.get('/find', async function (req, res) {
    try {
        if (req.query.text_search == undefined) {

            res.render('admin/students_find')
        }
        else {
            student.find({ $text: { $search: req.query.text_search } })
                .lean()
                .limit(100)
                .exec(function (err, students) {
                    students.forEach(obj => {
                        obj.NgaySinh = obj.NgaySinh.toLocaleDateString()
                        if (obj.GioiTinh == 1) obj.GioiTinh = 'Nam'
                        else obj.GioiTinh = 'Nữ'
                    })
                    res.render('admin/students_find', {
                        list: students,
                        empty: students.length == 0
                    })
                });
        }

    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})
router.post('/add-new', async function (req, res) {
    try {
        data = req.body
        data.Nganh = new Schema.Types.ObjectId(data.Nganh)
        const result = await studentModel.addOne(data)
        if(result == false) res.json({err:'Sinh viên này đã tồn tại'})
        else res.json({succ:'Thêm thành công sinh viên'})
    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

router.post('/edit-info', async function (req, res) {
    condition=req.body.MSSV;
    console.log(condition)
    data=req.body;
    console.log(data)
    data.NgaySinh=Date.parse(data.NgaySinh)

    student.findOneAndUpdate(condition,data,(err,results)=>{
        if(err){
            res.json({mess:err})
        }
        else{
            res.json({mess:"Cập nhật thành công!"})
        }
    })

})

router.get('/edit-info/:MSSV', async function (req, res) {
    const condition = req.params
    try {
        let student = await studentModel.findOne(condition)
        let major = await majors.find({})
        res.render('admin/students_edit_detail', {
            detail: singleMongooseToObject(student),
            province: provinces,
            majors: mutipleMongooseToObject(major)
        })

    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})


router.get('/edit-info', async function (req, res) {
    try {
        if (req.query.text_search == undefined) {
            console.log("đấkdjkad")

            res.render('admin/students_edit_info')

        }
        else {
            student.find({ $text: { $search: req.query.text_search } })
                .lean()
                .limit(100)
                .exec(function (err, students) {
                    students.forEach(obj => {
                        obj.NgaySinh = obj.NgaySinh.toLocaleDateString()
                        if (obj.GioiTinh == 1) obj.GioiTinh = 'Nam'
                        else obj.GioiTinh = 'Nữ'
                    })
                    res.render('admin/students_edit_info', {
                        list: students,
                        empty: students.length == 0
                    })
                });
        }



    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

router.get('/search/:id', async function (req, res) {
    id = req.params.id
    try {
        

            student.findOne({ $text: { $search: id } })
                .lean()
                .exec(function (err, students) {
                    if(!students)  res.json({mess:"MSSV không hợp lệ!"})
                    else res.json({name: students.HoLot +' '+ students.Ten})

                });
        

    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})
module.exports = router;