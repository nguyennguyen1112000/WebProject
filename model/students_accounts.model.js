const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Student_Account = new Schema({
    SinhVien: { type: Schema.Types.ObjectId,ref:'Student'},
    MatKhau: { type: String },
    TrangThai: { type: Boolean }
},
{timestamps: true});

module.exports = mongoose.model('Student_Account',Student_Account)