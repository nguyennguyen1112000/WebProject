const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const History_Subject = new Schema(
  {
    SinhVien: { type: String },
    HocPhan: { type: Schema.Types.ObjectId, ref: "Subject" },
    TinhTrang: { type: Boolean},
  },
  { timestamps: true }
);
module.exports = mongoose.model("History_Subject", History_Subject);
