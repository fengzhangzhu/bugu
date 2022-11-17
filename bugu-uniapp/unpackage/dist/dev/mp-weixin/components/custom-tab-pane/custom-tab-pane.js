"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: ["label"],
  setup(props, context) {
    common_vendor.index.$emit("getTabLabel", props.label);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5cd81804"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/custom-tab-pane/custom-tab-pane.vue"]]);
wx.createComponent(Component);
