"use strict";
var uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
const ZPBackToTop = {
  props: {
    autoShowBackToTop: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoShowBackToTop", false)
    },
    backToTopThreshold: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("backToTopThreshold", "400rpx")
    },
    backToTopImg: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("backToTopImg", "")
    },
    backToTopWithAnimate: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("backToTopWithAnimate", true)
    },
    backToTopBottom: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("backToTopBottom", "160rpx")
    },
    backToTopStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("backToTopStyle", {});
      }
    },
    enableBackToTop: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("enableBackToTop", true)
    }
  },
  data() {
    return {
      backToTopClass: "zp-back-to-top zp-back-to-top-hide",
      lastBackToTopShowTime: 0,
      showBackToTopClass: false
    };
  },
  computed: {
    finalEnableBackToTop() {
      return this.usePageScroll ? false : this.enableBackToTop;
    },
    finalBackToTopThreshold() {
      return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.convertTextToPx(this.backToTopThreshold);
    },
    finalBackToTopStyle() {
      let tempBackToTopStyle = this.backToTopStyle;
      if (!tempBackToTopStyle.bottom) {
        tempBackToTopStyle.bottom = this.windowBottom + uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.convertTextToPx(this.backToTopBottom) + "px";
      }
      if (!tempBackToTopStyle.position) {
        tempBackToTopStyle.position = this.usePageScroll ? "fixed" : "absolute";
      }
      return tempBackToTopStyle;
    }
  },
  methods: {
    _backToTopClick() {
      !this.backToTopWithAnimate && this._checkShouldShowBackToTop(1, 0);
      this.scrollToTop(this.backToTopWithAnimate);
    },
    _checkShouldShowBackToTop(newVal, oldVal) {
      if (!this.autoShowBackToTop) {
        this.showBackToTopClass = false;
        return;
      }
      if (newVal !== oldVal) {
        if (newVal > this.finalBackToTopThreshold) {
          if (!this.showBackToTopClass) {
            this.showBackToTopClass = true;
            this.lastBackToTopShowTime = new Date().getTime();
            setTimeout(() => {
              this.backToTopClass = "zp-back-to-top zp-back-to-top-show";
            }, 300);
          }
        } else {
          if (this.showBackToTopClass) {
            const currentTime = new Date().getTime();
            let dalayTime = 300;
            if (currentTime - this.lastBackToTopShowTime < 500) {
              dalayTime = 0;
            }
            this.backToTopClass = "zp-back-to-top zp-back-to-top-hide";
            setTimeout(() => {
              this.showBackToTopClass = false;
            }, dalayTime);
          }
        }
      }
    }
  }
};
exports.ZPBackToTop = ZPBackToTop;
