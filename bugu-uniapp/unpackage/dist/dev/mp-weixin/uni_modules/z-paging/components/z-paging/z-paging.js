"use strict";
var uni_modules_zPaging_components_zPaging_js_zPagingMain = require("./js/z-paging-main.js");
var common_vendor = require("../../../../common/vendor.js");
require("./js/z-paging-static.js");
require("./js/z-paging-constant.js");
require("./js/z-paging-utils.js");
require("./js/z-paging-i18n.js");
require("./js/z-paging-config.js");
require("./config/index.js");
require("./js/modules/data-handle.js");
require("./js/z-paging-enum.js");
require("./js/z-paging-interceptor.js");
require("./js/modules/i18n.js");
require("./js/modules/nvue.js");
require("./js/modules/empty.js");
require("./js/modules/refresher.js");
require("./js/modules/load-more.js");
require("./js/modules/loading.js");
require("./js/modules/scroller.js");
require("./js/modules/back-to-top.js");
require("./js/modules/virtual-list.js");
var block0 = (Component2) => {
  if (!Component2.wxsCallMethods) {
    Component2.wxsCallMethods = [];
  }
  Component2.wxsCallMethods.push("_handleListTouchstart", "_handleRefresherTouchstart", "_handleTouchDirectionChange", "_handleScrollViewDisableBounce", "_handleWxsPullingDown", "_handleRefresherTouchmove", "_handleRefresherTouchend", "_handlePropUpdate", "_handleWxsPullingDownStatusChange");
};
var block1 = {};
if (!Array) {
  const _component_z_paging_refresh = common_vendor.resolveComponent("z-paging-refresh");
  const _component_z_paging_load_more = common_vendor.resolveComponent("z-paging-load-more");
  const _easycom_z_paging_empty_view2 = common_vendor.resolveComponent("z-paging-empty-view");
  (_component_z_paging_refresh + _component_z_paging_load_more + _easycom_z_paging_empty_view2)();
}
const _easycom_z_paging_empty_view = () => "../z-paging-empty-view/z-paging-empty-view.js";
if (!Math) {
  _easycom_z_paging_empty_view();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.cssSafeAreaInsetBottom === -1
  }, _ctx.cssSafeAreaInsetBottom === -1 ? {} : {}, {
    b: !_ctx.usePageScroll && _ctx.$slots.top
  }, !_ctx.usePageScroll && _ctx.$slots.top ? {} : _ctx.usePageScroll && _ctx.$slots.top ? {
    d: common_vendor.s({
      "top": `${_ctx.windowTop}px`,
      "z-index": _ctx.topZIndex
    })
  } : {}, {
    c: _ctx.usePageScroll && _ctx.$slots.top,
    e: _ctx.$slots.left
  }, _ctx.$slots.left ? {
    f: _ctx.finalIsOldWebView ? 1 : ""
  } : {}, {
    g: _ctx.finalRefresherFixedBacHeight > 0
  }, _ctx.finalRefresherFixedBacHeight > 0 ? {
    h: common_vendor.s({
      "background": _ctx.refresherFixedBackground,
      "height": `${_ctx.finalRefresherFixedBacHeight}px`
    })
  } : {}, {
    i: _ctx.showRefresher
  }, _ctx.showRefresher ? common_vendor.e({
    j: !(_ctx.$slots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete)
  }, !(_ctx.$slots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete) ? {
    k: common_vendor.r("refresher", {
      refresherStatus: _ctx.refresherStatus
    })
  } : {}, {
    l: _ctx.$slots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete
  }, _ctx.$slots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete ? {} : !_ctx.showCustomRefresher ? {
    n: common_vendor.sr("refresh", "0f887f1e-0"),
    o: common_vendor.s({
      "height": `${_ctx.finalRefresherThreshold}px`
    }),
    p: common_vendor.p({
      status: _ctx.refresherStatus,
      defaultThemeStyle: _ctx.finalRefresherThemeStyle,
      defaultText: _ctx.finalRefresherDefaultText,
      pullingText: _ctx.finalRefresherPullingText,
      refreshingText: _ctx.finalRefresherRefreshingText,
      completeText: _ctx.finalRefresherCompleteText,
      defaultImg: _ctx.refresherDefaultImg,
      pullingImg: _ctx.refresherPullingImg,
      refreshingImg: _ctx.refresherRefreshingImg,
      completeImg: _ctx.refresherCompleteImg,
      showUpdateTime: _ctx.showRefresherUpdateTime,
      updateTimeKey: _ctx.refresherUpdateTimeKey,
      imgStyle: _ctx.refresherImgStyle,
      titleStyle: _ctx.refresherTitleStyle,
      updateTimeStyle: _ctx.refresherUpdateTimeStyle
    })
  } : {}, {
    m: !_ctx.showCustomRefresher,
    q: common_vendor.s({
      "height": `${_ctx.finalRefresherThreshold}px`,
      "background": _ctx.refresherBackground
    }),
    r: common_vendor.s({
      "margin-top": `-${_ctx.finalRefresherThreshold}px`,
      "background": _ctx.refresherBackground
    })
  }) : {}, {
    s: _ctx.useChatRecordMode && _ctx.$slots.chatLoading && _ctx.loadingStatus !== _ctx.M.NoMore && _ctx.realTotalData.length
  }, _ctx.useChatRecordMode && _ctx.$slots.chatLoading && _ctx.loadingStatus !== _ctx.M.NoMore && _ctx.realTotalData.length ? {} : _ctx.useChatRecordMode && _ctx.loadingStatus !== _ctx.M.NoMore && _ctx.realTotalData.length ? common_vendor.e({
    v: _ctx.loadingStatus !== _ctx.M.Loading
  }, _ctx.loadingStatus !== _ctx.M.Loading ? {
    w: common_vendor.t(_ctx.chatRecordLoadingMoreText),
    x: common_vendor.o(($event) => _ctx._scrollToUpper()),
    y: common_vendor.n(_ctx.defaultThemeStyle === "white" ? "zp-loading-more-text zp-loading-more-text-white" : "zp-loading-more-text zp-loading-more-text-black")
  } : {
    z: _ctx.base64Flower
  }) : {}, {
    t: _ctx.useChatRecordMode && _ctx.loadingStatus !== _ctx.M.NoMore && _ctx.realTotalData.length,
    A: _ctx.showLoading && _ctx.$slots.loading && !_ctx.loadingFullFixed
  }, _ctx.showLoading && _ctx.$slots.loading && !_ctx.loadingFullFixed ? {} : {}, {
    B: _ctx.finalUseInnerList
  }, _ctx.finalUseInnerList ? common_vendor.e({
    C: _ctx.finalUseVirtualList
  }, _ctx.finalUseVirtualList ? {
    D: common_vendor.f(_ctx.virtualList, (item, index, i0) => {
      return {
        a: "cell-" + i0,
        b: common_vendor.r("cell", {
          item,
          index: _ctx.virtualTopRangeIndex + index
        }, i0),
        c: item.id ? item.id : `zp-id-${item["zp_index"]}`,
        d: item["zp_unique_index"]
      };
    }),
    E: common_vendor.s(_ctx.innerCellStyle)
  } : {
    F: common_vendor.f(_ctx.realTotalData, (item, index, i0) => {
      return {
        a: "cell-" + i0,
        b: common_vendor.r("cell", {
          item,
          index
        }, i0),
        c: index
      };
    })
  }, {
    G: common_vendor.s(_ctx.innerListStyle)
  }) : {}, {
    H: _ctx.useVirtualList
  }, _ctx.useVirtualList ? {
    I: common_vendor.s({
      height: _ctx.virtualPlaceholderBottomHeight + "px"
    })
  } : {}, {
    J: _ctx.showLoadingMoreDefault
  }, _ctx.showLoadingMoreDefault ? {} : _ctx.showLoadingMoreLoading ? {} : _ctx.showLoadingMoreNoMore ? {} : _ctx.showLoadingMoreFail ? {} : _ctx.showLoadingMoreCustom ? {
    O: common_vendor.o(($event) => _ctx._onLoadingMore("click")),
    P: common_vendor.p({
      zConfig: _ctx.zPagingLoadMoreConfig
    })
  } : {}, {
    K: _ctx.showLoadingMoreLoading,
    L: _ctx.showLoadingMoreNoMore,
    M: _ctx.showLoadingMoreFail,
    N: _ctx.showLoadingMoreCustom,
    Q: _ctx.safeAreaInsetBottom && _ctx.useSafeAreaPlaceholder
  }, _ctx.safeAreaInsetBottom && _ctx.useSafeAreaPlaceholder ? {
    R: common_vendor.s({
      height: _ctx.safeAreaBottom + "px"
    })
  } : {}, {
    S: common_vendor.s({
      transform: _ctx.virtualPlaceholderTopHeight > 0 ? `translateY(${_ctx.virtualPlaceholderTopHeight}px)` : "none"
    }),
    T: common_vendor.s(_ctx.finalPagingContentStyle),
    U: _ctx.showEmpty
  }, _ctx.showEmpty ? common_vendor.e({
    V: _ctx.$slots.empty
  }, _ctx.$slots.empty ? {} : {
    W: common_vendor.o(_ctx._emptyViewReload),
    X: common_vendor.o(_ctx._emptyViewClick),
    Y: common_vendor.p({
      emptyViewImg: _ctx.finalEmptyViewImg,
      emptyViewText: _ctx.finalEmptyViewText,
      showEmptyViewReload: _ctx.finalShowEmptyViewReload,
      emptyViewReloadText: _ctx.finalEmptyViewReloadText,
      isLoadFailed: _ctx.isLoadFailed,
      emptyViewStyle: _ctx.emptyViewStyle,
      emptyViewTitleStyle: _ctx.emptyViewTitleStyle,
      emptyViewImgStyle: _ctx.emptyViewImgStyle,
      emptyViewReloadStyle: _ctx.emptyViewReloadStyle,
      emptyViewZIndex: _ctx.emptyViewZIndex,
      emptyViewFixed: _ctx.emptyViewFixed
    })
  }, {
    Z: _ctx.emptyViewCenter ? 1 : "",
    aa: common_vendor.s({
      emptyViewSuperStyle: _ctx.emptyViewSuperStyle
    })
  }) : {}, {
    ab: common_vendor.s(_ctx.scrollViewInStyle),
    ac: common_vendor.s({
      "transform": _ctx.finalRefresherTransform,
      "transition": _ctx.refresherTransition
    }),
    ad: _ctx.wxsPropType,
    ae: _ctx.finalRefresherThreshold,
    af: _ctx.isIos,
    ag: _ctx.loading || _ctx.isRefresherInComplete,
    ah: _ctx.useChatRecordMode,
    ai: _ctx.refresherEnabled,
    aj: _ctx.useCustomRefresher,
    ak: _ctx.wxsPageScrollTop,
    al: _ctx.wxsScrollTop,
    am: _ctx.refresherMaxAngle,
    an: _ctx.refresherAngleEnableChangeContinued,
    ao: _ctx.usePageScroll,
    ap: _ctx.watchTouchDirectionChange,
    aq: _ctx.isTouchmoving,
    ar: _ctx.finalRefresherOutRate,
    as: _ctx.finalRefresherPullRate,
    at: _ctx.hasTouchmove,
    av: !_ctx.usePageScroll ? 1 : "",
    aw: !_ctx.showScrollbar ? 1 : "",
    ax: _ctx.scrollTop,
    ay: _ctx.scrollX,
    az: _ctx.scrollable && !_ctx.usePageScroll && _ctx.scrollEnable && (_ctx.refresherCompleteScrollable ? true : _ctx.refresherStatus !== _ctx.R.Complete),
    aA: _ctx.finalEnableBackToTop,
    aB: _ctx.showScrollbar,
    aC: _ctx.finalScrollWithAnimation,
    aD: _ctx.scrollIntoView,
    aE: _ctx.finalLowerThreshold,
    aF: _ctx.finalRefresherEnabled && !_ctx.useCustomRefresher,
    aG: _ctx.finalRefresherThreshold,
    aH: _ctx.finalRefresherDefaultStyle,
    aI: _ctx.refresherBackground,
    aJ: _ctx.finalRefresherTriggered,
    aK: common_vendor.o((...args) => _ctx._scroll && _ctx._scroll(...args)),
    aL: common_vendor.o(($event) => _ctx._onLoadingMore("toBottom")),
    aM: common_vendor.o((...args) => _ctx._scrollToUpper && _ctx._scrollToUpper(...args)),
    aN: common_vendor.o((...args) => _ctx._onRestore && _ctx._onRestore(...args)),
    aO: common_vendor.o(($event) => _ctx._onRefresh(true)),
    aP: _ctx.finalIsOldWebView ? 1 : "",
    aQ: common_vendor.s(_ctx.scrollViewContainerStyle),
    aR: _ctx.$slots.right
  }, _ctx.$slots.right ? {
    aS: _ctx.finalIsOldWebView ? 1 : ""
  } : {}, {
    aT: !_ctx.usePageScroll ? 1 : "",
    aU: common_vendor.s(_ctx.finalScrollViewStyle),
    aV: !_ctx.usePageScroll && _ctx.$slots.bottom
  }, !_ctx.usePageScroll && _ctx.$slots.bottom ? {} : _ctx.usePageScroll && _ctx.$slots.bottom ? {
    aX: common_vendor.s({
      "bottom": `${_ctx.windowBottom}px`
    })
  } : {}, {
    aW: _ctx.usePageScroll && _ctx.$slots.bottom,
    aY: _ctx.showBackToTopClass
  }, _ctx.showBackToTopClass ? common_vendor.e({
    aZ: _ctx.$slots.backToTop
  }, _ctx.$slots.backToTop ? {} : {
    ba: _ctx.backToTopImg.length ? _ctx.backToTopImg : _ctx.base64BackToTop
  }, {
    bb: common_vendor.n(_ctx.backToTopClass),
    bc: common_vendor.s(_ctx.finalBackToTopStyle),
    bd: common_vendor.o((...args) => _ctx._backToTopClick && _ctx._backToTopClick(...args))
  }) : {}, {
    be: _ctx.showLoading && _ctx.$slots.loading && _ctx.loadingFullFixed
  }, _ctx.showLoading && _ctx.$slots.loading && _ctx.loadingFullFixed ? {} : {}, {
    bf: !_ctx.usePageScroll && _ctx.fixed ? 1 : "",
    bg: _ctx.usePageScroll ? 1 : "",
    bh: _ctx.renderPropScrollTop < 1 ? 1 : "",
    bi: common_vendor.s(_ctx.finalPagingStyle)
  });
}
if (typeof block0 === "function")
  block0(uni_modules_zPaging_components_zPaging_js_zPagingMain._sfc_main);
if (typeof block1 === "function")
  block1(uni_modules_zPaging_components_zPaging_js_zPagingMain._sfc_main);
var Component = /* @__PURE__ */ common_vendor._export_sfc(uni_modules_zPaging_components_zPaging_js_zPagingMain._sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0f887f1e"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/uni_modules/z-paging/components/z-paging/z-paging.vue"]]);
wx.createComponent(Component);
