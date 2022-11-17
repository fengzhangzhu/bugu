"use strict";
var common_vendor = require("../../../common/vendor.js");
var services_answerServices = require("../../../services/answerServices.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
require("../../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      isLoading: true,
      haveMoreData: false,
      answers: [],
      showBottomLoading: false,
      page: 1,
      editAnswerItem: {},
      scrollInto: "",
      myUserInfo: {},
      myId: -1
    };
  },
  async onLoad() {
    let userInfo = await common_storageFunctions.getMyUserInfo();
    if (userInfo) {
      this.myId = userInfo.id;
      this.myUserInfo = userInfo;
    }
    await this.getMyAnswer(this.page);
    this.isLoading = false;
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onScrolltolower() {
      if (!this.haveMoreData) {
        return;
      }
      this.page = this.page + 1;
      this.getMyAnswer(this.page);
    },
    onQuestionItemClick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/question-info/question-info?questionId=${id}`
      });
    },
    onQuestionItemMoreClick(item) {
      this.editAnswerItem = item;
      this.$refs.answerActionPopup.open();
    },
    onAnswerDeleteClick(item) {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u56DE\u7B54",
        content: "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u56DE\u7B54\u5417",
        success: async function(res) {
          if (res.confirm) {
            if (await services_answerServices.deleteAnswer(item.id)) {
              let answers = _this.answers;
              for (let i = 0; i < answers.length; i++) {
                if (answers[i].id == item.id) {
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
    async getMyAnswer(page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "answer",
          action: "my/publish",
          data: {
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
        if (answers.length < 1 && pageInfo.hasNext) {
          if (page < pageInfo.totalPages) {
            this.page = page + 1;
            this.getMyAnswer(this.page);
          }
        }
        this.haveMoreData = pageInfo.hasNext;
        if (page === 1) {
          this.answers = answers;
          this.scrollInto = "";
        } else {
          let allanswers = this.answers.concat(answers);
          this.answers = allanswers;
        }
      }
      common_vendor.index.hideLoading();
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
    a: common_vendor.o(($event) => $options.onNarLeftClick()),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: $data.isLoading
  }, $data.isLoading ? {
    d: common_vendor.f([...new Array(5)], (item, index, i0) => {
      return {
        a: "skeleton" + index,
        b: "e78ddf86-1-" + i0
      };
    }),
    e: common_vendor.p({
      needLabel: false
    })
  } : common_vendor.e({
    f: common_vendor.f($data.answers, (item, index, i0) => {
      return {
        a: "question" + item.questionId,
        b: common_vendor.o(($event) => $options.onQuestionItemClick(item.questionId), "question" + item.questionId),
        c: common_vendor.o(($event) => $options.onQuestionItemMoreClick(item), "question" + item.questionId),
        d: "e78ddf86-2-" + i0,
        e: common_vendor.p({
          questionData: item.question,
          answerData: item
        })
      };
    }),
    g: $data.answers.length <= 0
  }, $data.answers.length <= 0 ? {} : {
    h: common_vendor.p({
      status: $data.haveMoreData ? $data.showBottomLoading ? "loading" : "more" : "noMore",
      contentText: {
        contentdown: "\u4E0A\u62C9\u663E\u793A\u66F4\u591A",
        contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
        contentnomore: "\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86"
      },
      iconType: "circle"
    })
  }, {
    i: $data.scrollInto,
    j: common_vendor.o((...args) => $options.onScrolltolower && $options.onScrolltolower(...args))
  }), {
    k: $data.editAnswerItem.id
  }, $data.editAnswerItem.id ? {
    l: common_vendor.o(($event) => $options.onAnswerDeleteClick($data.editAnswerItem)),
    m: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : {}, {
    n: common_vendor.sr("answerActionPopup", "e78ddf86-4"),
    o: common_vendor.p({
      needHead: true,
      title: "\u56DE\u7B54\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/my-acticity/my-answers/my-answers.vue"]]);
wx.createPage(MiniProgramPage);
