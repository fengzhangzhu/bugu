"use strict";
var utils_request = require("../utils/request.js");
var common_constants = require("../common/constants.js");
const COMMENT_GROUP = "answer/comment";
async function deleteAnswer(id) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: "answer",
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
async function agreeAnswer(id) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "answer",
      action: `${id}/agree`,
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
async function cancelAgreeAnswer(id) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: "answer",
      action: `${id}/agree/remove`,
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
async function opposeAnswer(id) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "answer",
      action: `${id}/oppose`,
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
async function cancelOpposeAnswer(id) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: "answer",
      action: `${id}/oppose/remove`,
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
async function commentAnswer(id, content, type) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: COMMENT_GROUP,
      action: `${id}`,
      data: {
        id,
        content,
        type
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return res.data.data;
  } else {
    return -1;
  }
}
async function ReplyAnswerComments(id, content, type, toUserId = 0) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: COMMENT_GROUP,
      action: `comment/${id}/response`,
      data: {
        id,
        content,
        toUserId,
        type
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return res.data.data;
  } else {
    return -1;
  }
}
async function likeAnwserComment(id) {
  let res = await utils_request.request({
    data: {
      method: "PUT",
      group: COMMENT_GROUP,
      action: `comment/${id}/like`,
      data: {
        id
      },
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
async function cancelLikeAnwserComment(id) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: COMMENT_GROUP,
      action: `comment/${id}/like/remove`,
      data: {
        id
      },
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
async function deleteAnswerComment(id) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: COMMENT_GROUP,
      action: `comment/${id}/delete`,
      data: {
        id
      },
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
async function deleteAnswerCommentReply(id) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: COMMENT_GROUP,
      action: `comment/response/${id}/delete`,
      data: {
        id
      },
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
exports.ReplyAnswerComments = ReplyAnswerComments;
exports.agreeAnswer = agreeAnswer;
exports.cancelAgreeAnswer = cancelAgreeAnswer;
exports.cancelLikeAnwserComment = cancelLikeAnwserComment;
exports.cancelOpposeAnswer = cancelOpposeAnswer;
exports.commentAnswer = commentAnswer;
exports.deleteAnswer = deleteAnswer;
exports.deleteAnswerComment = deleteAnswerComment;
exports.deleteAnswerCommentReply = deleteAnswerCommentReply;
exports.likeAnwserComment = likeAnwserComment;
exports.opposeAnswer = opposeAnswer;
