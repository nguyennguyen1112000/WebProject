const express = require('express');
const router = express.Router();

const modules = require('../model/modules.model')
const { mutipleMongooseToObject } = require('../utils/mongoose');

router.get('/list', async function (req, res) {

    try {

        modules.find({})
            .exec(function (err, results) {
                res.render('guest/modules_list', {
                    list: mutipleMongooseToObject(results),
                    empty: results.length == 0
                })
            });




    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }


})

router.get('/add', async function (req, res) {
    modules.find({},'MaMonHoc MonHoc',(err,results)=>{
        if(err){
            console.error(err);
            res.send('View error log at server console.');
        }
        else{
            res.render('guest/modules_add',{
                list:mutipleMongooseToObject(results)
            })
        }
    })
      



})


router.post('/add', async function (req, res) {

        modules.find({},'MaMonHoc MonHoc',(err,subjects)=>{
            if(err){
                console.error(err);
                res.send('View error log at server console.');
            }
            else{
            console.log(req.body)
            const mdl=req.body;
            const new_module= new modules({
            MaMonHoc:mdl.MaMonHoc,
            MonHoc: mdl.MonHoc,
            SoTC: mdl.SoTC,
            SoGioTC:{LyThuyet:parseInt(mdl.LyThuyet),ThucHanh:parseInt(mdl.ThucHanh),TuHoc:parseInt(mdl.TuHoc)},
            MonTienQuyet: subjects[parseInt(mdl.MonTienQuyet)].MaMonHoc,
            TenTiengAnh: mdl.TenTiengAnh
        })
            new_module.save(function (err) {
            if (err) return handleError(err);
            // lưu!
            });

            }
        })
        


})

module.exports = router;