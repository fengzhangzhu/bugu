"use strict";
var common_vendor = require("../../common/vendor.js");
var common_storageFunctions = require("../../common/storageFunctions.js");
var store_index = require("../../store/index.js");
var utils_socket = require("../../utils/socket.js");
var utils_tabBarBadgeUtils = require("../../utils/tabBarBadgeUtils.js");
require("../../common/storageKeys.js");
require("../../store/modules/messageStore.js");
require("../../store/modules/socketStateStore.js");
require("../../common/constants.js");
require("../../utils/messageUtils/storage.js");
require("../../utils/messageUtils/storageKeys.js");
require("../../utils/dateUtils.js");
require("../../common/requestFunctions.js");
require("../../utils/request.js");
require("../../common/globalMsgKeys.js");
require("../../utils/messageUtils/index.js");
require("../../utils/messageUtils/service.js");
const questions = () => "./questions.js";
const hotArticles = () => "./hot-articles.js";
const squareActivity = () => "./square-activity.js";
const _sfc_main = {
  components: {
    questions,
    hotArticles,
    squareActivity
  },
  data() {
    return {
      tabLabels: [{ title: "\u63A8\u8350", badge: 0 }, { title: "\u95EE\u7B54", badge: 0 }, { title: "\u70ED\u699C", badge: 0 }],
      tabSelect: 0,
      touchY: 0,
      myId: 0,
      state: store_index.store.state,
      refresherEnabled: true,
      contentHeight: 0,
      navHeight: 0,
      isRefresh: false
    };
  },
  async onLoad(params) {
    let inviteCode = params.inviteCode;
    if (inviteCode) {
      common_vendor.index.setStorage({ key: "BeInvitedCode", data: inviteCode });
    }
    let userInfo = await common_storageFunctions.getMyUserInfo();
    if (!userInfo) {
      this.isLoading = false;
      common_vendor.index.showModal({
        title: "\u672A\u767B\u5F55",
        content: "\u672A\u767B\u5F55\uFF0C\u8BF7\u5148\u767B\u5F55",
        success: function(res) {
          if (res.confirm) {
            common_vendor.index.setStorage({
              key: "token",
              data: null
            });
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
          }
        }
      });
      return;
    }
    this.myId = userInfo.id;
    this.isLoading = false;
    utils_tabBarBadgeUtils.initUnreadMessageSum(userInfo.id);
  },
  onReady() {
    let _this = this;
    common_vendor.index.getSystemInfo({
      success(res) {
        _this.contentHeight = res.windowHeight;
      }
    });
    let titleH = common_vendor.index.createSelectorQuery().select("#index-swiper");
    titleH.boundingClientRect((data) => {
      _this.navHeight = data.top;
    }).exec();
  },
  async onShow() {
    let userInfo = await common_storageFunctions.getMyUserInfo();
    if (!userInfo) {
      common_vendor.index.closeSocket();
    } else {
      if (!this.state.socketStateStore.isConnectSocket) {
        utils_socket.connectSocket();
      }
    }
  },
  computed: {
    newMessage() {
      return this.state.messageStore.newMessage;
    },
    statusBarHeight() {
      return common_vendor.index.getSystemInfoSync().statusBarHeight + "px";
    },
    scollerHeight() {
      return this.contentHeight - this.navHeight;
    }
  },
  watch: {
    newMessage: function(message) {
      this.$refs.messagePopup.open();
    }
  },
  onShareAppMessage() {
    let imageUrl = "";
    if (this.editArticleItem.pic.length > 0) {
      if (this.editArticleItem.video == 1) {
        imageUrl = this.editArticleItem.pic[0] + "?vframe/jpg/offset/0";
      } else {
        imageUrl = this.editArticleItem.pic[0];
      }
    }
    let username = "";
    if (this.editArticleItem.isAnonymity == 1) {
      username = "\u533F\u540D\u7528\u6237";
    } else {
      if (this.editArticleItem.publisher) {
        username = this.editArticleItem.publisher.username;
      }
    }
    return {
      title: `${username}\u53D1\u5E03\u4E86\u4E00\u6761\u52A8\u6001\uFF0C\u5FEB\u6765\u770B\u770Bta\u8BF4\u4E86\u4EC0\u4E48`,
      path: `/pages/activity-info/activity-info?activityId=${this.editArticleItem.id}`,
      imageUrl
    };
  },
  methods: {
    onRefreshing(isRefreshing) {
      this.isRefresh = isRefreshing;
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    onSwiperTransition() {
      if (!this.isRefreshing) {
        this.refresherEnabled = false;
      }
    },
    onSwiperAnimationfinish() {
      this.refresherEnabled = true;
    },
    onPublishButtonClick() {
      common_vendor.index.navigateTo({
        url: "/pages/publish/publish"
      });
    },
    onAskQuestionButtonClick() {
      common_vendor.index.navigateTo({
        url: "/pages/publish/ask-questions/ask-questions"
      });
    },
    onSellGoodsButtonClick() {
      common_vendor.index.navigateTo({
        url: "/pages/publish/sell-goods/sell-goods"
      });
    },
    onSwiperChange(e) {
      this.tabSelect = e.detail.current;
    },
    onTabsClick(index) {
      this.tabSelect = index;
    }
  }
};
if (!Array) {
  const _easycom_page_tabs2 = common_vendor.resolveComponent("page-tabs");
  const _component_square_activity = common_vendor.resolveComponent("square-activity");
  const _component_questions = common_vendor.resolveComponent("questions");
  const _component_hot_articles = common_vendor.resolveComponent("hot-articles");
  (_easycom_page_tabs2 + _component_square_activity + _component_questions + _component_hot_articles)();
}
const _easycom_page_tabs = () => "../../components/page-tabs/page-tabs.js";
if (!Math) {
  _easycom_page_tabs();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onTabsClick),
    b: common_vendor.p({
      labels: $data.tabLabels,
      index: $data.tabSelect,
      tabPadding: 26,
      activeFontSize: 18,
      defaultFontSize: 16,
      defaultColor: "#676767",
      underLineType: "bubble"
    }),
    c: $options.statusBarHeight,
    d: common_vendor.o((...args) => $options.onPublishButtonClick && $options.onPublishButtonClick(...args)),
    e: common_vendor.o($options.onRefreshing),
    f: common_vendor.p({
      scollerHeight: $options.scollerHeight,
      refresherEnabled: $data.refresherEnabled,
      myId: $data.myId
    }),
    g: common_vendor.o((...args) => $options.onAskQuestionButtonClick && $options.onAskQuestionButtonClick(...args)),
    h: common_vendor.o($options.onRefreshing),
    i: common_vendor.p({
      scollerHeight: $options.scollerHeight,
      refresherEnabled: $data.refresherEnabled,
      myId: $data.myId
    }),
    j: common_vendor.o($options.onRefreshing),
    k: common_vendor.p({
      scollerHeight: $options.scollerHeight,
      refresherEnabled: $data.refresherEnabled,
      myId: $data.myId
    }),
    l: $data.tabSelect,
    m: $options.scollerHeight + "px",
    n: common_vendor.o((...args) => $options.onSwiperChange && $options.onSwiperChange(...args)),
    o: common_vendor.o((...args) => $options.onSwiperTransition && $options.onSwiperTransition(...args)),
    p: common_vendor.o((...args) => $options.onSwiperAnimationfinish && $options.onSwiperAnimationfinish(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
