"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "page-tabs",
  props: {
    index: {
      type: Number,
      default: 0
    },
    labels: {
      type: Array,
      default: []
    },
    flex: {
      type: Boolean,
      default: false
    },
    tabPadding: {
      type: Number,
      default: 20
    },
    borderBottom: {
      type: Boolean,
      default: false
    },
    activeColor: {
      type: String,
      default: "#000000"
    },
    defaultColor: {
      type: String,
      default: "#aaaaaa"
    },
    defaultFontSize: {
      type: Number,
      default: 16
    },
    activeFontSize: {
      type: Number,
      default: 16
    },
    underLineType: {
      type: String,
      default: "default"
    }
  },
  emits: ["changeIndex"],
  setup(props, context) {
    console.log(props.index);
    const data = common_vendor.reactive({
      tabList: props.labels ? props.labels : ["\u9ED8\u8BA4"],
      translateX: -100 * +props.index,
      transition: props.animation === false ? 0 : 0.2,
      scrollId: "tab_0",
      tabPadding: props.tabPadding ? props.tabPadding : 20
    });
    const tabChange = (index) => {
      if (data.tabIndex == index)
        return false;
      data.tabIndex = index;
      data.translateX = -100 * data.tabIndex;
      data.scrollId = `tab_${index - 1}`;
      context.emit("changeIndex", index);
    };
    setTimeout(() => {
      data.scrollId = `tab_${props.index - 1}`;
    }, 100);
    return __spreadProps(__spreadValues({}, common_vendor.toRefs(data)), {
      tabChange
    });
  },
  computed: {
    tabIndex() {
      return this.index ? +this.index : 0;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(_ctx.tabList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.title),
        b: item.badge
      }, item.badge ? {
        c: common_vendor.t(item.badge < 100 ? item.badge : "99+"),
        d: item.badge < 10 ? "-5rpx" : item.badge < 100 ? "-10rpx" : "-20rpx"
      } : {}, {
        e: common_vendor.n($options.tabIndex === index ? "active underline-" + $props.underLineType : ""),
        f: `tab_${index}`,
        g: $options.tabIndex === index ? $props.activeColor : $props.defaultColor,
        h: $options.tabIndex === index ? $props.activeFontSize + "px" : $props.defaultFontSize + "px",
        i: index,
        j: common_vendor.o(($event) => $setup.tabChange(index), index)
      });
    }),
    b: `0 ${$props.tabPadding}rpx`,
    c: common_vendor.n("tab-bar-flex-" + $props.flex),
    d: common_vendor.n("tab-bar-borde-bottom" + $props.borderBottom),
    e: _ctx.scrollId
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cad0fb84"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/page-tabs/page-tabs.vue"]]);
wx.createComponent(Component);
