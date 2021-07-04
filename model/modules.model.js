const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Module = new Schema(
  {
    MaMonHoc: { type: String },
    MonHoc: { type: String },
    Nganh: { type: Schema.Types.ObjectId, ref: "Major" },
    ChuyenNganh: { type: Schema.Types.ObjectId, ref: "Speciality" },
    SoTC: { type: Number },
    SoGioTC: { type: { LyThuyet: Number, ThucHanh: Number, TuHoc: Number } },
    MonTienQuyet: { type: String },
    slug: { type: String, slug: "MaMonHoc", unique: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Module", Module);
