import {timeDifference} from "@/common/dataClass"
//获取今天和指定日期的时间差 
export function GettimeifferenceOfNow(lastDate: string): timeDifference {
    var lastDate = lastDate.replace(/\-/g, "/").replace("T"," ")     //使用replace函数，调用data.replace(/\-/g, "/")将全部的“-”替换为”/“
    var date = new Date(lastDate)
    var date_last = date.getTime();
    var date_now = new Date().getTime();
    var day = Math.round((date_now - date_last) / (1000 * 60 * 60 * 24));//核心：时间戳相减，然后除以天数
    var hours = Math.round((date_now - date_last) / (1000 * 60 * 60));//核心：时间戳相减，然后除以天数
    var minutes = Math.round((date_now - date_last) / (1000 * 60));//核心：时间戳相减，然后除以天数
    var myYear = date.getFullYear(); //获取完整的年份(4位,1970-????)
    var myMonth = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var myToday = date.getDate(); //获取当前日(1-31)
    // var myDay = date.getDay(); //获取当前星期X(0-6,0代表星期天)
    var myHour = date.getHours(); //获取当前小时数(0-23)
    var myMinute = date.getMinutes(); //获取当前分钟数(0-59)
    // var mySecond = date.getSeconds(); //获取当前秒数(0-59)
    // var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    if (day > 0) {
		
		if(day>10){
			return {
			    DistanceNow: myYear + '-' + myMonth + '-' + myToday,
			    Detailed: myMonth + '-' + myToday ,
			    MinuteDifference: minutes,
			    HourDifference: hours,
			}
		}
        return {
            DistanceNow: `${day}天前`,
            Detailed: myMonth + '-' + myToday ,
            MinuteDifference: minutes,
            HourDifference: hours,

        }
    } else if (hours > 0) {
        return {
            DistanceNow: `${hours}小时前`,
            Detailed: (myHour < 10 ? '0' + myHour : myHour) + ':' + (myMinute < 10 ? '0' + myMinute : myMinute),
            MinuteDifference: minutes,
            HourDifference: hours,
        }
    } else if (minutes > 0) {
        return {
            DistanceNow: `${minutes}分钟前`,
            Detailed: (myHour < 10 ? '0' + myHour : myHour) + ':' + (myMinute < 10 ? '0' + myMinute : myMinute),
            MinuteDifference: minutes,
            HourDifference: hours,
        }
    } else {
        return {
            DistanceNow: `刚刚`,
            Detailed: (myHour < 10 ? '0' + myHour : myHour) + ':' + (myMinute < 10 ? '0' + myMinute : myMinute),
            HourDifference: hours,
            MinuteDifference: minutes
        }
    }
};
//获取今天的日期
/**
 * @function 获取今天的日期-中文
 * @returns {{
 * MonthAndDay：月和日期，
 * YearAndMothAndDay:年月日
 * weekday:星期几
 * time:时间 小时和分钟
 * }}
 */
export function GetNowDate() {

    var date = new Date()
    // var date_now = new Date().getTime();
    var myYear = date.getFullYear(); //获取完整的年份(4位,1970-????)
    var myMonth = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var myToday = date.getDate(); //获取当前日(1-31)
    var myDay = date.getDay(); //获取当前星期X(0-6,0代表星期天)
    var myHour = date.getHours(); //获取当前小时数(0-23)
    var myMinute = date.getMinutes(); //获取当前分钟数(0-59)
    // var mySecond = date.getSeconds(); //获取当前秒数(0-59)
    var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    return {
        MonthAndDay: myMonth + '月' + myToday + '日',
        YearAndMothAndDay: myYear + '年' + myMonth + '月' + myToday + '日',
        weekday: week[myDay],
        time: (myHour < 10 ? '0' + myHour : myHour) + ':' + (myMinute < 10 ? '0' + myMinute : myMinute)
    }

};
//获得两个时间的分钟数差值
export function GetNumberOfMenit(date1, date2) {
	//date1：开始日期，date2结束日期
	date1=date1.replace(/\-/g, "/")     //使用replace函数，调用data.replace(/\-/g, "/")将全部的“-”替换为”/“
	date2=date2.replace(/\-/g, "/")
	var date1_time = new Date(date1).getTime();
	var date2_time = new Date(date2).getTime();
	var menit = Math.round((date2_time - date1_time) / (1000 * 60));//核心：时间戳相减，然后除以天数
	return menit
};
//获取现在的时间
export function getTime() {
  var myDate = new Date();
  var myYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
  var myMonth = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
  var myToday = myDate.getDate(); //获取当前日(1-31)
  // var myDay = myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
  var myHour = myDate.getHours(); //获取当前小时数(0-23)
  var myMinute = myDate.getMinutes(); //获取当前分钟数(0-59)
  var mySecond = myDate.getSeconds(); //获取当前秒数(0-59)
  // var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  var nowTime;

  nowTime = myYear + '/' + myMonth + '/' + myToday + ' ' + (myHour < 10 ? '0' + myHour : myHour) + ':' +
    (myMinute < 10 ? '0' + myMinute : myMinute) + ':' + (mySecond < 10 ? '0' + mySecond : mySecond);
  //console.log(nowTime);
  return nowTime
};
