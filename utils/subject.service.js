class SubjectService {
  constructor() {
    this.subjectsModel = require("../model/subjects.model");
    this.studentService = new (require("../utils/student.service"))();
  }
  async all() {
    return await this.subjectsModel
      .find({})
      .populate([
        { path: "MonHoc" },
        { path: "GVLyThuyet" },
        { path: "GVThucHanh" },
        { path: "DSSinhVien.SinhVien" },
      ]);
  }
  async byCondition(condition) {
    return await this.subjectsModel
      .find(condition)
      .populate([
        { path: "MonHoc" },
        { path: "GVLyThuyet" },
        { path: "GVThucHanh" },
        { path: "DSSinhVien.SinhVien" },
      ]);
  }
  async detail(condition) {
    return await this.subjectsModel
      .findOne(condition)
      .populate([
        { path: "MonHoc" },
        { path: "GVLyThuyet" },
        { path: "GVThucHanh" },
        { path: "DSSinhVien.SinhVien" },
      ]);
  }
  async add(newSubj) {
    const Subject = require("../model/subjects.model");
    const subject = new Subject(newSubj);
    //subject = newSubj;
    await subject.save();
  }
  async updateOne(condition) {
    return await this.subjectsModel
      .findOne(condition)
      .populate([
        { path: "MonHoc" },
        { path: "GVLyThuyet" },
        { path: "GVThucHanh" },
        { path: "DSSinhVien.SinhVien" },
      ]);
  }
  async delete(condition) {
    return await this.subjectsModel.findOneAndDelete(condition);
  }
  async deleteStudent(condition, studentDto) {
    const student = await this.studentService.detail(studentDto);
    const subject = await this.subjectsModel.findOne(condition);
    subject.DSSinhVien = subject.DSSinhVien.filter((ele) => {
      return ele.SinhVien.equals(student._id) == false;
    });
    await subject.save();
    student.HPTichLuy = student.HPTichLuy.filter(
      (ele) => ele.HocPhan.MaHP != subject.MaHP
    );
    await student.save();
  }
  async update(condition, data) {
    return this.subjectsModel.findOneAndUpdate(condition, data);
  }
  async addStudent(SinhVien, HocPhan) {
    const { MSSV, Nhom } = SinhVien;
    const student = await this.studentService.detail({ MSSV });
    const subject = await this.subjectsModel.findOne(HocPhan);
    let check = false;
    subject.DSSinhVien.forEach((ele) => {
      if (ele.SinhVien.equals(student._id)) check = true;
    });
    if (!check) {
      subject.DSSinhVien.push({
        SinhVien: student._id,
        Nhom: Nhom,
        DiemTK: null,
      });
      student.HPTichLuy.push({ HocPhan: subject._id, DiemTK: null });
      subject.save();
      student.save();
    }
    return check;
  }
  async updateMark(data, subjectDto, state) {
    const subject = await this.detail(subjectDto);
    for (let i = 0; i < subject.DSSinhVien.length; i++) {
      subject.DSSinhVien[i].DiemTK = +data[i];
      const student = await this.studentService.detail({
        _id: subject.DSSinhVien[i].SinhVien._id,
      });
      student.HPTichLuy.forEach((obj) => {
        if (obj.HocPhan._id.equals(subject._id)) {
          obj.DiemTK = +data[i];
        }
      });
      await student.save();
    }
    subject.NhapDiem = state;
    await subject.save();
  }
  containStudent(subject, studentId) {
    let contain = false;
    subject.DSSinhVien.forEach((obj) => {
      if (obj.SinhVien.equals(studentId)) {
        contain = true;
      }
    });
    return contain;
  }
}
module.exports = SubjectService;
