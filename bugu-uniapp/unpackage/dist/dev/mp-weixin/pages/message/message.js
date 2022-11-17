"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_messageUtils_index = require("../../utils/messageUtils/index.js");
var utils_messageUtils_storage = require("../../utils/messageUtils/storage.js");
var common_storageFunctions = require("../../common/storageFunctions.js");
var common_constants = require("../../common/constants.js");
var store_index = require("../../store/index.js");
var utils_socket = require("../../utils/socket.js");
var common_storageKeys = require("../../common/storageKeys.js");
var utils_request = require("../../utils/request.js");
var utils_tabBarBadgeUtils = require("../../utils/tabBarBadgeUtils.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
require("../../utils/messageUtils/service.js");
require("../../utils/messageUtils/storageKeys.js");
require("../../utils/dateUtils.js");
require("../../store/modules/messageStore.js");
require("../../store/modules/socketStateStore.js");
require("../../common/globalMsgKeys.js");
const _sfc_main = {
  data() {
    return {
      tabLabels: [{ title: "\u6D88\u606F", badge: 0 }, { title: "\u52A8\u6001", badge: 0 }],
      tabSelect: 0,
      InteractiveGroup: common_constants.InteractiveGroup,
      InteractiveType: common_constants.InteractiveType,
      OfficeMessageType: common_constants.OfficeMessageType,
      scrollInto: "",
      userMessageList: [],
      officialNewsList: [],
      attentionUnreadSum: 0,
      likedUnreadSum: 0,
      commentUnreadSum: 0,
      publishUnreadSum: 0,
      questionMessageUnreadSum: 0,
      state: store_index.store.state,
      userInfo: {},
      editArticleItem: {},
      refresherEnabled: false,
      editUserMessageItem: {},
      editOfficialNewsItem: {},
      attentionArticles: {
        data: [],
        isRefresh: false,
        haveMoreData: true,
        page: 1
      },
      contentHeight: 0,
      navHeight: 0
    };
  },
  async onLoad() {
    this.userInfo = await common_storageFunctions.getMyUserInfo();
    if (!this.userInfo) {
      return;
    }
    this.refreshMessages(this.userInfo);
    this.officialNewsList = await utils_messageUtils_storage.getOfficalList(this.userInfo.id);
  },
  onReady() {
    let _this = this;
    common_vendor.index.getSystemInfo({
      success(res) {
        _this.contentHeight = res.windowHeight;
      }
    });
    let titleH = common_vendor.index.createSelectorQuery().select("#message-swiper");
    titleH.boundingClientRect((data) => {
      _this.navHeight = data.top;
    }).exec();
  },
  async onShow() {
    utils_tabBarBadgeUtils.changeUnreadMessageSum();
    this.userInfo = await common_storageFunctions.getMyUserInfo();
    if (!this.userInfo) {
      this.tabLabels = [{ title: "\u52A8\u6001", badge: 0 }, { title: "\u6D88\u606F", badge: 0 }];
      this.userMessageList = [];
      this.interactiveMessageList = { unreadSum: 0, data: [] };
      this.likedUnreadSum = 0;
      this.commentUnreadSum = 0;
      this.publishUnreadSum = 0;
      return;
    }
    this.refreshMessages(this.userInfo);
    if (!this.state.socketStateStore.isConnectSocket) {
      utils_socket.connectSocket();
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
    newMessage: async function(message) {
      if (message.type === common_constants.USER_MESSAGE || message.type === common_constants.WITHDRAW) {
        let userMessageList = await utils_messageUtils_storage.getUserMessageList(this.userInfo.id);
        this.userMessageList = userMessageList.reverse();
      } else if (message.type === common_constants.INTERACTIVE) {
        let interactiveMessageList = await utils_messageUtils_storage.getInteractiveMessageList(this.userInfo.id, message.data.type);
        if (utils_messageUtils_storage.likeGroup.indexOf(message.data.type) != -1) {
          this.likedUnreadSum = interactiveMessageList.unreadSum;
        } else if (utils_messageUtils_storage.commentGroup.indexOf(message.data.type) != -1) {
          this.commentUnreadSum = interactiveMessageList.unreadSum;
        } else if (message.data.type === common_constants.InteractiveType.PUBLISH) {
          this.tabLabels[0].badge = interactiveMessageList.unreadSum;
        } else if (message.data.type === common_constants.InteractiveType.ATTENTION) {
          this.attentionUnreadSum = interactiveMessageList.unreadSum;
        }
      }
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
    async refreshMessages(userInfo) {
      let userMessageList = await utils_messageUtils_storage.getUserMessageList(this.userInfo.id);
      this.userMessageList = userMessageList.reverse();
      this.attentionUnreadSum = (await utils_messageUtils_storage.getInteractiveMessageList(this.userInfo.id, common_constants.InteractiveType.ATTENTION)).unreadSum;
      this.likedUnreadSum = (await utils_messageUtils_storage.getInteractiveMessageList(this.userInfo.id, common_constants.InteractiveType.LIKE)).unreadSum;
      this.commentUnreadSum = (await utils_messageUtils_storage.getInteractiveMessageList(this.userInfo.id, common_constants.InteractiveType.COMMENT)).unreadSum;
      this.tabLabels[0].badge = (await utils_messageUtils_storage.getInteractiveMessageList(this.userInfo.id, common_constants.InteractiveType.PUBLISH)).unreadSum;
      let officialNewsList = await utils_messageUtils_index.getAndHandOfficialNewsList(this.userInfo.id);
      this.officialNewsList = officialNewsList.reverse();
    },
    onTabsClick(tabNumber) {
      this.tabSelect = tabNumber;
    },
    async onSwiperChange(e) {
      this.tabSelect = e.detail.current;
      if (this.tabSelect == 1) {
        if (this.tabLabels[1].badge > 0) {
          utils_tabBarBadgeUtils.changeUnreadMessageSum(-this.tabLabels[1].badge);
          this.tabLabels[1].badge = 0;
          if (this.userInfo.id) {
            utils_messageUtils_storage.interactiveMessageALLRead(this.userInfo.id, common_constants.InteractiveType.PUBLISH);
          }
        }
      }
    },
    onSwiperTransition() {
      if (!this.attentionArticles.isRefresh) {
        this.refresherEnabled = false;
      }
    },
    onSwiperAnimationfinish() {
      this.refresherEnabled = true;
      if (this.tabSelect == 1) {
        if (this.attentionArticles.data.length < 1 && this.attentionArticles.haveMoreData) {
          this.attentionArticles.isRefresh = true;
        }
      }
    },
    onAttentionIsRefresh() {
      this.attentionArticles.isRefresh = true;
      this.attentionArticles.page = 1;
      this.getAttentionarticles(this.attentionArticles.page);
    },
    onAttentionScrolltolower() {
      if (!this.attentionArticles.haveMoreData) {
        return;
      }
      this.showBottomLoading = true;
      this.attentionArticles.page = this.attentionArticles.page + 1;
      this.getAttentionarticles(this.attentionArticles.page);
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
    onShareClick(item) {
      this.editArticleItem = item;
    },
    onPopupReportClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${common_constants.reportObjectType.activity}`
      });
      this.$refs.articleActionPopup.close();
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
                let attentionArticles = _this.attentionArticles.data;
                for (let i = 0; i < attentionArticles.length; i++) {
                  if (attentionArticles[i].publisher && attentionArticles[i].publisher.id == item.publisher.id) {
                    attentionArticles[i].publisher.isAttention = 0;
                  }
                }
                _this.attentionArticles.data = attentionArticles;
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
        let attentionArticles = _this.attentionArticles.data;
        for (let i = 0; i < attentionArticles.length; i++) {
          if (attentionArticles[i].publisher && attentionArticles[i].publisher.id == item.publisher.id) {
            attentionArticles[i].publisher.isAttention = 1;
          }
        }
        _this.attentionArticles.data = attentionArticles;
        _this.$refs.articleActionPopup.close();
        common_vendor.index.showToast({
          title: "\u5173\u6CE8\u6210\u529F",
          icon: "success"
        });
      }
    },
    async onChatClick(item) {
      if (item.publisher)
        common_vendor.index.navigateTo({
          url: `/pages/message-secondary-page/chat-content/chat-content?fromUserId=${item.publisher.id}`
        });
    },
    onSearchBarClick() {
      common_vendor.index.navigateTo({
        url: "/pages/message-secondary-page/search-user/search-user"
      });
    },
    onInteractiveMessageClick(type) {
      common_vendor.index.navigateTo({
        url: "/pages/message-secondary-page/interactive-message/interactive-message?type=" + type
      });
    },
    onQuestionMessageClick() {
      common_vendor.index.navigateTo({
        url: "/pages/message-secondary-page/question-message/question-message"
      });
    },
    onUserMessageItemClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/message-secondary-page/chat-content/chat-content?fromUserId=${item.userId}`
      });
    },
    onUserMessageMoreClick(item) {
      this.editUserMessageItem = item;
      this.$refs.userMessageActionPopup.open();
    },
    onUserMessageDeleteClick(item) {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u5BF9\u8BDD",
        content: `\u4F60\u786E\u5B9A\u8981\u5220\u9664\u4E0E${item.username}\u7684\u5BF9\u8BDD\u5417\uFF1F`,
        success: async function(res) {
          if (res.confirm) {
            if (item) {
              utils_tabBarBadgeUtils.changeUnreadMessageSum(-item.unReadSum);
              let messageList = await utils_messageUtils_storage.deleteUserMessageItem(_this.userInfo.id, item.userId);
              _this.userMessageList = messageList;
            }
            _this.$refs.userMessageActionPopup.close();
          }
        }
      });
    },
    onUserMessageReportClick(item) {
      this.$refs.userMessageActionPopup.close();
      common_vendor.index.navigateTo({
        url: `/pages/setting/report-user/report-user?objectId=${item.userId}&objectType=chat`
      });
    },
    onOfficialNewsItemMoreClick(item) {
      this.editOfficialNewsItem = item;
      this.$refs.officialNewsActionPopup.open();
    },
    onOfficialNewsDeleteClick(item) {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u5BF9\u8BDD",
        content: `\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u6D88\u606F\u8BB0\u5F55\u5417\uFF1F`,
        success: async function(res) {
          if (res.confirm) {
            if (item) {
              utils_tabBarBadgeUtils.changeUnreadMessageSum(-item.unreadSum);
              let officialNewsList = await utils_messageUtils_storage.deleteOfficalNewsItem(_this.userInfo.id, item.type);
              _this.officialNewsList = officialNewsList;
            }
            _this.$refs.officialNewsActionPopup.close();
          }
        }
      });
    },
    onOfficialNewsItemClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/message-secondary-page/official-news-info/official-news-info?type=${item.type}`
      });
    },
    async getAttentionarticles(page, notPlaySound = false) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: "attention",
          data: {
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      setTimeout(() => {
        this.attentionArticles.isRefresh = false;
      }, 700);
      this.showBottomLoading = false;
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let pageSum = res.data.data.pageSum;
        let articles = res.data.data.list;
        if (page === 1) {
          common_vendor.index.showToast({
            title: "\u5237\u65B0\u6210\u529F",
            icon: "none"
          });
          if (!notPlaySound) {
            this.playRefreshDynamicSound();
          }
          this.attentionArticles.data = articles;
          this.scrollInto = "";
          if (pageSum <= 1) {
            this.attentionArticles.haveMoreData = false;
          } else {
            this.attentionArticles.haveMoreData = true;
          }
        } else {
          if (page > pageSum) {
            this.attentionArticles.haveMoreData = false;
            this.attentionArticles.page = page - 1;
          } else {
            let allarticles = this.attentionArticles.data.concat(articles);
            this.attentionArticles.data = allarticles;
            if (page == pageSum) {
              this.attentionArticles.haveMoreData = false;
            } else {
              this.attentionArticles.haveMoreData = true;
            }
          }
        }
        if (articles.length < 1) {
          if (page < pageSum) {
            this.attentionArticles.page = page + 1;
            this.getAttentionarticles(this.attentionArticles.page, true);
          }
        }
      }
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
  const _easycom_page_tabs2 = common_vendor.resolveComponent("page-tabs");
  const _easycom_interactive_message2 = common_vendor.resolveComponent("interactive-message");
  const _easycom_user_message_item2 = common_vendor.resolveComponent("user-message-item");
  const _easycom_activity_item2 = common_vendor.resolveComponent("activity-item");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_page_tabs2 + _easycom_interactive_message2 + _easycom_user_message_item2 + _easycom_activity_item2 + _easycom_uni_load_more2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_page_tabs = () => "../../components/page-tabs/page-tabs.js";
const _easycom_interactive_message = () => "../../components/interactive-message/interactive-message.js";
const _easycom_user_message_item = () => "../../components/user-message-item/user-message-item.js";
const _easycom_activity_item = () => "../../components/activity-item/activity-item.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_action_sheet_item = () => "../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_page_tabs + _easycom_interactive_message + _easycom_user_message_item + _easycom_activity_item + _easycom_uni_load_more + _easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.onTabsClick),
    b: common_vendor.p({
      labels: $data.tabLabels,
      index: $data.tabSelect,
      tabPadding: 26,
      activeFontSize: 18,
      defaultFontSize: 16,
      flex: true,
      defaultColor: "#7a7a7a",
      underLineType: "bubble"
    }),
    c: $options.statusBarHeight,
    d: common_vendor.o(($event) => $options.onSearchBarClick()),
    e: common_vendor.o(($event) => $options.onInteractiveMessageClick("ATTENTION")),
    f: common_vendor.p({
      avatar: "/static/svgs/add_user.svg",
      title: "\u5173\u6CE8",
      badgeNumber: $data.attentionUnreadSum
    }),
    g: common_vendor.o(($event) => $options.onInteractiveMessageClick("COMMENT")),
    h: common_vendor.p({
      avatar: "/static/svgs/message-comment.svg",
      title: "\u8BC4\u8BBA\u548C\u56DE\u7B54",
      badgeNumber: $data.commentUnreadSum
    }),
    i: common_vendor.o(($event) => $options.onInteractiveMessageClick("LIKE")),
    j: common_vendor.p({
      avatar: "/static/svgs/message-like.svg",
      title: "\u559C\u6B22\u548C\u8D5E\u540C",
      badgeNumber: $data.likedUnreadSum
    }),
    k: $data.officialNewsList.length > 0
  }, $data.officialNewsList.length > 0 ? {
    l: common_vendor.f($data.officialNewsList, (item, k0, i0) => {
      return {
        a: item.type,
        b: common_vendor.o(($event) => $options.onOfficialNewsItemClick(item), item.type),
        c: common_vendor.o(($event) => $options.onOfficialNewsItemMoreClick(item), item.type),
        d: "2d59ac4e-4-" + i0,
        e: common_vendor.p({
          avatar: item.type === $data.OfficeMessageType.ACTIVITY ? "/static/svgs/official-activities.svg" : "/static/svgs/official-communication.svg",
          title: "\u5E03\u5495\u901A\u77E5",
          messageType: "official",
          badgeNumber: item.unreadSum,
          note: item.lastText,
          needOnlineState: false,
          time: item.lastTime
        })
      };
    })
  } : {}, {
    m: $data.userMessageList.length > 0
  }, $data.userMessageList.length > 0 ? {
    n: common_vendor.f($data.userMessageList, (item, k0, i0) => {
      return {
        a: item.userId,
        b: common_vendor.o(($event) => $options.onUserMessageItemClick(item), item.userId),
        c: common_vendor.o(($event) => $options.onUserMessageMoreClick(item), item.userId),
        d: "2d59ac4e-5-" + i0,
        e: common_vendor.p({
          avatar: item.avatar,
          title: item.username,
          note: item.lastMessageType == 1 ? "[\u56FE\u7247]" : item.lastMessageType == 2 ? "\u8BED\u97F3" : item.lastMessage,
          needOnlineState: true,
          time: item.lastTime,
          onLineState: item.online,
          badgeNumber: item.unReadSum
        })
      };
    })
  } : {}, {
    o: $options.scollerHeight + "px",
    p: common_vendor.f($data.attentionArticles.data, (item, index, i0) => {
      return {
        a: item.id,
        b: common_vendor.o(($event) => $options.onFollow(item), item.id),
        c: common_vendor.o(($event) => $options.onMoreClick(item), item.id),
        d: common_vendor.o(($event) => $options.onActivityItemClick(item), item.id),
        e: common_vendor.o(($event) => $options.onShareClick(item), item.id),
        f: "2d59ac4e-6-" + i0,
        g: common_vendor.p({
          articleItem: item,
          isMe: false
        })
      };
    }),
    q: $data.attentionArticles.data.length > 0
  }, $data.attentionArticles.data.length > 0 ? {
    r: common_vendor.p({
      iconType: "circle",
      status: $data.attentionArticles.haveMoreData ? _ctx.showBottomLoading ? "loading" : "more" : "noMore",
      contentText: {
        contentdown: "\u4E0A\u62C9\u663E\u793A\u66F4\u591A",
        contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
        contentnomore: "\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86"
      }
    })
  } : {}, {
    s: $options.scollerHeight + "px",
    t: $data.refresherEnabled,
    v: $data.attentionArticles.isRefresh,
    w: $data.scrollInto,
    x: common_vendor.o(($event) => $options.onAttentionIsRefresh()),
    y: common_vendor.o(($event) => $options.onAttentionScrolltolower()),
    z: $data.tabSelect,
    A: $options.scollerHeight + "px",
    B: common_vendor.o((...args) => $options.onSwiperChange && $options.onSwiperChange(...args)),
    C: common_vendor.o((...args) => $options.onSwiperTransition && $options.onSwiperTransition(...args)),
    D: common_vendor.o((...args) => $options.onSwiperAnimationfinish && $options.onSwiperAnimationfinish(...args)),
    E: $data.editUserMessageItem.userId
  }, $data.editUserMessageItem.userId ? {
    F: common_vendor.o(($event) => $options.onUserMessageDeleteClick($data.editUserMessageItem)),
    G: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664\u5BF9\u8BDD"
    }),
    H: common_vendor.o(($event) => $options.onUserMessageReportClick($data.editUserMessageItem)),
    I: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5\u7528\u6237"
    })
  } : {}, {
    J: common_vendor.sr("userMessageActionPopup", "2d59ac4e-8"),
    K: common_vendor.p({
      needHead: true,
      title: "\u6D88\u606F\u9009\u62E9",
      needCancelButton: true
    }),
    L: $data.editOfficialNewsItem.type
  }, $data.editOfficialNewsItem.type ? {
    M: common_vendor.o(($event) => $options.onOfficialNewsDeleteClick($data.editOfficialNewsItem)),
    N: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664\u5BF9\u8BDD"
    })
  } : {}, {
    O: common_vendor.sr("officialNewsActionPopup", "2d59ac4e-11"),
    P: common_vendor.p({
      needHead: true,
      title: "\u6D88\u606F\u9009\u62E9",
      needCancelButton: true
    }),
    Q: $data.editArticleItem.id
  }, $data.editArticleItem.id ? common_vendor.e({
    R: $data.editArticleItem.publisher.isAttention == 1
  }, $data.editArticleItem.publisher.isAttention == 1 ? {
    S: common_vendor.o(($event) => $options.onCancelFollow($data.editArticleItem)),
    T: common_vendor.p({
      icon: "icon-quxiaoguanzhu",
      title: "\u53D6\u6D88\u5173\u6CE8"
    })
  } : {
    U: common_vendor.o(($event) => $options.onFollow($data.editArticleItem)),
    V: common_vendor.p({
      icon: "icon-guanzhu",
      title: "\u5173\u6CE8"
    })
  }, {
    W: common_vendor.o(($event) => $options.onChatClick($data.editArticleItem)),
    X: common_vendor.p({
      icon: "icon-message",
      title: "\u79C1\u804A"
    }),
    Y: common_vendor.o(($event) => $options.onPopupReportClick($data.editArticleItem)),
    Z: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  }) : {}, {
    aa: common_vendor.sr("articleActionPopup", "2d59ac4e-13"),
    ab: common_vendor.p({
      needHead: true,
      title: "\u52A8\u6001\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/message/message.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
