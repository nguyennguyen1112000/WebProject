class Register_SubjectStore{
    constructor(){
        this.Model = require('../model/register_subjects.model')
    }
    async all(){
        return await this.Model.find({}).populate([{ path: 'DSHocPhan.HocPhan' }])
    }
    async byCondition(condition){
        return await this.Model.find(condition).populate([{ path: 'DSHocPhan.HocPhan' }])
    }
    async detail(condition){
        return await this.Model.findOne(condition).populate([{ path: 'DSHocPhan.HocPhan' }])
    }
    async updateOne(condition,data){
        return await this.Model.findOneAndUpdate(condition,data)
    }
    async delete(condition){
        return await this.Model.findOneAndDelete(condition)
    }
    async add(data){
        let detail = new this.Model(data)
        return await detail.save()
    }

    

}
module.exports = Register_SubjectStore;