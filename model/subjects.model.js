const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Teacher = require("../model/teachers.model");

const Subject = new Schema(
  {
    MaDKHP: { type: String },
    MonHoc: { type: Schema.Types.ObjectId, ref: "Module" },
    Nganh: { type: Schema.Types.ObjectId, ref: "Major" },
    MaHP: { type: String },
    TenHP: { type: String },
    GVLyThuyet: { type: [{ type: Schema.Types.ObjectId, ref: "Teacher" }] },
    GVThucHanh: { type: [{ type: Schema.Types.ObjectId, ref: "Teacher" }] },
    HocKi: { type: Number },
    NgayBatDau: { type: Date, default: Date.now },
    NgayKetThuc: { type: Date, default: Date.now },
    DSSinhVien: {
      type: [
        {
          SinhVien: { type: Schema.Types.ObjectId, ref: "Student" },
          DiemTK: Number,
          Nhom: Number,
        },
      ],
    },
    SoNhomTH: { type: Number },
    SoSVToiDa: { type: Number },
    SoSVToiThieu: { type: Number },
    LichHoc: { type: String },
    LichHocTH: { type: [{ThoiGian:String}] },
    NhapDiem: { type: Boolean, default: false },
    slug: { type: String, slug: "MaHP", unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", Subject);
