"use strict";
var common_vendor = require("../../../common/vendor.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var common_storageKeys = require("../../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: "",
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
    onCheckBoxClick() {
      this.agreest = !this.agreest;
    },
    onPasswordInput(e) {
      this.password = e;
    },
    onUsernameInput(e) {
      this.username = e;
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
    onLoginButtonClick() {
      if (this.username && this.password) {
        if (this.agreest) {
          this.tryToLogin(this.username, this.password);
        } else {
          common_vendor.index.showToast({
            title: "\u8BF7\u5148\u540C\u610F\u7528\u6237\u534F\u8BAE\u548C\u9690\u79C1\u653F\u7B56",
            icon: "none"
          });
        }
      } else {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u8F93\u5165\u7528\u6237\u540D\u6216\u5BC6\u7801",
          icon: "none"
        });
      }
    },
    async tryToLogin(username, password) {
      common_vendor.index.showLoading({
        title: "\u6B63\u5728\u767B\u9646"
      });
      try {
        let res = await utils_request.request({
          data: {
            method: "POST",
            group: "verify",
            action: "login",
            data: {
              username,
              password
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          }
        });
        common_vendor.index.hideLoading();
        if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          common_vendor.index.showToast({
            title: "\u8BA4\u8BC1\u6210\u529F",
            icon: "success"
          });
          let userInfo = await common_storageFunctions.getMyUserInfo();
          userInfo.isVerify = 1;
          common_vendor.index.setStorage({
            key: common_storageKeys.USER_INFO,
            data: userInfo
          });
          setTimeout(function() {
            common_vendor.index.navigateBack({
              delta: 1
            });
          }, 1e3);
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
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_nav_bar2 + _easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
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
    c: common_vendor.o($options.onUsernameInput),
    d: common_vendor.p({
      value: $data.username,
      type: "text",
      placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D"
    }),
    e: common_vendor.p({
      required: "true",
      label: "\u7528\u6237\u540D",
      name: "username"
    }),
    f: common_vendor.o($options.onPasswordInput),
    g: common_vendor.p({
      value: $data.password,
      type: "password",
      placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801"
    }),
    h: common_vendor.p({
      required: "true",
      label: "\u5BC6\u7801",
      name: "password"
    }),
    i: $data.MainColor,
    j: common_vendor.o(($event) => $options.onCheckBoxClick()),
    k: $data.agreest,
    l: common_vendor.o((...args) => $options.onUserProtocolClick && $options.onUserProtocolClick(...args)),
    m: common_vendor.o((...args) => $options.onPrivacyPolicyClick && $options.onPrivacyPolicyClick(...args)),
    n: $data.MainColor,
    o: common_vendor.o(($event) => $options.onLoginButtonClick())
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/school-login/school-login.vue"]]);
wx.createPage(MiniProgramPage);
