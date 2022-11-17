"use strict";
var common_vendor = require("../../../common/vendor.js");
var services_questionServices = require("../../../services/questionServices.js");
var services_answerServices = require("../../../services/answerServices.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
require("../../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      questionData: {},
      answers: [],
      editAnswerItem: {},
      havaMoreData: true,
      bottomLoading: false,
      showAllDescription: false,
      questionLoading: true,
      contentHeight: 0,
      navHeight: 0,
      page: 1,
      myId: -1,
      myUserInfo: {},
      isRefresh: false
    };
  },
  computed: {
    questionDescription() {
      if (!this.questionData.id) {
        return "";
      }
      let text = this.questionData.text;
      if (this.showAllDescription) {
        return text;
      } else {
        let realMaxLength = 58;
        let maxLength = 58;
        let line_breaks = 0;
        let transformTextLength = 0;
        let textMatch = text.match(/\n/ig);
        if (textMatch) {
          line_breaks = textMatch.length;
        }
        if (line_breaks <= 0) {
          transformTextLength = text.length;
        } else {
          transformTextLength = text.length + line_breaks * 19;
          if (transformTextLength > maxLength) {
            let first_break = text.indexOf("\n");
            let temp_break = first_break;
            let real_break = first_break;
            let temp_text = text;
            while (temp_break < maxLength) {
              temp_text = text.slice(real_break + 1);
              if (temp_text.indexOf("\n") == -1) {
                break;
              }
              temp_break = temp_break + 20 + temp_text.indexOf("\n");
              real_break = real_break + 1 + temp_text.indexOf("\n");
            }
            realMaxLength = real_break;
          }
        }
        let showAll = transformTextLength <= realMaxLength;
        if (showAll) {
          return this.questionData.text;
        } else {
          return this.questionData.text.slice(0, realMaxLength) + "...";
        }
      }
    },
    showUnfoldButton() {
      if (!this.questionData.id) {
        return false;
      } else {
        if (this.questionData.pics || this.questionData.video) {
          return true;
        }
        let text = this.questionData.text;
        let maxLength = 40;
        let transformTextLength = 0;
        let line_breaks = 0;
        let textMatch = text.match(/\n/ig);
        if (textMatch) {
          line_breaks = textMatch.length;
        }
        if (line_breaks <= 0) {
          transformTextLength = text.length;
        } else {
          transformTextLength = text.length + line_breaks * 19;
        }
        if (transformTextLength < maxLength) {
          return false;
        } else {
          return true;
        }
      }
    },
    scollerHeight() {
      return this.contentHeight - this.navHeight;
    }
  },
  onReady() {
    let _this = this;
    common_vendor.index.getSystemInfo({
      success(res) {
        _this.contentHeight = res.windowHeight;
      }
    });
    let titleH = common_vendor.index.createSelectorQuery().select("#question-content");
    titleH.boundingClientRect((data) => {
      _this.navHeight = data.top;
    }).exec();
  },
  async onLoad(params) {
    this.questionId = params.questionId;
    this.getQuetionsInfo(this.questionId);
    this.getAnswers(this.questionId, 1);
    let userInfo = await common_storageFunctions.getMyUserInfo();
    if (userInfo) {
      this.myId = userInfo.id;
      this.myUserInfo = userInfo;
    }
  },
  onShareAppMessage() {
    let imageUrl = "";
    if (this.questionData.video) {
      imageUrl = this.questionData.video[0] + "?vframe/jpg/offset/0";
    } else if (this.questionData.issue.imgs) {
      imageUrl = this.questionData.pics[0];
    }
    let username = this.myUserInfo.username.length > 7 ? this.myUserInfo.username.slice(0, 7) : this.myUserInfo.username;
    return {
      title: `${username}\u9080\u8BF7\u60A8\u56DE\u7B54\u95EE\u9898\u201C${this.questionData.title}\u201D`,
      path: `/pages/activity-info/question-info/question-info?questionId=${this.questionData.id}`,
      imageUrl
    };
  },
  onShareTimeline() {
    let imageUrl = "";
    if (this.questionData.video) {
      imageUrl = this.questionData.video[0] + "?vframe/jpg/offset/0";
    } else if (this.questionData.pics) {
      imageUrl = this.questionData.pics[0];
    }
    let username = this.myUserInfo.username.length > 7 ? this.myUserInfo.username.slice(0, 7) : this.myUserInfo.username;
    return {
      title: `${username}\u9080\u8BF7\u60A8\u56DE\u7B54\u95EE\u9898\u201C${this.questionData.title}\u201D`,
      path: `/pages/activity-info/question-info/question-info?questionId=${this.questionData.id}`,
      imageUrl
    };
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onQuestionLabelClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/label-activity/label-question/label-question?labelId=${item.id}&labelContent=${item.content}`
      });
    },
    onUnfoldClick() {
      this.showAllDescription = !this.showAllDescription;
    },
    onWriteAnswerClick() {
      let questionTitle = encodeURIComponent(JSON.stringify(JSON.stringify(this.questionData.title)));
      common_vendor.index.navigateTo({
        url: `/pages/publish/write-answers/write-answers?questionTitle=${questionTitle}&questionId=${this.questionData.id}`
      });
    },
    async onLikeButtonClick() {
      if (this.questionData.isLiked === 0) {
        this.questionData.isLiked = 1;
        this.questionData.likeSum = this.questionData.likeSum + 1;
        if (await services_questionServices.likeQuestion(this.questionData.id)) {
          common_vendor.index.showToast({
            title: "\u70B9\u8D5E\u6210\u529F",
            icon: "success"
          });
        } else {
          this.questionData.isLiked = 0;
          this.questionData.likeSum = this.questionData.likeSum - 1;
          common_vendor.index.showToast({
            title: "\u70B9\u8D5E\u5931\u8D25",
            icon: "error"
          });
        }
      } else if (this.questionData.isLiked === 1) {
        this.questionData.isLiked = 0;
        this.questionData.likeSum = this.questionData.likeSum - 1;
        if (await services_questionServices.cancelLikeQuestion(this.questionData.id)) {
          common_vendor.index.showToast({
            title: "\u53D6\u6D88\u6210\u529F",
            icon: "success"
          });
        } else {
          this.questionData.isLiked = 1;
          this.questionData.likeSum = this.questionData.likeSum + 1;
          common_vendor.index.showToast({
            title: "\u53D6\u6D88\u5931\u8D25",
            icon: "error"
          });
        }
      }
    },
    async onCollectButtonClick() {
      if (this.questionData.isCollected === 0) {
        this.questionData.isCollected = 1;
        this.questionData.collectSum = this.questionData.collectSum + 1;
        if (await services_questionServices.collectQuestion(this.questionData.id)) {
          common_vendor.index.showToast({
            title: "\u6536\u85CF\u6210\u529F",
            icon: "success"
          });
        } else {
          this.questionData.isCollected = 0;
          this.questionData.collectSum = this.questionData.collectSum - 1;
          common_vendor.index.showToast({
            title: "\u5173\u6CE8\u5931\u8D25",
            icon: "error"
          });
        }
      } else if (this.questionData.isCollected == 1) {
        this.questionData.isCollected = 0;
        this.questionData.collectSum = this.questionData.collectSum - 1;
        if (await services_questionServices.cancelCollectQuestion(this.questionData.id)) {
          common_vendor.index.showToast({
            title: "\u53D6\u6D88\u6210\u529F",
            icon: "success"
          });
        } else {
          this.questionData.isCollected = 1;
          this.questionData.collectSum = this.questionData.collectSum + 1;
          common_vendor.index.showToast({
            title: "\u53D6\u6D88\u5931\u8D25",
            icon: "error"
          });
        }
      }
    },
    async onAnswerIsRefresh() {
      this.isRefresh = true;
      this.page = 1;
      await this.getAnswers(this.questionData.id, this.page);
      setTimeout(() => {
        this.isRefresh = false;
      }, 700);
    },
    onAnswerClick(item) {
      let questionTitle = encodeURIComponent(JSON.stringify(JSON.stringify(this.questionData.title)));
      let questionId = this.questionData.id;
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/answer-info/answer-info?questionTitle=${questionTitle}&questionId=${questionId}&answerId=${item.id}`
      });
    },
    onAnswerMoreClick(item) {
      this.editAnswerItem = item;
      this.$refs.answerActionPopup.open();
    },
    onAnswerReportClick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/setting/report-user/report-user?objectId=${id}&objectType=${common_constants.reportObjectType.answer}&modular=question`
      });
      this.$refs.answerActionPopup.close();
    },
    onAnswerDeleteClick(id) {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u56DE\u7B54",
        content: "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u56DE\u7B54\u5417",
        success: async function(res) {
          if (res.confirm) {
            if (await services_answerServices.deleteAnswer(id)) {
              let answers = _this.answers;
              for (let i = 0; i < answers.length; i++) {
                if (answers[i].id == id) {
                  answers.splice(i, 1);
                  break;
                }
              }
              _this.answers = answers;
              _this.$refs.answerActionPopup.close();
              common_vendor.index.showToast({
                title: "\u5220\u9664\u6210\u529F",
                icon: "success"
              });
            } else {
              common_vendor.index.showToast({
                title: "\u5220\u9664\u5931\u8D25",
                icon: "error"
              });
            }
          }
        }
      });
    },
    async getQuetionsInfo(question_id) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "question",
          action: `${question_id}/detail`,
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        this.questionData = res.data.data;
        this.questionLoading = false;
      }
    },
    async getAnswers(questionId, page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "answer",
          action: "all",
          data: {
            questionId,
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let pageInfo = res.data.data;
        let answers = pageInfo.list;
        this.haveMoreData = pageInfo.hasNext;
        if (page === 1) {
          this.answers = answers;
          this.scrollInto = "";
        } else {
          let allanswers = this.answers.concat(answers);
          this.answers = allanswers;
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_question_skeleton2 = common_vendor.resolveComponent("question-skeleton");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_View = common_vendor.resolveComponent("View");
  const _easycom_answer_item2 = common_vendor.resolveComponent("answer-item");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_question_skeleton2 + _easycom_uni_icons2 + _component_View + _easycom_answer_item2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_question_skeleton = () => "../../../components/question-skeleton/question-skeleton.js";
const _easycom_uni_icons = () => "../../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_answer_item = () => "../../../components/answer-item/answer-item.js";
const _easycom_action_sheet_item = () => "../../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_question_skeleton + _easycom_uni_icons + _easycom_answer_item + _easycom_action_sheet_item + _easycom_action_sheet)();
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
    c: $data.questionLoading
  }, $data.questionLoading ? {} : common_vendor.e({
    d: common_vendor.f($data.questionData.labels, (item, index, i0) => {
      return {
        a: common_vendor.t(item.content),
        b: "label" + item.id,
        c: common_vendor.o(($event) => $options.onQuestionLabelClick(item), "label" + item.id)
      };
    }),
    e: common_vendor.t($data.questionData.title),
    f: $data.questionData.pics.length > 0 && !$data.showAllDescription
  }, $data.questionData.pics.length > 0 && !$data.showAllDescription ? {
    g: $data.questionData.pics[0]
  } : {}, {
    h: $data.questionData.video.length > 0 && !$data.showAllDescription
  }, $data.questionData.video.length > 0 && !$data.showAllDescription ? {
    i: $data.questionData.video[0] + "?vframe/jpg/offset/0",
    j: common_vendor.p({
      customPrefix: "customicons",
      type: "videocam-filled",
      color: "#c5c5c5dc",
      size: "70"
    }),
    k: !_ctx.playVideo
  } : {}, {
    l: common_vendor.t($options.questionDescription),
    m: common_vendor.f($data.questionData.pics, (item, k0, i0) => {
      return {
        a: item,
        b: item
      };
    }),
    n: $data.questionData.pics.length > 0 && $data.showAllDescription,
    o: common_vendor.f($data.questionData.video, (item, index, i0) => {
      return {
        a: item,
        b: `video_${index}`,
        c: item
      };
    }),
    p: $data.questionData.video.length > 0 && $data.showAllDescription,
    q: $options.showUnfoldButton
  }, $options.showUnfoldButton ? common_vendor.e({
    r: $data.showAllDescription
  }, $data.showAllDescription ? {} : {}, {
    s: common_vendor.o(($event) => $options.onUnfoldClick())
  }) : {}, {
    t: common_vendor.t($data.questionData.answerSum),
    v: common_vendor.t($data.questionData.viewSum),
    w: common_vendor.p({
      type: "hand-up",
      color: $data.questionData.isLiked == 1 ? "#04543B" : "#838383",
      size: "20"
    }),
    x: common_vendor.t($data.questionData.likeSum),
    y: common_vendor.o((...args) => $options.onLikeButtonClick && $options.onLikeButtonClick(...args)),
    z: common_vendor.n("is-liked-" + $data.questionData.isLiked)
  }), {
    A: common_vendor.p({
      type: "personadd-filled",
      color: "#626262",
      size: "23"
    }),
    B: common_vendor.p({
      type: "compose",
      color: "#626262",
      size: "23"
    }),
    C: common_vendor.o(($event) => $options.onWriteAnswerClick()),
    D: common_vendor.p({
      type: $data.questionData.isCollected == 1 ? "star-filled" : "star",
      color: "#626262",
      size: "23"
    }),
    E: common_vendor.t($data.questionData.isCollected == 1 ? "\u5DF2\u6536\u85CF" : "\u6536\u85CF\u95EE\u9898"),
    F: common_vendor.o((...args) => $options.onCollectButtonClick && $options.onCollectButtonClick(...args)),
    G: $data.questionData.issue
  }, $data.questionData.issue ? {
    H: common_vendor.t($data.questionData.answerSum)
  } : {}, {
    I: common_vendor.f($data.answers, (item, k0, i0) => {
      return {
        a: common_vendor.o(($event) => $options.onAnswerClick(item)),
        b: common_vendor.o(($event) => $options.onAnswerMoreClick(item)),
        c: "6bca8dd2-8-" + i0,
        d: common_vendor.p({
          answerData: item
        }),
        e: item.id
      };
    }),
    J: $options.scollerHeight + "px",
    K: $data.isRefresh,
    L: common_vendor.o(($event) => $options.onAnswerIsRefresh()),
    M: $data.editAnswerItem.id
  }, $data.editAnswerItem.id ? common_vendor.e({
    N: $data.editAnswerItem.publisher && $data.editAnswerItem.publisher.id == $data.myId
  }, $data.editAnswerItem.publisher && $data.editAnswerItem.publisher.id == $data.myId ? {
    O: common_vendor.o(($event) => $options.onAnswerDeleteClick($data.editAnswerItem.id)),
    P: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : {
    Q: common_vendor.o(($event) => $options.onAnswerReportClick($data.editAnswerItem.id)),
    R: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  }) : {}, {
    S: common_vendor.sr("answerActionPopup", "6bca8dd2-9"),
    T: common_vendor.p({
      needHead: true,
      title: "\u56DE\u7B54\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/activity-info/question-info/question-info.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
