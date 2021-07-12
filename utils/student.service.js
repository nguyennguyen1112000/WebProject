const Student = require("../model/students.model");
const MajorService = require("../utils/major.service");
const HistoryService = require("../utils/history_subject.service");
const AccountService = require("../utils/account.service");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var transport = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    auth: {
      user: "nguyentheanhbmt1112000@gmail.com",
      pass: "password",
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
);

class StudentStore {
  constructor() {
    this.studentsModel = require("../model/students.model");
    this.majorService = new MajorService();
    this.subjectModel = require("../model/subjects.model");
    this.historyService = new HistoryService();
    this.accountService = new AccountService();
  }
  async all() {
    return await this.studentsModel.find({}).populate([{ path: "Nganh" }]);
  }
  async find(condition) {
    return await this.studentsModel
      .find(condition)
      .populate([{ path: "Nganh" }]);
  }
  async findById(id) {
    return await this.studentsModel
      .findById(id)
      .populate([{ path: "Nganh" }, { path: "HPTichLuy" }]);
  }
  async detail(condition) {
    return await this.studentsModel
      .findOne(condition)
      .populate([{ path: "HPTichLuy.HocPhan" }]);
  }
  async addList(list) {
    list.forEach(async (element) => {
      let check = await this.studentsModel.findOne({ MSSV: element.MSSV });
      if (!check) {
        const Nganh = await this.majorService.detail({
          TenNganh: element.Nganh,
        });
        const { MSSV, HoLot, Ten, GioiTinh, NgaySinh, NoiSinh, Lop, Email } =
          element;
        const newStudent = new Student({
          MSSV,
          HoLot,
          Ten,
          GioiTinh,
          Nganh,
          NgaySinh,
          NoiSinh,
          Lop,
          Email,
        });
        await newStudent.save();
        const MatKhau = await this.accountService.createAccount(newStudent);
        var mail = {
          from: "ABC@gmail.com",
          to: Email,
          subject: "Thông tin tài khoản!",
          text: "Xin chào!",
          html: `<b>MSSV là tên đăng nhập mặc định, Mật khẩu của bạn là ${MatKhau}</b>`,
        };
        transport.sendMail(mail, function (error, response) {
          if (error) {
            console.log(error);
          }
          transport.close();
        });
      }
    });
  }
  async addOne(data) {
    let check = await this.studentsModel.findOne({ MSSV: data.MSSV });
    if (!check) {
      const newStudent = new Student(data);
      await newStudent.save();
      const student = await this.detail({ MSSV: data.MSSV });
      const MatKhau = await this.accountService.createAccount(student);
      var mail = {
        from: "ABC@gmail.com",
        to: student.Email,
        subject: "Thông tin tài khoản!",
        text: "Xin chào!",
        html: `<b>MSSV là tên đăng nhập mặc định, Mật khẩu của bạn là ${MatKhau}</b>`,
      };
      transport.sendMail(mail, function (error, response) {
        if (error) {
          console.log(error);
        }
        transport.close();
      });
    } else return false;
  }
  async patch(condition, data) {
    return await this.studentsModel.findOneAndUpdate(condition, data);
  }

  async updateMarks(condition, data) {
    const student = await this.detail(condition);
    for (let i = 0; i < student.HPTichLuy.length; i++) {
      student.HPTichLuy[i].DiemTK = +data[i];
      const subject = await this.subjectModel.findById(
        student.HPTichLuy[i].HocPhan._id
      );
      subject.DSSinhVien.forEach((obj) => {
        if (obj.SinhVien.equals(student._id)) obj.DiemTK = +data[i];
      });
      await subject.save();
    }
    await student.save();
  }
  async education(id, filter) {
    var student = await this.studentsModel
      .findById(id)
      .populate([{ path: "HPTichLuy" }]);
    student.HPTichLuy = await Promise.all(
      student.HPTichLuy.map(async (obj) => {
        const subject = await this.subjectModel
          .findById(obj.HocPhan)
          .populate([{ path: "MonHoc" }]);
        return {
          _id: obj._id,
          HocPhan: subject,
          DiemTK: obj.DiemTK,
        };
      })
    );
    if (filter !== undefined) {
      student.HPTichLuy = student.HPTichLuy.filter((obj) => {
        var year;
        if (obj.HocPhan.HocKi == 1) {
          year = obj.HocPhan.NgayKetThuc.getFullYear();
        } else if (obj.HocPhan.HocKi == 2) {
          year = obj.HocPhan.NgayBatDau.getFullYear();
        }
        return `${year - 1}-${year}/${obj.HocPhan.HocKi}` == filter;
      });
    }

    return student.HPTichLuy;
  }
  async filterEducation(id) {
    const HPTichLuy = await this.education(id);
    const filters = [];
    HPTichLuy.forEach((obj) => {
      var year;
      if (obj.HocPhan.HocKi == 1) {
        year = obj.HocPhan.NgayKetThuc.getFullYear();
      } else if (obj.HocPhan.HocKi == 2) {
        year = obj.HocPhan.NgayBatDau.getFullYear();
      }
      if (!filters.includes(`${year - 1}-${year}/${obj.HocPhan.HocKi}`))
        filters.push(`${year - 1}-${year}/${obj.HocPhan.HocKi}`);
    });
    return filters.sort();
  }

  async submitSubject(subjectsData, student) {
    const props = Object.getOwnPropertyNames(subjectsData);
    const saveStudent = await this.studentsModel.findById(student);
    for (let i = 0; i < props.length; i++) {
      const MaHP = props[i];
      const subject = await this.subjectModel.findOne({ MaHP: MaHP });
      saveStudent.HPTichLuy.push({ HocPhan: subject._id, DiemTK: null });
      if (subject.DSSinhVien.length < subject.SoSVToiDa) {
        let group = null;
        if (Array.isArray(subjectsData[MaHP])) group = +subjectsData[MaHP][0];
        subject.DSSinhVien.push({
          SinhVien: student,
          DiemTK: null,
          Nhom: group,
        });
        await subject.save();
        const history = {
          SinhVien: saveStudent.MSSV,
          HocPhan: subject._id,
          TinhTrang: true,
        };
        await this.historyService.add(history);
      }
    }
    await saveStudent.save();
  }
  async allResidence(id) {
    const student = await this.studentsModel.findById(id);
    return student.LuuTru;
  }
  async addResidence(id, data) {
    const student = await this.studentsModel.findById(id);
    student.LuuTru.push(data);
    await student.save();
  }
  async updateResidence(id, data, index) {
    const student = await this.studentsModel.findById(id);
    const { ThoiGianBD, ThoiGianKT, DiaChi, GhiChu } = data;
    student.LuuTru[index].ThoiGianBD = ThoiGianBD;
    student.LuuTru[index].ThoiGianKT = ThoiGianKT;
    student.LuuTru[index].DiaChi = DiaChi;
    student.LuuTru[index].GhiChu = GhiChu;
    await student.save();
  }
  async deleteResidence(id, index) {
    const student = await this.studentsModel.findById(id);
    student.LuuTru = [
      ...student.LuuTru.splice(0, index),
      ...student.LuuTru.splice(index + 1),
    ];
    await student.save();
  }
  async deleteAll() {
    await this.studentsModel.deleteMany({});
  }
}

module.exports = StudentStore;
