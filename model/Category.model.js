const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const category = new Schema({
    name: { type: String },
    slug: {
        type: String,
        slug: 'name',
        unique: true
    }
});

module.exports = mongoose.model('category', category)