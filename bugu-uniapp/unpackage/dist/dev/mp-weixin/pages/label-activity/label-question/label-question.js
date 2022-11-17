"use strict";
var common_vendor = require("../../../common/vendor.js");
var services_questionServices = require("../../../services/questionServices.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
require("../../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      labelText: "",
      labelId: 0,
      isLoading: true,
      haveMoreData: false,
      questions: [],
      showBottomLoading: false,
      page: 1,
      editQuestionItem: {},
      scrollInto: "",
      myId: -1
    };
  },
  async onLoad(params) {
    this.labelContent = params.labelContent;
    this.labelId = params.labelId;
    let userInfo = await common_storageFunctions.getMyUserInfo();
    if (userInfo) {
      this.myId = userInfo.id;
    }
    if (this.labelId) {
      await this.getQuestionsBylabelId(this.labelId, this.page);
    }
    this.isLoading = false;
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onJoinButtonClick() {
      common_vendor.index.navigateTo({
        url: `/pages/publish/ask-questions/ask-questions?labelId=${this.labelId}&labelContent=${this.labelContent}`
      });
    },
    onScrolltolower() {
      if (!this.haveMoreData) {
        return;
      }
      this.page = this.page + 1;
      this.getQuestionsBylabelId(this.labelId, this.page);
    },
    onQuestionItemClick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/question-info/question-info?questionId=${id}`
      });
    },
    onQuestionItemMoreClick(item) {
      this.editQuestionItem = item;
      this.$refs.questionActionPopup.open();
    },
    async onQuestionCollect(id) {
      if (await services_questionServices.collectQuestion(id)) {
        let questions = this.questions;
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].id == id) {
            questions[i].isCollected = 1;
            questions[i].collectSum = questions[i].collectSum + 1;
            break;
          }
        }
        this.questions = questions;
        this.$refs.questionActionPopup.close();
        common_vendor.index.showToast({
          title: "\u6536\u85CF\u6210\u529F",
          icon: "success"
        });
      } else {
        common_vendor.index.showToast({
          title: "\u6536\u85CF\u5931\u8D25",
          icon: "error"
        });
      }
    },
    async onCancelQuestionCollect(id) {
      if (await services_questionServices.cancelCollectQuestion(id)) {
        let questions = this.questions;
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].id == id) {
            questions[i].isCollected = 0;
            questions[i].collectSum = questions[i].collectSum - 1;
            break;
          }
        }
        this.questions = questions;
        this.$refs.questionActionPopup.close();
        common_vendor.index.showToast({
          title: "\u53D6\u6D88\u6210\u529F",
          icon: "success"
        });
      } else {
        common_vendor.index.showToast({
          title: "\u53D6\u6D88\u5931\u8D25",
          icon: "error"
        });
      }
    },
    onQuestionDeleteClick(id) {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u95EE\u9898",
        content: "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u95EE\u9898\u5417",
        success: async function(res) {
          if (res.confirm) {
            if (await services_questionServices.deleteQuestion(id)) {
              let questions = _this.questions;
              for (let i = 0; i < questions.length; i++) {
                if (questions[i].id == id) {
                  questions.splice(i, 1);
                  break;
                }
              }
              _this.questions = questions;
              _this.$refs.questionActionPopup.close();
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
    async getQuestionsBylabelId(labelId, page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "question",
          action: "groupByLabel",
          data: {
            labelId,
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let pageInfo = res.data.data;
        let questions = pageInfo.list;
        if (questions.length < 1 && pageInfo.hasNext) {
          if (pageInfo.hasNext) {
            this.page = page + 1;
            this.getQuestionsBylabelId(labelId, this.page);
          }
          return;
        }
        if (pageInfo.hasNext) {
          this.haveMoreData = true;
        } else {
          this.haveMoreData = false;
        }
        if (page === 1) {
          this.questions = questions;
          this.scrollInto = "";
        } else {
          let allQuestions = this.questions.concat(questions);
          this.questions = allQuestions;
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_question_item_skeleton2 = common_vendor.resolveComponent("question-item-skeleton");
  const _easycom_question_item2 = common_vendor.resolveComponent("question-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_question_item_skeleton2 + _easycom_question_item2 + _easycom_uni_load_more2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_question_item_skeleton = () => "../../../components/question-item-skeleton/question-item-skeleton.js";
const _easycom_question_item = () => "../../../components/question-item/question-item.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_action_sheet_item = () => "../../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_question_item_skeleton + _easycom_question_item + _easycom_uni_load_more + _easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.labelText),
    b: common_vendor.o(($event) => $options.onNarLeftClick()),
    c: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    d: common_vendor.t(_ctx.labelContent),
    e: common_vendor.o(($event) => $options.onJoinButtonClick()),
    f: common_vendor.t($data.questions.length),
    g: $data.isLoading
  }, $data.isLoading ? {
    h: common_vendor.f([...new Array(5)], (item, index, i0) => {
      return {
        a: "skeleton" + index,
        b: "f3c5f9c4-1-" + i0
      };
    }),
    i: common_vendor.p({
      needLabel: false
    })
  } : common_vendor.e({
    j: common_vendor.f($data.questions, (item, index, i0) => {
      return {
        a: "question" + item.id,
        b: common_vendor.o(($event) => $options.onQuestionItemClick(item.id), "question" + item.id),
        c: common_vendor.o(($event) => $options.onQuestionItemMoreClick(item), "question" + item.id),
        d: "f3c5f9c4-2-" + i0,
        e: common_vendor.p({
          questionData: item,
          answerData: item.hotAnswer
        })
      };
    }),
    k: $data.questions.length <= 0
  }, $data.questions.length <= 0 ? {} : {
    l: common_vendor.p({
      status: $data.haveMoreData ? $data.showBottomLoading ? "loading" : "more" : "noMore",
      contentText: {
        contentdown: "\u4E0A\u62C9\u663E\u793A\u66F4\u591A",
        contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
        contentnomore: "\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86"
      },
      iconType: "circle"
    })
  }, {
    m: $data.scrollInto,
    n: common_vendor.o((...args) => $options.onScrolltolower && $options.onScrolltolower(...args))
  }), {
    o: $data.editQuestionItem.id
  }, $data.editQuestionItem.id ? common_vendor.e({
    p: $data.editQuestionItem.publisher && $data.editQuestionItem.publisher.id == $data.myId
  }, $data.editQuestionItem.publisher && $data.editQuestionItem.publisher.id == $data.myId ? {
    q: common_vendor.o(($event) => $options.onQuestionDeleteClick($data.editQuestionItem.id)),
    r: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    s: common_vendor.o(($event) => _ctx.onQuestionReportClick($data.editQuestionItem.id)),
    t: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    }),
    v: $data.editQuestionItem.isLike
  }, $data.editQuestionItem.isLike ? {
    w: common_vendor.o(($event) => $options.onCancelQuestionCollect($data.editQuestionItem.id)),
    x: common_vendor.p({
      icon: "icon-quxiaoguanzhu",
      title: "\u53D6\u6D88\u5173\u6CE8"
    })
  } : {
    y: common_vendor.o(($event) => $options.onQuestionCollect($data.editQuestionItem.id)),
    z: common_vendor.p({
      icon: "icon-guanzhu",
      title: "\u5173\u6CE8\u95EE\u9898"
    })
  })) : {}, {
    A: common_vendor.sr("questionActionPopup", "f3c5f9c4-4"),
    B: common_vendor.p({
      needHead: true,
      title: "\u95EE\u9898\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/label-activity/label-question/label-question.vue"]]);
wx.createPage(MiniProgramPage);
