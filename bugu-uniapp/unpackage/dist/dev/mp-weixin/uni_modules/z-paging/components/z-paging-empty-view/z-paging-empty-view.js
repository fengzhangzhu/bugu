"use strict";
var uni_modules_zPaging_components_zPaging_js_zPagingStatic = require("../z-paging/js/z-paging-static.js");
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "z-paging-empty-view",
  data() {
    return {
      base64Empty: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Empty,
      base64Error: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Error
    };
  },
  props: {
    emptyViewText: {
      type: String,
      default: "\u6CA1\u6709\u6570\u636E\u54E6~"
    },
    emptyViewImg: {
      type: String,
      default: ""
    },
    showEmptyViewReload: {
      type: Boolean,
      default: false
    },
    emptyViewReloadText: {
      type: String,
      default: "\u91CD\u65B0\u52A0\u8F7D"
    },
    isLoadFailed: {
      type: Boolean,
      default: false
    },
    emptyViewStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    emptyViewImgStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    emptyViewTitleStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    emptyViewReloadStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    emptyViewZIndex: {
      type: Number,
      default: 9
    },
    emptyViewFixed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    emptyImg() {
      return this.isLoadFailed ? this.base64Error : this.base64Empty;
    },
    finalEmptyViewStyle() {
      this.emptyViewStyle["z-index"] = this.emptyViewZIndex;
      return this.emptyViewStyle;
    }
  },
  methods: {
    reloadClick() {
      this.$emit("reload");
    },
    emptyViewClick() {
      this.$emit("viewClick");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.emptyViewImg.length
  }, !$props.emptyViewImg.length ? {
    b: common_vendor.s($props.emptyViewImgStyle),
    c: $options.emptyImg
  } : {
    d: common_vendor.s($props.emptyViewImgStyle),
    e: $props.emptyViewImg
  }, {
    f: common_vendor.t($props.emptyViewText),
    g: common_vendor.s($props.emptyViewTitleStyle),
    h: $props.showEmptyViewReload
  }, $props.showEmptyViewReload ? {
    i: common_vendor.t($props.emptyViewReloadText),
    j: common_vendor.s($props.emptyViewReloadStyle),
    k: common_vendor.o((...args) => $options.reloadClick && $options.reloadClick(...args))
  } : {}, {
    l: $props.emptyViewFixed ? 1 : "",
    m: common_vendor.s($options.finalEmptyViewStyle),
    n: common_vendor.o((...args) => $options.emptyViewClick && $options.emptyViewClick(...args))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a664708e"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/uni_modules/z-paging/components/z-paging-empty-view/z-paging-empty-view.vue"]]);
wx.createComponent(Component);
