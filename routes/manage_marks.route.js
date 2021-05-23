const express = require('express');
const Schema = require('mongoose');
const router = express.Router();
const subjects = require('../model/subjects.model')
const students = require('../model/students.model')
const { mutipleMongooseToObject, singleMongooseToObject } = require('../utils/mongoose');
const mongoose = require('../utils/mongoose');
const multer = require('multer');
const path = require('path');
const reader = require('xlsx')

router.get('/list_bySubject', async function (req, res) {

    subjects.find({}).
        populate([{ path: 'MonHoc' }, { path: 'GVLyThuyet' }, { path: 'GVThucHanh' }, { path: 'DSSinhVien' }]).
        exec(function (err, subs) {
            if (err) {
                console.error(err);
                res.send('View error log at server console.');
            }
            else {

                var subject = [];
                subs.forEach(obj => {
                    state = 'Đang diễn ra'
                    if (obj.TinhTrang == 0) state = 'Đã kết thúc'
                    var NhapDiem = "Chưa xong"
                    if (obj.NhapDiem == 1) NhapDiem = "Đã xong"

                    subject.push({
                        MaMonHoc: obj.MonHoc.MaMonHoc,
                        MaHP: obj.MaHP,
                        TenHP: obj.TenHP,
                        GVLyThuyet: mutipleMongooseToObject(obj.GVLyThuyet),
                        GVThucHanh: mutipleMongooseToObject(obj.GVThucHanh),
                        HocKi: obj.HocKi,
                        NgayBatDau: obj.NgayBatDau,
                        NgayKetThuc: obj.NgayKetThuc,
                        TinhTrang: state,
                        SoSinhVien: obj.DSSinhVien.length,
                        DaNhapDiem: NhapDiem

                    })

                })
                res.render('guest/marks_list_bySubject',
                    {
                        list: subject
                    })

            }
        })

})

router.get('/list_byStudent', async function (req, res) {
    try {

        student = await students.find({})
            .lean()
            .limit(100)
            .exec(function (err, students) {
                students.forEach(obj => {
                    obj.NgaySinh = obj.NgaySinh.toLocaleDateString()
                    if (obj.GioiTinh == 1) obj.GioiTinh = 'Nam'
                    else obj.GioiTinh = 'Nữ'
                })
                res.render('guest/marks_list_byStudent', {
                    list: students,
                })
            });




    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

router.get('/students/:MSSV', async function (req, res) {
    condition = req.params
    student = await students.findOne(condition).populate({ path: 'HPTichLuy.HocPhan' })
    res.render('guest/marks_students', {
        student: singleMongooseToObject(student)
    })
})
router.get('/subjects/:id', async function (req, res) {
    MaHocPhan = req.params.id
    subjects.findOne({ MaHP: MaHocPhan }).
        populate([{ path: 'MonHoc' }, { path: 'GVLyThuyet' }, { path: 'GVThucHanh' }, { path: 'DSSinhVien.SinhVien' }]).
        exec(function (err, result) {
            if (err) return handleError(err)
            else {
                res.render('guest/marks_subjects', {
                    HocPhan: mongoose.singleMongooseToObject(result)
                })
            }
        })

})

router.post('/update/subject/:MaHP', async function (req, res) {
    condition = req.params
    finish = req.query.finish
    data = req.body.data
    subjects.findOne(condition, (err, results) => {
        if (err) return handleError(err)
        else {
            for (let i = 0; i < results.DSSinhVien.length; i++) {
                results.DSSinhVien[i].DiemTK = parseFloat(data[i])
                students.findById(results.DSSinhVien[i].SinhVien, (err, result) => {
                    result.HPTichLuy.forEach(obj => {
                        if (obj.HocPhan.equals(results._id)) obj.DiemTK = parseFloat(data[i])
                    })
                    result.save()
                })

            }

            if (finish == "1") {
                results.NhapDiem = 1
                results.save()
                res.json({ mess: "Hoàn thành nhập điểm" })

            }
            else {
                results.save()
                res.json({ mess: "Đã lưu cập nhật" })
            }

        }

    })
})


router.post('/update/student/:MSSV', async function (req, res) {
    condition = req.params
    data = req.body.data
    students.findOne(condition, (err, results) => {
        if (err) return handleError(err)
        else {
            for (let i = 0; i < results.HPTichLuy.length; i++) {
                results.HPTichLuy[i].DiemTK = parseFloat(data[i])
                subjects.findById(results.HPTichLuy[i].HocPhan, (err, result) => {
                    result.DSSinhVien.forEach(obj => {
                        if (obj.SinhVien.equals(results._id)) obj.DiemTK = parseFloat(data[i])
                    })
                    result.save()
                })

            }
            results.save()
            res.json({ mess: "Đã lưu cập nhật" })


        }

    })
})

router.get('/upload', async function (req, res) {
    subjects.find({}).
        populate([{ path: 'MonHoc' }, { path: 'GVLyThuyet' }, { path: 'GVThucHanh' }, { path: 'DSSinhVien' }]).
        exec(function (err, subs) {
            if (err) {
                console.error(err);
                res.send('View error log at server console.');
            }
            else {

                var subject = [];
                subs.forEach(obj => {
                    state = 'Đang diễn ra'
                    if (obj.TinhTrang == 0) state = 'Đã kết thúc'
                    var NhapDiem = "Chưa xong"
                    if (obj.NhapDiem == 1) NhapDiem = "Đã xong"

                    subject.push({
                        MaMonHoc: obj.MonHoc.MaMonHoc,
                        MaHP: obj.MaHP,
                        TenHP: obj.TenHP,
                        GVLyThuyet: mutipleMongooseToObject(obj.GVLyThuyet),
                        GVThucHanh: mutipleMongooseToObject(obj.GVThucHanh),
                        HocKi: obj.HocKi,
                        NgayBatDau: obj.NgayBatDau,
                        NgayKetThuc: obj.NgayKetThuc,
                        TinhTrang: state,
                        SoSinhVien: obj.DSSinhVien.length,
                        DaNhapDiem: NhapDiem

                    })

                })
                res.render('guest/marks_list_bySubject_upload',
                    {
                        list: subject
                    })

            }
        })

})


router.get('/upload/:MaHP', async function (req, res) {
    try {
        condition = req.params.id
        result = await subjects.findOne(condition).
            populate([{ path: 'MonHoc' }, { path: 'GVLyThuyet' }, { path: 'GVThucHanh' }, { path: 'DSSinhVien.SinhVien' }])
        res.render('guest/marks_upload', {
            list: singleMongooseToObject(result)
        })
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})


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
    if (extname) {
        return cb(null, true);
    } else {
        cb('Error: Excel file Only!');
    }
}


router.post('/upload/:MaHP', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            res.send('View error log at server console.');
        } else {
            if (req.file == undefined) {
                res.render('guest/students_add', {
                    msg: 'Error: No File Selected!'
                });
            } else {

                filepath = `resources/uploads/${req.file.filename}`
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
                subjects.findOne({ MaHP: 'THCS21' }).
                    populate([{ path: 'MonHoc' }, { path: 'GVLyThuyet' }, { path: 'GVThucHanh' }, { path: 'DSSinhVien.SinhVien' }])
                    .exec((err, results) => {
                        if (err) {

                        }
                        else {
                            docs = JSON.parse(JSON.stringify(results))
                            console.log(docs)
                            docs.DSSinhVien.forEach(obj => {
                                data.forEach(dt => {
                                    if (obj.SinhVien.MSSV == dt.MSSV) {
                                        obj.DiemTK = dt.DiemTK
                                        if (obj.DiemTK != dt.DiemTK) obj.Difference = false
                                        else obj.Difference = true
                                    }

                                })

                            })
                            res.render('guest/marks_upload', {
                                list: JSON.parse(JSON.stringify(docs))
                            })
                        }
                    })

            }
        }
    });
})
module.exports = router;