"use strict";
var common_vendor = require("../../common/vendor.js");
var common_storageFunctions = require("../../common/storageFunctions.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
var services_answerServices = require("../../services/answerServices.js");
var common_constants = require("../../common/constants.js");
require("../../common/storageKeys.js");
require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      commentType: "activity",
      myUserInfo: {},
      scrollInto: "",
      commentData: {},
      authorId: -1,
      needRefresh: false,
      commentSelected: {},
      commentMoreSelected: {},
      buttonIsLoading: false,
      sendText: "",
      showEmojiPicker: false,
      inputFocus: false,
      myId: 0,
      keyboardHeight: 0,
      emojiContentHeight: 300,
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
    let titleH = common_vendor.index.createSelectorQuery().select("#comment-info-scroll");
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
    let commentDataStr = params.commentData;
    this.authorId = Number(params.authorId);
    let commentType = params.commentType;
    if (commentType) {
      this.commentType = commentType;
    }
    if (commentDataStr) {
      this.commentData = JSON.parse(commentDataStr);
      let userInfo = await common_storageFunctions.getMyUserInfo();
      this.myId = userInfo.id;
      this.myUserInfo = userInfo;
      this.commentSelected = {
        commentId: this.commentData.id,
        toUsername: this.commentData.publisher.username,
        toUserId: 0
      };
    }
  },
  computed: {
    placeholder() {
      return this.commentSelected.toUsername ? `\u56DE\u590D${this.commentSelected.toUsername}` : "";
    },
    scollerHeight() {
      return this.contentHeight - this.navHeight;
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onCommentTextareaInput(e) {
      this.sendText = e.detail.value;
    },
    onCommentTextareaFocus() {
      this.inputFocus = true;
    },
    onCommentTextareaBlur() {
      this.inputFocus = false;
    },
    onEmojiIconClick() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    onScrollToLower() {
      this.$refs.commentItem.getMoreReplys();
    },
    async onSendButtonClick() {
      if (this.sendText.length <= 0) {
        return;
      }
      if (this.buttonIsLoading) {
        return;
      }
      this.needRefresh = false;
      this.buttonIsLoading = true;
      this.scrollInto = "";
      let res = {};
      if (this.commentType === "index") {
        res = await common_requestFunctions.ReplyComments(this.commentSelected.commentId, this.sendText, 0, this.commentSelected.toUserId);
      } else if (this.commentType === "answer") {
        res = await services_answerServices.ReplyAnswerComments(this.commentSelected.commentId, this.sendText, 0, this.commentSelected.toUserId);
      }
      this.buttonIsLoading = false;
      this.showEmojiPicker = false;
      if (res != -1) {
        this.$refs.commentItem.addReplyItem({
          content: this.sendText,
          fromUserId: this.myUserInfo.id,
          fromUsername: this.myUserInfo.username,
          id: res,
          isDeleted: 0,
          toUserId: this.commentSelected.toUserId,
          toUsername: this.commentSelected.toUsername,
          type: 0,
          fromUserAvatar: this.myUserInfo.avatar
        });
        this.sendText = "";
        setTimeout(() => {
          this.scrollInto = "reply-newest";
        }, 1e3);
      }
    },
    setEmoj(item) {
      this.sendText = this.sendText + item;
    },
    onCommentClick(item) {
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
    onReplyClick(item, replyItem) {
      this.inputFocus = true;
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
            _this.needRefresh = false;
            if (item.isReply) {
              if (_this.commentType === "index") {
                deleteRes = await common_requestFunctions.DeleteReply(item.replyId);
              } else if (_this.commentType === "answer") {
                deleteRes = await services_answerServices.deleteAnswerCommentReply(_this.commentData.id, item.replyId);
              }
              if (deleteRes) {
                _this.$refs.commentItem.deleteReplyItem(item.replyId);
              }
            } else {
              if (_this.commentType === "index") {
                deleteRes = await common_requestFunctions.DeleteComments(item.commentId);
              } else if (_this.commentType === "answer") {
                deleteRes = await services_answerServices.deleteAnswerComment(item.commentId);
              }
              if (deleteRes) {
                _this.commentData.isDeleted = true;
              }
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
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_comment_item2 = common_vendor.resolveComponent("comment-item");
  const _easycom_emoji2 = common_vendor.resolveComponent("emoji");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_comment_item2 + _easycom_emoji2 + _easycom_uni_transition2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_comment_item = () => "../../components/comment-item/comment-item.js";
const _easycom_emoji = () => "../../components/emoji/emoji.js";
const _easycom_uni_transition = () => "../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
const _easycom_action_sheet_item = () => "../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_comment_item + _easycom_emoji + _easycom_uni_transition + _easycom_action_sheet_item + _easycom_action_sheet)();
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
    c: $data.commentData.id
  }, $data.commentData.id ? {
    d: common_vendor.sr("commentItem", "219d1616-1"),
    e: common_vendor.o(($event) => $options.onCommentClick($data.commentData)),
    f: common_vendor.o(($event) => $options.onCommentMoreClick($data.commentData)),
    g: common_vendor.o($options.onReplyClick),
    h: common_vendor.o($options.onReplyMoreClick),
    i: common_vendor.p({
      commentType: $data.commentType,
      commentData: $data.commentData,
      authorId: $data.authorId,
      needRefresh: $data.needRefresh,
      needShowAll: true,
      replyAlign: true,
      showReplyCount: true
    })
  } : {}, {
    j: $data.scrollInto,
    k: $options.scollerHeight + "px",
    l: common_vendor.o(($event) => $options.onScrollToLower()),
    m: $data.isIOS
  }, $data.isIOS ? {
    n: $options.placeholder,
    o: $data.inputFocus,
    p: common_vendor.o((...args) => $options.onCommentTextareaFocus && $options.onCommentTextareaFocus(...args)),
    q: common_vendor.o((...args) => $options.onCommentTextareaBlur && $options.onCommentTextareaBlur(...args)),
    r: $data.sendText,
    s: common_vendor.o(($event) => $data.sendText = $event.detail.value)
  } : {
    t: $options.placeholder,
    v: $data.inputFocus,
    w: common_vendor.o((...args) => $options.onCommentTextareaFocus && $options.onCommentTextareaFocus(...args)),
    x: common_vendor.o((...args) => $options.onCommentTextareaBlur && $options.onCommentTextareaBlur(...args)),
    y: $data.sendText,
    z: common_vendor.o(($event) => $data.sendText = $event.detail.value)
  }, {
    A: common_vendor.o(($event) => $options.onEmojiIconClick()),
    B: common_vendor.t($data.buttonIsLoading ? "\u53D1\u9001\u4E2D" : "\u53D1\u9001"),
    C: common_vendor.o(($event) => $options.onSendButtonClick()),
    D: $data.showEmojiPicker,
    E: common_vendor.o($options.setEmoj),
    F: common_vendor.p({
      contentHeight: $data.keyboardHeight
    }),
    G: $data.showEmojiPicker ? $data.emojiContentHeight + "px" : $data.keyboardHeight + "px",
    H: common_vendor.p({
      ["mode-class"]: "slide-bottom",
      show: $data.showEmojiPicker
    }),
    I: $data.showEmojiPicker ? $data.emojiContentHeight + "px" : $data.keyboardHeight + "px",
    J: $data.commentMoreSelected.fromUserId
  }, $data.commentMoreSelected.fromUserId ? common_vendor.e({
    K: $data.myId == $data.commentMoreSelected.fromUserId
  }, $data.myId == $data.commentMoreSelected.fromUserId ? {
    L: common_vendor.o(($event) => $options.onCommentPopupDeleteClick($data.commentMoreSelected)),
    M: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    N: common_vendor.o(($event) => $options.onCommentPopupReportClick($data.commentMoreSelected)),
    O: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    }),
    P: _ctx.article.publisher && _ctx.article.publisher.id == $data.myId
  }, _ctx.article.publisher && _ctx.article.publisher.id == $data.myId ? {
    Q: common_vendor.o(($event) => $options.onCommentPopupDeleteClick($data.commentMoreSelected)),
    R: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : {})) : {}, {
    S: common_vendor.sr("commentActionPopup", "219d1616-4"),
    T: common_vendor.p({
      needHead: true,
      title: "\u8BC4\u8BBA\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/activity-info/comment-info.vue"]]);
wx.createPage(MiniProgramPage);
