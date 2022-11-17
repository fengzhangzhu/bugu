"use strict";
var common_vendor = require("../../../../../../common/vendor.js");
var uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
var uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("../z-paging-enum.js");
const ZPLoading = {
  props: {
    autoHideLoadingAfterFirstLoaded: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHideLoadingAfterFirstLoaded", true)
    },
    loadingFullFixed: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("loadingFullFixed", false)
    },
    autoShowSystemLoading: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoShowSystemLoading", false)
    },
    systemLoadingMask: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("systemLoadingMask", true)
    },
    systemLoadingText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("systemLoadingText", null)
    }
  },
  data() {
    return {
      loading: false,
      loadingForNow: false
    };
  },
  watch: {
    loadingStatus(newVal, oldVal) {
      this.$emit("loadingStatusChange", newVal);
      this.$nextTick(() => {
        this.loadingStatusAfterRender = newVal;
      });
    },
    loading(newVal) {
      if (newVal) {
        this.loadingForNow = newVal;
      }
    }
  },
  computed: {
    showLoading() {
      let res = false;
      if (this.firstPageLoaded || !this.loading || !this.loadingForNow)
        return false;
      if (this.autoHideLoadingAfterFirstLoaded) {
        res = this.fromEmptyViewReload ? true : !this.pagingLoaded;
      } else {
        res = this.loadingType === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.Refresher;
      }
      if (this.finalShowSystemLoading) {
        common_vendor.index.showLoading({
          title: this.finalSystemLoadingText,
          mask: this.systemLoadingMask
        });
      }
      return res;
    },
    finalShowSystemLoading() {
      return this.autoShowSystemLoading && this.loadingType === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.Refresher;
    }
  },
  methods: {
    _startLoading(isReload = false) {
      if (this.showLoadingMoreWhenReload && !this.isUserPullDown || !isReload) {
        this.loadingStatus = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More.Loading;
      }
      this.loading = true;
    },
    _endSystemLoadingAndRefresh() {
      this.finalShowSystemLoading && common_vendor.index.hideLoading();
      !this.useCustomRefresher && common_vendor.index.stopPullDownRefresh();
    }
  }
};
exports.ZPLoading = ZPLoading;
