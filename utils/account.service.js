const bcrypt = require("bcrypt");
module.exports = class AccountService {
  constructor() {
    this.accountModel = require("../model/account.model");
  }
  async Login(username, password) {
    const account = await this.accountModel.findOne({ TenDangNhap: username });
    if (account && (await bcrypt.compare(password, account.MatKhau)))
      return account;
    return null;
  }
  async all() {
    return this.accountModel.find({}).populate([{ path: "SinhVien" }]);
  }
};
