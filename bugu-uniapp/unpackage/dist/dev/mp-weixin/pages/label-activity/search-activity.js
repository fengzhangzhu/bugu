"use strict";
var common_vendor = require("../../common/vendor.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
var common_storageKeys = require("../../common/storageKeys.js");
var common_storageFunctions = require("../../common/storageFunctions.js");
var utils_request = require("../../utils/request.js");
var common_constants = require("../../common/constants.js");
const _sfc_main = {
  data() {
    return {
      searchText: "",
      searchTextBefore: "",
      haveMoreData: false,
      articles: [],
      showBottomLoading: false,
      page: 1,
      editArticleItem: {},
      scrollInto: "",
      hotLabels: [],
      showHotLabels: true,
      searchHistory: [],
      myId: -1
    };
  },
  async onLoad() {
    this.hotLabels = await common_requestFunctions.getHotLabels();
    let userInfo = await common_storageFunctions.getMyUserInfo();
    if (userInfo) {
      this.myId = userInfo.id;
    }
    let searchHistory = common_vendor.index.getStorageSync(common_storageKeys.SEARCH_ACTIVITY_HISTORY);
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
      this.searchActivities(this.searchText, this.page);
    },
    onScrolltolower() {
      if (!this.haveMoreData) {
        return;
      }
      this.page = this.page + 1;
      if (this.searchText !== this.searchTextBefore) {
        this.searchActivities(this.searchTextBefore, this.page);
      } else {
        this.searchActivities(this.searchText, this.page);
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
      this.searchActivities(this.searchText, this.page);
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
    async searchActivities(subText, page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "activity",
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
        let pageSum = res.data.data.pageSum;
        let articles = res.data.data.list;
        if (page < pageSum) {
          this.haveMoreData = true;
        } else {
          this.haveMoreData = false;
        }
        if (page === 1) {
          this.articles = articles;
          this.scrollInto = "";
        } else {
          let allArtilces = this.articles.concat(articles);
          this.articles = allArtilces;
        }
        if (articles.length < 1) {
          if (page < pageSum) {
            this.page = page + 1;
            this.searchActivities(subText, this.page);
          }
        }
      }
      common_vendor.index.hideLoading();
      this.showHotLabels = false;
      if (page == 1) {
        let searchHistory = [];
        let searchHistoryStorage = common_vendor.index.getStorageSync(common_storageKeys.SEARCH_ACTIVITY_HISTORY);
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
          key: common_storageKeys.SEARCH_ACTIVITY_HISTORY,
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
  const _easycom_activity_item2 = common_vendor.resolveComponent("activity-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_uni_search_bar2 + _easycom_activity_item2 + _easycom_uni_load_more2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_activity_item = () => "../../components/activity-item/activity-item.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_action_sheet_item = () => "../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_search_bar + _easycom_activity_item + _easycom_uni_load_more + _easycom_action_sheet_item + _easycom_action_sheet)();
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
      placeholder: "\u641C\u7D22\u6807\u7B7E",
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
    k: common_vendor.f($data.articles, (item, index, i0) => {
      return {
        a: item.id,
        b: common_vendor.o(($event) => $options.onActivityItemClick(item), item.id),
        c: common_vendor.o(($event) => $options.onFollow(item), item.id),
        d: common_vendor.o(($event) => $options.onMoreClick(item), item.id),
        e: "2643c263-2-" + i0,
        f: common_vendor.p({
          articleItem: item,
          isMe: item.publisher && $data.myId == item.publisher.id
        })
      };
    }),
    l: $data.articles.length < 0
  }, $data.articles.length < 0 ? {} : {
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
    p: $data.editArticleItem.id
  }, $data.editArticleItem.id ? common_vendor.e({
    q: $data.editArticleItem.isAnonymity
  }, $data.editArticleItem.isAnonymity ? {
    r: common_vendor.o(($event) => $options.onPopupReportClick($data.editArticleItem)),
    s: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  } : common_vendor.e({
    t: $data.editArticleItem.publisher.id == $data.myId
  }, $data.editArticleItem.publisher.id == $data.myId ? {
    v: common_vendor.o($options.onPopupDeleteClick),
    w: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    x: $data.editArticleItem.publisher.isAttention == 1
  }, $data.editArticleItem.publisher.isAttention == 1 ? {
    y: common_vendor.o(($event) => $options.onCancelFollow($data.editArticleItem)),
    z: common_vendor.p({
      icon: "icon-quxiaoguanzhu",
      title: "\u53D6\u6D88\u5173\u6CE8"
    })
  } : {
    A: common_vendor.o(($event) => $options.onFollow($data.editArticleItem)),
    B: common_vendor.p({
      icon: "icon-guanzhu",
      title: "\u5173\u6CE8"
    })
  }, {
    C: common_vendor.p({
      icon: "icon-message",
      title: "\u79C1\u804A"
    }),
    D: common_vendor.o(($event) => $options.onPopupReportClick($data.editArticleItem)),
    E: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  }))) : {}, {
    F: common_vendor.sr("articleActionPopup", "2643c263-4"),
    G: common_vendor.p({
      needHead: true,
      title: "\u52A8\u6001\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/label-activity/search-activity.vue"]]);
wx.createPage(MiniProgramPage);
