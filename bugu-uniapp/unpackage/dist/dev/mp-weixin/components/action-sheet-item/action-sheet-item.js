"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "action-sheet-item",
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: false
    }
  },
  data() {
    return {};
  },
  methods: {
    click(e) {
      this.$emit("click");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.icon
  }, $props.icon ? {
    b: common_vendor.n("iconfont " + $props.icon)
  } : {}, {
    c: common_vendor.t($props.title),
    d: $props.icon ? "left" : "center",
    e: common_vendor.o((...args) => $options.click && $options.click(...args))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/action-sheet-item/action-sheet-item.vue"]]);
wx.createComponent(Component);
