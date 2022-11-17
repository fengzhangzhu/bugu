"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "my-box-item",
  props: {
    myBoxData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    onClick() {
      this.$emit("onClick");
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.myBoxData.sex == 0 ? "\u5973\u751F\u76D2\u5B50" : "\u7537\u751F\u76D2\u5B50"),
    b: common_vendor.t($props.myBoxData.isDeleted == 1 ? "-\u5DF2\u5220\u9664" : $props.myBoxData.isCollected == 1 ? "-\u5DF2\u88AB\u6536\u53D6" : ""),
    c: common_vendor.t($props.myBoxData.text),
    d: common_vendor.t($props.myBoxData.time),
    e: common_vendor.p({
      color: "#b4b4b4",
      type: "right",
      size: "20"
    }),
    f: $props.myBoxData.sex == 0 ? `linear-gradient(to left, #fce9f0, #fff);` : `linear-gradient(to left, #ebf2fd, #fff);`,
    g: common_vendor.o((...args) => $options.onClick && $options.onClick(...args))
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/my-box-item/my-box-item.vue"]]);
wx.createComponent(Component);
