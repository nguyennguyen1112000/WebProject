const mongoose = require('mongoose');
async function connect(){
  try {
    await mongoose.connect('mongodb://localhost:27017/manage_students', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
  console.log("Connect successfully!")
  } catch (error) {
    console.log("Fail to connect!")
  }
  
}
module.exports = {connect};