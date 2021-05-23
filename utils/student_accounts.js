class Student_AccountStore{
    constructor(){
        this.Model = require('../model/students_accounts.model')
    }
    async all(){
        return await this.Model.find({}).populate([{ path: 'SinhVien' }])
    }
    async byCondition(condition){
        return await this.Model.find(condition).populate([{ path: 'SinhVien' }])
    }
    async detail(condition){
        return await this.Model.findOne(condition).populate([{ path: 'SinhVien' }])
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
module.exports = Student_AccountStore;