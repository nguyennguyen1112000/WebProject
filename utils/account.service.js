const bcrypt = require("bcrypt");
module.exports = class AccountService {
  constructor() {
    this.accountModel = require("../model/account.model");
  }
  async add(info) {
    const account = new this.accountModel(info);
    await account.save();
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
  async updateState(id) {
    const account = await this.accountModel.findById(id);
    account.TrangThai = !account.TrangThai;
    await account.save();
  }
  async createAccount(student) {
    const { _id, MSSV } = student;
    const saltRounds = 10;
    const MatKhau = Math.random().toString(36).substr(2, 6);
    const hash = await bcrypt.hash(MatKhau, saltRounds);
    const account = {
      TenDangNhap: MSSV,
      MatKhau: hash,
      TrangThai: true,
      SinhVien: _id,
    };
    console.log(account);
    await this.add(account);
    return MatKhau;
  }
  async updatePassword(student, hash) {
    const { MSSV } = student;
    const account = await this.accountModel.findOne({ TenDangNhap: MSSV });
    account.MatKhau = hash;
    await account.save();
  }
};
