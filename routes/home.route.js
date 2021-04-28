const express = require('express');
const router = express.Router();
const { mutipleMongooseToObject } = require('../utils/mongoose')
router.get('/', async function(req, res) {
    try {
        // book.find({'genre':/Tiên Hiệp/},null,{limit:10}, function (err, books) {
        //     res.render('home',{
        //         books: mutipleMongooseToObject(books)
        //     });
        //   });
        res.render('home');

        
    } catch (err) {
        console.error(err);
        res.send('View error log at server console.');
    }

})

module.exports = router;