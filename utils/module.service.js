class ModuleService {
  constructor() {
    this.ModulesModel = require("../model/modules.model");
  }
  async all() {
    return await this.ModulesModel.find({}).populate([
      { path: "Nganh" },
      { path: "ChuyenNganh" },
    ]);
  }
  async updateOne(condition, data) {
    return await this.ModulesModel.findOneAndUpdate(condition, data);
  }
  async detail(conditon) {
    return await this.ModulesModel.findOne(conditon).populate([
      { path: "Nganh" },
      { path: "ChuyenNganh" },
    ]);
  }
  async byId(id) {
    return await this.ModulesModel.findById(id);
  }
  async patch(condition, update) {
    const to_update = await this.detail(condition);
    console.log(update);
    const { Nganh, ChuyenNganh, MaMonHoc, MonHoc, MonTienQuyet, SoGioTC } =
      update;
    to_update.Nganh = Nganh;
    to_update.ChuyenNganh = ChuyenNganh;
    to_update.MaMonHoc = MaMonHoc;
    to_update.MonHoc = MonHoc;
    to_update.MonTienQuyet = MonTienQuyet;
    to_update.SoGioTC = SoGioTC;
    await to_update.save();
  }
  async add(module) {
    await this.ModulesModel.create(module);
  }
  async delete(condition) {
    await this.ModulesModel.deleteOne(condition);
  }
}
module.exports = ModuleService;
