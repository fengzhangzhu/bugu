"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var common_vendor = require("../common/vendor.js");
var common_constants = require("../common/constants.js");
async function getWeatherInfo(latitude, longitude) {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      method: "GET",
      url: "https://living.hbut.edu.cn/living/weather/now",
      data: {
        latitude,
        longitude
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(result) {
        resolve(result);
      },
      fail: function(e) {
        console.log("error in...");
        reject(e);
      }
    });
  });
}
async function request(req) {
  let token = "";
  try {
    token = common_vendor.index.getStorageSync("token");
  } catch {
  }
  if (!token) {
    console.log("\u672A\u767B\u9304");
  }
  let random16 = common_constants.random16String();
  let time = common_constants.timestamp;
  let header = __spreadProps(__spreadValues({}, req.data.header), {
    "t": time,
    "r": random16,
    "s": common_vendor.md5(time + random16 + common_constants.key),
    "token": token
  });
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      method: req.data.method,
      url: `${common_constants.Protocol}://${common_constants.ServerDomain}${req.data.modular ? "/" + req.data.modular : ""}/living/${req.data.group}/${req.data.action}`,
      data: req.data.data,
      header,
      success: function(result) {
        resolve(result);
        let data = result.data;
        let resCode = data.code;
        let userMsg = data.userMsg;
        if (resCode != common_constants.REQUEST_SUCCEEDED_CODE) {
          console.log(result.data);
          if (resCode === "A0001" || resCode === "A0005") {
            common_vendor.index.showToast({
              title: "\u767B\u5F55\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55",
              icon: "none"
            });
          } else {
            if (result.data.data === "\u7528\u6237\u672A\u8BA4\u8BC1,\u8BF7\u5148\u8BA4\u8BC1") {
              common_vendor.index.showModal({
                title: "\u672A\u5B9E\u540D\u8BA4\u8BC1",
                content: "\u53D1\u5E03\u5185\u5BB9\u9700\u8981\u5B9E\u540D\u8BA4\u8BC1\u54E6~",
                success: function(res) {
                  if (res.confirm) {
                    common_vendor.index.navigateTo({
                      url: "/pages/setting/setting?open_real_name_authentication=true"
                    });
                  }
                }
              });
              return result;
            }
            if (data.errMsg == "\u7528\u6237\u672A\u8BA4\u8BC1,\u8BF7\u5148\u8BA4\u8BC1") {
              common_vendor.index.showModal({
                title: "\u672A\u5B9E\u540D\u8BA4\u8BC1",
                content: "\u53D1\u5E03\u5185\u5BB9\u9700\u8981\u5B9E\u540D\u8BA4\u8BC1\u54E6~",
                success: function(res) {
                  if (res.confirm) {
                    common_vendor.index.navigateTo({
                      url: "/pages/setting/setting?open_real_name_authentication=true"
                    });
                  }
                }
              });
              return result;
            }
            common_vendor.index.showToast({
              title: userMsg ? userMsg : "\u7F51\u7EDC\u5F02\u5E38",
              icon: "none"
            });
          }
        }
        return result;
      },
      fail: function(e) {
        console.log("error in...");
        msag(e);
        reject(e);
      }
    });
  });
}
function msag(err) {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        common_vendor.index.showToast({
          title: err.response.data.error.details,
          icon: "none"
        });
        break;
      case 401:
        common_vendor.index.showToast({
          title: "\u672A\u6388\u6743\uFF0C\u8BF7\u767B\u5F55",
          icon: "none"
        });
        break;
      case 403:
        common_vendor.index.showToast({
          title: "\u62D2\u7EDD\u8BBF\u95EE",
          icon: "none"
        });
        break;
      case 404:
        common_vendor.index.showToast({
          title: "\u8BF7\u6C42\u5730\u5740\u51FA\u9519",
          icon: "none"
        });
        break;
      case 408:
        common_vendor.index.showToast({
          title: "\u8BF7\u6C42\u8D85\u65F6",
          icon: "none"
        });
        break;
      case 500:
        common_vendor.index.showToast({
          title: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF",
          icon: "none"
        });
        break;
      case 501:
        common_vendor.index.showToast({
          title: "\u670D\u52A1\u672A\u5B9E\u73B0",
          icon: "none"
        });
        break;
      case 502:
        common_vendor.index.showToast({
          title: "\u7F51\u5173\u9519\u8BEF",
          icon: "none"
        });
        break;
      case 503:
        common_vendor.index.showToast({
          title: "\u670D\u52A1\u4E0D\u53EF\u7528",
          icon: "none"
        });
        break;
      case 504:
        common_vendor.index.showToast({
          title: "\u7F51\u5173\u8D85\u65F6",
          icon: "none"
        });
        break;
      case 505:
        common_vendor.index.showToast({
          title: "HTTP\u7248\u672C\u4E0D\u53D7\u652F\u6301",
          icon: "none"
        });
        break;
    }
  }
}
exports.getWeatherInfo = getWeatherInfo;
exports.request = request;
