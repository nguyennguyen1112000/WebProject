const express = require('express');
const Schema = require('mongoose');
const router = express.Router();
const modules = require('../model/modules.model')
const teachers = require('../model/teachers.model')
const subjects = require('../model/subjects.model')
const students = require('../model/students.model')
const { mutipleMongooseToObject, singleMongooseToObject } = require('../utils/mongoose')
const mongoose = require('../utils/mongoose');
const SubjectModel = require('../utils/subjects');
const ModulesModel = require('../utils/modules');
const Register_SubjectModel = require('../utils/register_subject');
const { json } = require('express');
const SubjectStore = require('../utils/subjects');
let subjectModel = new SubjectModel()
let modulesModel = new ModulesModel()
let register_SubjectModel = new Register_SubjectModel()

router.get('/list', async function (req, res) {

   
    try {
        const list = await subjectModel.all()
        res.render('admin/subjects_list',
        {
            list: mutipleMongooseToObject(list),
        })
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }
})

router.get('/students_list/:id', async function (req, res) {
    MaHocPhan = req.params.id
    subjects.findOne({ MaHP: MaHocPhan }).
        populate([{ path: 'MonHoc' }, { path: 'GVLyThuyet' }, { path: 'GVThucHanh' }, { path: 'DSSinhVien.SinhVien' }]).
        exec(function (err, results) {
            if (err) return handleError(err)
            else {
                res.render('guest/subjects_students_list', {
                    list: mutipleMongooseToObject(results.DSSinhVien)
                })
            }
        })

})

router.get('/add', async function (req, res) {
   try{
       const tea = await teachers.find({})
       const mods = await modulesModel.all()
        res.render('admin/subjects_add', {
        list_GV: mutipleMongooseToObject(tea),
        list_MonHoc: mutipleMongooseToObject(mods)
    })
   }
   catch(err){
        console.error(err);
        res.send('View error log at server console.');
   }

})

router.post('/add', async function (req, res) {
    const obj = req.body;
    var GVLyThuyet, GVThucHanh
    if (typeof obj.GVLyThuyet == 'string') GVLyThuyet = [obj.GVLyThuyet]
    else GVLyThuyet = obj.GVLyThuyet
    if (typeof obj.GVThucHanh == 'string') GVThucHanh = [obj.GVThucHanh]
    else GVThucHanh = obj.GVThucHanh
    state = 1
    if (Date.parse(obj.NgayKetThuc) < new Date()) state = 0
    GVLyThuyet.forEach(gv => new Schema.Types.ObjectId(gv))
    GVThucHanh.forEach(gv => new Schema.Types.ObjectId(gv))
    save_obj = new subjects({
        MonHoc: new Schema.Types.ObjectId(obj.MaMonHoc),
        MaHP: obj.MaHP,
        TenHP: obj.TenHP,
        HocKi: obj.HocKi,
        NgayBatDau: Date.parse(obj.NgayBatDau),
        NgayKetThuc: Date.parse(obj.NgayKetThuc),
        TinhTrang: state,
        GVLyThuyet: obj.GVLyThuyet,
        GVThucHanh: obj.GVThucHanh,
        MaDKHP: obj.MaDKHP,
        SoNhomTH: obj.SoNhomTH
    })
    save_obj.save(function (err) {
        if (err) return handleError(err)
    })
    res.render('admin/subjects_add')

})


router.get('/edit', async function (req, res) {

    try {
        const list = await subjectModel.all()
        res.render('admin/subjects_edit',
        {
            list: mutipleMongooseToObject(list),
        })
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})


router.get('/edit/:MaHP', async function (req, res) {
    const condition= req.params;
    const obj = await subjectModel.detail(condition)
    const tea = await teachers.find({})
    const mods = await modules.find({})
    try {
        res.render('admin/subjects_edit_info',
        {
            detail: singleMongooseToObject(obj),
            list_GV: mutipleMongooseToObject(tea),
            list_mod: mutipleMongooseToObject(mods)
        })
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

//Danh sách sinh viên trong 1 học phần
router.get('/students_list/edit/:MaHP', async function (req, res) {
    condition = req.params;
    const subs = await subjectModel.detail(condition)
    try {
        res.render('guest/subjects_students_list_edit',
            {
                list: mongoose.singleMongooseToObject(subs),
            })
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }


})

router.post('/edit', async function (req, res) {

    try{
        condition = { MaHP: req.body.MaHP };
        data = req.body;
        await subjectModel.update(condition,data)
        res.json({success:'Cập nhật học phần thành công!'})
    }
    catch(err){
        console.error(err);
        res.send('View error log at server console.');
    }
    

})

router.post('/add_students/:MaHP', async function (req, res) {
    condition = req.params
    console.log(condition)
    data = req.body;
    subjects.findOne(condition, (err, obj) => {
        if (err) res.json({ err: 1 })
        else {
            students.findOne(req.body, (err, result) => {
                if (err) {
                    console.error(err);
                    res.send('View error log at server console.');
                }
                else {
                    check = false
                    obj.DSSinhVien.forEach(ele => {
                        if (ele.SinhVien.equals(result._id)) check = true
                    })
                    console.log(check)
                    if (!check) {
                        obj.DSSinhVien.push({ SinhVien: result._id, DiemTK: null })
                        result.HPTichLuy.push({ HocPhan: obj._id, DiemTK: null })
                        result.save()
                        obj.save((err) => {
                            if (err) return handleError(err)
                            else res.json({ success: "Thành công" })
                        })
                    }

                }
            })
        }
    })

})



router.get('/open', async function (req, res) {
    try {
        res.render('admin/subject_open/subjects_open')
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})
router.get('/open/step2', async function (req, res) {
    try {
        if(req.session.DKHP){
            condition = {MaDKHP:req.session.DKHP.MaDKHP}
            const result = await subjectModel.byCondition(condition)
            res.render('admin/subjects_open_step2',{
            list: mutipleMongooseToObject(result),
            empty: result.length == 0
        })
        }
        else{
            res.redirect('/subjects/open')
        }

    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})
router.post('/open/step2', async function (req, res) {
    try {
        req.session.DKHP = JSON.parse(JSON.stringify(req.body))
        condition = {MaDKHP:req.body.MaDKHP}
        const result = await subjectModel.byCondition(condition)
        res.render('admin/subject_open/subjects_open_step2',{
            list: mutipleMongooseToObject(result),
            empty: result.length == 0
        })

    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})
router.post('/open/reset', async function (req, res) {
    try {
        req.session.DKHP = null
        res.redirect('/subjects/open')

    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})
router.post('/open/finish', async function (req, res) {
    try {
        SVToiDa = req.body.SVToiDa
        ss = req.session.DKHP
        if(SVToiDa != undefined) {
            if(!Array.isArray(SVToiDa)) SVToiDa= [SVToiDa]
            DSHocPhan = []
            const subs = await subjectModel.byCondition({MaDKHP: ss.MaDKHP})
            for(var i=0;i<subs.length;i++){
                DSHocPhan.push({HocPhan:subs[i]._id,SVToiDa: SVToiDa[i]})
            }
            ss.DSHocPhan = DSHocPhan
        }
        await register_SubjectModel.add(ss)
        req.session.DKHP = null
        res.redirect(`/subjects/open/detail/${ss.MaDKHP}`)

        
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

router.get('/open/detail/:MaDKHP', async function (req, res) {
    try {
       condition = req.params
       const result = await register_SubjectModel.detail(condition)
       res.render('admin/subject_open/subjects_open_detail',{
           detail: singleMongooseToObject(result)
       })
        
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})
router.get('/open/list', async function (req, res) {
    try {
       const results = await register_SubjectModel.all()
       res.render('admin/subject_open/subjects_open_list',{
           list: mutipleMongooseToObject(results)
       })
        
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

//DELETE
router.delete('/delete_students/:MaHP', async function (req, res) {
    condition = req.params
    data = req.body;
    console.log(condition,data)
    try {
        await subjectModel.removeStudent(condition, data)
        res.json({ success: "Thành công" })
    }
    catch (err) {
        console.error(err);
        res.json({ err: 1 })
    }

})
router.post('/delete/:MaHP', async function (req, res) {
    try {
        const condition = req.params
        await subjectModel.delete(condition)
        res.json({success:"Xóa học phần thành công"})
       
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})




module.exports = router;