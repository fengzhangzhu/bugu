"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
var utils_request = require("../../utils/request.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
var common_storageFunctions = require("../../common/storageFunctions.js");
require("../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      title: "\u7528\u6237\u4E3B\u9875",
      isRefresh: false,
      userInfo: {},
      myArticles: [],
      articlesPage: 1,
      haveMoreData: true,
      isAttention: 0,
      isMe: false,
      editArticleItem: {}
    };
  },
  async onLoad(params) {
    let userId = params.userId;
    let userInfo = await common_requestFunctions.getUserinfo(userId);
    let myUserInfo = await common_storageFunctions.getMyUserInfo();
    if (userInfo) {
      this.userInfo = userInfo;
      this.isAttention = userInfo.isAttention;
      if (userInfo.id == myUserInfo.id) {
        this.isMe = true;
      }
      this.getUserArticles(userInfo.id, this.articlesPage);
    }
  },
  onShareAppMessage() {
    return {
      title: `${this.userInfo.username}\u7684\u4E3B\u9875`,
      path: `/pages/user-home-page/user-home-page?userId=${this.userInfo.id}`,
      imageUrl: ""
    };
  },
  onShareTimeline() {
    return {
      title: `${this.userInfo.username}\u7684\u4E3B\u9875`,
      path: `/pages/user-home-page/user-home-page?userId=${this.userInfo.id}`,
      imageUrl: this.userInfo.avatar
    };
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onScrolltolower() {
      if (this.haveMoreData) {
        this.articlesPage = this.articlesPage + 1;
        this.getUserArticles(this.userInfo.id, this.articlesPage);
      }
    },
    onActivityItemClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/activity-info?activityId=${item.id}`
      });
    },
    onMoreClick(item) {
      if (this.isMe) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5230\u6211\u7684\u9875\u9762\u8FDB\u884C\u64CD\u4F5C",
          icon: "none"
        });
      } else {
        this.$refs.articleActionPopup.open();
        this.editArticleItem = item;
      }
    },
    onPopupReportClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${common_constants.reportObjectType.activity}`
      });
      this.$refs.articleActionPopup.close();
    },
    onChatButtonClick() {
      common_vendor.index.navigateTo({
        url: `/pages/message-secondary-page/chat-content/chat-content?fromUserId=${this.userInfo.id}`
      });
    },
    async onFollowButtonClick() {
      if (await common_requestFunctions.followUser(this.userInfo.id)) {
        this.isAttention = 1;
      }
    },
    async getUserArticles(userId, page) {
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D"
      });
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "user",
          action: `${userId}/activity`,
          data: {
            userId,
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      common_vendor.index.hideLoading();
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let pageSum = res.data.data.pageSum;
        let articles = res.data.data.list;
        if (page < pageSum) {
          this.haveMoreData = true;
        } else {
          this.haveMoreData = false;
        }
        if (page === 1) {
          this.myArticles = articles;
        } else {
          let allArtilces = this.myArticles.concat(articles);
          this.myArticles = allArtilces;
        }
        if (articles.length < 1) {
          if (page < pageSum) {
            this.articlesPage = page + 1;
            this.getUserArticles(userId, this.articlesPage);
          }
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _component_View = common_vendor.resolveComponent("View");
  const _easycom_user_activity_item2 = common_vendor.resolveComponent("user-activity-item");
  const _easycom_custom_tab_pane2 = common_vendor.resolveComponent("custom-tab-pane");
  const _easycom_custom_tabs2 = common_vendor.resolveComponent("custom-tabs");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _component_View + _easycom_user_activity_item2 + _easycom_custom_tab_pane2 + _easycom_custom_tabs2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_user_activity_item = () => "../../components/user-activity-item/user-activity-item.js";
const _easycom_custom_tab_pane = () => "../../components/custom-tab-pane/custom-tab-pane.js";
const _easycom_custom_tabs = () => "../../components/custom-tabs/custom-tabs.js";
const _easycom_action_sheet_item = () => "../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_user_activity_item + _easycom_custom_tab_pane + _easycom_custom_tabs + _easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.title),
    b: common_vendor.o(($event) => $options.onNarLeftClick()),
    c: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      border: false,
      backgroundColor: "#ffffff00",
      color: "#808080",
      statusBar: "true"
    }),
    d: common_vendor.p({
      className: "upper-head"
    }),
    e: $data.userInfo.id
  }, $data.userInfo.id ? common_vendor.e({
    f: $data.userInfo.avatar
  }, $data.userInfo.avatar ? {
    g: $data.userInfo.avatar
  } : {}, {
    h: $data.userInfo.vip && $data.userInfo.vip.remainDays > 0 ? "../../static/svgs/vip-logo.svg" : "../../static/svgs/no-vip-logo.svg",
    i: common_vendor.o(($event) => _ctx.onNavigateTo("/pages/setting/personal_information/personal_information")),
    j: common_vendor.t($data.userInfo.attentionSum),
    k: common_vendor.o((...args) => _ctx.onFollowedNumberClick && _ctx.onFollowedNumberClick(...args)),
    l: common_vendor.t($data.userInfo.beAttentionSum),
    m: common_vendor.o((...args) => _ctx.onFansNumberClick && _ctx.onFansNumberClick(...args)),
    n: common_vendor.t($data.userInfo.visitorSum),
    o: common_vendor.o((...args) => _ctx.onVisitorNumberClick && _ctx.onVisitorNumberClick(...args)),
    p: $data.isAttention == 0
  }, $data.isAttention == 0 ? {
    q: common_vendor.o(($event) => $options.onFollowButtonClick())
  } : {}, {
    r: common_vendor.o(($event) => $options.onChatButtonClick()),
    s: common_vendor.o(() => {
    })
  }) : {}, {
    t: common_vendor.o((...args) => _ctx.onBackgroundClick && _ctx.onBackgroundClick(...args)),
    v: $data.userInfo.background ? `url(${$data.userInfo.background})` : "linear-gradient(to bottom, #e7d3aa, #61c5ae);",
    w: common_vendor.f($data.myArticles, (item, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.onActivityItemClick(item)),
        b: common_vendor.o(($event) => $options.onMoreClick(item)),
        c: "2b77362e-4-" + i0 + ",2b77362e-3",
        d: common_vendor.p({
          articleItem: item,
          isMe: true,
          avatar: $data.userInfo.avatar,
          username: $data.userInfo.username
        }),
        e: item.id
      };
    }),
    x: common_vendor.p({
      label: "\u52A8\u6001"
    }),
    y: common_vendor.p({
      index: "0",
      animation: true,
      tabPadding: "80",
      flex: true
    }),
    z: common_vendor.o((...args) => $options.onScrolltolower && $options.onScrolltolower(...args)),
    A: $data.editArticleItem.id
  }, $data.editArticleItem.id ? {
    B: common_vendor.o(($event) => $options.onPopupReportClick($data.editArticleItem)),
    C: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  } : {}, {
    D: common_vendor.sr("articleActionPopup", "2b77362e-5"),
    E: common_vendor.p({
      needHead: true,
      title: "\u52A8\u6001\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/user-home-page/user-home-page.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
