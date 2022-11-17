"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      onNarLeftClick() {
        common_vendor.index.navigateBack({
          delta: 1
        });
      }
    };
  },
  methods: {}
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  (_easycom_uni_nav_bar2 + _easycom_uni_collapse_item2 + _easycom_uni_collapse2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_collapse_item = () => "../../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_collapse_item + _easycom_uni_collapse)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.onNarLeftClick()),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: common_vendor.p({
      title: "\u4E3A\u4EC0\u4E48\u8981\u8FDB\u884C\u8EAB\u4EFD\u8BA4\u8BC1\uFF1F"
    }),
    d: common_vendor.p({
      title: "\u5176\u4ED6\u4EBA\u53EF\u4EE5\u770B\u5230\u6211\u7684\u771F\u5B9E\u8EAB\u4EFD\u5417\uFF1F"
    }),
    e: common_vendor.p({
      title: "\u4E3A\u4EC0\u4E48\u6027\u522B\u8BBE\u7F6E\u540E\u4E0D\u80FD\u4FEE\u6539\uFF1F"
    }),
    f: common_vendor.p({
      title: "\u4E3A\u4EC0\u4E48\u6211\u7684\u8D26\u6237\u88AB\u7981\u8A00/\u5C01\u7981\uFF1F"
    }),
    g: common_vendor.p({
      accordion: true
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/help/help.vue"]]);
wx.createPage(MiniProgramPage);
