"use strict";
var common_vendor = require("../../../../../../common/vendor.js");
var uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
var uni_modules_zPaging_components_zPaging_js_zPagingConstant = require("../z-paging-constant.js");
var uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("../z-paging-enum.js");
const ZPRefresher = {
  props: {
    refresherThemeStyle: {
      type: String,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherThemeStyle", "");
      }
    },
    refresherImgStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherImgStyle", {});
      }
    },
    refresherTitleStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherTitleStyle", {});
      }
    },
    refresherUpdateTimeStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherUpdateTimeStyle", {});
      }
    },
    watchRefresherTouchmove: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("watchRefresherTouchmove", false)
    },
    loadingMoreThemeStyle: {
      type: String,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("loadingMoreThemeStyle", "");
      }
    },
    refresherOnly: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherOnly", false)
    },
    refresherDefaultDuration: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherDefaultDuration", 100)
    },
    refresherCompleteDelay: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherCompleteDelay", 0)
    },
    refresherCompleteDuration: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherCompleteDuration", 300)
    },
    refresherCompleteScrollable: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherCompleteScrollable", false)
    },
    useCustomRefresher: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("useCustomRefresher", true)
    },
    refresherFps: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherFps", 40)
    },
    refresherMaxAngle: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherMaxAngle", 40)
    },
    refresherAngleEnableChangeContinued: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherAngleEnableChangeContinued", false)
    },
    refresherDefaultText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherDefaultText", null)
    },
    refresherPullingText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherPullingText", null)
    },
    refresherRefreshingText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherRefreshingText", null)
    },
    refresherCompleteText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherCompleteText", null)
    },
    refresherDefaultImg: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherDefaultImg", null)
    },
    refresherPullingImg: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherPullingImg", null)
    },
    refresherRefreshingImg: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherRefreshingImg", null)
    },
    refresherCompleteImg: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherCompleteImg", null)
    },
    refresherEndBounceEnabled: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherEndBounceEnabled", true)
    },
    refresherEnabled: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherEnabled", true)
    },
    refresherThreshold: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherThreshold", "80rpx")
    },
    refresherDefaultStyle: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherDefaultStyle", "black")
    },
    refresherBackground: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherBackground", "transparent")
    },
    refresherFixedBackground: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherFixedBackground", "transparent")
    },
    refresherFixedBacHeight: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherFixedBacHeight", 0)
    },
    refresherOutRate: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherOutRate", 0.65)
    },
    refresherPullRate: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherPullRate", 0.75)
    },
    showRefresherUpdateTime: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("showRefresherUpdateTime", false)
    },
    refresherUpdateTimeKey: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("refresherUpdateTimeKey", "default")
    }
  },
  data() {
    return {
      R: uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher,
      refresherStatus: uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Default,
      refresherTouchstartY: 0,
      lastRefresherTouchmove: null,
      refresherReachMaxAngle: true,
      refresherTransform: "translateY(0px)",
      refresherTransition: "",
      finalRefresherDefaultStyle: "black",
      refresherRevealStackCount: 0,
      refresherCompleteTimeout: null,
      refresherCompleteSubTimeout: null,
      refresherEndTimeout: null,
      isTouchmovingTimeout: null,
      refresherTriggered: false,
      isTouchmoving: false,
      isTouchEnded: false,
      isUserPullDown: false,
      privateRefresherEnabled: -1,
      privateShowRefresherWhenReload: false,
      customRefresherHeight: -1,
      showCustomRefresher: false,
      doRefreshAnimateAfter: false,
      isRefresherInComplete: false,
      pullDownTimeStamp: 0,
      moveDis: 0,
      oldMoveDis: 0,
      oldRefresherTouchmoveY: 0,
      oldTouchDirection: ""
    };
  },
  watch: {
    refresherDefaultStyle: {
      handler(newVal) {
        if (newVal.length) {
          this.finalRefresherDefaultStyle = newVal;
        }
      },
      immediate: true
    },
    refresherStatus(newVal, oldVal) {
      if (newVal === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Loading) {
        this._cleanRefresherEndTimeout();
      }
      this.$emit("refresherStatusChange", newVal);
      this.$emit("update:refresherStatus", newVal);
    },
    moveDis(newVal, oldVal) {
      this.oldMoveDis = oldVal;
    }
  },
  computed: {
    pullDownDisTimeStamp() {
      return 1e3 / this.refresherFps;
    },
    finalRefresherEnabled() {
      if (this.useChatRecordMode)
        return false;
      if (this.privateRefresherEnabled === -1)
        return this.refresherEnabled;
      return this.privateRefresherEnabled === 1;
    },
    finalRefresherThreshold() {
      let refresherThreshold = this.refresherThreshold;
      let idDefault = false;
      if (refresherThreshold === "80rpx") {
        idDefault = true;
        if (this.showRefresherUpdateTime) {
          refresherThreshold = "120rpx";
        }
      }
      if (idDefault && this.customRefresherHeight > 0) {
        return this.customRefresherHeight;
      }
      return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.convertTextToPx(refresherThreshold);
    },
    finalRefresherFixedBacHeight() {
      return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.convertTextToPx(this.refresherFixedBacHeight);
    },
    finalRefresherThemeStyle() {
      return this.refresherThemeStyle.length ? this.refresherThemeStyle : this.defaultThemeStyle;
    },
    finalRefresherOutRate() {
      let rate = this.refresherOutRate;
      rate = Math.max(0, rate);
      rate = Math.min(1, rate);
      return rate;
    },
    finalRefresherPullRate() {
      let rate = this.refresherPullRate;
      rate = Math.max(0, rate);
      return rate;
    },
    finalRefresherTransform() {
      if (this.refresherTransform === "translateY(0px)")
        return "none";
      return this.refresherTransform;
    },
    finalShowRefresherWhenReload() {
      return this.showRefresherWhenReload || this.privateShowRefresherWhenReload;
    },
    finalRefresherTriggered() {
      if (!(this.finalRefresherEnabled && !this.useCustomRefresher))
        return false;
      return this.refresherTriggered;
    },
    showRefresher() {
      const showRefresher = this.finalRefresherEnabled && this.useCustomRefresher && this.isTouchmoving;
      if (this.customRefresherHeight === -1 && showRefresher) {
        setTimeout(() => {
          this.$nextTick(() => {
            this._updateCustomRefresherHeight();
          });
        }, 100);
      }
      return showRefresher;
    },
    hasTouchmove() {
      return this.watchRefresherTouchmove;
    }
  },
  methods: {
    endRefresh() {
      this.totalData = this.realTotalData;
      this._refresherEnd();
      this._endSystemLoadingAndRefresh();
    },
    handleRefresherStatusChanged(func) {
      this.refresherStatusChangedFunc = func;
    },
    _onRefresh(fromScrollView = false, isUserPullDown = true) {
      if (fromScrollView && !(this.finalRefresherEnabled && !this.useCustomRefresher))
        return;
      this.$emit("onRefresh");
      this.$emit("Refresh");
      if (this.loading || this.isRefresherInComplete)
        return;
      this.loadingType = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.Refresher;
      if (this.nShowRefresherReveal)
        return;
      this.isUserPullDown = isUserPullDown;
      this.isUserReload = !isUserPullDown;
      this._startLoading(true);
      this.refresherTriggered = true;
      if (this.reloadWhenRefresh && isUserPullDown) {
        if (this.useChatRecordMode) {
          this._onLoadingMore("click");
        } else {
          this._reload(false, false, isUserPullDown);
        }
      }
    },
    _onRestore() {
      this.refresherTriggered = "restore";
      this.$emit("onRestore");
      this.$emit("Restore");
    },
    _handleRefresherTouchstart(touch) {
      if (!this.loading && this.isTouchEnded) {
        this.isTouchmoving = false;
      }
      this.loadingType = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.Refresher;
      this.isTouchmovingTimeout && clearTimeout(this.isTouchmovingTimeout);
      this.isTouchEnded = false;
      this.refresherTransition = "";
      this.refresherTouchstartY = touch.touchY;
      this.$emit("refresherTouchstart", this.refresherTouchstartY);
      this.lastRefresherTouchmove = touch;
      this._cleanRefresherCompleteTimeout();
      this._cleanRefresherEndTimeout();
    },
    _handleRefresherTouchmove(moveDis, touch) {
      this.refresherReachMaxAngle = true;
      this.isTouchmovingTimeout && clearTimeout(this.isTouchmovingTimeout);
      this.isTouchmoving = true;
      this.isTouchEnded = false;
      this.refresherStatus = moveDis >= this.finalRefresherThreshold ? uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.ReleaseToRefresh : this.refresherStatus = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Default;
      this.moveDis = moveDis;
    },
    _handleRefresherTouchend(moveDis) {
      this.isTouchmovingTimeout && clearTimeout(this.isTouchmovingTimeout);
      this.refresherReachMaxAngle = true;
      if (moveDis < 0 && this.usePageScroll && this.loadingMoreEnabled && this.useCustomRefresher && this.pageScrollTop === -1) {
        if (this.showConsoleError) {
          uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.consoleErr("usePageScroll\u4E3Atrue\u5E76\u4E14\u81EA\u5B9A\u4E49\u4E0B\u62C9\u5237\u65B0\u65F6\u5FC5\u987B\u5F15\u5165mixin\u6216\u5728page\u6EDA\u52A8\u65F6\u901A\u8FC7\u8C03\u7528z-paging\u7EC4\u4EF6\u7684updatePageScrollTop\u65B9\u6CD5\u8BBE\u7F6E\u5F53\u524D\u7684scrollTop");
        }
      }
      this.isTouchEnded = true;
      if (moveDis >= this.finalRefresherThreshold && this.refresherStatus === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.ReleaseToRefresh) {
        this.moveDis = this.finalRefresherThreshold;
        this.refresherStatus = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Loading;
        this._doRefresherLoad();
      } else {
        this._refresherEnd();
        this.isTouchmovingTimeout = setTimeout(() => {
          this.isTouchmoving = false;
        }, this.refresherDefaultDuration);
      }
      this.scrollEnable = true;
      this.$emit("refresherTouchend", moveDis);
    },
    _handleListTouchstart() {
      if (this.useChatRecordMode && this.autoHideKeyboardWhenChat) {
        common_vendor.index.hideKeyboard();
        this.$emit("hidedKeyboard");
      }
    },
    _handleScrollViewDisableBounce(e) {
      if (!this.usePageScroll && !this.scrollToTopBounceEnabled) {
        this.refresherTransition = "";
        this.scrollEnable = e.bounce;
      }
    },
    _handleWxsPullingDownStatusChange(onPullingDown) {
      this.wxsOnPullingDown = onPullingDown;
      if (onPullingDown && !this.useChatRecordMode) {
        this.renderPropScrollTop = 0;
      }
    },
    _handleWxsPullingDown(e) {
      this._emitTouchmove({ pullingDistance: e.moveDis, dy: e.diffDis });
    },
    _handleTouchDirectionChange(e) {
      this.$emit("touchDirectionChange", e.direction);
    },
    _handlePropUpdate(e) {
      this.wxsPropType = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime().toString();
    },
    _refresherEnd(shouldEndLoadingDelay = true, fromAddData = false, isUserPullDown = false, setLoading = true) {
      if (this.loadingType === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.LoadingType.Refresher) {
        let refresherCompleteDelay = 0;
        if (fromAddData && (isUserPullDown || this.showRefresherWhenReload)) {
          refresherCompleteDelay = this.refresherCompleteDuration > 700 ? 1 : this.refresherCompleteDelay;
        }
        const refresherStatus = refresherCompleteDelay > 0 ? uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Complete : uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Default;
        if (this.finalShowRefresherWhenReload) {
          const stackCount = this.refresherRevealStackCount;
          this.refresherRevealStackCount--;
          if (stackCount > 1)
            return;
        }
        this._cleanRefresherEndTimeout();
        this.refresherEndTimeout = setTimeout(() => {
          this.refresherStatus = refresherStatus;
        }, this.refresherStatus !== uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Default && refresherStatus === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Default ? this.refresherCompleteDuration : 0);
        if (refresherCompleteDelay > 0) {
          this.isRefresherInComplete = true;
        }
        this._cleanRefresherCompleteTimeout();
        this.refresherCompleteTimeout = setTimeout(() => {
          let animateDuration = 1;
          const animateType = this.refresherEndBounceEnabled && fromAddData ? "cubic-bezier(0.19,1.64,0.42,0.72)" : "linear";
          if (fromAddData) {
            animateDuration = this.refresherEndBounceEnabled ? this.refresherCompleteDuration / 1e3 : this.refresherCompleteDuration / 3e3;
          }
          this.refresherTransition = `transform ${fromAddData ? animateDuration : this.refresherDefaultDuration / 1e3}s ${animateType}`;
          this.wxsPropType = this.refresherTransition + "end" + uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime();
          this.moveDis = 0;
          if (refresherStatus === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Complete) {
            if (this.refresherCompleteSubTimeout) {
              clearTimeout(this.refresherCompleteSubTimeout);
              this.refresherCompleteSubTimeout = null;
            }
            this.refresherCompleteSubTimeout = setTimeout(() => {
              this.$nextTick(() => {
                this.refresherStatus = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Default;
                this.isRefresherInComplete = false;
              });
            }, animateDuration * 800);
          }
        }, refresherCompleteDelay);
      }
      if (setLoading) {
        setTimeout(() => {
          this.loading = false;
        }, shouldEndLoadingDelay ? uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.delayTime : 0);
        isUserPullDown && this._onRestore();
      }
    },
    _doRefresherRefreshAnimate() {
      this._cleanRefresherCompleteTimeout();
      const doRefreshAnimateAfter = !this.doRefreshAnimateAfter && this.finalShowRefresherWhenReload && this.customRefresherHeight === -1 && this.refresherThreshold === "80rpx";
      if (doRefreshAnimateAfter) {
        this.doRefreshAnimateAfter = true;
        return;
      }
      this.refresherRevealStackCount++;
      this.wxsPropType = "begin" + uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime();
      this.moveDis = this.finalRefresherThreshold;
      this.refresherStatus = uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher.Loading;
      this.isTouchmoving = true;
      this.isTouchmovingTimeout && clearTimeout(this.isTouchmovingTimeout);
      this._doRefresherLoad(false);
    },
    _doRefresherLoad(isUserPullDown = true) {
      this._onRefresh(false, isUserPullDown);
      this.loading = true;
    },
    _getFinalRefresherMoveDis(moveDis) {
      moveDis = moveDis * this.finalRefresherPullRate;
      if (moveDis >= this.finalRefresherThreshold) {
        moveDis = this.finalRefresherThreshold + (moveDis - this.finalRefresherThreshold) * (1 - this.finalRefresherOutRate);
      }
      return moveDis;
    },
    _updateCustomRefresherHeight() {
      this._getNodeClientRect(".zp-custom-refresher-slot-view").then((res) => {
        if (res) {
          this.customRefresherHeight = res[0].height;
          if (this.customRefresherHeight > 0) {
            this.showCustomRefresher = true;
          }
        } else {
          this.customRefresherHeight = 0;
        }
        if (this.doRefreshAnimateAfter) {
          this.doRefreshAnimateAfter = false;
          this._doRefresherRefreshAnimate();
        }
      });
    },
    _emitTouchmove(e) {
      e.viewHeight = this.finalRefresherThreshold;
      e.rate = e.pullingDistance / e.viewHeight;
      if (this.hasTouchmove) {
        this.$emit("refresherTouchmove", e);
      }
    },
    _cleanRefresherCompleteTimeout() {
      this.refresherCompleteTimeout = this._cleanTimeout(this.refresherCompleteTimeout);
    },
    _cleanRefresherEndTimeout() {
      this.refresherEndTimeout = this._cleanTimeout(this.refresherEndTimeout);
    }
  }
};
exports.ZPRefresher = ZPRefresher;
