"use strict";
var common_vendor = require("../../common/vendor.js");
var common_storageFunctions = require("../../common/storageFunctions.js");
var utils_messageUtils_storage = require("../../utils/messageUtils/storage.js");
var common_storageKeys = require("../../common/storageKeys.js");
var common_globalMsgKeys = require("../../common/globalMsgKeys.js");
require("../../utils/messageUtils/storageKeys.js");
require("../../utils/dateUtils.js");
require("../../common/constants.js");
require("../../common/requestFunctions.js");
require("../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {}
    };
  },
  async onLoad(params) {
    this.userInfo = await common_storageFunctions.getMyUserInfo();
    let open_real_name_authentication = params.open_real_name_authentication;
    if (open_real_name_authentication) {
      this.$refs.authenticationActionSheet.open();
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onNavigateTo(page_url) {
      common_vendor.index.navigateTo({
        url: page_url
      });
    },
    onRealNameAuthenticationClick() {
      if (this.userInfo.isVerify == 1) {
        common_vendor.index.showToast({
          title: "\u60A8\u5DF2\u7ECF\u5B8C\u6210\u5B9E\u540D\u8BA4\u8BC1",
          icon: "none"
        });
        return;
      }
      this.$refs.authenticationActionSheet.open();
    },
    onClearCacheClick() {
      if (!this.userInfo.id) {
        common_vendor.index.showToast({
          title: "\u60A8\u8FD8\u672A\u767B\u5F55\uFF0C\u8BF7\u5148\u767B\u5F55",
          icon: "error"
        });
        return;
      }
      let _this = this;
      common_vendor.index.showModal({
        title: "\u6E05\u9664\u804A\u5929\u8BB0\u5F55\u5417",
        content: "\u4F60\u786E\u5B9A\u8981\u6E05\u9664\u6240\u6709\u672C\u5730\u7684\u804A\u5929\u8BB0\u5F55\u5417",
        success: function(res) {
          if (res.confirm) {
            utils_messageUtils_storage.deleteMessageRecord(_this.userInfo.id);
            common_vendor.index.showToast({
              title: "\u6E05\u9664\u6210\u529F"
            });
          }
        }
      });
    },
    onLogoutClick() {
      common_vendor.index.showModal({
        title: "\u9000\u51FA\u767B\u5F55",
        content: "\u4F60\u786E\u5B9A\u8981\u9000\u51FA\u767B\u5F55\u5417\uFF1F",
        success: function(res) {
          if (res.confirm) {
            common_vendor.index.closeSocket();
            common_vendor.index.setStorage({ key: common_storageKeys.TOKEN, data: null });
            common_vendor.index.setStorage({ key: common_storageKeys.USER_INFO, data: null });
            common_vendor.index.$emit(common_globalMsgKeys.LOGOUT, { logout: true });
            common_vendor.index.navigateBack({
              delta: 1
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_list_item = () => "../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_action_sheet_item = () => "../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_list_item + _easycom_uni_list + _easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onNarLeftClick),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: common_vendor.p({
      clickable: true,
      showArrow: true,
      link: true,
      to: "/pages/setting/personal_information/personal_information",
      title: "\u4E2A\u4EBA\u8D44\u6599",
      thumb: "/static/icons/user.png",
      ["thumb-size"]: "medium"
    }),
    d: common_vendor.p({
      clickable: true,
      showArrow: true,
      link: true,
      to: "/pages/setting/bugu-vip/bugu-vip",
      title: "\u5E03\u5495\u4F1A\u5458",
      thumb: "/static/icons/crown.png",
      ["thumb-size"]: "medium"
    }),
    e: common_vendor.o(($event) => $options.onRealNameAuthenticationClick()),
    f: common_vendor.p({
      clickable: true,
      showArrow: true,
      title: "\u5B9E\u540D\u8BA4\u8BC1",
      thumb: "/static/icons/security-scan.png",
      ["thumb-size"]: "medium"
    }),
    g: common_vendor.p({
      clickable: true,
      showArrow: true,
      link: true,
      to: "/pages/setting/sound-setting/sound-setting",
      title: "\u58F0\u97F3\u8BBE\u7F6E",
      thumb: "/static/icons/bell.png",
      ["thumb-size"]: "medium"
    }),
    h: common_vendor.p({
      clickable: true,
      showArrow: true,
      link: true,
      to: "/pages/setting/help/help",
      title: "\u5E2E\u52A9\u4E0E\u53CD\u9988",
      thumb: "/static/icons/question.png",
      ["thumb-size"]: "medium"
    }),
    i: common_vendor.p({
      clickable: true,
      showArrow: true,
      link: true,
      to: "/pages/setting/about-bugu/about-bugu",
      title: "\u5173\u4E8E\u5E03\u5495\u661F\u7403",
      thumb: "/static/icons/read.png",
      ["thumb-size"]: "medium"
    }),
    j: common_vendor.o(($event) => $options.onClearCacheClick()),
    k: common_vendor.p({
      clickable: true,
      showArrow: true,
      title: "\u6E05\u9664\u804A\u5929\u8BB0\u5F55",
      thumb: "/static/icons/clear.png",
      ["thumb-size"]: "medium"
    }),
    l: common_vendor.o($options.onLogoutClick),
    m: common_vendor.p({
      clickable: true,
      showArrow: true,
      title: "\u9000\u51FA\u767B\u5F55",
      thumb: "/static/icons/logout.png",
      ["thumb-size"]: "medium"
    }),
    n: common_vendor.o(($event) => $options.onNavigateTo("/pages/setting/school-login/school-login")),
    o: common_vendor.p({
      title: "\u767B\u5F55\u5B66\u6821\u5B98\u7F51\u8BA4\u8BC1(\u4EC5\u652F\u6301\u6E56\u5317\u5DE5\u4E1A\u5927\u5B66)"
    }),
    p: common_vendor.o(($event) => $options.onNavigateTo("/pages/setting/real-name-authentication/real-name-authentication")),
    q: common_vendor.p({
      title: "\u4E0A\u4F20\u7167\u7247\u8BA4\u8BC1"
    }),
    r: common_vendor.sr("authenticationActionSheet", "197e572a-10"),
    s: common_vendor.p({
      title: "\u9009\u62E9\u8BA4\u8BC1\u65B9\u5F0F",
      needCancelButton: "true",
      needHead: "true"
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/setting.vue"]]);
wx.createPage(MiniProgramPage);
