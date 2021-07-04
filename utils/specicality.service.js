class SpecicalityService{
  constructor() {
    this.Model = require("../model/speciality.model.");
  }
  async all() {
    return await this.Model.find({});
  }
  async byMajor(majorId) {
    const majors = await this.all();
    majors.filter(obj => obj.Nganh.equals(majorId));
    return majors;
  }
  async detail(condition) {
    return await this.Model.findOne(condition)
  }

}
module.exports = SpecicalityService;
