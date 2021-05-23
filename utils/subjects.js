const students = require('../model/students.model')
class SubjectStore{
    constructor(){
        this.subjectsModel = require('../model/subjects.model')
    }
    async all(){
        return await this.subjectsModel.find({}).populate([{ path: 'MonHoc' }, { path: 'GVLyThuyet' }, { path: 'GVThucHanh' }, { path: 'DSSinhVien.SinhVien' }])
    }
    async byCondition(condition){
        return await this.subjectsModel.find(condition).populate([{ path: 'MonHoc' }, { path: 'GVLyThuyet' }, { path: 'GVThucHanh' }, { path: 'DSSinhVien.SinhVien' }])
    }
    async detail(condition){
        return await this.subjectsModel.findOne(condition).
        populate([{ path: 'MonHoc' }, { path: 'GVLyThuyet' }, { path: 'GVThucHanh' }, { path: 'DSSinhVien.SinhVien' }])
    }
    async updateOne(condition){
        return await this.subjectsModel.findOne(condition).
        populate([{ path: 'MonHoc' }, { path: 'GVLyThuyet' }, { path: 'GVThucHanh' }, { path: 'DSSinhVien.SinhVien' }])
    }
    async delete(condition){
        return await this.subjectsModel.findOneAndDelete(condition)
    }
    async removeStudent(condition,student){
        let detail_student  = await students.findOne(student).populate([{path:'HPTichLuy.HocPhan'}])
        return await this.subjectsModel.findOne(condition,(err,obj)=>{
            obj.DSSinhVien = obj.DSSinhVien.filter(ele => {
                return (ele.SinhVien.equals(detail_student._id)==false)
            })
            obj.save()
            detail_student.HPTichLuy = detail_student.HPTichLuy.filter(ele => ele.HocPhan.MaHP != obj.MaHP)
            detail_student.save()
        })
    }
    async update(condition,data){
        return this.subjectsModel.findOneAndUpdate(condition, data)
    }
    

}
module.exports = SubjectStore;