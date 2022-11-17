"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_constants = require("../../../common/constants.js");
var utils_request = require("../../../utils/request.js");
var common_globalMsgKeys = require("../../../common/globalMsgKeys.js");
const _sfc_main = {
  data() {
    return {
      username: ""
    };
  },
  onLoad(params) {
    this.username = params.username;
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onUsernameInput(e) {
      this.username = e.detail.value;
    },
    onSaveButtonClick() {
      if (this.username.length < 1) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u8F93\u5165\u6635\u79F0",
          icon: "error"
        });
        return;
      }
      if (this.username.length > 16) {
        common_vendor.index.showToast({
          title: "\u6635\u79F0\u4E0D\u80FD\u8D85\u8FC716\u4E2A\u5B57\u7B26",
          icon: "error"
        });
        return;
      }
      this.changeName(this.username);
    },
    async changeName(newUsername) {
      common_vendor.index.showLoading({
        title: "\u4FEE\u6539\u4E2D"
      });
      let res = await utils_request.request({
        data: {
          method: "POST",
          group: "user",
          action: `username/change/${newUsername}`,
          data: {
            username: newUsername
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      common_vendor.index.hideLoading();
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        common_vendor.index.$emit(common_globalMsgKeys.REFRESH_USERINFO, { needRefresh: true });
        common_vendor.index.navigateBack();
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
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
    c: $data.username,
    d: common_vendor.o((...args) => $options.onUsernameInput && $options.onUsernameInput(...args)),
    e: common_vendor.o(($event) => $options.onSaveButtonClick())
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/personal_information/change-username.vue"]]);
wx.createPage(MiniProgramPage);
