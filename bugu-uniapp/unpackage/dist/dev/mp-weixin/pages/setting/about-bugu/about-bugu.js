"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_constants = require("../../../common/constants.js");
const _sfc_main = {
  data() {
    return {
      AppVersion: common_constants.AppVersion
    };
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  (_easycom_uni_nav_bar2 + _easycom_uni_list_item2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_list_item = () => "../../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_list_item)();
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
    c: common_vendor.t($data.AppVersion),
    d: common_vendor.p({
      clickable: true,
      showArrow: true,
      link: true,
      to: "/pages/setting/about-bugu/update-log",
      title: "\u66F4\u65B0\u65E5\u5FD7",
      arrow: "right"
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/about-bugu/about-bugu.vue"]]);
wx.createPage(MiniProgramPage);
