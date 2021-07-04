const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const Speciality = new Schema(
  {
    Nganh: { type: Schema.Types.ObjectId, ref: "Major" },
    MaChuyenNganh: { type: String },
    ChuyenNganh: { type: String },
    slug: { type: String, slug: "MaChuyenNganh", unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Speciality", Speciality);
