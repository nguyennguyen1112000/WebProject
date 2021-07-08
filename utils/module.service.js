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
    to_update.overwrite(update);
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
