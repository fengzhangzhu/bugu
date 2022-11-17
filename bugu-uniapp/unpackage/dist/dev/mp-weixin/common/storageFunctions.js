"use strict";
var common_vendor = require("./vendor.js");
var common_storageKeys = require("./storageKeys.js");
async function getMyUserInfo() {
  let userInfo = common_vendor.index.getStorageSync(common_storageKeys.USER_INFO);
  return userInfo;
}
exports.getMyUserInfo = getMyUserInfo;
