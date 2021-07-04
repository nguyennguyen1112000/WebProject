const Student = require("../model/students.model");
const MajorService = require("../utils/major.service");
class StudentStore {
  constructor() {
    this.studentsModel = require("../model/students.model");
    this.majorService = new MajorService();
    this.subjectModel = require("../model/subjects.model");
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
    return await this.studentsModel.findById(id);
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
      }
    });
  }
  async addOne(data) {
    let check = await this.studentsModel.findOne({ MSSV: data.MSSV });
    if (!check) {
      const newStudent = new Student(data);
      await newStudent.save();
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
      }
    }
    await saveStudent.save();
  }
}

module.exports = StudentStore;
