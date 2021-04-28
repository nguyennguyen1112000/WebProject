const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Admin = new Schema({
    TenDangNhap: { type: String },
    MatKhau: { type: String },
    slug: { type: String, slug: 'TenDangNhap', unique:true }
},
{timestamps: true});


module.exports = mongoose.model('Admin',Admin)