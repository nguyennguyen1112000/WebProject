const multer = require('multer');
const path = require('path');
class FileStore{
  constructor(){
    this.storage = multer.diskStorage({
      destination: './resources/uploads/',
      filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
    })
  }
  //Check file type
  checkFileType(file, cb) {
    const filetypes = /xlsx|xls/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());  
    if (extname) {
        return cb(null, true);
    } else {
        cb('Error: Excel file Only!');
    }
  }
  //Init upload
  upload(fileName){
    return multer({
      storage: this.storage,
      limits: { fileSize: 1000000 },
      fileFilter: function (req, file, cb) {
          this.checkFileType(file, cb);
      }
    }).single(`${fileName}`);
  }

}

module.exports = FileStore



