"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "question-item",
  data() {
    return {};
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => _ctx.onQuetionItemClick && _ctx.onQuetionItemClick(...args))
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/question-item-skeleton/question-item-skeleton.vue"]]);
wx.createComponent(Component);
