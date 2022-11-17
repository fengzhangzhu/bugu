"use strict";
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "UniStatusBar",
  data() {
    return {
      statusBarHeight: 20
    };
  },
  mounted() {
    this.statusBarHeight = common_vendor.index.getSystemInfoSync().statusBarHeight + "px";
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.statusBarHeight
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f9a87a8e"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar.vue"]]);
wx.createComponent(Component);
