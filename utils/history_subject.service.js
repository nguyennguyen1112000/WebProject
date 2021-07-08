class HistoryService {
  constructor() {
    this.Model = require("../model/history_subject.model");
  }
  async all(MSSV) {
    return await this.Model.find({ SinhVien: MSSV }).populate([
      { path: "HocPhan" },
    ]);
  }
  async add(data) {
    let detail = new this.Model(data);
    return await detail.save();
  }
 
}
module.exports = HistoryService;
