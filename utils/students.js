const students = require('../model/students.model')
class StudentStore{
    constructor(){
        this.studentsModel = require('../model/students.model')
    }
    async all(){
        return await this.studentsModel.find({})
    }

    async findOne(condition){
        return await this.studentsModel.findOne(condition).populate([{ path: 'HPTichLuy.HocPhan' }])
    }
    async addList(list){
        list.forEach(async (element) => {
            let check = await this.studentsModel.findOne({MSSV: element.MSSV})
            if(!check){
                const newStudent = new students(element)
                await newStudent.save()
            }
        });
    }
    async addOne(student){
        let check = await this.studentsModel.findOne({MSSV: student.MSSV})
        if(!check){
            const newStudent = new students(student)
            await newStudent.save()
        }
        else return false
    }

}
module.exports = StudentStore;