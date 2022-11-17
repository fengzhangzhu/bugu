"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_requestFunctions = require("../../../common/requestFunctions.js");
var services_answerServices = require("../../../services/answerServices.js");
var common_constants = require("../../../common/constants.js");
var utils_request = require("../../../utils/request.js");
var utils_dateUtils = require("../../../utils/dateUtils.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
require("../../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      AnonymousAvatar: common_constants.AnonymousAvatar,
      questionTitle: "",
      questionId: 0,
      answerId: 0,
      answerData: {},
      answerUser: {},
      isMe: false,
      isDelete: false,
      playVideo: false,
      videoContext: {},
      isRefresh: false,
      scrollInto: "",
      contentHeight: 0,
      navHeight: 0,
      myUserInfo: {},
      commentDatas: [],
      page: 1,
      haveMoreData: true,
      keyboardHeight: 0,
      emojiContentHeight: 300,
      showEmojiPicker: false,
      showBottomLoading: false,
      refreshCommentId: 0,
      isReplyComment: false,
      inputFocus: false,
      sendText: "",
      buttonIsLoading: false,
      commentSelected: {},
      commentMoreSelected: {},
      isIOS: false
    };
  },
  onShareAppMessage() {
    let imageUrl = "";
    if (this.answerData.videoPaths) {
      imageUrl = this.answerData.videoPaths[0] + "?vframe/jpg/offset/0";
    } else if (this.answerData.imgPaths) {
      imageUrl = this.answerData.imgPaths[0];
    }
    let username = "";
    if (this.answerData.isAnony == 1) {
      username = "\u533F\u540D\u7528\u6237";
    } else {
      if (this.answerUser.username) {
        username = this.answerUser.username;
      }
    }
    let questionTitle = encodeURIComponent(JSON.stringify(JSON.stringify(this.questionTitle)));
    let questionId = this.questionId;
    return {
      title: `${username}\u56DE\u7B54\u4E86\u4E00\u4E2A\u95EE\u9898\uFF0C\u5FEB\u6765\u770B\u770Bta\u8BF4\u4E86\u4EC0\u4E48`,
      path: `/pages/activity-info/answer-info/answer-info?questionTitle=${questionTitle}&questionId=${questionId}&answerId=${item.issueComment.id}`,
      imageUrl
    };
  },
  onShareTimeline() {
    let imageUrl = "";
    if (this.answerData.videoPaths) {
      imageUrl = this.answerData.videoPaths[0] + "?vframe/jpg/offset/0";
    } else if (this.answerData.imgPaths) {
      imageUrl = this.answerData.imgPaths[0];
    }
    let username = "";
    if (this.answerData.isAnony == 1) {
      username = "\u533F\u540D\u7528\u6237";
    } else {
      if (this.answerUser.username) {
        username = this.answerUser.username;
      }
    }
    let questionTitle = encodeURIComponent(JSON.stringify(JSON.stringify(this.questionTitle)));
    let questionId = this.questionId;
    return {
      title: `${username}\u56DE\u7B54\u4E86\u4E00\u4E2A\u95EE\u9898\uFF0C\u5FEB\u6765\u770B\u770Bta\u8BF4\u4E86\u4EC0\u4E48`,
      path: `/pages/activity-info/answer-info/answer-info?questionTitle=${questionTitle}&questionId=${questionId}&answerId=${item.issueComment.id}`,
      imageUrl
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
    let titleH = common_vendor.index.createSelectorQuery().select("#answer-info-scroll");
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
    this.answerId = params.answerId;
    try {
      this.questionTitle = JSON.parse(JSON.parse(decodeURIComponent(params.questionTitle)));
    } catch {
    }
    await this.getAnswerInfo(this.answerId);
    if (this.answerUser.id) {
      let userInfo = await common_storageFunctions.getMyUserInfo();
      this.myId = userInfo.id;
      this.myUserInfo = userInfo;
      this.isMe = this.answerUser.id == userInfo.id;
    }
    try {
      this.questionId = params.questionId;
    } catch {
      this.questionId = this.answerData.questionId;
    }
    this.getQuetionsInfo(this.questionId);
    this.showBottomLoading = true;
    this.getAnswerComments(this.answerId, this.page);
    this.showBottomLoading = false;
  },
  computed: {
    placeholder() {
      return this.isReplyComment ? `\u56DE\u590D${this.commentSelected.toUsername}` : "\u56DE\u590D\u4F5C\u8005";
    },
    scollerHeight() {
      return this.contentHeight - this.navHeight;
    },
    publishTime() {
      if (!this.answerData.createTime) {
        return "";
      } else {
        return utils_dateUtils.GettimeifferenceOfNow(this.answerData.createTime).DistanceNow;
      }
    },
    answerAvatar() {
      if (!this.answerData) {
        return "";
      } else {
        if (this.answerData.isAnonymity == 1) {
          return common_constants.AnonymousAvatar;
        } else {
          if (this.answerUser.id) {
            return this.answerUser.avatar + common_constants.avatar_pic_hendle;
          } else {
            return "";
          }
        }
      }
    },
    answerUsername() {
      if (!this.answerData) {
        return "";
      } else {
        if (this.answerData.isAnonymity === 1) {
          return "\u67D0\u53EA\u5C0F\u5E03\u5495";
        } else {
          if (this.answerUser.id) {
            return this.answerUser.username.length < 7 ? this.answerUser.username : this.answerUser.username.slice(0, 7) + "...";
          } else {
            return "";
          }
        }
      }
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onAvatarClick() {
      if (this.answerData.isAnony == 0 && !this.isMe) {
        common_vendor.index.navigateTo({
          url: `/pages/user-home-page/user-home-page?userId=${this.answerUser.id}`
        });
      }
    },
    onMoreClick() {
      this.$refs.answerActionPopup.open();
    },
    onPopupReportClick() {
      common_vendor.index.navigateTo({
        url: `/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${common_constants.reportObjectType.activity}`
      });
      this.$refs.answerActionPopup.close();
    },
    onPopupDeleteClick() {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u7B54\u6848",
        content: "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u7B54\u6848\u5417",
        success: async function(res) {
          if (res.confirm) {
            if (await services_answerServices.deleteAnswer(_this.answerData.id)) {
              _this.$refs.answerActionPopup.close();
              _this.isDelete = false;
              common_vendor.index.showToast({
                title: "\u5220\u9664\u6210\u529F",
                icon: "success"
              });
            }
          }
        }
      });
    },
    async onFollow() {
      if (!this.answerUser.id) {
        return;
      }
      let _this = this;
      if (await common_requestFunctions.followUser(this.answerUser.id)) {
        this.answerUser.isAttention = 1;
        _this.$refs.answerActionPopup.close();
        common_vendor.index.showToast({
          title: "\u5173\u6CE8\u6210\u529F",
          icon: "success"
        });
      }
    },
    async onCancelFollow() {
      if (!this.answerUser.id) {
        return;
      }
      let _this = this;
      common_vendor.index.showModal({
        title: "\u53D6\u6D88\u5173\u6CE8",
        content: `\u4F60\u786E\u5B9A\u8981\u53D6\u6D88\u5173\u6CE8${_this.answerUser.username}`,
        success: async function(res) {
          if (res.confirm) {
            if (_this.answerUser.id) {
              if (await common_requestFunctions.cancelAttention(_this.answerUser.id)) {
                _this.answerUser.isAttention = 0;
                _this.$refs.answerActionPopup.close();
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
    async onChatClick() {
      if (this.answerUser.id)
        common_vendor.index.navigateTo({
          url: `/pages/message-secondary-page/chat-content/chat-content?fromUserId=${this.answerUser.id}`
        });
    },
    onImageClick(item2) {
      common_vendor.index.previewImage({ urls: this.answerData.pic, current: item2 });
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
      if (!this.questionId || !this.answerId) {
        return;
      }
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
        res = await services_answerServices.ReplyAnswerComments(this.commentSelected.commentId, this.sendText, 0, this.commentSelected.toUserId);
      } else {
        res = await services_answerServices.commentAnswer(this.answerId, this.sendText, 0);
      }
      this.buttonIsLoading = false;
      this.showEmojiPicker = false;
      if (res !== -1) {
        if (this.isReplyComment) {
          this.refreshCommentId = this.commentSelected.commentId;
        } else {
          this.scrollInto = `comment-item-newest`;
          if (this.isMe && this.answerData.isAnony == 1) {
            this.commentDatas.push({
              father: {
                content: this.sendText,
                createTime: utils_dateUtils.getTime(),
                id: res,
                isDeleted: 0,
                likeSum: 0,
                isLiked: 0,
                fromUserId: 0,
                publisher: null,
                responseSum: 0,
                type: 0
              },
              sons: []
            });
          } else {
            this.commentDatas.push({
              father: {
                content: this.sendText,
                createTime: utils_dateUtils.getTime(),
                id: res,
                isDeleted: 0,
                likeSum: 0,
                isLiked: 0,
                fromUserId: this.myUserInfo.id,
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
        }
        this.sendText = "";
      }
    },
    setEmoj(item2) {
      this.sendText = this.sendText + item2;
    },
    async onRefresh() {
      if (!this.answerId) {
        return;
      }
      this.isRefresh = true;
      await this.getAnswerInfo(this.answerId);
      this.page = 1;
      this.haveMoreData = true;
      this.getAnswerComments(this.answerId, this.page);
    },
    async onScrollToLower() {
      if (this.answerId) {
        if (this.haveMoreData) {
          this.showBottomLoading = true;
          this.page = this.page + 1;
          let newDatas = await this.getAnswerComments(this.answerId, this.page);
          if (newDatas.length > 0) {
            this.commentDatas = this.commentDatas.concat(newDatas);
          } else {
            this.haveMoreData = false;
          }
          this.showBottomLoading = false;
        }
      }
    },
    onAnswerClick() {
      if (this.inputFocus) {
        this.inputFocus = false;
      } else {
        this.inputFocus = true;
      }
      this.isReplyComment = false;
    },
    onCommentPopupReportClick(item2) {
      if (item2.isReply) {
        common_vendor.index.navigateTo({
          url: `/pages/setting/report-user/report-user?objectId=${item2.replyId}&objectType=${common_constants.reportObjectType.answerCommentResponse}&modular=question`
        });
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/setting/report-user/report-user?objectId=${item2.commentId}&objectType=${common_constants.reportObjectType.answerComment}&modular=question`
        });
      }
      this.$refs.commentActionPopup.close();
    },
    onCommentPopupDeleteClick(item2) {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u8BC4\u8BBA",
        content: "\u4F60\u786E\u5B9A\u5220\u9664\u8FD9\u6761\u8BC4\u8BBA\u5417\uFF1F",
        success: async function(res) {
          if (res.confirm) {
            let deleteRes = false;
            _this.refreshCommentId = 0;
            if (item2.isReply) {
              deleteRes = await services_answerServices.deleteAnswerCommentReply(_this.answerData.id, item2.replyId);
              if (deleteRes) {
                _this.refreshCommentId = item2.commentId;
              }
            } else {
              deleteRes = await services_answerServices.deleteAnswerComment(item2.commentId);
              let commentDatas = _this.commentDatas;
              for (let i = 0; i < commentDatas.length; i++) {
                if (commentDatas[i].father.id == item2.commentId) {
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
    onCommentClick(item2) {
      this.isReplyComment = true;
      this.inputFocus = true;
      this.commentSelected = {
        toUsername: item2.publisher.username ? item2.publisher.username : "\u67D0\u53EA\u5C0F\u5E03\u5495",
        toUserId: 0,
        commentId: item2.id
      };
    },
    onCommentMoreClick(item2) {
      this.commentMoreSelected = {
        commentId: item2.id,
        replyId: 0,
        fromUserId: item2.publisher ? item2.publisher.id : -1,
        isReply: false
      };
      this.$refs.commentActionPopup.open();
    },
    onShowAllClick(item2) {
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/comment-info?commentData=${JSON.stringify(item2)}&authorId=${this.answerUser ? this.answerUser.id : 0}&commentType=answer`
      });
    },
    onReplyClick(item2, replyItem, index) {
      this.isReplyComment = true;
      this.commentSelected = {
        commentId: item2.id,
        replyId: replyItem.id,
        toUsername: replyItem.fromUsername,
        toUserId: replyItem.fromUserId == 0 ? -1 : replyItem.fromUserId
      };
    },
    onReplyMoreClick(item2, replyItem) {
      this.commentMoreSelected = {
        commentId: item2.id,
        replyId: replyItem.id,
        fromUserId: replyItem.fromUserId == 0 ? -1 : replyItem.fromUserId,
        isReply: true
      };
      this.$refs.commentActionPopup.open();
    },
    async onOpposeButtonClick() {
      if (this.answerData.isOpposed === 1) {
        this.answerData.isOpposed = 0;
        this.answerData.opposeSum = this.answerData.opposeSum - 1;
        if (!await services_answerServices.cancelOpposeAnswer(this.answerData.id)) {
          this.answerData.isOpposed = 1;
          this.answerData.opposeSum = this.answerData.opposeSum + 1;
          common_vendor.index.showToast({
            title: "\u53D6\u6D88\u5931\u8D25",
            icon: "error"
          });
        }
      } else {
        this.answerData.isOpposed = 1;
        this.answerData.opposeSum = this.answerData.opposeSum + 1;
        if (!await services_answerServices.opposeAnswer(this.answerData.id)) {
          this.answerData.isOpposed = 0;
          this.answerData.opposeSum = this.answerData.opposeSum - 1;
          common_vendor.index.showToast({
            title: "\u53CD\u5BF9\u5931\u8D25",
            icon: "error"
          });
        }
      }
    },
    async onAgreeButtonClick() {
      if (this.answerData.isAgreed === 1) {
        this.answerData.isAgreed = 0;
        this.answerData.agreeSum = this.answerData.agreeSum - 1;
        if (!await services_answerServices.cancelAgreeAnswer(this.answerData.id)) {
          this.answerData.isAgreed = 1;
          this.answerData.agreeSum = this.answerData.agreeSum + 1;
          common_vendor.index.showToast({
            title: "\u53D6\u6D88\u5931\u8D25",
            icon: "error"
          });
        }
      } else {
        this.answerData.isAgreed = 1;
        this.answerData.agreeSum = this.answerData.agreeSum + 1;
        if (!await services_answerServices.agreeAnswer(this.answerData.id)) {
          this.answerData.isAgreed = 0;
          this.answerData.agreeSum = this.answerData.agreeSum - 1;
          common_vendor.index.showToast({
            title: "\u8D5E\u540C\u5931\u8D25",
            icon: "error"
          });
        }
      }
    },
    async getQuetionsInfo(id) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "question",
          action: `${id}/detail`,
          data: {},
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        this.questionTitle = res.data.data.title;
      }
    },
    async getAnswerInfo(id) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "answer",
          action: `${id}/detail`,
          data: {},
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        this.answerData = res.data.data;
        this.isMe = this.answerData.isMe === 1;
        if (!this.answerData.isAnonymity) {
          this.answerUser = this.answerData.publisher;
        }
      }
    },
    async getAnswerComments(id, page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "answer/comment",
          action: `${id}/commentList`,
          data: {
            id,
            father_pageSize: 10,
            father_startPage: page,
            son_startPage: 1,
            son_pageSize: 3
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      setTimeout(() => {
        this.isRefresh = false;
        this.showBottomLoading = false;
      }, 700);
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let pageInfo = res.data.data;
        let commentDatas = pageInfo.list;
        this.haveMoreData = pageInfo.hasNext;
        if (page === 1) {
          this.commentDatas = commentDatas;
          this.scrollInto = "";
        } else {
          let allCommentDatas = this.commentDatas.concat(commentDatas);
          this.commentDatas = allCommentDatas;
        }
        return commentDatas;
      } else {
        return [];
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_activity_skeleton2 = common_vendor.resolveComponent("activity-skeleton");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_comment_item2 = common_vendor.resolveComponent("comment-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_emoji2 = common_vendor.resolveComponent("emoji");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_activity_skeleton2 + _easycom_uni_icons2 + _easycom_comment_item2 + _easycom_uni_load_more2 + _easycom_emoji2 + _easycom_uni_transition2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_activity_skeleton = () => "../../../components/activity-skeleton/activity-skeleton.js";
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_comment_item = () => "../../../components/comment-item/comment-item.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_emoji = () => "../../../components/emoji/emoji.js";
const _easycom_uni_transition = () => "../../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
const _easycom_action_sheet_item = () => "../../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_activity_skeleton + _easycom_uni_icons + _easycom_comment_item + _easycom_uni_load_more + _easycom_emoji + _easycom_uni_transition + _easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache) {
  return common_vendor.e({
    a: common_vendor.o(($event) => _ctx.onNarLeftClick()),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: common_vendor.t(_ctx.questionTitle),
    d: !_ctx.answerData.id
  }, !_ctx.answerData.id ? {} : common_vendor.e({
    e: _ctx.answerAvatar,
    f: common_vendor.o(($event) => _ctx.onAvatarClick()),
    g: _ctx.answerUser.isVip && _ctx.answerUser.isVip.remainDays > 0
  }, _ctx.answerUser.isVip && _ctx.answerUser.isVip.remainDays > 0 ? {} : {}, {
    h: common_vendor.t(_ctx.answerUsername),
    i: _ctx.answerUser.isVerify
  }, _ctx.answerUser.isVerify ? {} : {}, {
    j: _ctx.answerUser.sex != void 0
  }, _ctx.answerUser.sex != void 0 ? {
    k: common_vendor.n(_ctx.answerUser.sex == 0 ? "iconfont icon-nvxing" : "iconfont icon-nanxing"),
    l: _ctx.answerUser.sex == 0 ? "#e86591" : "#528cea"
  } : {}, {
    m: common_vendor.t(_ctx.publishTime),
    n: !_ctx.answerData.isAnony
  }, !_ctx.answerData.isAnony ? common_vendor.e({
    o: !_ctx.isMe
  }, !_ctx.isMe ? common_vendor.e({
    p: _ctx.answerUser.isAttention == 0
  }, _ctx.answerUser.isAttention == 0 ? {
    q: common_vendor.o(($event) => _ctx.onFollow())
  } : {
    r: common_vendor.o(($event) => _ctx.onChatClick())
  }) : {}) : {}, {
    s: common_vendor.o(($event) => _ctx.onMoreClick()),
    t: common_vendor.t(_ctx.answerData.text),
    v: _ctx.answerData.pic.length > 0
  }, _ctx.answerData.pic.length > 0 ? common_vendor.e({
    w: _ctx.answerData.isVideo === 1
  }, _ctx.answerData.isVideo === 1 ? {
    x: common_vendor.f(_ctx.answerData.pic, (item2, k0, i0) => {
      return {
        a: item2 + "?vframe/jpg/offset/0",
        b: item2,
        c: "0e766922-2-" + i0,
        d: common_vendor.o((...args) => _ctx.onVideoClick && _ctx.onVideoClick(...args), item2),
        e: item2
      };
    }),
    y: !_ctx.playVideo,
    z: _ctx.playVideo,
    A: `video_${_ctx.answerId}`,
    B: common_vendor.o((...args) => _ctx.onFullscreenChange && _ctx.onFullscreenChange(...args)),
    C: common_vendor.p({
      customPrefix: "customicons",
      type: "videocam-filled",
      color: "#c5c5c5dc",
      size: "100"
    }),
    D: !_ctx.playVideo
  } : {
    E: common_vendor.f(_ctx.answerData.pic, (item2, index, i0) => {
      return {
        a: item2,
        b: index,
        c: common_vendor.o(($event) => _ctx.onImageClick(item2), index)
      };
    }),
    F: common_vendor.n("answer-body-image")
  }) : {}, {
    G: _ctx.answerData.isAgreed
  }, _ctx.answerData.isAgreed ? {
    H: common_vendor.t(_ctx.answerData.agreeSum),
    I: common_vendor.o((...args) => _ctx.onAgreeButtonClick && _ctx.onAgreeButtonClick(...args))
  } : _ctx.answerData.isOpposed ? {
    K: common_vendor.o((...args) => _ctx.onOpposeButtonClick && _ctx.onOpposeButtonClick(...args))
  } : {
    L: common_vendor.t(_ctx.answerData.agreeSum),
    M: common_vendor.o((...args) => _ctx.onAgreeButtonClick && _ctx.onAgreeButtonClick(...args)),
    N: common_vendor.o((...args) => _ctx.onOpposeButtonClick && _ctx.onOpposeButtonClick(...args))
  }, {
    J: _ctx.answerData.isOpposed,
    O: common_vendor.o(($event) => _ctx.onShareClick()),
    P: common_vendor.t(_ctx.answerData.commentSum),
    Q: common_vendor.o((...args) => _ctx.onAnswerClick && _ctx.onAnswerClick(...args))
  }), {
    R: common_vendor.f(_ctx.commentDatas, (item2, index, i0) => {
      return {
        a: item2.father.id,
        b: common_vendor.o(($event) => _ctx.onCommentClick(item2.father), item2.father.id),
        c: common_vendor.o(($event) => _ctx.onShowAllClick(item2.father), item2.father.id),
        d: common_vendor.o(($event) => _ctx.onCommentMoreClick(item2.father), item2.father.id),
        e: common_vendor.o(_ctx.onReplyClick, item2.father.id),
        f: common_vendor.o(_ctx.onReplyMoreClick, item2.father.id),
        g: "0e766922-3-" + i0,
        h: common_vendor.p({
          commentType: "answer",
          commentData: item2.father,
          replyData: item2.sons,
          authorId: _ctx.answerData.isAnonymity ? 0 : _ctx.answerUser.id,
          needRefresh: _ctx.refreshCommentId == item2.father.id
        })
      };
    }),
    S: common_vendor.p({
      status: _ctx.haveMoreData ? _ctx.showBottomLoading ? "loading" : "more" : "noMore",
      contentText: {
        contentdown: "\u4E0A\u62C9\u663E\u793A\u66F4\u591A",
        contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
        contentnomore: _ctx.haveMoreData == false && _ctx.commentDatas.length <= 0 ? "\u8FD8\u6CA1\u6709\u8BC4\u8BBA\uFF0C\u5FEB\u6765\u62A2\u6C99\u53D1\u5427~" : "\u6CA1\u6709\u66F4\u591A\u8BC4\u8BBA\u4E86"
      },
      iconType: "circle"
    }),
    T: _ctx.isRefresh,
    U: common_vendor.o(($event) => _ctx.onRefresh()),
    V: common_vendor.o(($event) => _ctx.onScrollToLower()),
    W: _ctx.scrollInto,
    X: _ctx.scollerHeight + "px",
    Y: _ctx.isIOS
  }, _ctx.isIOS ? {
    Z: _ctx.placeholder,
    aa: _ctx.inputFocus,
    ab: common_vendor.o((...args) => _ctx.onCommentTextareaFocus && _ctx.onCommentTextareaFocus(...args)),
    ac: common_vendor.o((...args) => _ctx.onCommentTextareaBlur && _ctx.onCommentTextareaBlur(...args)),
    ad: _ctx.sendText,
    ae: common_vendor.o(($event) => _ctx.sendText = $event.detail.value)
  } : {
    af: _ctx.placeholder,
    ag: _ctx.inputFocus,
    ah: common_vendor.o((...args) => _ctx.onCommentTextareaFocus && _ctx.onCommentTextareaFocus(...args)),
    ai: common_vendor.o((...args) => _ctx.onCommentTextareaBlur && _ctx.onCommentTextareaBlur(...args)),
    aj: _ctx.sendText,
    ak: common_vendor.o(($event) => _ctx.sendText = $event.detail.value)
  }, {
    al: common_vendor.o(($event) => _ctx.onEmojiIconClick()),
    am: common_vendor.t(_ctx.buttonIsLoading ? "\u53D1\u9001\u4E2D" : "\u53D1\u9001"),
    an: common_vendor.o(($event) => _ctx.onSendButtonClick()),
    ao: _ctx.showEmojiPicker,
    ap: common_vendor.o(_ctx.setEmoj),
    aq: common_vendor.p({
      contentHeight: _ctx.emojiContentHeight
    }),
    ar: common_vendor.p({
      ["mode-class"]: "slide-bottom",
      show: _ctx.showEmojiPicker
    }),
    as: _ctx.showEmojiPicker ? _ctx.emojiContentHeight + "px" : _ctx.keyboardHeight + "px",
    at: _ctx.answerData.id
  }, _ctx.answerData.id ? common_vendor.e({
    av: _ctx.answerData.isAnonymity
  }, _ctx.answerData.isAnonymity ? {
    aw: common_vendor.o(($event) => _ctx.onPopupReportClick()),
    ax: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  } : common_vendor.e({
    ay: _ctx.answerUser.id == _ctx.myId
  }, _ctx.answerUser.id == _ctx.myId ? {
    az: common_vendor.o(_ctx.onPopupDeleteClick),
    aA: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    aB: _ctx.answerUser.isAttention == 1
  }, _ctx.answerUser.isAttention == 1 ? {
    aC: common_vendor.o(($event) => _ctx.onCancelFollow()),
    aD: common_vendor.p({
      icon: "icon-quxiaoguanzhu",
      title: "\u53D6\u6D88\u5173\u6CE8"
    })
  } : {
    aE: common_vendor.o(($event) => _ctx.onFollow()),
    aF: common_vendor.p({
      icon: "icon-guanzhu",
      title: "\u5173\u6CE8"
    })
  }, {
    aG: common_vendor.o(($event) => _ctx.onChatClick()),
    aH: common_vendor.p({
      icon: "icon-message",
      title: "\u79C1\u804A"
    }),
    aI: common_vendor.o(($event) => _ctx.onPopupReportUserClick()),
    aJ: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  }))) : {}, {
    aK: common_vendor.sr("answerActionPopup", "0e766922-7"),
    aL: common_vendor.p({
      needHead: true,
      title: "\u52A8\u6001\u9009\u62E9",
      needCancelButton: true
    }),
    aM: _ctx.commentMoreSelected.fromUserId
  }, _ctx.commentMoreSelected.fromUserId ? common_vendor.e({
    aN: _ctx.myId == _ctx.commentMoreSelected.fromUserId
  }, _ctx.myId == _ctx.commentMoreSelected.fromUserId ? {
    aO: common_vendor.o(($event) => _ctx.onCommentPopupDeleteClick(_ctx.commentMoreSelected)),
    aP: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    aQ: common_vendor.o(($event) => _ctx.onCommentPopupReportClick(_ctx.commentMoreSelected)),
    aR: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    }),
    aS: _ctx.answerUser.id == _ctx.myId
  }, _ctx.answerUser.id == _ctx.myId ? {
    aT: common_vendor.o(($event) => _ctx.onCommentPopupDeleteClick(_ctx.commentMoreSelected)),
    aU: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : {})) : {}, {
    aV: common_vendor.sr("commentActionPopup", "0e766922-14"),
    aW: common_vendor.p({
      needHead: true,
      title: "\u8BC4\u8BBA\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/activity-info/answer-info/answer-info.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
