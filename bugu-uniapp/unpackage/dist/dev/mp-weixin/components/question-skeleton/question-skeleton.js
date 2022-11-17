"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "question-skeleton",
  data() {
    return {};
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f([...new Array(3)], (item, index, i0) => {
      return {
        a: "label" + index
      };
    })
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/question-skeleton/question-skeleton.vue"]]);
wx.createComponent(Component);
