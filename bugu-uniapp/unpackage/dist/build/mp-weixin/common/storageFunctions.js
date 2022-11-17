"use strict";var e=require("./vendor.js"),r=require("./storageKeys.js");exports.getMyUserInfo=async function(){return e.index.getStorageSync(r.USER_INFO)};
