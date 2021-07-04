class MajorService{
  constructor() {
    this.Model = require("../model/major.model");
  }
  async all() {
    return await this.Model.find({})
  }
  async byCondition(condition) {
    return await this.Model.find(condition)
  }
  async detail(condition) {
    return await this.Model.findOne(condition)
  }
  async updateOne(condition, data) {
    return await this.Model.findOneAndUpdate(condition, data);
  }
  async delete(condition) {
    return await this.Model.findOneAndDelete(condition);
  }
  async add(data) {
    let detail = new this.Model(data);
    return await detail.save();
  }
}
module.exports = MajorService;
