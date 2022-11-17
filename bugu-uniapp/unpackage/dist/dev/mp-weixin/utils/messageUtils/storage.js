"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_messageUtils_storageKeys = require("./storageKeys.js");
var utils_dateUtils = require("../dateUtils.js");
var common_constants = require("../../common/constants.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
const likeGroup = [common_constants.InteractiveType.LIKE, common_constants.InteractiveType.AGREE];
const commentGroup = [common_constants.InteractiveType.COMMENT, common_constants.InteractiveType.ANSWER];
async function saveChatRecord(new_message, userId) {
  let CHAT_RECORD = utils_messageUtils_storageKeys.getChatRecordKey(userId, new_message.data.fromUserId);
  let messagesGroup = await getChatRecord(userId, new_message.data.fromUserId);
  let messages = messagesGroup.messages;
  messages.push({
    content: new_message.data.content,
    type: new_message.data.type,
    id: new_message.data.id,
    createTime: utils_dateUtils.getTime(),
    isMe: false,
    time: new_message.data.time
  });
  messagesGroup.badgeNumber = messagesGroup.badgeNumber + 1;
  messagesGroup.messages = messages;
  common_vendor.index.setStorage({ key: CHAT_RECORD, data: messagesGroup });
}
async function saveWithDrawChatRecord(with_draw_message, userId) {
  let CHAT_RECORD = utils_messageUtils_storageKeys.getChatRecordKey(userId, with_draw_message.data.userId);
  let messagesGroup = await getChatRecord(userId, with_draw_message.data.userId);
  let messages = messagesGroup.messages;
  for (let j = messages.length - 1; j >= 0; j--) {
    if (messages[j].id == with_draw_message.data.messageId) {
      messages[j] = {
        id: with_draw_message.data.messageId,
        type: -1,
        content: "\u5BF9\u65B9\u64A4\u56DE\u4E86\u4E00\u6761\u6D88\u606F",
        createTime: messages[j].createTime,
        isMe: false
      };
    }
  }
  messagesGroup.messages = messages;
  common_vendor.index.setStorage({ key: CHAT_RECORD, data: messagesGroup });
}
async function saveAlreadyRead(new_message, userId) {
  let CHAT_RECORD = utils_messageUtils_storageKeys.getChatRecordKey(userId, new_message.data.userId);
  let messagesGroup = await getChatRecord(userId, new_message.data.userId);
  let messages = messagesGroup.messages;
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].isMe) {
      messages[i].isNotRead = false;
    }
  }
  messagesGroup.messages = messages;
  common_vendor.index.setStorage({ key: CHAT_RECORD, data: messagesGroup });
}
async function getChatRecord(userId, toUserId) {
  let CHAT_RECORD = utils_messageUtils_storageKeys.getChatRecordKey(userId, toUserId);
  let userMessageGroup = common_vendor.index.getStorageSync(CHAT_RECORD);
  if (!userMessageGroup) {
    userMessageGroup = {
      fromUserId: toUserId,
      type: common_constants.USER_MESSAGE,
      badgeNumber: 0,
      messages: []
    };
  }
  return userMessageGroup;
}
async function saveUserMessageList(new_message, userId) {
  let USER_MESSAGE_LIST = utils_messageUtils_storageKeys.getUserMessageListKey(userId);
  let userMessageList = await getUserMessageList(userId);
  let have_data = false;
  for (let i = 0; i < userMessageList.length; i++) {
    if (new_message.data.fromUserId == userMessageList[i].userId) {
      userMessageList.push({
        avatar: userMessageList[i].avatar,
        lastMessage: new_message.data.content,
        lastMessageType: new_message.data.type,
        lastTime: utils_dateUtils.getTime(),
        online: userMessageList[i].online,
        unReadSum: userMessageList[i].unReadSum + 1,
        userId: userMessageList[i].userId,
        username: userMessageList[i].username
      });
      userMessageList.splice(i, 1);
      have_data = true;
      common_vendor.index.setStorage({ key: USER_MESSAGE_LIST, data: userMessageList });
      break;
    }
  }
  if (!have_data) {
    let userInfo = await common_requestFunctions.getUserinfo(new_message.data.fromUserId);
    if (userInfo) {
      userMessageList.push({
        avatar: userInfo.avatar,
        lastMessage: new_message.data.content,
        lastMessageType: new_message.data.type,
        lastTime: utils_dateUtils.getTime(),
        online: true,
        unReadSum: 1,
        userId: userInfo.id,
        username: userInfo.username
      });
    }
  }
  common_vendor.index.setStorage({ key: USER_MESSAGE_LIST, data: userMessageList });
}
async function saveUserMessageListWhenWithDraw(with_draw_message, userId) {
  let USER_MESSAGE_LIST = utils_messageUtils_storageKeys.getUserMessageListKey(userId);
  let userMessageList = await getUserMessageList(userId);
  let have_data = false;
  for (let i = 0; i < userMessageList.length; i++) {
    if (with_draw_message.data.userId == userMessageList[i].userId) {
      userMessageList[i] = {
        avatar: userMessageList[i].avatar,
        lastMessage: "\u5BF9\u65B9\u64A4\u56DE\u4E86\u4E00\u6761\u6D88\u606F",
        lastMessageType: -1,
        lastTime: userMessageList[i].lastTime,
        online: userMessageList[i].online,
        unReadSum: userMessageList[i].unReadSum,
        userId: userMessageList[i].userId,
        username: userMessageList[i].username
      };
      have_data = true;
      break;
    }
  }
  if (!have_data) {
    let userInfo = await common_requestFunctions.getUserinfo(with_draw_message.data.userId);
    if (userInfo) {
      userMessageList.push({
        avatar: userInfo.avatar,
        lastMessage: "\u5BF9\u65B9\u64A4\u56DE\u4E86\u4E00\u6761\u6D88\u606F",
        lastMessageType: -1,
        lastTime: utils_dateUtils.getTime(),
        online: true,
        unReadSum: 0,
        userId: userInfo.id,
        username: userInfo.username
      });
    }
  }
  common_vendor.index.setStorage({ key: USER_MESSAGE_LIST, data: userMessageList });
}
async function deleteUserMessageItem(userId, toUserId) {
  let userMessageList = await getUserMessageList(userId);
  let USER_MESSAGE_LIST = utils_messageUtils_storageKeys.getUserMessageListKey(userId);
  for (let i = 0; i < userMessageList.length; i++) {
    if (userMessageList[i].userId == toUserId) {
      let CHAT_RECORD = utils_messageUtils_storageKeys.getChatRecordKey(userId, toUserId);
      common_vendor.index.setStorage({ key: CHAT_RECORD, data: null });
      userMessageList.splice(i, 1);
      break;
    }
  }
  common_vendor.index.setStorage({ key: USER_MESSAGE_LIST, data: userMessageList });
  return userMessageList;
}
async function getUserMessageList(userId) {
  let USER_MESSAGE_LIST = utils_messageUtils_storageKeys.getUserMessageListKey(userId);
  let userMessageList = common_vendor.index.getStorageSync(USER_MESSAGE_LIST);
  if (!userMessageList) {
    userMessageList = [];
  }
  return userMessageList;
}
async function saveInteractiveMessageItem(new_message, userId) {
  console.log("new_message", new_message);
  let INTERACTIVE_MESSAGE_LIST;
  let interactiveList;
  if (likeGroup.includes(new_message.data.type)) {
    INTERACTIVE_MESSAGE_LIST = utils_messageUtils_storageKeys.getInteractiveMessageListKey(userId, "LIKE");
    interactiveList = await getInteractiveMessageList(userId, "LIKE");
  } else if (commentGroup.includes(new_message.data.type)) {
    INTERACTIVE_MESSAGE_LIST = utils_messageUtils_storageKeys.getInteractiveMessageListKey(userId, "COMMENT");
    interactiveList = await getInteractiveMessageList(userId, "COMMENT");
  } else if (new_message.data.type === common_constants.InteractiveType.PUBLISH) {
    INTERACTIVE_MESSAGE_LIST = utils_messageUtils_storageKeys.getInteractiveMessageListKey(userId, "PUBLISH");
    interactiveList = await getInteractiveMessageList(userId, "PUBLISH");
  } else if (new_message.data.type === common_constants.InteractiveType.ATTENTION) {
    INTERACTIVE_MESSAGE_LIST = utils_messageUtils_storageKeys.getInteractiveMessageListKey(userId, "ATTENTION");
    interactiveList = await getInteractiveMessageList(userId, "ATTENTION");
  }
  new_message.data.createTime = utils_dateUtils.getTime();
  interactiveList.data.push(new_message.data);
  interactiveList.unreadSum = interactiveList.unreadSum + 1;
  common_vendor.index.setStorage({ key: INTERACTIVE_MESSAGE_LIST, data: interactiveList });
}
async function saveInteractiveMessageList(messages, userId, type) {
  if (messages.length < 1) {
    return;
  }
  let INTERACTIVE_MESSAGE_LIKE = utils_messageUtils_storageKeys.getInteractiveMessageListKey(userId, type);
  let interactiveList = await getInteractiveMessageList(userId, type);
  interactiveList.data = messages.concat(interactiveList.data);
  interactiveList.unreadSum = interactiveList.unreadSum + messages.length;
  common_vendor.index.setStorage({ key: INTERACTIVE_MESSAGE_LIKE, data: interactiveList });
}
async function interactiveMessageALLRead(userId, type) {
  let INTERACTIVE_MESSAGE_LIST = utils_messageUtils_storageKeys.getInteractiveMessageListKey(userId, type);
  let interactiveList = await getInteractiveMessageList(userId, type);
  interactiveList.unreadSum = 0;
  common_vendor.index.setStorage({ key: INTERACTIVE_MESSAGE_LIST, data: interactiveList });
}
async function deleteAllInteractiveMessage(userId, type) {
  let INTERACTIVE_MESSAGE_LIST = utils_messageUtils_storageKeys.getInteractiveMessageListKey(userId, type);
  common_vendor.index.setStorage({ key: INTERACTIVE_MESSAGE_LIST, data: null });
}
async function getInteractiveMessageList(userId, type) {
  let INTERACTIVE_MESSAGE_LIST = utils_messageUtils_storageKeys.getInteractiveMessageListKey(userId, type);
  let interactiveList = common_vendor.index.getStorageSync(INTERACTIVE_MESSAGE_LIST);
  if (!interactiveList || !interactiveList.data) {
    interactiveList = {
      unreadSum: 0,
      data: []
    };
  }
  return interactiveList;
}
async function getOfficalList(userId) {
  let OFFICE_NEWS_LIST = utils_messageUtils_storageKeys.getOfficeNewsListKey(userId);
  let officalList = common_vendor.index.getStorageSync(OFFICE_NEWS_LIST);
  if (!officalList) {
    officalList = [];
  }
  return officalList;
}
async function deleteOfficalNewsItem(userId, type) {
  let officalList = await getOfficalList(userId);
  let OFFICE_NEWS_LIST = utils_messageUtils_storageKeys.getOfficeNewsListKey(userId);
  for (let i = 0; i < officalList.length; i++) {
    if (officalList[i].type === type) {
      let OFFICE_TYPE_NEWS = utils_messageUtils_storageKeys.getOfficeTypeNewsListKey(userId, type);
      common_vendor.index.setStorage({ key: OFFICE_TYPE_NEWS, data: null });
      officalList.splice(i, 1);
      break;
    }
  }
  common_vendor.index.setStorage({ key: OFFICE_NEWS_LIST, data: officalList });
  return officalList;
}
async function getTypeOfficalNews(userId, type) {
  let OFFICE_TYPE_NEWS = utils_messageUtils_storageKeys.getOfficeTypeNewsListKey(userId, type);
  let officalNews = common_vendor.index.getStorageSync(OFFICE_TYPE_NEWS);
  if (!officalNews) {
    officalNews = [];
  }
  return officalNews;
}
async function deleteMessageRecord(userId) {
  let INTERACTIVE_MESSAGE_LIKE = utils_messageUtils_storageKeys.getInteractiveMessageListKey(userId, "LIKE");
  common_vendor.index.setStorage({ key: INTERACTIVE_MESSAGE_LIKE, data: null });
  let INTERACTIVE_MESSAGE_COMMENT = utils_messageUtils_storageKeys.getInteractiveMessageListKey(userId, "COMMENT");
  common_vendor.index.setStorage({ key: INTERACTIVE_MESSAGE_COMMENT, data: null });
  let USER_MESSAGE_LIST = utils_messageUtils_storageKeys.getUserMessageListKey(userId);
  let userMessageList = await getUserMessageList(userId);
  userMessageList.forEach((item) => {
    let CHAT_RECORD = utils_messageUtils_storageKeys.getChatRecordKey(userId, item.userId);
    common_vendor.index.setStorage({ key: CHAT_RECORD, data: null });
  });
  common_vendor.index.setStorage({ key: USER_MESSAGE_LIST, data: null });
}
exports.commentGroup = commentGroup;
exports.deleteAllInteractiveMessage = deleteAllInteractiveMessage;
exports.deleteMessageRecord = deleteMessageRecord;
exports.deleteOfficalNewsItem = deleteOfficalNewsItem;
exports.deleteUserMessageItem = deleteUserMessageItem;
exports.getChatRecord = getChatRecord;
exports.getInteractiveMessageList = getInteractiveMessageList;
exports.getOfficalList = getOfficalList;
exports.getTypeOfficalNews = getTypeOfficalNews;
exports.getUserMessageList = getUserMessageList;
exports.interactiveMessageALLRead = interactiveMessageALLRead;
exports.likeGroup = likeGroup;
exports.saveAlreadyRead = saveAlreadyRead;
exports.saveChatRecord = saveChatRecord;
exports.saveInteractiveMessageItem = saveInteractiveMessageItem;
exports.saveInteractiveMessageList = saveInteractiveMessageList;
exports.saveUserMessageList = saveUserMessageList;
exports.saveUserMessageListWhenWithDraw = saveUserMessageListWhenWithDraw;
exports.saveWithDrawChatRecord = saveWithDrawChatRecord;
