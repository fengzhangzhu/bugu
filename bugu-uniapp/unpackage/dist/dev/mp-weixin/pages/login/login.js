"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_request = require("../../utils/request.js");
var common_constants = require("../../common/constants.js");
var common_globalMsgKeys = require("../../common/globalMsgKeys.js");
const _sfc_main = {
  data() {
    return {
      isLoading: false,
      agreest: false,
      MainColor: common_constants.MainColor
    };
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onOtherLoginTextClick() {
      common_vendor.index.navigateTo({
        url: "./account-login"
      });
    },
    onCheckBoxClick() {
      this.agreest = !this.agreest;
    },
    onUserProtocolClick() {
      common_vendor.index.navigateTo({
        url: "/pages/login/bugu-use-protocol/bugu-use-protocol"
      });
    },
    onPrivacyPolicyClick() {
      common_vendor.index.navigateTo({
        url: "/pages/login/bugu-privacy-policy/bugu-privacy-policy"
      });
    },
    onLoginButtonClidk() {
      if (this.isLoading) {
        return;
      }
      if (this.agreest) {
        let _this = this;
        common_vendor.index.login({
          provider: "weixin",
          success: function(res) {
            if (res.code) {
              _this.code = res.code;
              try {
                let BeInvitedCode = common_vendor.index.getStorageSync("BeInvitedCode");
                _this.tryToLogin(res.code, BeInvitedCode);
                common_vendor.index.setStorage({
                  key: "BeInvitedCode",
                  data: null
                });
              } catch {
                _this.tryToLogin(res.code);
              }
            }
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u540C\u610F\u300A\u7528\u6237\u534F\u8BAE\u300B\u548C\u300A\u9690\u79C1\u653F\u7B56\u300B",
          icon: "none"
        });
      }
    },
    async tryToLogin(code, BeInvitedCode) {
      common_vendor.index.showLoading({
        title: "\u6B63\u5728\u767B\u9646"
      });
      this.isLoading = true;
      try {
        let res = await utils_request.request({
          data: {
            method: "GET",
            group: "user",
            action: "login",
            data: BeInvitedCode ? {
              inviteCode: BeInvitedCode,
              code
            } : {
              code
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          }
        });
        this.isLoading = false;
        if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          await common_vendor.index.setStorage({
            key: "token",
            data: res.data.data.token
          });
          await common_vendor.index.setStorage({
            key: "userInfo",
            data: res.data.data.userInfo
          });
          common_vendor.index.showToast({
            title: "\u767B\u5F55\u6210\u529F",
            icon: "success"
          });
          common_vendor.index.$emit(common_globalMsgKeys.REFRESH_USERINFO, { needRefresh: true });
          common_vendor.index.navigateBack({});
        }
      } catch {
        common_vendor.index.showToast({
          title: "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5",
          icon: "none"
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
if (!Math) {
  _easycom_uni_nav_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.onNarLeftClick()),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: common_vendor.t($data.isLoading ? "\u6B63\u5728\u767B\u9646" : "\u5FAE\u4FE1\u4E00\u952E\u767B\u5F55"),
    d: common_vendor.o(($event) => $options.onLoginButtonClidk()),
    e: common_vendor.o(($event) => $options.onOtherLoginTextClick()),
    f: $data.MainColor,
    g: common_vendor.o(($event) => $options.onCheckBoxClick()),
    h: $data.agreest,
    i: common_vendor.o((...args) => $options.onUserProtocolClick && $options.onUserProtocolClick(...args)),
    j: common_vendor.o((...args) => $options.onPrivacyPolicyClick && $options.onPrivacyPolicyClick(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
