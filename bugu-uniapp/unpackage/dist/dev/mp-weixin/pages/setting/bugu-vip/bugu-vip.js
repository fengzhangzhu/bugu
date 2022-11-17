"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_constants = require("../../../common/constants.js");
var utils_request = require("../../../utils/request.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var common_requestFunctions = require("../../../common/requestFunctions.js");
require("../../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {},
      typeSelect: 0
    };
  },
  onLoad() {
    this.refreshUserInfo();
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    async refreshUserInfo() {
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D"
      });
      let userInfoBefore = await common_storageFunctions.getMyUserInfo();
      this.userInfo = await common_requestFunctions.getUserinfo(userInfoBefore.id);
      common_vendor.index.hideLoading();
    },
    onVipTypeClick(select) {
      this.typeSelect = select;
    },
    onOpenVipClick() {
      common_vendor.index.showModal({
        title: "\u5F00\u901A\u4F1A\u5458",
        content: "\u6682\u65F6\u8FD8\u4E0D\u80FD\u5F00\u901A\u54E6~\uFF0C\u53C2\u52A0\u5B98\u65B9\u6D3B\u52A8\u53EF\u4EE5\u514D\u8D39\u9886\u53D6\u4F1A\u5458\u54E6~"
      });
    },
    async getFreeVip() {
      common_vendor.index.showLoading({
        title: "\u9886\u53D6\u4E2D"
      });
      let res = await utils_request.request({
        data: {
          method: "PUT",
          group: "welfare",
          action: `vip/oneMonth`,
          data: {},
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        common_vendor.index.showToast({
          title: "\u9886\u53D6\u6210\u529F",
          icon: "success"
        });
        this.refreshUserInfo();
      }
    },
    async getVipByActivitySum() {
      let res = await utils_request.request({
        data: {
          method: "PUT",
          group: "welfare",
          action: `getByActivitySum`,
          data: {},
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        common_vendor.index.showToast({
          title: "\u9886\u53D6\u6210\u529F",
          icon: "success"
        });
        this.refreshUserInfo();
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
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.onNarLeftClick()),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: $data.userInfo.id
  }, $data.userInfo.id ? {
    d: $data.userInfo.avatar,
    e: common_vendor.t($data.userInfo.username),
    f: common_vendor.t($data.userInfo.vip && $data.userInfo.vip.remainDays > 0 ? "\u60A8\u7684\u4F1A\u5458\u5269\u4F59" + $data.userInfo.vip.remainDays + "\u5929" : "\u5F00\u901A\u5E03\u5495\u4F1A\u5458\uFF0C\u4EAB\u66F4\u591A\u6743\u76CA")
  } : {}, {
    g: common_vendor.o(($event) => $options.onVipTypeClick(0)),
    h: $data.typeSelect == 0 ? "#ffefdb" : "#ffffff",
    i: $data.typeSelect == 0 ? "2px solid #deb887" : "2px solid #ffffff00",
    j: common_vendor.o(($event) => $options.onVipTypeClick(1)),
    k: $data.typeSelect == 1 ? "#ffefdb" : "#ffffff",
    l: $data.typeSelect == 1 ? "2px solid #deb887" : "2px solid #ffffff00",
    m: common_vendor.o(($event) => $options.onVipTypeClick(2)),
    n: $data.typeSelect == 2 ? "#ffefdb" : "#ffffff",
    o: $data.typeSelect == 2 ? "2px solid #deb887" : "2px solid #ffffff00",
    p: common_vendor.o((...args) => $options.getVipByActivitySum && $options.getVipByActivitySum(...args))
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/bugu-vip/bugu-vip.vue"]]);
wx.createPage(MiniProgramPage);
