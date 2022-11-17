"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_messageUtils_service = require("./service.js");
var utils_messageUtils_storage = require("./storage.js");
var utils_messageUtils_storageKeys = require("./storageKeys.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
var common_constants = require("../../common/constants.js");
async function getAndHandleUserMessageList(userId) {
  let unReadList = await utils_messageUtils_service.getUnReadUser();
  console.log("unReadList", unReadList);
  let chatUsersId = [];
  let userMessageList = [];
  let beforeUsermessageList = await utils_messageUtils_storage.getUserMessageList(userId);
  beforeUsermessageList.forEach((item) => {
    let hava_data = false;
    for (let i = 0; i < unReadList.length; i++) {
      if (unReadList[i].userId == item.userId) {
        hava_data = true;
        break;
      }
    }
    if (!hava_data) {
      chatUsersId.push(item.userId);
      userMessageList.push(item);
    }
  });
  let userInfos = await common_requestFunctions.updateUserInfo(chatUsersId);
  for (let i = 0; i < userInfos.length; i++) {
    if (userInfos[i].id == userMessageList[i].userId) {
      userMessageList[i].avatar = userInfos[i].avatar;
      userMessageList[i].username = userInfos[i].username;
      userMessageList[i].online = userInfos[i].online;
    } else {
      for (let j = 0; j < userMessageList.length; j++) {
        if (userInfos[i].id == userMessageList[j].userId) {
          userMessageList[j].avatar = userInfos[i].avatar;
          userMessageList[j].username = userInfos[i].username;
          userMessageList[j].online = userInfos[i].online;
          break;
        }
      }
    }
  }
  userMessageList = userMessageList.concat(unReadList);
  console.log("userMessageList", userMessageList);
  let storageKey = utils_messageUtils_storageKeys.getUserMessageListKey(userId);
  common_vendor.index.setStorage({ key: storageKey, data: userMessageList });
  return userMessageList;
}
async function getAndHandleInteractiveMessageList(userId) {
  let unreadSum = 0;
  let unreads = await utils_messageUtils_service.getUnReadInteractiveMessage();
  console.log("unreads", unreads);
  let likeMessages = [];
  let commentMessages = [];
  let attentionMessages = [];
  let publishMessages = [];
  for (let item of unreads) {
    if (utils_messageUtils_storage.likeGroup.includes(item.type)) {
      likeMessages.push(item);
    } else if (utils_messageUtils_storage.commentGroup.includes(item.type)) {
      commentMessages.push(item);
    } else if (item.type === common_constants.InteractiveType.ATTENTION) {
      attentionMessages.push(item);
    } else if (item.type === common_constants.InteractiveType.PUBLISH) {
      publishMessages.push(item);
    }
  }
  utils_messageUtils_storage.saveInteractiveMessageList(likeMessages, userId, "LIKE");
  utils_messageUtils_storage.saveInteractiveMessageList(commentMessages, userId, "COMMENT");
  utils_messageUtils_storage.saveInteractiveMessageList(attentionMessages, userId, "ATTENTION");
  utils_messageUtils_storage.saveInteractiveMessageList(publishMessages, userId, "PUBLISH");
  unreadSum = likeMessages.length + commentMessages.length + attentionMessages.length + publishMessages.length;
  return unreadSum;
}
async function getAndHandOfficialNewsList(userId) {
  let unReadNewsList = await utils_messageUtils_service.getUnReadOfficialNews();
  let beforeOfficialNewsList = await utils_messageUtils_storage.getOfficalList(userId);
  let officialNewsList = [];
  beforeOfficialNewsList.forEach((item, index) => {
    let hava_data = false;
    for (let i = 0; i < unReadNewsList.length; i++) {
      if (unReadNewsList[i].type == item.type) {
        hava_data = true;
        break;
      }
    }
    if (!hava_data) {
      officialNewsList.push(item);
    }
  });
  let OFFICE_NEWS_LIST = utils_messageUtils_storageKeys.getOfficeNewsListKey(userId);
  officialNewsList = officialNewsList.concat(unReadNewsList);
  await common_vendor.index.setStorage({
    key: OFFICE_NEWS_LIST,
    data: officialNewsList
  });
  return officialNewsList;
}
exports.getAndHandOfficialNewsList = getAndHandOfficialNewsList;
exports.getAndHandleInteractiveMessageList = getAndHandleInteractiveMessageList;
exports.getAndHandleUserMessageList = getAndHandleUserMessageList;
