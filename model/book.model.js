const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const book = new Schema({
    title: String ,
    description: String,
    author: String,
    genre: String,
    rating: String,
    lastUpdated: String,
    state: Intl,
    img: String

});

module.exports = mongoose.model('book', book)
