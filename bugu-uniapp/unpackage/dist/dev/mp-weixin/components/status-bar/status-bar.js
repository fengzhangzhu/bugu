"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "StatusBar",
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
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-01a41e78"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/status-bar/status-bar.vue"]]);
wx.createComponent(Component);
