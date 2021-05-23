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

  password = req.body.MatKhau;
  await admin.findOne({ TenDangNhap: req.body.TenDangNhap }, (err, results) => {
    if (err) {
      console.error(err);
      res.send('View error log at server console.');
    }
    else {
      if(results==null){
        res.render('admin/login',{layout:false,
        err: {err:"Tên đăng nhập không chính xác"}})
      }
      else{
        const hash=results.MatKhau
        bcrypt.compare(password, hash, function(err, result) {
          if(result)  {
            req.session.admin = true;
            res.render('guest/students_add')
          
        }
        else{
          res.render('admin/login',{layout:false,
            err: {err:"Mật khẩu không chính xác"}})
        }
        
      });
      }
      
      }
    })


    


});

router.post('/out', async function (req, res) {
  req.session.admin = false;
  res.render('admin/login',{layout:false})
});


module.exports = router;