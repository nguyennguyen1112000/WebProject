const express = require('express');
const router = express.Router();
const book = require('../model/book.model')
const { mutipleMongooseToObject } = require('../utils/mongoose')
router.get('/category', async function(req, res) {
    try {
        res.render('guest/byCategory')

        
    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

module.exports = router;