"use strict";
var common_vendor = require("../../../../common/vendor.js");
const statusBar = () => "./uni-status-bar.js";
const _sfc_main = {
  name: "UniNavBar",
  components: {
    statusBar
  },
  emits: ["clickLeft", "clickRight", "clickTitle"],
  props: {
    title: {
      type: String,
      default: ""
    },
    leftText: {
      type: String,
      default: ""
    },
    rightText: {
      type: String,
      default: ""
    },
    leftIcon: {
      type: String,
      default: ""
    },
    rightIcon: {
      type: String,
      default: ""
    },
    fixed: {
      type: [Boolean, String],
      default: false
    },
    color: {
      type: String,
      default: "#000000"
    },
    backgroundColor: {
      type: String,
      default: "#FFFFFF"
    },
    statusBar: {
      type: [Boolean, String],
      default: false
    },
    shadow: {
      type: [Boolean, String],
      default: false
    },
    border: {
      type: [Boolean, String],
      default: true
    }
  },
  mounted() {
    if (common_vendor.index.report && this.title !== "") {
      common_vendor.index.report("title", this.title);
    }
  },
  methods: {
    onClickLeft() {
      this.$emit("clickLeft");
    },
    onClickRight() {
      this.$emit("clickRight");
    },
    onClickTitle() {
      this.$emit("clickTitle");
    }
  }
};
if (!Array) {
  const _easycom_status_bar2 = common_vendor.resolveComponent("status-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_status_bar2 + _easycom_uni_icons2)();
}
const _easycom_status_bar = () => "../../../../components/status-bar/status-bar.js";
const _easycom_uni_icons = () => "../../../uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_status_bar + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.statusBar
  }, $props.statusBar ? {} : {}, {
    b: $props.leftIcon.length
  }, $props.leftIcon.length ? {
    c: common_vendor.p({
      color: $props.color,
      type: $props.leftIcon,
      size: "22",
      color: "#333"
    })
  } : {}, {
    d: $props.leftText.length
  }, $props.leftText.length ? {
    e: common_vendor.t($props.leftText),
    f: $props.color,
    g: !$props.leftIcon.length ? 1 : ""
  } : {}, {
    h: common_vendor.o((...args) => $options.onClickLeft && $options.onClickLeft(...args)),
    i: $props.title.length
  }, $props.title.length ? {
    j: common_vendor.t($props.title),
    k: $props.color
  } : {}, {
    l: common_vendor.o((...args) => $options.onClickTitle && $options.onClickTitle(...args)),
    m: $props.rightIcon.length
  }, $props.rightIcon.length ? {
    n: common_vendor.p({
      color: $props.color,
      type: $props.rightIcon,
      size: "22"
    })
  } : {}, {
    o: $props.rightText.length && !$props.rightIcon.length
  }, $props.rightText.length && !$props.rightIcon.length ? {
    p: common_vendor.t($props.rightText)
  } : {}, {
    q: common_vendor.n($props.title.length ? "uni-navbar__header-btns-right" : ""),
    r: common_vendor.o((...args) => $options.onClickRight && $options.onClickRight(...args)),
    s: $props.color,
    t: $props.backgroundColor,
    v: $props.fixed ? 1 : "",
    w: $props.shadow ? 1 : "",
    x: $props.border ? 1 : "",
    y: $props.backgroundColor,
    z: $props.fixed
  }, $props.fixed ? common_vendor.e({
    A: $props.statusBar
  }, $props.statusBar ? {} : {}) : {});
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6bda1a90"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue"]]);
wx.createComponent(Component);
