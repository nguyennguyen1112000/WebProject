const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const admin = require('../model/admin.model')
const saltRounds = 10;
//Đi đến trang chủ
router.get('/admin', async function (req, res) {
  try {

    res.render('admin/login', {
      layout: false
    });
  } catch (err) {
    console.error(err);
    res.send('View error log at server console.');
  }

})

router.post('/admin', async function (req, res) {

  console.log(req.body)
  password = req.body.MatKhau;
  admin.findOne({ TenDangNhap: req.body.TenDangNhap }, (err, results) => {
    if (err) {
      console.error(err);
      res.send('View error log at server console.');
    }
    else {
      console.log(results);
      if(results==null){
        res.json({err:0})
      }
      else{
        const hash=results.MatKhau
        bcrypt.compare(password, hash, function(err, result) {
          if(result) {
            console.log("Đăng nhập thành công");
            req.session.admin=true;
            res.render('guest/students_add',{layout:false})}
          else res.json({err:1})
      });
      }
      
      }
    })


    


});


module.exports = router;