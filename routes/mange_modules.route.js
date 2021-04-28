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


module.exports = router;