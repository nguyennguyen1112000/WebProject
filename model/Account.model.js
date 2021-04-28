const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Account = new Schema({
    username: { type: String },
    password: { type: String },
    fullname: { type: String },
    Email: { type: String },
    slug: { type: String, slug: 'username', unique:true }
},
{timestamps: true});

module.exports = mongoose.model('Account',Account)