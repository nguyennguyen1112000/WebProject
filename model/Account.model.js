const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const Account = new Schema(
  {
    TenDangNhap: { type: String },
    MatKhau: { type: String },
    TrangThai: {type:Boolean},
    SinhVien:  { type: Schema.Types.ObjectId, ref: "Student" },
    slug: { type: String, slug: "TenDangNhap", unique: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Account", Account);
