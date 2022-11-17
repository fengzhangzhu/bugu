"use strict";
var common_vendor = require("../common/vendor.js");
var store_modules_messageStore = require("./modules/messageStore.js");
var store_modules_socketStateStore = require("./modules/socketStateStore.js");
var store = common_vendor.createStore({
  modules: {
    messageStore: store_modules_messageStore.messageStore,
    socketStateStore: store_modules_socketStateStore.socketStateStore
  }
});
exports.store = store;
