const express = require('express');
const router = express.Router();
//Đi đến trang chủ
router.get('/login', async function (req, res) {
    try {
    
      res.render('guest/login',{
        layout:false
      });
    } catch (err) {
      console.error(err);
      res.send('View error log at server console.');
    }
  
  })
 
  module.exports = router;