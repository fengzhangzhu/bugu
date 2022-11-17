"use strict";
var utils_request = require("../request.js");
var common_constants = require("../../common/constants.js");
async function getUnReadUser() {
  let messageList = [];
  try {
    let res = await utils_request.request({
      data: {
        method: "GET",
        group: "message",
        action: "unRead/user",
        data: {},
        header: {
          "content-type": "application/x-www-form-urlencoded"
        }
      }
    });
    if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
      messageList = res.data.data;
    } else {
      console.log(`getUnReadUser_error:${res.data}`);
    }
  } catch {
  }
  return messageList;
}
async function getUnReadInteractiveMessage() {
  let res = await utils_request.request({
    data: {
      method: "GET",
      group: "message",
      action: "interactive/unread",
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    let unreads = res.data.data;
    return unreads;
  } else {
    return [];
  }
}
async function getUnReadOfficialNews() {
  let res = await utils_request.request({
    data: {
      method: "GET",
      group: "message",
      action: "official/unread/list",
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    let officialNewsList = res.data.data;
    return officialNewsList;
  } else {
    return [];
  }
}
exports.getUnReadInteractiveMessage = getUnReadInteractiveMessage;
exports.getUnReadOfficialNews = getUnReadOfficialNews;
exports.getUnReadUser = getUnReadUser;
