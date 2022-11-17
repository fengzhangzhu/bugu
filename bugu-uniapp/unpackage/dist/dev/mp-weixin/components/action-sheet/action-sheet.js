"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "action-sheet",
  props: {
    title: {
      type: String,
      required: false
    },
    needHead: {
      type: Boolean,
      default: false
    },
    needCancelButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$refs.actionPopup.close();
    },
    open() {
      this.$refs.actionPopup.open();
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.needHead
  }, $props.needHead ? {
    b: common_vendor.t($props.title),
    c: common_vendor.o(($event) => $options.close()),
    d: common_vendor.p({
      customPrefix: "customicons",
      type: "closeempty",
      color: "#000000",
      size: "25"
    })
  } : {}, {
    e: $props.needCancelButton
  }, $props.needCancelButton ? {
    f: common_vendor.o(($event) => $options.close())
  } : {}, {
    g: common_vendor.sr("actionPopup", "38b86961-0"),
    h: common_vendor.p({
      backgroundColor: "#ffffff00",
      ["safe-area"]: true,
      type: "bottom"
    })
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/action-sheet/action-sheet.vue"]]);
wx.createComponent(Component);
