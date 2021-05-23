const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Module = require('./modules.model')
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Major= new Schema({
    MaNganh: { type: Schema.Types.ObjectId,ref:'Module'},
    TenNganh: { type: String },
    slug: { type: String, slug: 'MaNganh', unique:true }
},
{timestamps: true});


module.exports = mongoose.model('Major',Major)
