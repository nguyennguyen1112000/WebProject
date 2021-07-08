class SubjectService {
  constructor() {
    this.subjectsModel = require("../model/subjects.model");
    this.studentService = new (require("../utils/student.service"))();
    this.moduleService = new (require("../utils/module.service"))();
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
  async byId(id) {
    return await this.subjectsModel
      .findById(id)
      .populate([
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
  async inSameModule(subjectId1, subjectId2) {
    const module1 = await this.subjectsModel
      .findById(subjectId1)
      .populate([{ path: "MonHoc" }]);
    const moduleId1 = module1.MonHoc._id;
    const module2 = await this.subjectsModel
      .findById(subjectId2)
      .populate([{ path: "MonHoc" }]);
    const moduleId2 = module2.MonHoc._id;
    //console.log(moduleId1,moduleId2);
    return moduleId1.equals(moduleId2);
  }
  async passPreviousModule(studentId, subject) {
    const previousModuleId = subject.MonHoc.MonTienQuyet;
    if (previousModuleId == "") return true;
    const list = await this.studentService.education(studentId, undefined);
    for (let i = 0; i < list.length; i++) {
      const moduleId = list[i].HocPhan.MonHoc.MaMonHoc;
      if (moduleId === previousModuleId && list[i].DiemTK >= 5) return true;
    }
    return false;
  }
  async forbiddenSubject(subject, studentId) {
    const subjectId = subject._id;
    var check = false;
    const list = await this.studentService.education(studentId, undefined);
    const result = await Promise.all(
      list.map(async (obj) => {
        return (
          (await this.inSameModule(obj.HocPhan._id, subjectId)) &&
          obj.DiemTK >= 5
        );
      })
    );
    return result.includes(true);
  }
}
module.exports = SubjectService;
