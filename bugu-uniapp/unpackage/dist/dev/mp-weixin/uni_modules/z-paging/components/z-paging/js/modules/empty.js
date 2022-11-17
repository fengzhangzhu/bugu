"use strict";
var uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
const ZPEmptyView = {
  props: {
    hideEmptyView: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("hideEmptyView", false)
    },
    emptyViewText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewText", null)
    },
    showEmptyViewReload: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("showEmptyViewReload", false)
    },
    showEmptyViewReloadWhenError: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("showEmptyViewReloadWhenError", true)
    },
    emptyViewReloadText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewReloadText", null)
    },
    emptyViewImg: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewImg", "")
    },
    emptyViewErrorText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewErrorText", null)
    },
    emptyViewErrorImg: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewErrorImg", "")
    },
    emptyViewStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewStyle", {});
      }
    },
    emptyViewSuperStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewSuperStyle", {});
      }
    },
    emptyViewImgStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewImgStyle", {});
      }
    },
    emptyViewTitleStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewTitleStyle", {});
      }
    },
    emptyViewReloadStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewReloadStyle", {});
      }
    },
    emptyViewFixed: {
      type: Boolean,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewFixed", false);
      }
    },
    emptyViewCenter: {
      type: Boolean,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewCenter", true);
      }
    },
    autoHideEmptyViewWhenLoading: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHideEmptyViewWhenLoading", true)
    },
    autoHideEmptyViewWhenPull: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHideEmptyViewWhenPull", true)
    },
    emptyViewZIndex: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewZIndex", 9)
    }
  },
  computed: {
    finalEmptyViewImg() {
      return this.isLoadFailed ? this.emptyViewErrorImg : this.emptyViewImg;
    },
    finalShowEmptyViewReload() {
      return this.isLoadFailed ? this.showEmptyViewReloadWhenError : this.showEmptyViewReload;
    },
    showEmpty() {
      if (this.refresherOnly || this.hideEmptyView || this.totalData.length)
        return false;
      if (this.autoHideEmptyViewWhenLoading) {
        if (this.isAddedData && !this.firstPageLoaded && !this.loading)
          return true;
      } else {
        return true;
      }
      if (!this.autoHideEmptyViewWhenPull && !this.isUserReload)
        return true;
      return false;
    }
  },
  methods: {
    _emptyViewReload() {
      let callbacked = false;
      this.$emit("emptyViewReload", (reload) => {
        if (reload === void 0 || reload === true) {
          this.fromEmptyViewReload = true;
          this.reload();
        }
        callbacked = true;
      });
      this.$nextTick(() => {
        if (!callbacked) {
          this.fromEmptyViewReload = true;
          this.reload();
        }
      });
    },
    _emptyViewClick() {
      this.$emit("emptyViewClick");
    }
  }
};
exports.ZPEmptyView = ZPEmptyView;
