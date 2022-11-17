"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
var services_questionServices = require("../../services/questionServices.js");
var common_storageKeys = require("../../common/storageKeys.js");
var utils_request = require("../../utils/request.js");
const _sfc_main = {
  emits: ["onRefreshing"],
  props: {
    scollerHeight: {
      type: Number,
      require: true
    },
    refresherEnabled: {
      type: Boolean,
      require: true
    },
    myId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      isLoading: false,
      data: [],
      editQuestionItem: {}
    };
  },
  async created() {
    this.isLoading = true;
  },
  methods: {
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    onSearchBarClick(type = "index") {
      common_vendor.index.navigateTo({
        url: "/pages/label-activity/search-question/search-question"
      });
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
    async onQuestionFollow(id) {
      if (await services_questionServices.likeQuestion(id)) {
        let questions = this.data;
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].issue.id == id) {
            questions[i].isLike = 1;
            questions[i].issue.likeSum = questions[i].issue.likeSum + 1;
            break;
          }
        }
        this.data = questions;
        this.$refs.questionActionPopup.close();
        common_vendor.index.showToast({
          title: "\u5173\u6CE8\u6210\u529F",
          icon: "success"
        });
      } else {
        common_vendor.index.showToast({
          title: "\u5173\u6CE8\u5931\u8D25",
          icon: "error"
        });
      }
    },
    async onCancelQuestionFollow(id) {
      if (await services_questionServices.cancelLikeQuestion(id)) {
        let questions = this.data;
        for (let i = 0; i < questions.length; i++) {
          if (questions[i].issue.id == id) {
            questions[i].isLike = 0;
            questions[i].issue.likeSum = questions[i].issue.likeSum - 1;
            break;
          }
        }
        this.data = questions;
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
    onQuestionReportClick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/setting/report-user/report-user?objectId=${id}&objectType=${common_constants.reportObjectType.question}&modular=question`
      });
      this.$refs.questionActionPopup.close();
    },
    onQuestionDeleteClick(id) {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u95EE\u9898",
        content: "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u95EE\u9898\u5417",
        success: async function(res) {
          if (res.confirm) {
            if (await services_questionServices.deleteQuestion(id)) {
              let questions = _this.data;
              for (let i = 0; i < questions.length; i++) {
                if (questions[i].id == id) {
                  questions.splice(i, 1);
                  break;
                }
              }
              _this.data = questions;
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
    getQuestions(page, pageSize) {
      utils_request.request({
        data: {
          method: "GET",
          group: "question",
          action: "all",
          data: {
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      }).then((res) => {
        if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          let pageInfo = res.data.data;
          let questions = pageInfo.list;
          this.$refs.questionPaging.complete(questions);
          this.isLoading = false;
        } else {
          this.$refs.questionPaging.complete(false);
          this.isLoading = false;
        }
      }, () => {
        this.$refs.questionPaging.complete(false);
        this.isLoading = false;
      });
    },
    async playRefreshDynamicSound() {
      let refreshDynamicSound = common_vendor.index.getStorageSync(common_storageKeys.REFRESH_DYNAMIC_SOUND);
      if (!refreshDynamicSound) {
        refreshDynamicSound = common_constants.RingingToneList[6];
      }
      const innerAudioContext = common_vendor.index.createInnerAudioContext();
      innerAudioContext.autoplay = true;
      innerAudioContext.src = refreshDynamicSound.url;
    }
  }
};
if (!Array) {
  const _easycom_question_item_skeleton2 = common_vendor.resolveComponent("question-item-skeleton");
  const _easycom_question_item2 = common_vendor.resolveComponent("question-item");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_question_item_skeleton2 + _easycom_question_item2 + _easycom_z_paging2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_question_item_skeleton = () => "../../components/question-item-skeleton/question-item-skeleton.js";
const _easycom_question_item = () => "../../components/question-item/question-item.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _easycom_action_sheet_item = () => "../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_question_item_skeleton + _easycom_question_item + _easycom_z_paging + _easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.onSearchBarClick("question")),
    b: common_vendor.o(($event) => $options.navigateTo("/pages/my-acticity/my-questions/my-questions")),
    c: common_vendor.o(($event) => $options.navigateTo("/pages/my-acticity/my-answers/my-answers")),
    d: common_vendor.o(($event) => $options.navigateTo("/pages/my-acticity/my-collected-question/my-collected-question")),
    e: $data.isLoading
  }, $data.isLoading ? {
    f: common_vendor.f([...new Array(5)], (item, index, i0) => {
      return {
        a: "skeleton" + index,
        b: "b9d69698-1-" + i0 + ",b9d69698-0"
      };
    }),
    g: common_vendor.p({
      needLabel: false
    })
  } : {}, {
    h: common_vendor.w(({
      item,
      index
    }, s0, i0) => {
      return {
        a: "question" + item.id,
        b: common_vendor.o(($event) => $options.onQuestionItemClick(item.id)),
        c: common_vendor.o(($event) => $options.onQuestionItemMoreClick(item)),
        d: "b9d69698-2-" + i0 + ",b9d69698-0",
        e: common_vendor.p({
          questionData: item,
          answerData: item.hotAnswer
        }),
        f: i0,
        g: s0
      };
    }, {
      name: "cell",
      path: "h",
      vueId: "b9d69698-0"
    }),
    i: common_vendor.sr("questionPaging", "b9d69698-0"),
    j: common_vendor.o($options.getQuestions),
    k: common_vendor.p({
      ["default-page-size"]: 10,
      ["use-virtual-list"]: true,
      ["cell-height-mode"]: "dynamic"
    }),
    l: $data.editQuestionItem.id
  }, $data.editQuestionItem.id ? common_vendor.e({
    m: $data.editQuestionItem.publisher && $data.editQuestionItem.publisher.id == $props.myId
  }, $data.editQuestionItem.publisher && $data.editQuestionItem.publisher.id == $props.myId ? {
    n: common_vendor.o(($event) => $options.onQuestionDeleteClick($data.editQuestionItem.id)),
    o: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    p: common_vendor.o(($event) => $options.onQuestionReportClick($data.editQuestionItem.id)),
    q: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    }),
    r: $data.editQuestionItem.isLiked
  }, $data.editQuestionItem.isLiked ? {
    s: common_vendor.o(($event) => $options.onCancelQuestionFollow($data.editQuestionItem.id)),
    t: common_vendor.p({
      icon: "icon-quxiaoguanzhu",
      title: "\u53D6\u6D88\u5173\u6CE8"
    })
  } : {
    v: common_vendor.o(($event) => $options.onQuestionFollow($data.editQuestionItem.id)),
    w: common_vendor.p({
      icon: "icon-guanzhu",
      title: "\u5173\u6CE8\u95EE\u9898"
    })
  })) : {}, {
    x: common_vendor.sr("questionActionPopup", "b9d69698-3"),
    y: common_vendor.p({
      needHead: true,
      title: "\u95EE\u9898\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/index/questions.nvue"]]);
wx.createComponent(Component);
