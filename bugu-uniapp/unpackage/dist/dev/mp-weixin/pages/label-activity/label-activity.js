"use strict";
var common_vendor = require("../../common/vendor.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
var common_storageFunctions = require("../../common/storageFunctions.js");
var utils_request = require("../../utils/request.js");
var common_constants = require("../../common/constants.js");
require("../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      articleNumber: 0,
      showBottomLoading: false,
      isRefresh: false,
      haveMoreData: false,
      labelId: "",
      labelContent: "",
      articles: [],
      myId: 0,
      editArticleItem: {},
      page: 1
    };
  },
  async onLoad(params) {
    this.labelId = params.labelId;
    this.labelContent = params.labelContent;
    let userInfo = await common_storageFunctions.getMyUserInfo();
    if (userInfo) {
      this.myId = userInfo.id;
    }
    this.getLabelArticles(this.labelId, this.page);
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onJoinButtonClick() {
      common_vendor.index.navigateTo({
        url: `/pages/publish/publish?labelId=${this.labelId}&labelContent=${this.labelContent}`
      });
    },
    onIsRefresh() {
      this.isRefresh = true;
      this.page = 1;
      this.getLabelArticles(this.labelId, this.page);
    },
    onScrolltolower() {
      if (!this.haveMoreData) {
        return;
      }
      this.page = this.page + 1;
      this.getLabelArticles(this.labelId, this.page);
    },
    onActivityItemClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/activity-info?activityId=${item.id}`
      });
    },
    onMoreClick(item) {
      this.$refs.articleActionPopup.open();
      this.editArticleItem = item;
    },
    onPopupReportClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${common_constants.reportObjectType.activity}`
      });
      this.$refs.articleActionPopup.close();
    },
    onPopupDeleteClick(item) {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u52A8\u6001",
        content: "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u52A8\u6001\u5417",
        success: async function(res) {
          if (res.confirm) {
            if (await common_requestFunctions.deleteMyArticle(item.id)) {
              let articles = _this.articles;
              for (let i = 0; i < articles.length; i++) {
                if (articles[i].id == item.id) {
                  articles.splice(i, 1);
                  break;
                }
              }
              _this.articles = articles;
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
                let articles = _this.articles;
                for (let i = 0; i < articles.length; i++) {
                  if (articles[i].publisher && articles[i].publisher.id == item.publisher.id) {
                    articles[i].publisher.isAttention = 0;
                  }
                }
                _this.articles = articles;
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
        let articles = _this.articles;
        for (let i = 0; i < articles.length; i++) {
          if (articles[i].publisher && articles[i].publisher.id == item.publisher.id) {
            articles[i].publisher.isAttention = 1;
          }
        }
        _this.articles = articles;
        _this.$refs.articleActionPopup.close();
        common_vendor.index.showToast({
          title: "\u5173\u6CE8\u6210\u529F",
          icon: "success"
        });
      }
    },
    async getLabelArticles(labelId, page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: "groupByLabel",
          data: {
            page,
            labelId
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
        let pageSum = res.data.data.pageSum;
        this.articleNumber = res.data.data.total;
        let articles = res.data.data.list;
        if (page < pageSum) {
          this.haveMoreData = true;
        } else {
          this.haveMoreData = false;
        }
        if (page === 1) {
          common_vendor.index.showToast({
            title: "\u5237\u65B0\u6210\u529F",
            icon: "none"
          });
          this.articles = articles;
          this.scrollInto = "";
        } else {
          let allArtilces = this.articles.concat(articles);
          this.articles = allArtilces;
        }
        if (articles.length < 1) {
          if (page < pageSum) {
            this.page = page + 1;
            this.getLabelArticles(labelId, this.page);
          }
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_activity_item2 = common_vendor.resolveComponent("activity-item");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_activity_item2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_activity_item = () => "../../components/activity-item/activity-item.js";
const _easycom_action_sheet_item = () => "../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_activity_item + _easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.labelContent),
    b: common_vendor.o(($event) => $options.onNarLeftClick()),
    c: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    d: common_vendor.t($data.labelContent),
    e: common_vendor.o(($event) => $options.onJoinButtonClick()),
    f: common_vendor.t($data.articleNumber),
    g: common_vendor.f($data.articles, (item, index, i0) => {
      return {
        a: item.id,
        b: common_vendor.o(($event) => $options.onActivityItemClick(item), item.id),
        c: common_vendor.o(($event) => $options.onFollow(item), item.id),
        d: common_vendor.o(($event) => $options.onMoreClick(item), item.id),
        e: "6a372949-1-" + i0,
        f: common_vendor.p({
          articleItem: item,
          isMe: item.publisher && $data.myId == item.publisher.id
        })
      };
    }),
    h: $data.articles.length < 0
  }, $data.articles.length < 0 ? {} : common_vendor.e({
    i: $data.showBottomLoading
  }, $data.showBottomLoading ? {
    j: `30px`,
    k: `#adadad`
  } : {
    l: common_vendor.t($data.haveMoreData ? "\u4E0A\u62C9\u6216\u70B9\u51FB\u52A0\u8F7D\u66F4\u591A" : "\u6CA1\u6709\u66F4\u591A\u5185\u5BB9\u4E86")
  }), {
    m: $data.isRefresh,
    n: _ctx.scrollInto,
    o: common_vendor.o(($event) => $options.onIsRefresh()),
    p: common_vendor.o((...args) => $options.onScrolltolower && $options.onScrolltolower(...args)),
    q: $data.editArticleItem.id
  }, $data.editArticleItem.id ? common_vendor.e({
    r: $data.editArticleItem.isAnonymity
  }, $data.editArticleItem.isAnonymity ? {
    s: common_vendor.o(($event) => $options.onPopupReportClick($data.editArticleItem)),
    t: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  } : common_vendor.e({
    v: $data.editArticleItem.publisher.id == $data.myId
  }, $data.editArticleItem.publisher.id == $data.myId ? {
    w: common_vendor.o($options.onPopupDeleteClick),
    x: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    y: $data.editArticleItem.publisher.isAttention == 1
  }, $data.editArticleItem.publisher.isAttention == 1 ? {
    z: common_vendor.o(($event) => $options.onCancelFollow($data.editArticleItem)),
    A: common_vendor.p({
      icon: "icon-quxiaoguanzhu",
      title: "\u53D6\u6D88\u5173\u6CE8"
    })
  } : {
    B: common_vendor.o(($event) => $options.onFollow($data.editArticleItem)),
    C: common_vendor.p({
      icon: "icon-guanzhu",
      title: "\u5173\u6CE8"
    })
  }, {
    D: common_vendor.p({
      icon: "icon-message",
      title: "\u79C1\u804A"
    }),
    E: common_vendor.o(($event) => $options.onPopupReportClick($data.editArticleItem)),
    F: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  }))) : {}, {
    G: common_vendor.sr("articleActionPopup", "6a372949-2"),
    H: common_vendor.p({
      needHead: true,
      title: "\u52A8\u6001\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/label-activity/label-activity.vue"]]);
wx.createPage(MiniProgramPage);
