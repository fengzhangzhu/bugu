"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_constants = require("../../../common/constants.js");
const _sfc_main = {
  data() {
    return {
      updateLogs: common_constants.updateLogs
    };
  },
  onLoad() {
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
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_nav_bar2 + _easycom_uni_card2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_card = () => "../../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_card)();
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
    c: common_vendor.f($data.updateLogs, (item, index, i0) => {
      return {
        a: common_vendor.f(item.logTexts, (logText, logIndex, i1) => {
          return {
            a: common_vendor.t(logIndex + 1),
            b: common_vendor.t(logText),
            c: logIndex
          };
        }),
        b: item.version,
        c: "6d5cba29-1-" + i0,
        d: common_vendor.p({
          title: "v " + item.version + " \u66F4\u65B0\u65E5\u5FD7"
        })
      };
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/about-bugu/update-log.vue"]]);
wx.createPage(MiniProgramPage);
