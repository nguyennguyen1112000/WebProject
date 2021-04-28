const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Student = new Schema({
    MSSV: { type: String },
    HoLot: { type: String },
    Ten: { type: String },
    GioiTinh: { type: Boolean },
    NgaySinh: { type: Date},
    NoiSinh: { type: String },
    Lop: { type: String },
    Nganh: { type: String },
    Email: { type: String },
    slug: { type: String, slug: 'MSSV', unique:true }
},
{timestamps: true});

Student.index({MSSV: 'text', HoLot: 'text',Ten:'text'});

module.exports = mongoose.model('Student',Student)