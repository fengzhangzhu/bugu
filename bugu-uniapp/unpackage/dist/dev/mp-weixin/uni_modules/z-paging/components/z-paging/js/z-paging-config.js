"use strict";
var common_vendor = require("../../../../../common/vendor.js");
let config = null;
let getedStorage = false;
const storageKey = "Z-PAGING-CONFIG-STORAGE-KEY";
function setConfig(value) {
  try {
    common_vendor.index.setStorageSync(storageKey, value);
  } catch (e) {
  }
}
function getConfig() {
  try {
    if (getedStorage)
      return config;
    config = common_vendor.index.getStorageSync(storageKey);
    getedStorage = true;
  } catch (e) {
    return null;
  }
}
var zConfig = {
  setConfig,
  getConfig
};
exports.zConfig = zConfig;
