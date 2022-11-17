"use strict";
var uni_modules_zPaging_components_zPaging_js_zPagingStatic = require("../js/z-paging-static.js");
var uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("../js/z-paging-enum.js");
var common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "z-paging-load-more",
  data() {
    return {
      M: uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More,
      base64Arrow: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Arrow,
      base64Flower: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Flower,
      base64FlowerWhite: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64FlowerWhite
    };
  },
  props: ["zConfig"],
  computed: {
    ownLoadingMoreText() {
      return this.statusTextArr[this.finalStatus];
    },
    statusTextArr() {
      return [this.zConfig.defaultText, this.zConfig.loadingText, this.zConfig.noMoreText, this.zConfig.failText];
    },
    finalStatus() {
      if (this.zConfig.defaultAsLoading && this.zConfig.status === this.M.Default)
        return this.M.Loading;
      return this.zConfig.status;
    }
  },
  methods: {
    doClick() {
      this.$emit("doClick");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.zConfig.hideContent
  }, !$props.zConfig.hideContent ? common_vendor.e({
    b: $props.zConfig.showNoMoreLine && $options.finalStatus === $data.M.NoMore
  }, $props.zConfig.showNoMoreLine && $options.finalStatus === $data.M.NoMore ? {
    c: common_vendor.n($props.zConfig.defaultThemeStyle === "white" ? "zp-l-line zp-l-line-white" : "zp-l-line zp-l-line-black"),
    d: common_vendor.s($props.zConfig.noMoreLineCustomStyle)
  } : {}, {
    e: $options.finalStatus === $data.M.Loading && $props.zConfig.loadingIconCustomImage.length
  }, $options.finalStatus === $data.M.Loading && $props.zConfig.loadingIconCustomImage.length ? {
    f: $props.zConfig.loadingIconCustomImage,
    g: common_vendor.s($props.zConfig.iconCustomStyle),
    h: $props.zConfig.loadingAnimated ? 1 : ""
  } : {}, {
    i: $options.finalStatus === $data.M.Loading && $props.zConfig.loadingIconType === "flower" && !$props.zConfig.loadingIconCustomImage.length
  }, $options.finalStatus === $data.M.Loading && $props.zConfig.loadingIconType === "flower" && !$props.zConfig.loadingIconCustomImage.length ? {
    j: common_vendor.s($props.zConfig.iconCustomStyle),
    k: $props.zConfig.defaultThemeStyle === "white" ? $data.base64FlowerWhite : $data.base64Flower
  } : {}, {
    l: $options.finalStatus === $data.M.Loading && $props.zConfig.loadingIconType === "circle" && !$props.zConfig.loadingIconCustomImage.length
  }, $options.finalStatus === $data.M.Loading && $props.zConfig.loadingIconType === "circle" && !$props.zConfig.loadingIconCustomImage.length ? {
    m: common_vendor.n($props.zConfig.defaultThemeStyle === "white" ? "zp-l-line-loading-view zp-l-line-loading-view-white" : "zp-l-line-loading-view zp-l-line-loading-view-black"),
    n: common_vendor.s($props.zConfig.iconCustomStyle)
  } : {}, {
    o: common_vendor.t($options.ownLoadingMoreText),
    p: common_vendor.n($props.zConfig.defaultThemeStyle === "white" ? "zp-l-text zp-l-text-white" : "zp-l-text zp-l-text-black"),
    q: common_vendor.s($props.zConfig.titleCustomStyle),
    r: $props.zConfig.showNoMoreLine && $options.finalStatus === $data.M.NoMore
  }, $props.zConfig.showNoMoreLine && $options.finalStatus === $data.M.NoMore ? {
    s: common_vendor.n($props.zConfig.defaultThemeStyle === "white" ? "zp-l-line zp-l-line-white" : "zp-l-line zp-l-line-black"),
    t: common_vendor.s($props.zConfig.noMoreLineCustomStyle)
  } : {}) : {}, {
    v: common_vendor.s($props.zConfig.customStyle),
    w: common_vendor.o((...args) => $options.doClick && $options.doClick(...args))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ef0d5cb6"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/uni_modules/z-paging/components/z-paging/components/z-paging-load-more.vue"]]);
wx.createComponent(Component);
