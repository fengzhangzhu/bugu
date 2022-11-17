"use strict";
var utils_dateUtils = require("../../utils/dateUtils.js");
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "user-message-item",
  props: {
    badgeNumber: {
      type: Number,
      default: 0
    },
    avatar: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  computed: {
    lastTime() {
      return utils_dateUtils.GettimeifferenceOfNow(this.time).Detailed;
    }
  },
  data() {
    return {};
  },
  methods: {
    onClick() {
      this.$emit("onClick");
    },
    onMoreClick() {
      this.$emit("onMoreClick");
    }
  }
};
if (!Array) {
  const _component_Text = common_vendor.resolveComponent("Text");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_component_Text + _easycom_uni_icons2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.avatar,
    b: common_vendor.t($props.title),
    c: $props.badgeNumber > 0
  }, $props.badgeNumber > 0 ? {
    d: common_vendor.t($props.badgeNumber > 99 ? "\xB7\xB7\xB7" : $props.badgeNumber)
  } : {}, {
    e: common_vendor.p({
      customPrefix: "customicons",
      type: "right",
      color: "#a3a3a3",
      size: "16"
    }),
    f: common_vendor.o(($event) => $options.onClick())
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/interactive-message/interactive-message.vue"]]);
wx.createComponent(Component);
