const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Module = new Schema({
    MaMonHoc: { type: String },
    MonHoc: { type: String },
    SoTC: { type: Number },
    SoGioTC: {type:{LyThuyet:Number,ThucHanh:Number,TuHoc:Number}},
    MonTienQuyet: { type: String },
    TenTiengAnh: { type: String},
    slug: { type: String, slug: 'MaMonHoc', unique:true }
},
{timestamps: true});

//Student.index({MSSV: 'text', HoLot: 'text',Ten:'text'});

module.exports = mongoose.model('Module',Module)
