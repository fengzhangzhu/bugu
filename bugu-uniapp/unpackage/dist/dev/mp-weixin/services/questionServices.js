"use strict";
var utils_request = require("../utils/request.js");
var common_constants = require("../common/constants.js");
async function likeQuestion(id) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "question",
      action: `${id}/like`,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return true;
  } else {
    if (res.data.errMsg === "\u8BF7\u52FF\u91CD\u590D\u70B9\u8D5E") {
      return true;
    } else {
      return false;
    }
  }
}
async function collectQuestion(id) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "question",
      action: `${id}/collect`,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return true;
  } else {
    if (res.data.errMsg === "\u8BF7\u52FF\u91CD\u590D\u70B9\u8D5E") {
      return true;
    } else {
      return false;
    }
  }
}
async function cancelLikeQuestion(id) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "question",
      action: `${id}/like/remove`,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return true;
  } else {
    return false;
  }
}
async function cancelCollectQuestion(id) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "question",
      action: `${id}/collect/remove`,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return true;
  } else {
    return false;
  }
}
async function deleteQuestion(id) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: "question",
      action: `${id}/delete`,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return true;
  } else {
    return false;
  }
}
exports.cancelCollectQuestion = cancelCollectQuestion;
exports.cancelLikeQuestion = cancelLikeQuestion;
exports.collectQuestion = collectQuestion;
exports.deleteQuestion = deleteQuestion;
exports.likeQuestion = likeQuestion;
