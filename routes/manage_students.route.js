const express = require('express');
const router = express.Router();
const multer = require('multer');
const { route } = require('./dashboard.route');
const path = require('path');
const fastcsv = require("fast-csv");
const fs = require('fs')
const student = require('../model/students.model')
const { mutipleMongooseToObject } = require('../utils/mongoose');
const { find } = require('../model/students.model');

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
    // Allowed ext
    const filetypes = /csv/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetypes = /excel/;
    const mimetype = mimetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: CSV file Only!');
    }
}


router.post('/add', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('guest/students_add', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('guest/students_add', {
                    msg: 'Error: No File Selected!'
                });
            } else {

                let stream = fs.createReadStream(`resources/uploads/${req.file.filename}`);
                let csvData = [];
                let csvStream = fastcsv
                    .parse()
                    .on("data", function (data) {
                        csvData.push({
                            MSSV: data[0],
                            HoLot: data[1],
                            Ten: data[2],
                            GioiTinh: data[3] == "Nam" ? 1 : 0,
                            NgaySinh: data[4],
                            NoiSinh: data[5],
                            Lop: data[6],
                            Nganh: data[7],
                            SoTC: data[8],
                            DiemTBTichLuy: data[9],
                            XepLoai: data[10]
                        });
                    })
                    .on("end", function () {
                        // remove the first line: header
                        csvData.shift();
                        csvData.forEach(std => {
                            student.create(std, function (err, std) {
                                if (err) return handleError(err);

                            });
                        });

                        res.render('guest/students_add', {
                            msg: 'File Uploaded!',
                            list: csvData
                        });





                    });
                stream.pipe(csvStream);



            }
        }
    });
})
router.get('/add', async function (req, res) {
    try {

        res.render('guest/students_add');
    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

router.get('/add-new', async function (req, res) {
    try {
        const provinces = [{ province: "An Giang" }, { province: "Bà Rịa - Vũng Tàu" }, { province: "Bắc Giang" }, { province: "Bắc Kạn" }, { province: "Bạc Liêu" }, { province: "Bắc Ninh" }, { province: "Bến Tre" }, { province: "Bình Định" }, { province: "Bình Dương" },
        { province: "Bình Phước" }, { province: "Bình Thuận" }, { province: "Cà Mau" }, { province: "Cao Bằng" }, { province: "Đắk Lắk" }, { province: "Đắk Nông" }, { province: "Điện Biên" }, { province: "Đồng Nai" }, { province: "Đồng Tháp" }, { province: "Gia Lai" }, { province: "Hà Giang" },
        { province: "Hà Nam" }, { province: "Hà Tĩnh" }, { province: "Hải Dương" }, { province: "Hậu Giang" }, { province: "Hòa Bình" }, { province: "Hưng Yên" }, { province: "Khánh Hòa" }, { province: "Kiên Giang" }, { province: "Kon Tum" }, { province: "Lai Châu" }, { province: "Lâm Đồng" },
        { province: "Lạng Sơn" }, { province: "Lào Cai" }, { province: "Long An" }, { province: "Nam Định" }, { province: "Nghệ An" }, { province: "Ninh Bình" }, { province: "Ninh Thuận" }, { province: "Phú Thọ" }, { province: "Quảng Bình" }, { province: "Quảng Nam" }, { province: "Quảng Ngãi" },
        { province: "Quảng Ninh" }, { province: "Quảng Trị" }, { province: "Sóc Trăng" }, { province: "Sơn La" }, { province: "Tây Ninh" }, { province: "Thái Bình" }, { province: "Thái Nguyên" }, { province: "Thanh Hóa" }, { province: "Thừa Thiên Huế" }, { province: "Tiền Giang" },
        { province: "Trà Vinh" }, { province: "Tuyên Quang" }, { province: "Vĩnh Long" }, { province: "Vĩnh Phúc" }, { province: "Yên Bái" }, { province: "Phú Yên" }, { province: "Cần Thơ" }, { province: "Đà Nẵng" }, { province: "Hải Phòng" }, { province: "Hà Nội" }, { province: "TP HCM" }];

        res.render('guest/students_add_new', {
            provinces: provinces
        });
    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

// router.get('/find', async function (req, res) {
//     try {

//         res.render('guest/students_find');
//     } catch (err) {
//         console.error(err);
//         res.send('View error log at server console.');
//     }

// })
router.get('/find', async function (req, res) {
    try {
        if (req.query.text_search == undefined) {

            res.render('guest/students_find')
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
                    res.render('guest/students_find', {
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
    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

router.post('/edit-info', async function (req, res) {
    condition=req.body.MSSV;
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



router.get('/edit-info', async function (req, res) {
    try {
        if (req.query.text_search == undefined) {

            res.render('guest/students_edit_info')

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
                    res.render('guest/students_edit_info', {
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
module.exports = router;