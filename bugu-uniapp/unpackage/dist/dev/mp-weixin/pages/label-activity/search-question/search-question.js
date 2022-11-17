"use strict";
var common_vendor = require("../../../common/vendor.js");
var services_questionServices = require("../../../services/questionServices.js");
var common_storageKeys = require("../../../common/storageKeys.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
const _sfc_main = {
  data() {
    return {
      searchText: "",
      searchTextBefore: "",
      haveMoreData: false,
      questions: [],
      showBottomLoading: false,
      page: 1,
      editQuestionItem: {},
      scrollInto: "",
      hotLabels: [],
      showHotLabels: true,
      searchHistory: [],
      myId: -1
    };
  },
  async onLoad() {
    this.hotLabels = await this.getHotLabels();
    let userInfo = await common_storageFunctions.getMyUserInfo();
    if (userInfo) {
      this.myId = userInfo.id;
    }
    let searchHistory = common_vendor.index.getStorageSync(common_storageKeys.SEARCH_QUESTION_HISTORY);
    if (searchHistory) {
      this.searchHistory = searchHistory;
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onLabelTextClick(labelText) {
      this.page = 1;
      this.searchTextBefore = this.searchText = labelText;
      this.searchQuestions(this.searchText, this.page);
    },
    onScrolltolower() {
      if (!this.haveMoreData) {
        return;
      }
      this.page = this.page + 1;
      if (this.searchText !== this.searchTextBefore) {
        this.searchQuestions(this.searchTextBefore, this.page);
      } else {
        this.searchQuestions(this.searchText, this.page);
      }
    },
    onSearchInput(e) {
      this.searchText = e;
    },
    onSearchConfirm() {
      if (this.searchText.length < 1) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u8F93\u5165\u5173\u952E\u8BCD"
        });
        return;
      }
      this.page = 1;
      common_vendor.index.showLoading({
        title: "\u641C\u7D22\u4E2D"
      });
      this.searchTextBefore = this.searchText;
      this.searchQuestions(this.searchText, this.page);
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
    async getHotLabels() {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "question",
          action: "label/list",
          data: {
            page: 1
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let labels = res.data.data.list;
        return labels;
      } else {
        return [];
      }
    },
    async searchQuestions(subText, page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "question",
          action: "fullTextQuery",
          data: {
            page,
            subText
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
            this.searchQuestions(subText, this.page);
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
      common_vendor.index.hideLoading();
      this.showHotLabels = false;
      if (page == 1) {
        let searchHistory = [];
        let searchHistoryStorage = common_vendor.index.getStorageSync(common_storageKeys.SEARCH_QUESTION_HISTORY);
        if (searchHistoryStorage) {
          searchHistory = searchHistoryStorage;
        }
        if (searchHistory.indexOf(subText) == -1) {
          searchHistory.push(subText);
          if (searchHistory.length > 10) {
            searchHistory.splice(0, 1);
          }
        } else {
          searchHistory.splice(searchHistory.indexOf(subText), 1);
          searchHistory.push(subText);
        }
        common_vendor.index.setStorage({
          key: common_storageKeys.SEARCH_QUESTION_HISTORY,
          data: searchHistory
        });
        this.searchHistory = searchHistory.reverse();
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_question_item2 = common_vendor.resolveComponent("question-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_uni_search_bar2 + _easycom_question_item2 + _easycom_uni_load_more2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_search_bar = () => "../../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_question_item = () => "../../../components/question-item/question-item.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_action_sheet_item = () => "../../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_search_bar + _easycom_question_item + _easycom_uni_load_more + _easycom_action_sheet_item + _easycom_action_sheet)();
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
    c: common_vendor.o(($event) => $options.onSearchConfirm()),
    d: common_vendor.o(($event) => $data.searchText = $event),
    e: common_vendor.p({
      placeholder: "\u95EE\u9898\u641C\u7D22",
      cancelButton: "none",
      modelValue: $data.searchText
    }),
    f: common_vendor.o(($event) => $options.onSearchConfirm()),
    g: $data.showHotLabels
  }, $data.showHotLabels ? common_vendor.e({
    h: $data.searchHistory.length > 0
  }, $data.searchHistory.length > 0 ? {
    i: common_vendor.f($data.searchHistory, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: common_vendor.o(($event) => $options.onLabelTextClick(item), item)
      };
    })
  } : {}, {
    j: common_vendor.f($data.hotLabels, (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.n(index < 3 ? "label-index-hot" : "label-index"),
        c: common_vendor.t(item.content),
        d: common_vendor.t(item.hot),
        e: item.id,
        f: common_vendor.o(($event) => $options.onLabelTextClick(item.content), item.id)
      };
    })
  }) : common_vendor.e({
    k: common_vendor.f($data.questions, (item, index, i0) => {
      return {
        a: "question" + item.id,
        b: common_vendor.o(($event) => $options.onQuestionItemClick(item.id), "question" + item.id),
        c: common_vendor.o(($event) => $options.onQuestionItemMoreClick(item), "question" + item.id),
        d: "1338afd4-2-" + i0,
        e: common_vendor.p({
          questionData: item,
          answerData: item.hotAnswer
        })
      };
    }),
    l: $data.questions.length <= 0
  }, $data.questions.length <= 0 ? {} : {
    m: common_vendor.p({
      status: $data.haveMoreData ? $data.showBottomLoading ? "loading" : "more" : "noMore",
      contentText: {
        contentdown: "\u4E0A\u62C9\u663E\u793A\u66F4\u591A",
        contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
        contentnomore: "\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86"
      },
      iconType: "circle"
    })
  }, {
    n: $data.scrollInto,
    o: common_vendor.o((...args) => $options.onScrolltolower && $options.onScrolltolower(...args))
  }), {
    p: $data.editQuestionItem.id
  }, $data.editQuestionItem.id ? common_vendor.e({
    q: $data.editQuestionItem.publisher && $data.editQuestionItem.publisher.id == $data.myId
  }, $data.editQuestionItem.publisher && $data.editQuestionItem.publisher.id == $data.myId ? {
    r: common_vendor.o(($event) => $options.onQuestionDeleteClick($data.editQuestionItem.id)),
    s: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    t: common_vendor.o(($event) => _ctx.onQuestionReportClick($data.editQuestionItem.id)),
    v: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    }),
    w: $data.editQuestionItem.isCollected
  }, $data.editQuestionItem.isCollected ? {
    x: common_vendor.o(($event) => $options.onCancelQuestionCollect($data.editQuestionItem.id)),
    y: common_vendor.p({
      icon: "icon-quxiaoguanzhu",
      title: "\u53D6\u6D88\u6536\u85CF"
    })
  } : {
    z: common_vendor.o(($event) => $options.onQuestionCollect($data.editQuestionItem.id)),
    A: common_vendor.p({
      icon: "icon-guanzhu",
      title: "\u6536\u85CF\u95EE\u9898"
    })
  })) : {}, {
    B: common_vendor.sr("questionActionPopup", "1338afd4-4"),
    C: common_vendor.p({
      needHead: true,
      title: "\u95EE\u9898\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/label-activity/search-question/search-question.vue"]]);
wx.createPage(MiniProgramPage);
