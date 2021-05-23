const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Module = require('../model/modules.model')
var slug = require('mongoose-slug-generator');
const Student=require('../model/students.model')
const Teacher = require('../model/teachers.model')
const Major = require('../model/major.model')
mongoose.plugin(slug);

const Subject = new Schema({
    MaDKHP: { type: String},
    MonHoc: { type: Schema.Types.ObjectId,ref:'Module'},
    Nganh: { type: Schema.Types.ObjectId,ref:'Major'},
    MaHP: { type: String },
    TenHP: { type: String },
    GVLyThuyet: {type:[{type: Schema.Types.ObjectId,ref:'Teacher'}]},
    GVThucHanh: {type:[{type: Schema.Types.ObjectId,ref:'Teacher'}]},
    HocKi: { type: Number},
    NgayBatDau: {type:Date,default:Date.now},
    NgayKetThuc: {type:Date,default:Date.now},
    TinhTrang: {type:Boolean}, //true: vẫn còn diễn ra, false: đã kết thúc
    DSSinhVien: { type: [{SinhVien:{type:Schema.Types.ObjectId,ref:'Student'},DiemTK: Number,Nhom:Number }]},
    SoNhomTH: {type:Number},
    LichHoc: {type:String},
    NhapDiem: {type:Number,default:0},
    slug: { type: String, slug: 'MaHP', unique:true }
},
{timestamps: true});


module.exports = mongoose.model('Subject',Subject)
