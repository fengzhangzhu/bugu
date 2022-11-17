"use strict";
function GettimeifferenceOfNow(lastDate) {
  var lastDate = lastDate.replace(/\-/g, "/").replace("T", " ");
  var date = new Date(lastDate);
  var date_last = date.getTime();
  var date_now = new Date().getTime();
  var day = Math.round((date_now - date_last) / (1e3 * 60 * 60 * 24));
  var hours = Math.round((date_now - date_last) / (1e3 * 60 * 60));
  var minutes = Math.round((date_now - date_last) / (1e3 * 60));
  var myYear = date.getFullYear();
  var myMonth = date.getMonth() + 1;
  var myToday = date.getDate();
  var myHour = date.getHours();
  var myMinute = date.getMinutes();
  if (day > 0) {
    if (day > 10) {
      return {
        DistanceNow: myYear + "-" + myMonth + "-" + myToday,
        Detailed: myMonth + "-" + myToday,
        MinuteDifference: minutes,
        HourDifference: hours
      };
    }
    return {
      DistanceNow: `${day}\u5929\u524D`,
      Detailed: myMonth + "-" + myToday,
      MinuteDifference: minutes,
      HourDifference: hours
    };
  } else if (hours > 0) {
    return {
      DistanceNow: `${hours}\u5C0F\u65F6\u524D`,
      Detailed: (myHour < 10 ? "0" + myHour : myHour) + ":" + (myMinute < 10 ? "0" + myMinute : myMinute),
      MinuteDifference: minutes,
      HourDifference: hours
    };
  } else if (minutes > 0) {
    return {
      DistanceNow: `${minutes}\u5206\u949F\u524D`,
      Detailed: (myHour < 10 ? "0" + myHour : myHour) + ":" + (myMinute < 10 ? "0" + myMinute : myMinute),
      MinuteDifference: minutes,
      HourDifference: hours
    };
  } else {
    return {
      DistanceNow: `\u521A\u521A`,
      Detailed: (myHour < 10 ? "0" + myHour : myHour) + ":" + (myMinute < 10 ? "0" + myMinute : myMinute),
      HourDifference: hours,
      MinuteDifference: minutes
    };
  }
}
function GetNowDate() {
  var date = new Date();
  var myYear = date.getFullYear();
  var myMonth = date.getMonth() + 1;
  var myToday = date.getDate();
  var myDay = date.getDay();
  var myHour = date.getHours();
  var myMinute = date.getMinutes();
  var week = ["\u661F\u671F\u65E5", "\u661F\u671F\u4E00", "\u661F\u671F\u4E8C", "\u661F\u671F\u4E09", "\u661F\u671F\u56DB", "\u661F\u671F\u4E94", "\u661F\u671F\u516D"];
  return {
    MonthAndDay: myMonth + "\u6708" + myToday + "\u65E5",
    YearAndMothAndDay: myYear + "\u5E74" + myMonth + "\u6708" + myToday + "\u65E5",
    weekday: week[myDay],
    time: (myHour < 10 ? "0" + myHour : myHour) + ":" + (myMinute < 10 ? "0" + myMinute : myMinute)
  };
}
function GetNumberOfMenit(date1, date2) {
  date1 = date1.replace(/\-/g, "/");
  date2 = date2.replace(/\-/g, "/");
  var date1_time = new Date(date1).getTime();
  var date2_time = new Date(date2).getTime();
  var menit = Math.round((date2_time - date1_time) / (1e3 * 60));
  return menit;
}
function getTime() {
  var myDate = new Date();
  var myYear = myDate.getFullYear();
  var myMonth = myDate.getMonth() + 1;
  var myToday = myDate.getDate();
  var myHour = myDate.getHours();
  var myMinute = myDate.getMinutes();
  var mySecond = myDate.getSeconds();
  var nowTime;
  nowTime = myYear + "/" + myMonth + "/" + myToday + " " + (myHour < 10 ? "0" + myHour : myHour) + ":" + (myMinute < 10 ? "0" + myMinute : myMinute) + ":" + (mySecond < 10 ? "0" + mySecond : mySecond);
  return nowTime;
}
exports.GetNowDate = GetNowDate;
exports.GetNumberOfMenit = GetNumberOfMenit;
exports.GettimeifferenceOfNow = GettimeifferenceOfNow;
exports.getTime = getTime;
