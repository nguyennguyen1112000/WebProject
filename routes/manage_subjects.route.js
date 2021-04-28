const express = require('express');
const router = express.Router();

const subjects= require('../model/subjects.model')
const { mutipleMongooseToObject } = require('../utils/mongoose');

router.get('/list', async function (req, res) {

    subjects.find({},(err,subs)=>{
        if(err){
            console.error(err);
            res.send('View error log at server console.');
        }
        else{
            console.log(subs)
            var subject=[];
            subs.forEach(obj => {
                GV=[]
                obj.GiangVien.forEach(gv=>{
                    if(gv.NhiemVu == 0) GV.push({TenGV:gv.TenGV,NhiemVu:"GV LyThuyet"})
                    else GV.push({TenGV:gv.TenGV,NhiemVu:"GV ThucHanh"})
                })

                year=(obj.NgayKetThuc.getFullYear()-1).toString()+'-'+(obj.NgayKetThuc.getFullYear()).toString()
                state = 'Đang diễn ra'
                if(obj.TinhTrang==0) state='Đã kết thúc' 
               subject.push({
                   MaMonHoc:obj.MaMonHoc,
                   MaHP:obj.MaHP,
                    TenHP:obj.TenHP,
                    GiangVien:GV,
                    HocKi:obj.HocKi,
                    NamHoc: year,
                    TinhTrang:state,
                    SoSinhVien: obj.DSSinhVien.length

                })
                
            })
            res.render('guest/subjects_list',
            {
                list:subject
            })

        }
    })

})

router.get('/students_list/:id', async function (req, res) {
    MaHP=req.params.id
    subjects.findOne({MaHP:MaHP},'TenHP DSSinhVien',(err,subs)=>{
        if(err){
            console.error(err);
            res.send('View error log at server console.');
        }
        else{
            
            res.render('guest/subjects_students_list',
            {
                list: mutipleMongooseToObject(subs.DSSinhVien),
                HocPhan: {TenHP:subs.TenHP}
            })

        }
    })

})


module.exports = router;