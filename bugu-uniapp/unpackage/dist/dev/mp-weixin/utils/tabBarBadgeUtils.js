"use strict";
var common_vendor = require("../common/vendor.js");
var common_constants = require("../common/constants.js");
var common_globalMsgKeys = require("../common/globalMsgKeys.js");
var utils_messageUtils_index = require("./messageUtils/index.js");
async function initUnreadMessageSum(userId) {
  let unreadSum = 0;
  let messageList = await utils_messageUtils_index.getAndHandleUserMessageList(userId);
  let officialNewsList = await utils_messageUtils_index.getAndHandOfficialNewsList(userId);
  let messageSum = 0;
  messageList.forEach((item) => {
    if (item.unReadSum > 0) {
      messageSum = messageSum + item.unReadSum;
    }
  });
  let officialSum = 0;
  officialNewsList.forEach((item) => {
    if (item.unreadSum > 0) {
      officialSum = officialSum + item.unreadSum;
    }
  });
  let interactiveSum = await utils_messageUtils_index.getAndHandleInteractiveMessageList(userId);
  unreadSum = messageSum + officialSum + interactiveSum;
  console.log("messageSum", messageSum);
  console.log("officialSum", officialSum);
  console.log("interactiveSum", interactiveSum);
  common_constants.setGlobalData(common_globalMsgKeys.ALL_UNREAD_MESSAGE_SUM, unreadSum);
  if (unreadSum > 0) {
    common_vendor.index.setTabBarBadge({
      index: 2,
      text: String(unreadSum)
    });
  } else {
    common_vendor.index.removeTabBarBadge({
      index: 2
    });
  }
}
function changeUnreadMessageSum(changeNumber = 0) {
  let unreadSum = 0;
  try {
    unreadSum = common_constants.getGlobalData(common_globalMsgKeys.ALL_UNREAD_MESSAGE_SUM);
    unreadSum = unreadSum + changeNumber;
  } catch {
    if (changeNumber > 0) {
      unreadSum = unreadSum + changeNumber;
    }
  }
  common_constants.setGlobalData(common_globalMsgKeys.ALL_UNREAD_MESSAGE_SUM, unreadSum);
  if (unreadSum > 0) {
    common_vendor.index.setTabBarBadge({
      index: 2,
      text: String(unreadSum)
    });
  } else {
    common_vendor.index.removeTabBarBadge({
      index: 2
    });
  }
}
exports.changeUnreadMessageSum = changeUnreadMessageSum;
exports.initUnreadMessageSum = initUnreadMessageSum;
