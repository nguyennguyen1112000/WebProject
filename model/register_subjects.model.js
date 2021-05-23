const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Module = require('./modules.model')
var slug = require('mongoose-slug-generator');
const Subject=require('./subjects.model')
mongoose.plugin(slug);

const Register_Subject = new Schema({
    MaDKHP: { type: String},
    HocKi: { type: Number},
    NgayBatDauHK: {type:Date,default:Date.now},
    NgayKetThucHK: {type:Date,default:Date.now},
    TGBatDau: {type:Date,default:Date.now},
    TGKetThuc: {type:Date,default:Date.now},
    DSHocPhan: { type: [{HocPhan:{type:Schema.Types.ObjectId,ref:'Subject'},SVToiDa:Number}]},
    slug: { type: String, slug: 'MaDKHP', unique:true }
},
{timestamps: true});


module.exports = mongoose.model('Register_Subject',Register_Subject)
