const { mapReduce } = require("../model/Account.model")

module.exports = {
    mutipleMongooseToObject: function (mongooses){
        return mongooses.map(mongoose => mongoose.toObject())
    },
    singleMongooseToObject: function (mongoose){
        return mongoose? mongoose.toObject(): mongoose
    },
}