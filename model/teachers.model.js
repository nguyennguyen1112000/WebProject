const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Teacher = new Schema({
    MaGV: { type: String },
    TenGV: { type: String },
    HocVi: { type: String },
    MonHoc: {type:[{MaMonHoc:String,MonHoc:String}]},
    slug: { type: String, slug: 'MaGV', unique:true }
},
{timestamps: true});


module.exports = mongoose.model('Teacher',Teacher)
