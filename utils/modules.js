class ModuleStore{
    constructor(){
        this.ModulesModel = require('../model/modules.model')
    }
    async all(){
        return await this.ModulesModel.find({}).sort({MonHoc:1})
    }
    async updateOne(condition,data){
        return await this.ModulesModel.findOneAndUpdate(condition,data)
    }
    // async removeStudent(condition,student){
    //     let detail_student  = await students.findOne(student).populate([{path:'HPTichLuy.HocPhan'}])
    //     return await this.ModulesModel.findOne(condition,(err,obj)=>{
    //         obj.DSSinhVien = obj.DSSinhVien.filter(ele => {
    //             return (ele.SinhVien.equals(detail_student._id)==false)
    //         })
    //         obj.save()
    //         detail_student.HPTichLuy = detail_student.HPTichLuy.filter(ele => ele.HocPhan.MaHP != obj.MaHP)
    //         detail_student.save()
    //     })
    // }
    

}
module.exports = ModuleStore;