"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
var utils_request = require("../../utils/request.js");
var common_storageFunctions = require("../../common/storageFunctions.js");
var utils_aes_export = require("../../utils/aes/export.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
var common_storageKeys = require("../../common/storageKeys.js");
var common_globalMsgKeys = require("../../common/globalMsgKeys.js");
var utils_tabBarBadgeUtils = require("../../utils/tabBarBadgeUtils.js");
require("../../utils/messageUtils/index.js");
require("../../utils/messageUtils/service.js");
require("../../utils/messageUtils/storage.js");
require("../../utils/messageUtils/storageKeys.js");
require("../../utils/dateUtils.js");
const _sfc_main = {
  data() {
    return {
      isLogin: true,
      AnonymousAvatar: common_constants.AnonymousAvatar,
      privateSettingGroup: common_constants.privateSettingGroup,
      privateSelected: common_constants.privateSettingGroup[0],
      isRefresh: false,
      userInfo: {},
      tabSelect: 0,
      myArticles: {
        data: [],
        page: 1,
        haveMore: true
      },
      likedArticles: {
        data: [],
        page: 1,
        haveMore: true
      },
      editArticleItem: {},
      numberChange: {
        followedNumber: 0,
        fansNumber: 0,
        viewsNumber: 0
      },
      lastClickTime: 0
    };
  },
  async onLoad() {
    let userInfo = await common_storageFunctions.getMyUserInfo();
    if (!userInfo) {
      this.userInfo = {
        attentionSum: 0,
        visitorSum: 0,
        beAttentionSum: 0,
        avatar: common_constants.AnonymousAvatar,
        id: -1,
        registerDay: 0,
        username: "\u672A\u767B\u5F55",
        isVerify: 0
      };
      this.isLogin = false;
      return;
    } else {
      this.userInfo = userInfo;
      this.isLogin = true;
      this.refreshUserInfo();
      utils_tabBarBadgeUtils.changeUnreadMessageSum();
    }
  },
  async onShow() {
    let _this = this;
    common_vendor.index.$once(common_globalMsgKeys.REFRESH_USERINFO, function(data) {
      if (data.needRefresh) {
        _this.refreshUserInfo();
      }
    });
    common_vendor.index.$once(common_globalMsgKeys.LOGOUT, function(data) {
      if (data.logout) {
        _this.userInfo = {
          attentionSum: 0,
          visitorSum: 0,
          beAttentionSum: 0,
          avatar: common_constants.AnonymousAvatar,
          id: -1,
          registerDay: 0,
          username: "\u672A\u767B\u5F55",
          isVerify: 0
        };
        _this.isLogin = false;
        _this.myArticles.data = [];
        _this.myArticles.page = 1;
      }
    });
  },
  methods: {
    onNavigateTo(page_url) {
      common_vendor.index.navigateTo({
        url: page_url
      });
    },
    async refreshUserInfo() {
      this.userInfo = await common_storageFunctions.getMyUserInfo();
      if (!this.userInfo) {
        common_vendor.index.showModal({
          title: "\u672A\u767B\u5F55",
          content: "\u672A\u767B\u5F55\u8BF7\u5148\u767B\u5F55",
          success: function(res) {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
              });
            }
          }
        });
        this.myArticles.data = [];
        this.myArticles.page = 1;
      } else {
        this.myArticles.page = 1;
        this.initNumberChange(this.userInfo);
        this.getMyArticle(this.userInfo.id, this.myArticles.page);
      }
    },
    async initNumberChange(userInfo) {
      let FOLLOWED_NUMBER_CHANGED = common_storageKeys.getFollowedNumberChangedKey(userInfo.id);
      let FANS_NUMBER_CHANGED = common_storageKeys.getFansNumberChangedKey(userInfo.id);
      let VIEWS_NUMBER_CHANGED = common_storageKeys.getViewsNumberChangedKey(userInfo.id);
      let followedNumberChanged = common_vendor.index.getStorageSync(FOLLOWED_NUMBER_CHANGED);
      let fansNumberChanged = common_vendor.index.getStorageSync(FANS_NUMBER_CHANGED);
      let viewsNumberChanged = common_vendor.index.getStorageSync(VIEWS_NUMBER_CHANGED);
      if (!followedNumberChanged)
        followedNumberChanged = 0;
      if (!fansNumberChanged)
        fansNumberChanged = 0;
      if (!viewsNumberChanged)
        viewsNumberChanged = 0;
      let userInfoNow = await common_requestFunctions.getUserinfo(userInfo.id);
      if (userInfoNow) {
        this.userInfo = userInfoNow;
        followedNumberChanged = userInfoNow.attentionSum - userInfo.attentionSum + followedNumberChanged;
        fansNumberChanged = userInfoNow.beAttentionSum - userInfo.beAttentionSum + fansNumberChanged;
        viewsNumberChanged = userInfoNow.visitorSum - userInfo.visitorSum + viewsNumberChanged;
        common_vendor.index.setStorage({
          key: common_storageKeys.USER_INFO,
          data: userInfoNow
        });
        common_vendor.index.setStorage({
          key: FOLLOWED_NUMBER_CHANGED,
          data: followedNumberChanged > 0 ? followedNumberChanged : 0
        });
        common_vendor.index.setStorage({
          key: FANS_NUMBER_CHANGED,
          data: fansNumberChanged > 0 ? fansNumberChanged : 0
        });
        common_vendor.index.setStorage({
          key: VIEWS_NUMBER_CHANGED,
          data: viewsNumberChanged > 0 ? viewsNumberChanged : 0
        });
        this.numberChange = {
          followedNumber: followedNumberChanged,
          fansNumber: fansNumberChanged,
          viewsNumber: viewsNumberChanged
        };
      }
    },
    onSettingButtonClick() {
      common_vendor.index.navigateTo({
        url: "/pages/setting/setting"
      });
    },
    onBackgroundClick() {
      let clickTime = Date.now();
      if (clickTime - this.lastClickTime > 1e3) {
        this.lastClickTime = clickTime;
      } else {
        return;
      }
      if (!this.userInfo) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u767B\u5F55",
          icon: "none"
        });
      }
      if (!this.userInfo.vip || this.userInfo.vip.remainDays < 1) {
        common_vendor.index.showToast({
          title: "\u53EA\u6709vip\u7528\u6237\u53EF\u4EE5\u66F4\u6362\u80CC\u666F\u54E6~",
          icon: "none"
        });
        return;
      }
      let _this = this;
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album"],
        success: function(res) {
          var tempFiles = res.tempFilePaths;
          _this.changeBackgroud(tempFiles[0]);
        }
      });
    },
    onVipLogoClick() {
      common_vendor.index.navigateTo({
        url: "/pages/setting/bugu-vip/bugu-vip"
      });
    },
    onFollowedNumberClick() {
      if (this.userInfo) {
        common_vendor.index.navigateTo({
          url: "/pages/mine-secondary-page/follow-list/follow-list"
        });
        this.numberChange.followedNumber = 0;
      }
    },
    onFansNumberClick() {
      if (this.userInfo) {
        common_vendor.index.navigateTo({
          url: "/pages/mine-secondary-page/fan-list/fan-list"
        });
        this.numberChange.fansNumber = 0;
      }
    },
    onVisitorNumberClick() {
      if (this.userInfo) {
        common_vendor.index.navigateTo({
          url: "/pages/mine-secondary-page/visitor-list/visitor-list"
        });
        this.numberChange.viewsNumber = 0;
      }
    },
    async onTabChange(index) {
      this.tabSelect = index;
      if (index == 1) {
        if (this.likedArticles.data.length < 1 && this.likedArticles.haveMore) {
          this.likedArticles.page = 1;
          let articles = await this.getMyLikedArticle(this.userInfo.id, this.likedArticles.page);
          if (articles.length > 0) {
            this.likedArticles.data = articles;
          } else {
            this.likedArticles.haveMore = false;
          }
        }
      }
    },
    async onRefresh() {
      this.isRefresh = true;
      this.initNumberChange(this.userInfo);
      this.myArticles.page = 1;
      this.likedArticles.page = 1;
      this.getMyArticle(this.userInfo.id, this.myArticles.page);
      let articles = await this.getMyLikedArticle(this.userInfo.id, this.likedArticles.page);
      if (articles.length > 0) {
        this.likedArticles.data = articles;
      } else {
        this.likedArticles.haveMore = false;
      }
    },
    async onPrivaterAdioChange(evt) {
      this.privateSelected = evt.detail.value;
      let visibility = this.privateSettingGroup.indexOf(this.privateSelected);
      if (this.editArticleItem.id) {
        common_vendor.index.showLoading({
          title: "\u6743\u9650\u4FEE\u6539\u4E2D"
        });
        let res = await this.ChangeVisibility(this.editArticleItem.id, visibility);
        common_vendor.index.hideLoading();
        if (res) {
          let myArticles = this.myArticles.data;
          for (let i = 0; i < myArticles.length; i++) {
            if (myArticles[i].id == this.editArticleItem.id) {
              myArticles[i].visibility = visibility;
              break;
            }
          }
          this.myArticles.data = myArticles;
          common_vendor.index.showToast({
            title: "\u53EF\u89C1\u6027\u4FEE\u6539\u6210\u529F\uFF01"
          });
          this.$refs.articleActionPopup.close();
        } else {
          this.privateSelected = this.privateSettingGroup[this.editArticleItem.visibility];
        }
      }
    },
    onActivityDeleteButtonClick() {
      if (this.editArticleItem.id) {
        let _this = this;
        common_vendor.index.showModal({
          title: "\u5220\u9664\u52A8\u6001",
          content: "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u52A8\u6001\u5417",
          confirmText: "\u786E\u5B9A",
          cancelText: "\u53D6\u6D88",
          success: async function(res) {
            if (res.confirm) {
              common_vendor.index.showLoading({
                title: "\u6743\u9650\u4FEE\u6539\u4E2D"
              });
              let res2 = await common_requestFunctions.deleteMyArticle(_this.editArticleItem.id);
              common_vendor.index.hideLoading();
              if (res2) {
                let myArticles = _this.myArticles.data;
                for (let i = 0; i < myArticles.length; i++) {
                  if (myArticles[i].id == _this.editArticleItem.id) {
                    myArticles.splice(i, 1);
                    break;
                  }
                }
                _this.myArticles.data = myArticles;
                common_vendor.index.showToast({
                  title: "\u5220\u9664\u6210\u529F\uFF01"
                });
                _this.$refs.articleActionPopup.close();
              }
            }
          }
        });
      }
    },
    onPopupReportClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${common_constants.reportObjectType.activity}`
      });
      this.$refs.articleLikedActionPopup.close();
    },
    onActivityItemClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/activity-info?activityId=${item.id}`
      });
    },
    onActivityItemMoreClick(item) {
      this.editArticleItem = item;
      this.privateSelected = this.privateSettingGroup[item.visibility];
      this.$refs.articleActionPopup.open();
    },
    onActivityLikedItemMoreClick(item) {
      this.editArticleItem = item;
      this.$refs.articleLikedActionPopup.open();
    },
    async onScrolltolower() {
      if (this.tabSelect == 0) {
        if (!this.myArticles.haveMore) {
          return;
        }
        this.myArticles.page = this.myArticles.page + 1;
        this.getMyArticle(this.userInfo.id, this.myArticles.page);
      } else if (this.tabSelect == 1) {
        this.likedArticles.page = this.likedArticles.page + 1;
        let articles = await this.getMyLikedArticle(this.userInfo.id, this.likedArticles.page);
        if (articles.length > 0) {
          this.likedArticles.data = this.likedArticles.data.concat(articles);
        } else {
          this.likedArticles.haveMore = false;
        }
      }
    },
    async getMyArticle(userId, page) {
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
      setTimeout(() => {
        this.isRefresh = false;
      }, 700);
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let result = res.data.data;
        let artices = res.data.data.list;
        if (page <= result.pageSum) {
          if (page == 1) {
            this.myArticles.data = artices;
          } else {
            this.myArticles.data = this.myArticles.data.concat(artices);
          }
          if (page == result.pageSum) {
            this.myArticles.haveMore = false;
          } else {
            this.myArticles.haveMore = true;
          }
        } else {
          this.myArticles.page = this.myArticles.page - 1;
          this.myArticles.haveMore = false;
        }
      }
    },
    async getMyLikedArticle(userId, page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: `uLikeActivity`,
          data: {
            uid: userId,
            startPage: page,
            pageSize: 8
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let articles = res.data.data;
        return articles;
      } else {
        return [];
      }
    },
    async ChangeVisibility(ArticleId, visibility) {
      let res = await utils_request.request({
        data: {
          method: "POST",
          group: "activity",
          action: `${ArticleId}/visibility/change`,
          data: {
            id: ArticleId,
            visibility
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        return true;
      } else {
        return false;
      }
    },
    async changeBackgroud(fileUrl) {
      common_vendor.index.showLoading({
        title: "\u6B63\u5728\u53D1\u5E03"
      });
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "user",
          action: "background/token",
          data: {},
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let fileName = res.data.data.fileName;
        let fileToken = res.data.data.token;
        let _this = this;
        common_vendor.index.uploadFile({
          url: common_constants.UploadUrl,
          filePath: fileUrl,
          name: "file",
          formData: {
            "key": fileName,
            "token": utils_aes_export.aes.decrypt(fileToken)
          },
          async success(fileRes) {
            let backgroundChangeRes = await utils_request.request({
              data: {
                method: "POST",
                group: "user",
                action: "background/update",
                data: {
                  background: fileName
                },
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                }
              }
            });
            if (backgroundChangeRes.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
              common_vendor.index.showToast({
                title: "\u66F4\u6362\u80CC\u666F\u6210\u529F"
              });
              _this.refreshUserInfo();
            }
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "\u6CA1\u6709\u6743\u9650\uFF0C\u8BF7\u5148\u767B\u5F55",
          icon: "none"
        });
        return;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_badge2 = common_vendor.resolveComponent("uni-badge");
  const _easycom_user_activity_item2 = common_vendor.resolveComponent("user-activity-item");
  const _easycom_custom_tab_pane2 = common_vendor.resolveComponent("custom-tab-pane");
  const _easycom_custom_tabs2 = common_vendor.resolveComponent("custom-tabs");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  (_easycom_uni_icons2 + _easycom_uni_nav_bar2 + _easycom_uni_badge2 + _easycom_user_activity_item2 + _easycom_custom_tab_pane2 + _easycom_custom_tabs2 + _easycom_action_sheet2 + _easycom_action_sheet_item2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_badge = () => "../../uni_modules/uni-badge/components/uni-badge/uni-badge.js";
const _easycom_user_activity_item = () => "../../components/user-activity-item/user-activity-item.js";
const _easycom_custom_tab_pane = () => "../../components/custom-tab-pane/custom-tab-pane.js";
const _easycom_custom_tabs = () => "../../components/custom-tabs/custom-tabs.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
const _easycom_action_sheet_item = () => "../../components/action-sheet-item/action-sheet-item.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_nav_bar + _easycom_uni_badge + _easycom_user_activity_item + _easycom_custom_tab_pane + _easycom_custom_tabs + _easycom_action_sheet + _easycom_action_sheet_item)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.id
  }, $data.userInfo.id ? {
    b: common_vendor.t($data.userInfo.username)
  } : {}, {
    c: common_vendor.p({
      customPrefix: "customicons",
      type: "settings-filled",
      color: "#fdfdfd",
      size: "25"
    }),
    d: common_vendor.o((...args) => $options.onSettingButtonClick && $options.onSettingButtonClick(...args)),
    e: common_vendor.o(($event) => _ctx.onNarLeftClick()),
    f: common_vendor.p({
      fixed: "true",
      border: false,
      backgroundColor: "#ffffff00",
      color: "#808080",
      statusBar: "true"
    }),
    g: $data.userInfo.id
  }, $data.userInfo.id ? common_vendor.e({
    h: $data.userInfo.avatar
  }, $data.userInfo.avatar ? {
    i: $data.userInfo.avatar
  } : {}, {
    j: $data.userInfo.vip && $data.userInfo.vip.remainDays > 0 ? "../../static/svgs/vip-logo.svg" : "../../static/svgs/no-vip-logo.svg",
    k: common_vendor.o(($event) => $options.onVipLogoClick()),
    l: common_vendor.o(($event) => $options.onNavigateTo("/pages/setting/personal_information/personal_information")),
    m: common_vendor.t($data.userInfo.attentionSum),
    n: $data.numberChange.followedNumber > 0
  }, $data.numberChange.followedNumber > 0 ? {
    o: common_vendor.p({
      text: $data.numberChange.followedNumber,
      type: "error",
      size: "small",
      ["max-num"]: 99
    })
  } : {}, {
    p: common_vendor.o((...args) => $options.onFollowedNumberClick && $options.onFollowedNumberClick(...args)),
    q: common_vendor.t($data.userInfo.beAttentionSum),
    r: $data.numberChange.fansNumber > 0
  }, $data.numberChange.fansNumber > 0 ? {
    s: common_vendor.p({
      text: $data.numberChange.fansNumber,
      type: "error",
      size: "small",
      ["max-num"]: 99
    })
  } : {}, {
    t: common_vendor.o((...args) => $options.onFansNumberClick && $options.onFansNumberClick(...args)),
    v: common_vendor.t($data.userInfo.visitorSum),
    w: $data.numberChange.viewsNumber > 0
  }, $data.numberChange.viewsNumber > 0 ? {
    x: common_vendor.p({
      text: $data.numberChange.viewsNumber,
      type: "error",
      size: "small",
      ["max-num"]: 99
    })
  } : {}, {
    y: common_vendor.o((...args) => $options.onVisitorNumberClick && $options.onVisitorNumberClick(...args)),
    z: $data.isLogin
  }, $data.isLogin ? {
    A: common_vendor.o(($event) => $options.onNavigateTo("/pages/setting/personal_information/personal_information"))
  } : {
    B: common_vendor.o(($event) => $options.onNavigateTo("/pages/login/login"))
  }, {
    C: common_vendor.o(() => {
    })
  }) : {}, {
    D: common_vendor.o((...args) => $options.onBackgroundClick && $options.onBackgroundClick(...args)),
    E: $data.userInfo.background ? `url(${$data.userInfo.background})` : "linear-gradient(to bottom, #e7d3aa, #61c5ae);",
    F: $data.myArticles.data.length > 0
  }, $data.myArticles.data.length > 0 ? {
    G: common_vendor.f($data.myArticles.data, (item, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.onActivityItemClick(item)),
        b: common_vendor.o(($event) => $options.onActivityItemMoreClick(item)),
        c: "48833c2e-7-" + i0 + ",48833c2e-6",
        d: common_vendor.p({
          articleItem: item,
          isMe: true,
          avatar: $data.userInfo.avatar,
          username: $data.userInfo.username
        }),
        e: item.id
      };
    })
  } : {}, {
    H: $data.isRefresh,
    I: common_vendor.o((...args) => $options.onScrolltolower && $options.onScrolltolower(...args)),
    J: common_vendor.p({
      label: "\u52A8\u6001"
    }),
    K: $data.likedArticles.data.length > 0
  }, $data.likedArticles.data.length > 0 ? {
    L: common_vendor.f($data.likedArticles.data, (item, index, i0) => {
      return common_vendor.e({
        a: item.isAnonymity != 1 && item.publisher
      }, item.isAnonymity != 1 && item.publisher ? {
        b: common_vendor.o(($event) => $options.onActivityItemClick(item)),
        c: common_vendor.o(($event) => $options.onActivityLikedItemMoreClick(item)),
        d: "48833c2e-9-" + i0 + ",48833c2e-8",
        e: common_vendor.p({
          articleItem: item,
          isMe: item.publisher.id == $data.userInfo.id,
          avatar: item.publisher.avatar,
          username: item.publisher.username
        })
      } : {
        f: common_vendor.o(($event) => $options.onActivityItemClick(item)),
        g: common_vendor.o(($event) => $options.onActivityLikedItemMoreClick(item)),
        h: "48833c2e-10-" + i0 + ",48833c2e-8",
        i: common_vendor.p({
          articleItem: item,
          isMe: false,
          avatar: $data.AnonymousAvatar,
          username: "\u533F\u540D\u7528\u6237"
        })
      }, {
        j: item.id
      });
    })
  } : {}, {
    M: $data.isRefresh,
    N: common_vendor.o((...args) => $options.onScrolltolower && $options.onScrolltolower(...args)),
    O: common_vendor.p({
      label: "\u8D5E\u8FC7"
    }),
    P: common_vendor.o($options.onTabChange),
    Q: common_vendor.p({
      index: $data.tabSelect,
      animation: true,
      tabPadding: "40",
      flex: true
    }),
    R: $data.editArticleItem.id
  }, $data.editArticleItem.id ? {
    S: common_vendor.f($data.privateSettingGroup, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: item === $data.privateSelected,
        d: item
      };
    }),
    T: common_vendor.o((...args) => $options.onPrivaterAdioChange && $options.onPrivaterAdioChange(...args)),
    U: common_vendor.o((...args) => $options.onActivityDeleteButtonClick && $options.onActivityDeleteButtonClick(...args))
  } : {}, {
    V: common_vendor.sr("articleActionPopup", "48833c2e-11"),
    W: common_vendor.p({
      needHead: true,
      title: "\u52A8\u6001\u8BBE\u7F6E"
    }),
    X: $data.editArticleItem.id
  }, $data.editArticleItem.id ? {
    Y: common_vendor.o(($event) => $options.onPopupReportClick($data.editArticleItem)),
    Z: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  } : {}, {
    aa: common_vendor.sr("articleLikedActionPopup", "48833c2e-12"),
    ab: common_vendor.p({
      needHead: true,
      title: "\u52A8\u6001\u8BBE\u7F6E"
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/mine/mine.vue"]]);
wx.createPage(MiniProgramPage);
