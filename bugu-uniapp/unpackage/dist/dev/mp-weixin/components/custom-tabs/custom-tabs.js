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
  name: "tabs",
  props: {
    index: {
      type: Number,
      default: 0
    },
    tabPadding: {
      type: Number,
      default: 20
    },
    scrollY: {
      type: Boolean,
      default: false
    },
    flex: {
      type: Boolean,
      default: false
    },
    borderBottom: {
      type: Boolean,
      default: false
    },
    defaultColor: {
      type: String,
      default: "#AAAAAA"
    },
    activeColor: {
      type: String,
      default: "#FFF"
    }
  },
  emits: ["changeIndex"],
  setup(props, context) {
    const data = common_vendor.reactive({
      tabList: [],
      tabIndex: props.index ? +props.index : 0,
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
    common_vendor.index.$on("getTabLabel", (val) => {
      data.tabList.push(val);
      if (data.timeId)
        clearTimeout(data.timeId);
      data.timeId = setTimeout(() => {
        common_vendor.index.$off("getTabLabel");
      }, 1e3);
    });
    setTimeout(() => {
      data.scrollId = `tab_${props.index - 1}`;
    }, 100);
    return __spreadProps(__spreadValues({}, common_vendor.toRefs(data)), {
      tabChange
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(_ctx.tabList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: _ctx.tabIndex === index ? 1 : "",
        c: `tab_${index}`,
        d: _ctx.tabIndex === index ? $props.activeColor : $props.defaultColor,
        e: index,
        f: common_vendor.o(($event) => $setup.tabChange(index), index)
      };
    }),
    b: `0 ${$props.tabPadding}rpx`,
    c: common_vendor.n("tab-bar-flex-" + $props.flex),
    d: common_vendor.n("tab-bar-borde-bottom" + $props.borderBottom),
    e: _ctx.scrollId,
    f: `translateX(${_ctx.translateX}%)`,
    g: `transform ${_ctx.transition}s ease-in-out`,
    h: common_vendor.n("tab-scrollY-" + $props.scrollY)
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ddf99b8c"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/custom-tabs/custom-tabs.vue"]]);
wx.createComponent(Component);
