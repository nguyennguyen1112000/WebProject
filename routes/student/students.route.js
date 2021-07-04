const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const { mutipleMongooseToObject, singleMongooseToObject } = require('../../utils/mongoose');

router.get('/', async function (req, res) {
    try {

        res.render('student/dashboard',{
            layout:'main'
        });
    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})


module.exports = router;