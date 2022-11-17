"use strict";
var common_vendor = require("../../../../../common/vendor.js");
var uni_modules_zPaging_components_zPaging_js_zPagingI18n = require("./z-paging-i18n.js");
var uni_modules_zPaging_components_zPaging_js_zPagingConfig = require("./z-paging-config.js");
var uni_modules_zPaging_components_zPaging_config_index = require("../config/index.js");
const storageKey = "Z-PAGING-REFRESHER-TIME-STORAGE-KEY";
let config = null;
function gc(key, defaultValue) {
  if (!config) {
    if (uni_modules_zPaging_components_zPaging_config_index.zLocalConfig && Object.keys(uni_modules_zPaging_components_zPaging_config_index.zLocalConfig).length) {
      config = uni_modules_zPaging_components_zPaging_config_index.zLocalConfig;
    } else {
      const temConfig = uni_modules_zPaging_components_zPaging_js_zPagingConfig.zConfig.getConfig();
      if (uni_modules_zPaging_components_zPaging_js_zPagingConfig.zConfig && temConfig) {
        config = temConfig;
      }
    }
  }
  if (!config)
    return defaultValue;
  const value = config[_toKebab(key)];
  return value === void 0 ? defaultValue : value;
}
function arrayIsEqual(arr1, arr2) {
  if (arr1 === arr2)
    return true;
  if (arr1.length !== arr2.length)
    return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i])
      return false;
  }
  return true;
}
function getTouch(e) {
  let touch = null;
  if (e.touches && e.touches.length) {
    touch = e.touches[0];
  } else if (e.changedTouches && e.changedTouches.length) {
    touch = e.changedTouches[0];
  } else if (e.datail && e.datail != {}) {
    touch = e.datail;
  } else {
    return {
      touchX: 0,
      touchY: 0
    };
  }
  return {
    touchX: touch.clientX,
    touchY: touch.clientY
  };
}
function getTouchFromZPaging(target) {
  if (target && target.tagName && target.tagName !== "BODY" && target.tagName !== "UNI-PAGE-BODY") {
    const classList = target.classList;
    if (classList && classList.contains("z-paging-content")) {
      return {
        "isFromZp": true,
        "isPageScroll": classList.contains("z-paging-content-page"),
        "isReachedTop": classList.contains("z-paging-reached-top")
      };
    } else {
      return getTouchFromZPaging(target.parentNode);
    }
  } else {
    return { "isFromZp": false };
  }
}
function getParent(parent) {
  if (!parent)
    return null;
  if (parent.$refs.paging)
    return parent;
  return getParent(parent.$parent);
}
function consoleErr(err) {
  console.error(`[z-paging]${err}`);
}
function consoleWarn(warn) {
  console.warn(`[z-paging]${warn}`);
}
function setRefesrherTime(time, key) {
  try {
    let datas = getRefesrherTime();
    if (!datas) {
      datas = {};
    }
    datas[key] = time;
    common_vendor.index.setStorageSync(storageKey, datas);
  } catch (e) {
  }
}
function getRefesrherTime() {
  try {
    const datas = common_vendor.index.getStorageSync(storageKey);
    return datas;
  } catch (e) {
    return null;
  }
}
function getRefesrherTimeByKey(key) {
  const datas = getRefesrherTime();
  if (datas) {
    const data = datas[key];
    if (data)
      return data;
  }
  return null;
}
function getRefesrherFormatTimeByKey(key) {
  const time = getRefesrherTimeByKey(key);
  let timeText = uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n.t["refresherUpdateTimeNoneText"][uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n.getLanguage()];
  if (time) {
    timeText = _timeFormat(time);
  }
  return `${uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n.t["refresherUpdateTimeText"][uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n.getLanguage()]}${timeText}`;
}
function convertTextToPx(text) {
  const dataType = Object.prototype.toString.call(text);
  if (dataType === "[object Number]") {
    return text;
  }
  let isRpx = false;
  if (text.indexOf("rpx") !== -1 || text.indexOf("upx") !== -1) {
    text = text.replace("rpx", "").replace("upx", "");
    isRpx = true;
  } else if (text.indexOf("px") !== -1) {
    text = text.replace("px", "");
  }
  if (!isNaN(text)) {
    if (isRpx)
      return Number(common_vendor.index.upx2px(text));
    return Number(text);
  }
  return 0;
}
function getTime() {
  return new Date().getTime();
}
function getInstanceId() {
  let s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 10; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
  }
  return s.join("") + getTime();
}
function _timeFormat(time) {
  const date = new Date(time);
  const currentDate = new Date();
  const dateDay = new Date(time).setHours(0, 0, 0, 0);
  const currentDateDay = new Date().setHours(0, 0, 0, 0);
  const disTime = dateDay - currentDateDay;
  let dayStr = "";
  const timeStr = _dateTimeFormat(date);
  if (disTime === 0) {
    dayStr = uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n.t["refresherUpdateTimeTodayText"][uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n.getLanguage()];
  } else if (disTime === -864e5) {
    dayStr = uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n.t["refresherUpdateTimeYesterdayText"][uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n.getLanguage()];
  } else {
    dayStr = _dateDayFormat(date, date.getFullYear() !== currentDate.getFullYear());
  }
  return `${dayStr} ${timeStr}`;
}
function _dateDayFormat(date, showYear = true) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (showYear) {
    return `${year}-${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}`;
  } else {
    return `${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}`;
  }
}
function _dateTimeFormat(date) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${_fullZeroToTwo(hour)}:${_fullZeroToTwo(minute)}`;
}
function _fullZeroToTwo(str) {
  str = str.toString();
  if (str.length === 1)
    return "0" + str;
  return str;
}
function _toKebab(value) {
  return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}
var u = {
  gc,
  setRefesrherTime,
  getRefesrherFormatTimeByKey,
  arrayIsEqual,
  getTouch,
  getTouchFromZPaging,
  getParent,
  convertTextToPx,
  getTime,
  getInstanceId,
  consoleErr,
  consoleWarn
};
exports.u = u;
