"use strict";
var common_constants = require("./constants.js");
var utils_request = require("../utils/request.js");
async function getUserinfo(userId) {
  let res = await utils_request.request({
    data: {
      method: "GET",
      group: "user",
      action: `${userId}/info`,
      data: {
        userId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return res.data.data;
  } else {
    return;
  }
}
async function followUser(userId) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "social",
      action: `attention/${userId}`,
      data: {
        userId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return true;
  } else {
    console.log(res);
    return false;
  }
}
async function cancelAttention(userId) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: "social",
      action: `removeAttention/${userId}`,
      data: {
        userId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return true;
  } else {
    console.log(res);
    return false;
  }
}
async function CancleLikeArticle(id) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "activity",
      action: `${id}/like/remove`,
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
async function LikeThisArtice(id) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "activity",
      action: `${id}/like`,
      data: {
        id
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  console.log(res.data);
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return true;
  } else {
    return false;
  }
}
async function GetonlineState(userId) {
  let res = await utils_request.request({
    data: {
      method: "GET",
      group: "message",
      action: `onlineState`,
      data: {
        userId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return res.data.data;
  } else {
    return false;
  }
}
async function deleteMyArticle(id) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: "activity",
      action: `${id}/delete`,
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
async function getHotLabels(page = 1) {
  let res = await utils_request.request({
    data: {
      method: "GET",
      group: "activity",
      action: "label/list",
      data: {
        page
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    let Labels = res.data.data.list;
    return Labels;
  } else {
    return [];
  }
}
async function getInviteUserCode() {
  let res = await utils_request.request({
    data: {
      method: "GET",
      group: "user",
      action: "invite",
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return res.data.data;
  } else {
    return "";
  }
}
async function updateUserInfo(userIds) {
  if (!userIds || userIds.length <= 0) {
    return [];
  }
  let res = await utils_request.request({
    data: {
      method: "GET",
      group: "message",
      action: "users/info",
      data: {
        userIds
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  let userInfos = [];
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    userInfos = res.data.data;
  } else {
    console.log(res.data);
  }
  return userInfos;
}
async function commentActivity(id, content, type) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "activity",
      action: `${id}/comment`,
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
async function ReplyComments(id, content, type, toUserId = 0) {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "activity/comment",
      action: `${id}/response`,
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
async function DeleteComments(id) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: "activity/comment",
      action: `${id}/delete`,
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
async function DeleteReply(id) {
  let res = await utils_request.request({
    data: {
      method: "DELETE",
      group: "activity/comment",
      action: `response/${id}/delete`,
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
exports.CancleLikeArticle = CancleLikeArticle;
exports.DeleteComments = DeleteComments;
exports.DeleteReply = DeleteReply;
exports.GetonlineState = GetonlineState;
exports.LikeThisArtice = LikeThisArtice;
exports.ReplyComments = ReplyComments;
exports.cancelAttention = cancelAttention;
exports.commentActivity = commentActivity;
exports.deleteMyArticle = deleteMyArticle;
exports.followUser = followUser;
exports.getHotLabels = getHotLabels;
exports.getInviteUserCode = getInviteUserCode;
exports.getUserinfo = getUserinfo;
exports.updateUserInfo = updateUserInfo;
