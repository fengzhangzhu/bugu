"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
var utils_request = require("../../utils/request.js");
var common_storageFunctions = require("../../common/storageFunctions.js");
var utils_dateUtils = require("../../utils/dateUtils.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
require("../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      isDelete: false,
      article: {},
      myId: 0,
      myUserInfo: {},
      isMe: false,
      commentDatas: [],
      page: 1,
      haveMoreData: true,
      showBottomLoading: false,
      refreshCommentId: 0,
      isRefresh: false,
      scrollInto: "",
      isReplyComment: false,
      inputFocus: false,
      sendText: "",
      buttonIsLoading: false,
      keyboardHeight: 0,
      emojiContentHeight: 300,
      showEmojiPicker: false,
      commentSelected: {},
      commentMoreSelected: {},
      contentHeight: 0,
      navHeight: 0,
      isIOS: false
    };
  },
  onReady() {
    let _this = this;
    common_vendor.index.getSystemInfo({
      success(res) {
        _this.contentHeight = res.windowHeight;
        _this.isIOS = res.system.indexOf("iOS") != -1;
      }
    });
    let titleH = common_vendor.index.createSelectorQuery().select(".activity-info-scroll");
    titleH.boundingClientRect((data) => {
      _this.navHeight = data.top;
    }).exec();
  },
  async onLoad(params) {
    common_vendor.index.onKeyboardHeightChange(async (res) => {
      if (res.height != 0) {
        this.keyboardHeight = res.height;
        this.emojiContentHeight = res.height;
        this.showEmojiPicker = false;
      } else {
        this.keyboardHeight = 0;
      }
    });
    let activityId = params.activityId;
    this.showBottomLoading = true;
    await this.getArticleInfo(activityId);
    if (this.article.publisher) {
      let userInfo = await common_storageFunctions.getMyUserInfo();
      this.myId = userInfo.id;
      this.myUserInfo = userInfo;
      this.isMe = this.article.publisher.id == userInfo.id;
    }
    this.commentDatas = await this.getActivtyComments(activityId, this.page);
    if (this.commentDatas.length <= 0) {
      this.haveMoreData = false;
    }
    this.showBottomLoading = false;
  },
  computed: {
    placeholder() {
      return this.isReplyComment ? `\u56DE\u590D${this.commentSelected.toUsername}` : "\u56DE\u590D\u4F5C\u8005";
    },
    scollerHeight() {
      return this.contentHeight - this.navHeight;
    }
  },
  onShareAppMessage() {
    let imageUrl = "";
    if (this.article.pic.length > 0) {
      if (this.article.video == 1) {
        imageUrl = this.article.pic[0] + "?vframe/jpg/offset/0";
      } else {
        imageUrl = this.article.pic[0];
      }
    }
    let username = "";
    if (this.article.isAnonymity == 1) {
      username = "\u533F\u540D\u7528\u6237";
    } else {
      if (this.article.publisher) {
        username = this.article.publisher.username;
      }
    }
    return {
      title: `${username}\u53D1\u5E03\u4E86\u4E00\u6761\u52A8\u6001\uFF0C\u5FEB\u6765\u770B\u770Bta\u8BF4\u4E86\u4EC0\u4E48`,
      path: `/pages/activity-info/activity-info?activityId=${this.article.id}`,
      imageUrl
    };
  },
  onShareTimeline() {
    let imageUrl = "";
    if (this.article.pic.length > 0) {
      if (this.article.video == 1) {
        imageUrl = this.article.pic[0] + "?vframe/jpg/offset/0";
      } else {
        imageUrl = this.article.pic[0];
      }
    }
    let username = "";
    if (this.article.isAnonymity == 1) {
      username = "\u533F\u540D\u7528\u6237";
    } else {
      if (this.article.publisher) {
        username = this.article.publisher.username;
      }
    }
    return {
      title: `${username}\u53D1\u5E03\u4E86\u4E00\u6761\u52A8\u6001\uFF0C\u5FEB\u6765\u770B\u770Bta\u8BF4\u4E86\u4EC0\u4E48`,
      path: `/pages/activity-info/activity-info?activityId=${this.article.id}`,
      imageUrl
    };
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onActivityItemClick() {
      if (this.inputFocus) {
        this.inputFocus = false;
      } else {
        this.inputFocus = true;
      }
      this.isReplyComment = false;
    },
    onCommentTextareaInput(e) {
      this.sendText = e.detail.value;
    },
    onCommentTextareaFocus() {
      this.inputFocus = true;
    },
    onCommentTextareaBlur() {
      setTimeout(() => {
        this.inputFocus = false;
      }, 100);
    },
    onEmojiIconClick() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    async onSendButtonClick() {
      if (this.sendText.length <= 0) {
        return;
      }
      if (this.buttonIsLoading) {
        return;
      }
      this.refreshCommentId = 0;
      this.buttonIsLoading = true;
      this.scrollInto = "";
      let res = false;
      if (this.isReplyComment) {
        res = await common_requestFunctions.ReplyComments(this.commentSelected.commentId, this.sendText, 0, this.commentSelected.toUserId);
      } else {
        res = await common_requestFunctions.commentActivity(this.article.id, this.sendText, 0);
      }
      this.buttonIsLoading = false;
      this.showEmojiPicker = false;
      if (res !== -1) {
        if (this.isReplyComment) {
          this.refreshCommentId = this.commentSelected.commentId;
        } else {
          this.scrollInto = `comment-item-newest`;
          this.commentDatas.push({
            father: {
              content: this.sendText,
              createTime: utils_dateUtils.getTime(),
              id: res,
              isDeleted: 0,
              likeSum: 0,
              isLiked: 0,
              publisher: {
                id: this.myUserInfo.id,
                username: this.myUserInfo.username,
                avatar: this.myUserInfo.avatar
              },
              responseSum: 0,
              type: 0
            },
            sons: []
          });
        }
        this.sendText = "";
      }
    },
    setEmoj(item) {
      this.sendText = this.sendText + item;
    },
    async onRefresh() {
      this.isRefresh = true;
      let activityId = this.article.id;
      await this.getArticleInfo(activityId);
      this.page = 1;
      this.haveMoreData = true;
      this.commentDatas = await this.getActivtyComments(activityId, this.page);
      setTimeout(() => {
        this.isRefresh = false;
      }, 700);
    },
    async onScrollToLower() {
      if (this.haveMoreData) {
        this.showBottomLoading = true;
        let activityId = this.article.id;
        this.page = this.page + 1;
        let newDatas = await this.getActivtyComments(activityId, this.page);
        if (newDatas.length > 0) {
          this.commentDatas = this.commentDatas.concat(newDatas);
        } else {
          this.haveMoreData = false;
        }
        this.showBottomLoading = false;
      }
    },
    onActivityPopupMoreClick() {
      this.$refs.articleActionPopup.open();
    },
    onActivityPopupReportClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${common_constants.reportObjectType.activity}`
      });
      this.$refs.articleActionPopup.close();
    },
    onActivityPopupDeleteClick() {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u52A8\u6001",
        content: "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u52A8\u6001\u5417",
        success: async function(res) {
          if (res.confirm) {
            if (await common_requestFunctions.deleteMyArticle(_this.article.id)) {
              _this.isDelete = true;
              _this.$refs.articleActionPopup.close();
              common_vendor.index.showToast({
                title: "\u5220\u9664\u6210\u529F",
                icon: "success"
              });
            }
          }
        }
      });
    },
    onCommentPopupReportClick(item) {
      if (item.isReply) {
        common_vendor.index.navigateTo({
          url: `/pages/setting/report-user/report-user?objectId=${item.replyId}&objectType=${common_constants.reportObjectType.commentResponse}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/setting/report-user/report-user?objectId=${item.commentId}&objectType=${common_constants.reportObjectType.comment}`
        });
      }
      this.$refs.commentActionPopup.close();
    },
    onCommentPopupDeleteClick(item) {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u8BC4\u8BBA",
        content: "\u4F60\u786E\u5B9A\u5220\u9664\u8FD9\u6761\u8BC4\u8BBA\u5417\uFF1F",
        success: async function(res) {
          if (res.confirm) {
            let deleteRes = false;
            _this.refreshCommentId = 0;
            if (item.isReply) {
              deleteRes = await common_requestFunctions.DeleteReply(item.replyId);
              if (deleteRes) {
                _this.refreshCommentId = item.commentId;
              }
            } else {
              deleteRes = await common_requestFunctions.DeleteComments(item.commentId);
              let commentDatas = _this.commentDatas;
              for (let i = 0; i < commentDatas.length; i++) {
                if (commentDatas[i].father.id == item.commentId) {
                  commentDatas[i].father.isDeleted = 1;
                  break;
                }
              }
              _this.commentDatas = commentDatas;
            }
            if (deleteRes) {
              common_vendor.index.showToast({
                title: "\u5220\u9664\u6210\u529F"
              });
              _this.$refs.commentActionPopup.close();
            }
          }
        }
      });
    },
    async onCancelFollow(item) {
      if (!item.publisher) {
        return;
      }
      let _this = this;
      common_vendor.index.showModal({
        title: "\u53D6\u6D88\u5173\u6CE8",
        content: `\u4F60\u786E\u5B9A\u8981\u53D6\u6D88\u5173\u6CE8${item.publisher.username}`,
        success: async function(res) {
          if (res.confirm) {
            if (item.publisher) {
              if (await common_requestFunctions.cancelAttention(item.publisher.id)) {
                _this.article.publisher.isAttention = 0;
                _this.$refs.articleActionPopup.close();
                common_vendor.index.showToast({
                  title: "\u53D6\u6D88\u5173\u6CE8",
                  icon: "success"
                });
              }
            }
          }
        }
      });
    },
    async onFollow(item) {
      if (!item.publisher) {
        return;
      }
      let _this = this;
      if (await common_requestFunctions.followUser(item.publisher.id)) {
        _this.article.publisher.isAttention = 1;
        _this.$refs.articleActionPopup.close();
        common_vendor.index.showToast({
          title: "\u5173\u6CE8\u6210\u529F",
          icon: "success"
        });
      }
    },
    onCommentClick(item) {
      this.isReplyComment = true;
      this.inputFocus = true;
      this.commentSelected = {
        toUsername: item.publisher.username,
        toUserId: 0,
        commentId: item.id
      };
    },
    onCommentMoreClick(item) {
      this.commentMoreSelected = {
        commentId: item.id,
        replyId: 0,
        fromUserId: item.publisher.id,
        isReply: false
      };
      this.$refs.commentActionPopup.open();
    },
    onShowAllClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/comment-info?commentData=${JSON.stringify(item)}&authorId=${this.article.publisher ? this.article.publisher.id : 0}`
      });
    },
    onReplyClick(item, replyItem, index) {
      this.inputFocus = true;
      this.isReplyComment = true;
      this.commentSelected = {
        commentId: item.id,
        replyId: replyItem.id,
        toUsername: replyItem.fromUsername,
        toUserId: replyItem.fromUserId == 0 ? -1 : replyItem.fromUserId
      };
    },
    onReplyMoreClick(item, replyItem) {
      this.commentMoreSelected = {
        commentId: item.id,
        replyId: replyItem.id,
        fromUserId: replyItem.fromUserId,
        isReply: true
      };
      this.$refs.commentActionPopup.open();
    },
    async getArticleInfo(id) {
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D"
      });
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: `${id}/info`,
          data: {
            id
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      common_vendor.index.hideLoading();
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        this.article = res.data.data;
      } else if (res.data.code === "A0201") {
        this.isDelete = true;
      }
    },
    async getActivtyComments(id, page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: `${id}/commentList`,
          data: {
            id,
            father_pageSize: 10,
            father_startPage: page,
            son_pageSize: 3,
            son_startPage: 1
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      setTimeout(() => {
        this.isRefresh = false;
      }, 700);
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let pageInfo = res.data.data;
        let commentDates = pageInfo.list;
        this.haveMoreData = pageInfo.hasNext;
        return commentDates;
      } else {
        return [];
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_activity_item2 = common_vendor.resolveComponent("activity-item");
  const _easycom_comment_item2 = common_vendor.resolveComponent("comment-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_activity_skeleton2 = common_vendor.resolveComponent("activity-skeleton");
  const _easycom_emoji2 = common_vendor.resolveComponent("emoji");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_activity_item2 + _easycom_comment_item2 + _easycom_uni_load_more2 + _easycom_activity_skeleton2 + _easycom_emoji2 + _easycom_uni_transition2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_activity_item = () => "../../components/activity-item/activity-item.js";
const _easycom_comment_item = () => "../../components/comment-item/comment-item.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_activity_skeleton = () => "../../components/activity-skeleton/activity-skeleton.js";
const _easycom_emoji = () => "../../components/emoji/emoji.js";
const _easycom_uni_transition = () => "../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
const _easycom_action_sheet_item = () => "../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_activity_item + _easycom_comment_item + _easycom_uni_load_more + _easycom_activity_skeleton + _easycom_emoji + _easycom_uni_transition + _easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.onNarLeftClick()),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: $data.isDelete
  }, $data.isDelete ? {} : common_vendor.e({
    d: $data.article.id
  }, $data.article.id ? {
    e: common_vendor.o(($event) => $options.onFollow($data.article)),
    f: common_vendor.o(($event) => $options.onActivityPopupMoreClick($data.article)),
    g: common_vendor.o(($event) => $options.onActivityItemClick()),
    h: common_vendor.p({
      isMe: $data.isMe,
      needShowAll: true,
      articleItem: $data.article
    }),
    i: common_vendor.f($data.commentDatas, (item, index, i0) => {
      return {
        a: item.father.id,
        b: common_vendor.o(($event) => $options.onCommentClick(item.father), item.father.id),
        c: common_vendor.o(($event) => $options.onShowAllClick(item.father), item.father.id),
        d: common_vendor.o(($event) => $options.onCommentMoreClick(item.father), item.father.id),
        e: common_vendor.o($options.onReplyClick, item.father.id),
        f: common_vendor.o($options.onReplyMoreClick, item.father.id),
        g: "8b83a73a-2-" + i0,
        h: common_vendor.p({
          commentData: item.father,
          replyData: item.sons,
          authorId: $data.article.isAnonymity ? 0 : $data.article.publisher.id,
          needRefresh: $data.refreshCommentId == item.father.id
        })
      };
    }),
    j: common_vendor.p({
      status: $data.haveMoreData ? $data.showBottomLoading ? "loading" : "more" : "noMore",
      contentText: {
        contentdown: "\u4E0A\u62C9\u663E\u793A\u66F4\u591A",
        contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
        contentnomore: $data.haveMoreData == false && $data.commentDatas.length <= 0 ? "\u8FD8\u6CA1\u6709\u8BC4\u8BBA\uFF0C\u5FEB\u6765\u62A2\u6C99\u53D1\u5427~" : "\u6CA1\u6709\u66F4\u591A\u8BC4\u8BBA\u4E86"
      },
      iconType: "circle"
    })
  } : {}), {
    k: $data.isRefresh,
    l: common_vendor.o(($event) => $options.onRefresh()),
    m: common_vendor.o(($event) => $options.onScrollToLower()),
    n: $data.scrollInto,
    o: $options.scollerHeight + "px",
    p: $data.isIOS
  }, $data.isIOS ? {
    q: $options.placeholder,
    r: $data.inputFocus,
    s: common_vendor.o((...args) => $options.onCommentTextareaFocus && $options.onCommentTextareaFocus(...args)),
    t: common_vendor.o((...args) => $options.onCommentTextareaBlur && $options.onCommentTextareaBlur(...args)),
    v: $data.sendText,
    w: common_vendor.o(($event) => $data.sendText = $event.detail.value)
  } : {
    x: $options.placeholder,
    y: $data.inputFocus,
    z: common_vendor.o((...args) => $options.onCommentTextareaFocus && $options.onCommentTextareaFocus(...args)),
    A: common_vendor.o((...args) => $options.onCommentTextareaBlur && $options.onCommentTextareaBlur(...args)),
    B: $data.sendText,
    C: common_vendor.o(($event) => $data.sendText = $event.detail.value)
  }, {
    D: common_vendor.o(($event) => $options.onEmojiIconClick()),
    E: common_vendor.t($data.buttonIsLoading ? "\u53D1\u9001\u4E2D" : "\u53D1\u9001"),
    F: common_vendor.o(($event) => $options.onSendButtonClick()),
    G: $data.showEmojiPicker,
    H: common_vendor.o($options.setEmoj),
    I: common_vendor.p({
      contentHeight: $data.emojiContentHeight
    }),
    J: common_vendor.p({
      ["mode-class"]: "slide-bottom",
      show: $data.showEmojiPicker
    }),
    K: $data.showEmojiPicker ? $data.emojiContentHeight + "px" : $data.keyboardHeight + "px",
    L: $data.commentMoreSelected.fromUserId
  }, $data.commentMoreSelected.fromUserId ? common_vendor.e({
    M: $data.myId == $data.commentMoreSelected.fromUserId
  }, $data.myId == $data.commentMoreSelected.fromUserId ? {
    N: common_vendor.o(($event) => $options.onCommentPopupDeleteClick($data.commentMoreSelected)),
    O: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    P: common_vendor.o(($event) => $options.onCommentPopupReportClick($data.commentMoreSelected)),
    Q: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    }),
    R: $data.article.publisher && $data.article.publisher.id == $data.myId
  }, $data.article.publisher && $data.article.publisher.id == $data.myId ? {
    S: common_vendor.o(($event) => $options.onCommentPopupDeleteClick($data.commentMoreSelected)),
    T: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : {})) : {}, {
    U: common_vendor.sr("commentActionPopup", "8b83a73a-7"),
    V: common_vendor.p({
      needHead: true,
      title: "\u8BC4\u8BBA\u9009\u62E9",
      needCancelButton: true
    }),
    W: $data.article.id
  }, $data.article.id ? common_vendor.e({
    X: $data.article.isAnonymity
  }, $data.article.isAnonymity ? {
    Y: common_vendor.o(($event) => $options.onActivityPopupReportClick($data.article)),
    Z: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  } : common_vendor.e({
    aa: $data.article.publisher.id == $data.myId
  }, $data.article.publisher.id == $data.myId ? {
    ab: common_vendor.o($options.onActivityPopupDeleteClick),
    ac: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    ad: $data.article.publisher.isAttention == 1
  }, $data.article.publisher.isAttention == 1 ? {
    ae: common_vendor.o(($event) => $options.onCancelFollow($data.article)),
    af: common_vendor.p({
      icon: "icon-quxiaoguanzhu",
      title: "\u53D6\u6D88\u5173\u6CE8"
    })
  } : {
    ag: common_vendor.o(($event) => $options.onFollow($data.article)),
    ah: common_vendor.p({
      icon: "icon-guanzhu",
      title: "\u5173\u6CE8"
    })
  }, {
    ai: common_vendor.p({
      icon: "icon-message",
      title: "\u79C1\u804A"
    }),
    aj: common_vendor.o(($event) => $options.onActivityPopupReportClick($data.article)),
    ak: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  }))) : {}, {
    al: common_vendor.sr("articleActionPopup", "8b83a73a-11"),
    am: common_vendor.p({
      needHead: true,
      title: "\u52A8\u6001\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/activity-info/activity-info.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
