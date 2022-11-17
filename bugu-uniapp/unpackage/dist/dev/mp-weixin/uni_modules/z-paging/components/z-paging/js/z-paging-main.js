"use strict";
var common_vendor = require("../../../../../common/vendor.js");
var uni_modules_zPaging_components_zPaging_js_zPagingStatic = require("./z-paging-static.js");
var uni_modules_zPaging_components_zPaging_js_zPagingConstant = require("./z-paging-constant.js");
var uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("./z-paging-utils.js");
var uni_modules_zPaging_components_zPaging_js_modules_dataHandle = require("./modules/data-handle.js");
var uni_modules_zPaging_components_zPaging_js_modules_i18n = require("./modules/i18n.js");
var uni_modules_zPaging_components_zPaging_js_modules_nvue = require("./modules/nvue.js");
var uni_modules_zPaging_components_zPaging_js_modules_empty = require("./modules/empty.js");
var uni_modules_zPaging_components_zPaging_js_modules_refresher = require("./modules/refresher.js");
var uni_modules_zPaging_components_zPaging_js_modules_loadMore = require("./modules/load-more.js");
var uni_modules_zPaging_components_zPaging_js_modules_loading = require("./modules/loading.js");
var uni_modules_zPaging_components_zPaging_js_modules_scroller = require("./modules/scroller.js");
var uni_modules_zPaging_components_zPaging_js_modules_backToTop = require("./modules/back-to-top.js");
var uni_modules_zPaging_components_zPaging_js_modules_virtualList = require("./modules/virtual-list.js");
var uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("./z-paging-enum.js");
const zPagingRefresh = () => "../components/z-paging-refresh.js";
const zPagingLoadMore = () => "../components/z-paging-load-more.js";
const zPagingEmptyView = () => "../../z-paging-empty-view/z-paging-empty-view.js";
const systemInfo = common_vendor.index.getSystemInfoSync();
var _sfc_main = {
  name: "z-paging",
  components: {
    zPagingRefresh,
    zPagingLoadMore,
    zPagingEmptyView
  },
  mixins: [
    uni_modules_zPaging_components_zPaging_js_modules_dataHandle.ZPData,
    uni_modules_zPaging_components_zPaging_js_modules_i18n.ZPI18n,
    uni_modules_zPaging_components_zPaging_js_modules_nvue.ZPNvue,
    uni_modules_zPaging_components_zPaging_js_modules_empty.ZPEmptyView,
    uni_modules_zPaging_components_zPaging_js_modules_refresher.ZPRefresher,
    uni_modules_zPaging_components_zPaging_js_modules_loadMore.ZPLoadMore,
    uni_modules_zPaging_components_zPaging_js_modules_loading.ZPLoading,
    uni_modules_zPaging_components_zPaging_js_modules_scroller.ZPScroller,
    uni_modules_zPaging_components_zPaging_js_modules_backToTop.ZPBackToTop,
    uni_modules_zPaging_components_zPaging_js_modules_virtualList.ZPVirtualList
  ],
  data() {
    return {
      base64Arrow: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Arrow,
      base64Flower: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Flower,
      base64BackToTop: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64BackToTop,
      loadingType: uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.Refresher,
      requestTimeStamp: 0,
      chatRecordLoadingMoreText: "",
      wxsPropType: "",
      renderPropScrollTop: -1,
      checkScrolledToBottomTimeOut: null,
      systemInfo: null,
      cssSafeAreaInsetBottom: -1,
      cacheTopHeight: -1,
      insideOfPaging: -1,
      isLoadFailed: false,
      isIos: systemInfo.platform === "ios",
      disabledBounce: false,
      fromCompleteEmit: false,
      disabledCompleteEmit: false,
      wxsIsScrollTopInTopRange: true,
      wxsScrollTop: 0,
      wxsPageScrollTop: 0,
      wxsOnPullingDown: false
    };
  },
  props: {
    delay: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("delay", 0)
    },
    minDelay: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("minDelay", 0)
    },
    pagingStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("pagingStyle", {});
      }
    },
    height: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("height", "")
    },
    width: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("width", "")
    },
    bgColor: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("bgColor", "")
    },
    pagingContentStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("pagingContentStyle", {});
      }
    },
    autoHeight: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHeight", false)
    },
    autoHeightAddition: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHeightAddition", "0px")
    },
    defaultThemeStyle: {
      type: String,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("defaultThemeStyle", "black");
      }
    },
    fixed: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("fixed", true)
    },
    safeAreaInsetBottom: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("safeAreaInsetBottom", false)
    },
    useSafeAreaPlaceholder: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("useSafeAreaPlaceholder", false)
    },
    topZIndex: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("topZIndex", 99)
    },
    superContentZIndex: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("superContentZIndex", 1)
    },
    contentZIndex: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("contentZIndex", 10)
    },
    autoFullHeight: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoFullHeight", true)
    },
    watchTouchDirectionChange: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("watchTouchDirectionChange", false)
    },
    showConsoleError: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("showConsoleError", true)
    }
  },
  created() {
    if (this.createdReload && !this.refresherOnly && (this.mountedAutoCallReload && this.auto)) {
      this._startLoading();
      this._preReload();
    }
  },
  mounted() {
    this.wxsPropType = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime().toString();
    this.renderJsIgnore;
    if (!this.createdReload && !this.refresherOnly && (this.mountedAutoCallReload && this.auto)) {
      this.$nextTick(() => {
        this._preReload();
      });
    }
    this.finalUseCache && this._setListByLocalCache();
    let delay = 0;
    delay = 100;
    this.$nextTick(() => {
      this.systemInfo = common_vendor.index.getSystemInfoSync();
      if (!this.usePageScroll && this.autoHeight) {
        this._setAutoHeight();
      }
      this.loaded = true;
    });
    this.updatePageScrollTopHeight();
    this.updatePageScrollBottomHeight();
    this._updateLeftAndRightWidth();
    if (this.finalRefresherEnabled && this.useCustomRefresher) {
      this.$nextTick(() => {
        this.isTouchmoving = true;
      });
    }
    this._onEmit();
    this.finalUseVirtualList && this._virtualListInit();
    this.$nextTick(() => {
      setTimeout(() => {
        this._getCssSafeAreaInsetBottom();
      }, delay);
    });
  },
  destroyed() {
    this._offEmit();
  },
  unmounted() {
    this._offEmit();
  },
  watch: {
    defaultThemeStyle: {
      handler(newVal) {
        if (newVal.length) {
          this.finalRefresherDefaultStyle = newVal;
        }
      },
      immediate: true
    },
    autoHeight(newVal, oldVal) {
      if (this.loaded && !this.usePageScroll) {
        this._setAutoHeight(newVal);
      }
    },
    autoHeightAddition(newVal, oldVal) {
      if (this.loaded && !this.usePageScroll && this.autoHeight) {
        this._setAutoHeight(newVal);
      }
    }
  },
  computed: {
    finalPagingStyle() {
      const pagingStyle = this.pagingStyle;
      if (!this.systemInfo)
        return pagingStyle;
      const windowTop = this.windowTop;
      const windowBottom = this.windowBottom;
      if (!this.usePageScroll && this.fixed) {
        if (windowTop && !pagingStyle.top) {
          pagingStyle.top = windowTop + "px";
        }
        if (windowBottom && !pagingStyle.bottom) {
          pagingStyle.bottom = windowBottom + "px";
        }
      }
      if (this.bgColor.length && !pagingStyle["background"]) {
        pagingStyle["background"] = this.bgColor;
      }
      if (this.height.length && !pagingStyle["height"]) {
        pagingStyle["height"] = this.height;
      }
      if (this.width.length && !pagingStyle["width"]) {
        pagingStyle["width"] = this.width;
      }
      return pagingStyle;
    },
    finalLowerThreshold() {
      return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.convertTextToPx(this.lowerThreshold);
    },
    finalPagingContentStyle() {
      if (this.contentZIndex != 1) {
        this.pagingContentStyle["z-index"] = this.contentZIndex;
        this.pagingContentStyle["position"] = "relative";
      }
      return this.pagingContentStyle;
    },
    safeAreaBottom() {
      if (!this.systemInfo)
        return 0;
      let safeAreaBottom = 0;
      safeAreaBottom = this.cssSafeAreaInsetBottom === -1 ? 0 : this.cssSafeAreaInsetBottom;
      return safeAreaBottom;
    },
    renderJsIgnore() {
      if (this.usePageScroll && this.useChatRecordMode || !this.refresherEnabled || !this.useCustomRefresher) {
        this.$nextTick(() => {
          this.renderPropScrollTop = 10;
        });
      }
      return 0;
    },
    windowHeight() {
      return !this.systemInfo ? 0 : this.systemInfo.windowHeight || 0;
    },
    windowTop() {
      return !this.systemInfo ? 0 : this.systemInfo.windowTop || 0;
    },
    windowBottom() {
      if (!this.systemInfo)
        return 0;
      let windowBottom = this.systemInfo.windowBottom || 0;
      if (this.safeAreaInsetBottom && !this.useSafeAreaPlaceholder) {
        windowBottom += this.safeAreaBottom;
      }
      return windowBottom;
    },
    isOldWebView() {
      try {
        const systemInfos = systemInfo.system.split(" ");
        const deviceType = systemInfos[0];
        const version = parseInt(systemInfos[1].slice(0, 1));
        if (deviceType === "iOS" && version <= 10 || deviceType === "Android" && version <= 6) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    isIosAndH5() {
      return false;
    }
  },
  methods: {
    getVersion() {
      return `z-paging v${zConstant.version}`;
    },
    setSpecialEffects(args) {
      this.setListSpecialEffects(args);
    },
    setListSpecialEffects(args) {
      this.nFixFreezing = args && Object.keys(args).length;
      if (this.isIos) {
        this.privateRefresherEnabled = 0;
      }
      if (!this.usePageScroll) {
        this.$refs["zp-n-list"].setSpecialEffects(args);
      }
    },
    _doCheckScrollViewShouldFullHeight(totalData) {
      if (this.autoFullHeight && this.usePageScroll && this.isTotalChangeFromAddData) {
        this.$nextTick(() => {
          this._checkScrollViewShouldFullHeight((scrollViewNode, pagingContainerNode) => {
            this._preCheckShowLoadingMoreWhenNoMoreAndInsideOfPaging(totalData, scrollViewNode, pagingContainerNode);
          });
        });
      } else {
        this._preCheckShowLoadingMoreWhenNoMoreAndInsideOfPaging(totalData);
      }
    },
    async _checkScrollViewShouldFullHeight(callback) {
      try {
        const scrollViewNode = await this._getNodeClientRect(".zp-scroll-view");
        const pagingContainerNode = await this._getNodeClientRect(".zp-paging-container-content");
        if (!scrollViewNode || !pagingContainerNode)
          return;
        const scrollViewHeight = pagingContainerNode[0].height;
        const scrollViewTop = scrollViewNode[0].top;
        if (this.isAddedData && scrollViewHeight + scrollViewTop <= this.windowHeight) {
          this._setAutoHeight(true, scrollViewNode);
          callback(scrollViewNode, pagingContainerNode);
        } else {
          this._setAutoHeight(false);
          callback(null, null);
        }
      } catch (e) {
        callback(null, null);
      }
    },
    async _setAutoHeight(shouldFullHeight = true, scrollViewNode = null) {
      let heightKey = "height";
      if (this.usePageScroll) {
        heightKey = "min-height";
      }
      try {
        if (shouldFullHeight) {
          let finalScrollViewNode = scrollViewNode ? scrollViewNode : await this._getNodeClientRect(".scroll-view");
          let finalScrollBottomNode = await this._getNodeClientRect(".zp-page-bottom");
          if (finalScrollViewNode) {
            const scrollViewTop = finalScrollViewNode[0].top;
            let scrollViewHeight = this.windowHeight - scrollViewTop;
            if (finalScrollBottomNode) {
              scrollViewHeight -= finalScrollBottomNode[0].height;
            }
            let additionHeight = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.convertTextToPx(this.autoHeightAddition);
            this.$set(this.scrollViewStyle, heightKey, scrollViewHeight + additionHeight - (this.insideMore ? 1 : 0) + "px");
            this.$set(this.scrollViewInStyle, heightKey, scrollViewHeight + additionHeight - (this.insideMore ? 1 : 0) + "px");
          }
        } else {
          this.$delete(this.scrollViewStyle, heightKey);
          this.$delete(this.scrollViewInStyle, heightKey);
        }
      } catch (e) {
      }
    },
    _getCssSafeAreaInsetBottom() {
      this._getNodeClientRect(".zp-safe-area-inset-bottom").then((res) => {
        if (res) {
          this.cssSafeAreaInsetBottom = res[0].height;
          if (this.safeAreaInsetBottom) {
            this.updatePageScrollBottomHeight();
          }
        }
      });
    },
    _updateInsideOfPaging() {
      if (this.insideMore && this.insideOfPaging === true) {
        setTimeout(() => {
          this.doLoadMore();
        }, 200);
      }
    },
    _getNodeClientRect(select, inThis = true, scrollOffset = false) {
      let res = inThis ? common_vendor.index.createSelectorQuery().in(this) : common_vendor.index.createSelectorQuery();
      if (scrollOffset) {
        res.select(select).scrollOffset();
      } else {
        res.select(select).boundingClientRect();
      }
      return new Promise((resolve, reject) => {
        res.exec((data) => {
          resolve(data && data != "" && data != void 0 && data.length ? data : false);
        });
      });
    },
    _cleanTimeout(timeout) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      return timeout;
    },
    _onEmit() {
      common_vendor.index.$on(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.i18nUpdateKey, () => {
        this.tempLanguageUpdateKey = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime();
      });
      common_vendor.index.$on(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.errorUpdateKey, () => {
        if (this.loading) {
          this.complete(false);
        }
      });
      common_vendor.index.$on(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.completeUpdateKey, (data) => {
        setTimeout(() => {
          if (this.loading) {
            if (!this.disabledCompleteEmit) {
              const type = data.type || "normal";
              const list = data.list || data;
              const rule = data.rule;
              this.fromCompleteEmit = true;
              switch (type) {
                case "normal":
                  this.complete(list);
                  break;
                case "total":
                  this.completeByTotal(list, rule);
                  break;
                case "nomore":
                  this.completeByNoMore(list, rule);
                  break;
                case "key":
                  this.completeByKey(list, rule);
                  break;
              }
            } else {
              this.disabledCompleteEmit = false;
            }
          }
        }, 1);
      });
    },
    _offEmit() {
      common_vendor.index.$off(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.i18nUpdateKey);
      common_vendor.index.$off(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.errorUpdateKey);
      common_vendor.index.$off(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.completeUpdateKey);
    }
  }
};
exports._sfc_main = _sfc_main;
