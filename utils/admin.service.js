const bcrypt = require("bcrypt");
module.exports = class AdminService {
  constructor() {
    this.adminModel = require("../model/admin.model");
  }
  async Login(username, password) {
    const admin = await this.adminModel.findOne({ TenDangNhap: username });
    if (admin && (await bcrypt.compare(password, admin.MatKhau)))
      return admin;
    return null;
  }
};
