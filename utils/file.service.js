const multer = require("multer");
const path = require("path");
const reader = require('xlsx');
const storage = multer.diskStorage({
  destination: "./resources/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
function checkFileType(file, cb) {
  const filetypes = /xlsx|xls/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  } else {
    cb("Error: Excel file Only!");
  }
}
module.exports = {
  upload: multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).single("file"),
  parseFile(file){
    let data = [];
    const sheets = file.SheetNames;
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]],{raw:false});
      temp.forEach((res) => {
        data.push(res);
      });
    }
    return data;
  }
};

