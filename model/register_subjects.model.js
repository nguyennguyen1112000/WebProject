const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Register_Subject = new Schema(
  {
    MaDKHP: { type: String },
    HocKi: { type: Number },
    NgayBatDauHK: { type: Date },
    NgayKetThucHK: { type: Date },
    ThoiGianBD: { type: Date },
    ThoiGianKT: { type: Date },
    slug: { type: String, slug: "MaDKHP", unique: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Register_Subject", Register_Subject);
