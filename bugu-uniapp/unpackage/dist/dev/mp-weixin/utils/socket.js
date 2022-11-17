"use strict";
var common_vendor = require("../common/vendor.js");
var store_index = require("../store/index.js");
var common_constants = require("../common/constants.js");
var common_storageKeys = require("../common/storageKeys.js");
var utils_tabBarBadgeUtils = require("./tabBarBadgeUtils.js");
var utils_messageUtils_storage = require("./messageUtils/storage.js");
var common_storageFunctions = require("../common/storageFunctions.js");
async function connectSocket() {
  let token = common_vendor.index.getStorageSync(common_storageKeys.TOKEN);
  let userInfo = await common_storageFunctions.getMyUserInfo();
  console.log(`${token}`);
  if (token) {
    let task = common_vendor.index.connectSocket({
      url: `${common_constants.SoketUrl}${token}`,
      success: function() {
        console.log("connect success");
      }
    });
    task.onOpen(function() {
      store_index.store.commit("socketStateStore/onSocketConnected", true);
      setInterval(() => {
        console.log("onOpen");
        task.send({ data: "\u6211\u5DF2\u7ECF\u4E0A\u7EBF" });
      }, 3e4);
    });
    task.onMessage(async function(msg) {
      console.log("onMessage: ", msg);
      let msgData = msg.data;
      let socketResult = JSON.parse(msgData);
      console.log("socketResult.type", socketResult.type);
      if (socketResult.type === common_constants.USER_MESSAGE) {
        let new_message_sound = common_vendor.index.getStorageSync(common_storageKeys.NEW_MESSAGE_SOUND);
        if (!new_message_sound) {
          new_message_sound = common_constants.RingingToneList[0];
        }
        const innerAudioContext = common_vendor.index.createInnerAudioContext();
        innerAudioContext.autoplay = true;
        innerAudioContext.src = new_message_sound.url;
        let new_message = JSON.parse(msgData);
        await utils_messageUtils_storage.saveUserMessageList(new_message, userInfo.id);
        await utils_messageUtils_storage.saveChatRecord(new_message, userInfo.id);
        utils_tabBarBadgeUtils.changeUnreadMessageSum(1);
        onNewMessage(msg.data);
      } else if (socketResult.type === common_constants.WITHDRAW) {
        let new_message = JSON.parse(msgData);
        await utils_messageUtils_storage.saveWithDrawChatRecord(new_message, userInfo.id);
        await utils_messageUtils_storage.saveUserMessageListWhenWithDraw(new_message, userInfo.id);
        onNewMessage(msg.data);
      } else if (socketResult.type === common_constants.ALREADY_READ) {
        let new_message = JSON.parse(msgData);
        await utils_messageUtils_storage.saveAlreadyRead(new_message, userInfo.id);
        onNewMessage(msg.data);
      } else if (socketResult.type === common_constants.INTERACTIVE) {
        utils_tabBarBadgeUtils.changeUnreadMessageSum(1);
        let new_message = JSON.parse(msgData);
        await utils_messageUtils_storage.saveInteractiveMessageItem(new_message, userInfo.id);
        onNewMessage(msg.data);
      }
    });
    task.onError(function() {
      console.log("onError");
      common_vendor.index.closeSocket({});
    });
    task.onClose(() => {
      store_index.store.commit("socketStateStore/onSocketConnected", false);
    });
  }
}
function onNewMessage(e) {
  e = JSON.parse(e);
  store_index.store.commit("messageStore/onNewMessage", e);
  let state = store_index.store.state;
  console.log(state.messageStore.newMessage);
}
exports.connectSocket = connectSocket;
