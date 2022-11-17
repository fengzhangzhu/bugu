"use strict";
var common_vendor = require("../../../../../common/vendor.js");
var uni_modules_zPaging_components_zPaging_js_zPagingStatic = require("../js/z-paging-static.js");
var uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../js/z-paging-utils.js");
var uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("../js/z-paging-enum.js");
require("../js/z-paging-i18n.js");
require("../js/z-paging-config.js");
require("../config/index.js");
const systemInfo = common_vendor.index.getSystemInfoSync();
const _sfc_main = {
  name: "z-paging-refresh",
  data() {
    return {
      R: uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher,
      systemInfo,
      base64Arrow: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Arrow,
      base64ArrowWhite: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64ArrowWhite,
      base64Flower: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Flower,
      base64FlowerWhite: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64FlowerWhite,
      base64Success: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Success,
      base64SuccessWhite: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64SuccessWhite,
      refresherTimeText: "",
      leftImageLoaded: false
    };
  },
  props: {
    "status": {
      default: uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Default
    },
    "defaultThemeStyle": {},
    "defaultText": "",
    "pullingText": "",
    "refreshingText": "",
    "completeText": "",
    "defaultImg": "",
    "pullingImg": "",
    "refreshingImg": "",
    "completeImg": "",
    "showUpdateTime": {
      default: false
    },
    "updateTimeKey": "",
    "imgStyle": {
      default: {}
    },
    "titleStyle": {
      default: {}
    },
    "updateTimeStyle": {
      default: {}
    }
  },
  computed: {
    statusTextArr() {
      this.updateTime(this.updateTimeKey);
      return [this.defaultText, this.pullingText, this.refreshingText, this.completeText];
    },
    currentTitle() {
      return this.statusTextArr[this.status] || this.defaultText;
    },
    leftImageClass() {
      if (this.status === this.R.Complete) {
        return "zp-r-left-image-no-transform zp-r-left-image-pre-size";
      }
      let cls = "zp-r-left-image ";
      if (this.status === this.R.Default) {
        if (this.leftImageLoaded) {
          cls += "zp-r-arrow-down";
        } else {
          this.leftImageLoaded = true;
          cls += "zp-r-arrow-down-no-duration";
        }
      } else {
        cls += "zp-r-arrow-top";
      }
      return cls + " zp-r-left-image-pre-size";
    },
    leftImageStyle() {
      const showUpdateTime = this.showUpdateTime;
      const size = showUpdateTime ? "36rpx" : "30rpx";
      return { width: size, height: size, "margin-right": showUpdateTime ? "20rpx" : "9rpx" };
    },
    leftImageSrc() {
      const R = this.R;
      const status = this.status;
      const isWhite = this.defaultThemeStyle === "white";
      if (status === R.Default) {
        if (!!this.defaultImg)
          return this.defaultImg;
        return isWhite ? this.base64ArrowWhite : this.base64Arrow;
      } else if (status === R.ReleaseToRefresh) {
        if (!!this.pullingImg)
          return this.pullingImg;
        if (!!this.defaultImg)
          return this.defaultImg;
        return isWhite ? this.base64ArrowWhite : this.base64Arrow;
      } else if (status === R.Loading) {
        if (!!this.refreshingImg)
          return this.refreshingImg;
        return isWhite ? this.base64FlowerWhite : this.base64Flower;
      } else if (status === R.Complete) {
        if (!!this.completeImg)
          return this.completeImg;
        return isWhite ? this.base64SuccessWhite : this.base64Success;
      }
      return "";
    },
    rightTextStyle() {
      let stl = {};
      let color = "#555555";
      if (this.defaultThemeStyle === "white") {
        color = "#efefef";
      }
      stl["color"] = color;
      return stl;
    }
  },
  methods: {
    updateTime(updateTimeKey) {
      if (!updateTimeKey) {
        updateTimeKey = this.updateTimeKey;
      }
      if (this.showUpdateTime) {
        this.refresherTimeText = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getRefesrherFormatTimeByKey(updateTimeKey);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.status !== $data.R.Loading
  }, $props.status !== $data.R.Loading ? {
    b: common_vendor.n($options.leftImageClass),
    c: common_vendor.s($options.leftImageStyle),
    d: common_vendor.s($props.imgStyle),
    e: $options.leftImageSrc
  } : {
    f: common_vendor.s($options.leftImageStyle),
    g: common_vendor.s($props.imgStyle),
    h: $options.leftImageSrc
  }, {
    i: common_vendor.t($options.currentTitle),
    j: common_vendor.s($options.rightTextStyle),
    k: common_vendor.s($props.titleStyle),
    l: $props.showUpdateTime && $data.refresherTimeText.length
  }, $props.showUpdateTime && $data.refresherTimeText.length ? {
    m: common_vendor.t($data.refresherTimeText),
    n: common_vendor.s($options.rightTextStyle),
    o: common_vendor.s($props.updateTimeStyle)
  } : {}, {
    p: common_vendor.n($props.showUpdateTime ? "zp-r-container zp-r-container-padding" : "zp-r-container")
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9e33a538"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/uni_modules/z-paging/components/z-paging/components/z-paging-refresh.vue"]]);
wx.createComponent(Component);
