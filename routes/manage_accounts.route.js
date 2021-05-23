const express = require('express');
const Schema = require('mongoose');
const router = express.Router();
const modules = require('../model/modules.model')
const teachers = require('../model/teachers.model')
const subjects = require('../model/subjects.model')
const students = require('../model/students.model')
const { mutipleMongooseToObject, singleMongooseToObject } = require('../utils/mongoose')
const mongoose = require('../utils/mongoose');
const AccountModel = require('../utils/student_accounts');
let accountModel = new AccountModel()


router.get('/manage', async function (req, res) {
   
    try {
        const results = await accountModel.all()
        res.render('admin/account/accounts',{
            list: mutipleMongooseToObject(results)
        })
    }
    catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }
})





module.exports = router;