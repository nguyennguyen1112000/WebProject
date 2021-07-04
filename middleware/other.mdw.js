var hbs_sections = require("express-handlebars-sections");
var register = function (Handlebars) {
  var helpers = {
    ifCond: function (v1, v2, options) {
      if (v1 == v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    ifEID: function (v1, v2, options) {
      if (v1.equals(v2)) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    NamHoc: function (startDate, endDate, term) {
      if (term == 1) {
        year = endDate.getFullYear();
      } else if (term == 2) {
        year = startDate.getFullYear();
      }
      date = `${year - 1}-${year}`;
      return date;
    },
    countArray: function (arr) {
      if (Array.isArray(arr)) return arr.length;
      else return 0;
    },
    DateFormat: function (date) {
      if (typeof date == "string") {
        date = new Date(date);
      }
      let d = date.toLocaleDateString();
      let arr = d.split("/");
      return arr[1] + "/" + arr[0] + "/" + arr[2];
    },
    LocaleStringDate: (date) => date.toLocaleDateString(),
    Add: function (x, y) {
      return x + y;
    },
    TinhTrang: function (NgayKetThuc) {
      return NgayKetThuc >= new Date() ? "Đã kết thúc" : "Đang diễn ra";
    },
    TimeFormat: function (date) {
      var days = [
        "Chủ nhật",
        "thứ 2",
        "thứ 3",
        "thứ 4",
        "thứ 5",
        "thứ 6",
        "thứ 7",
      ];
      var day = days[date.getDay()];
      var hr = date.getHours();
      var min = date.getMinutes();
      if (min < 10) {
        min = "0" + min;
      }
      var ampm = "A.M";
      if (hr > 12) {
        hr -= 12;
        ampm = "P.M";
      }
      var temp = date.getDate();
      var month = date.getMonth()+1;
      var year = date.getFullYear();
      return (
        hr +
        ":" +
        min +
        " " +
        ampm +
        ", " +
        day +
        ", ngày " +
        temp +
        "/" +
        month +
        "/" +
        year
      );
    },
    XepLoai: function (mark) {
      if (mark >= 5) return "Đạt";
      return "Chưa đạt";
    },
    section: hbs_sections(),
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    return helpers;
  }
};
module.exports.register = register;
module.exports.helpers = register(null);
