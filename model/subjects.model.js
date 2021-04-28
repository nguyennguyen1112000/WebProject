const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Subject = new Schema({
    MaMonHoc: { type: String },
    MaHP: { type: String },
    TenHP: { type: String },
    GiangVien: {type:[{MaGV:String,TenGV:String,NhiemVu:Number}]}, //NhiemVu: 1: GiangVien Lt, 2: GiangVien TH
    HocKi: { type: Number},
    NgayBatDau: {type:Date,default:Date.now},
    NgayKetThuc: {type:Date,default:Date.now},
    TinhTrang: {type:Boolean}, //true: vẫn còn diễn ra, false: đã kết thúc
    DSSinhVien: { type: [{MSSV:String,HoTen:String}]},
    slug: { type: String, slug: 'MaHP', unique:true }
},
{timestamps: true});


module.exports = mongoose.model('Subject',Subject)
