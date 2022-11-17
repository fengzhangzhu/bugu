"use strict";
var uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
var uni_modules_zPaging_components_zPaging_js_zPagingConstant = require("../z-paging-constant.js");
var uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("../z-paging-enum.js");
const ZPVirtualList = {
  props: {
    useVirtualList: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("useVirtualList", false)
    },
    useInnerList: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("useInnerList", false)
    },
    forceCloseInnerList: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("forceCloseInnerList", false)
    },
    cellKeyName: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("cellKeyName", "")
    },
    innerListStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("innerListStyle", {});
      }
    },
    innerCellStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("innerCellStyle", {});
      }
    },
    preloadPage: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("preloadPage", 7),
      validator: (value) => {
        if (value <= 0)
          uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.consoleErr("preload-page\u5FC5\u987B\u5927\u4E8E0\uFF01");
        return value > 0;
      }
    },
    cellHeightMode: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("cellHeightMode", uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.CacheMode.Fixed)
    },
    virtualListCol: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("virtualListCol", 1)
    },
    virtualScrollFps: {
      type: [Number, String],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("virtualScrollFps", 60)
    }
  },
  data() {
    return {
      virtualListKey: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getInstanceId(),
      virtualPageHeight: 0,
      virtualCellHeight: 0,
      virtualScrollTimeStamp: 0,
      virtualList: [],
      virtualPlaceholderTopHeight: 0,
      virtualPlaceholderBottomHeight: 0,
      virtualTopRangeIndex: 0,
      virtualBottomRangeIndex: 0,
      lastVirtualTopRangeIndex: 0,
      lastVirtualBottomRangeIndex: 0,
      virtualHeightCacheList: [],
      getCellHeightRetryCount: {
        fixed: 0,
        dynamic: 0
      },
      pagingOrgTop: -1,
      updateVirtualListFromDataChange: false
    };
  },
  watch: {
    realTotalData(newVal) {
      if (this.finalUseVirtualList) {
        this.updateVirtualListFromDataChange = true;
        this.$nextTick(() => {
          if (!newVal.length) {
            this._resetDynamicListState(!this.isUserPullDown);
          }
          this.getCellHeightRetryCount.fixed = 0;
          this.finalUseVirtualList && newVal.length && this.cellHeightMode === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.CellHeightMode.Fixed && this.isFirstPage && this._updateFixedCellHeight();
          this.finalUseVirtualList && this._updateVirtualScroll(this.oldScrollTop);
        });
      }
    },
    virtualList(newVal) {
      this.$emit("update:virtualList", newVal);
      this.$emit("virtualListChange", newVal);
    }
  },
  computed: {
    finalUseVirtualList() {
      if (this.useVirtualList && this.usePageScroll) {
        uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.consoleErr("\u4F7F\u7528\u9875\u9762\u6EDA\u52A8\u65F6\uFF0C\u5F00\u542F\u865A\u62DF\u5217\u8868\u65E0\u6548\uFF01");
      }
      return this.useVirtualList && !this.usePageScroll;
    },
    finalUseInnerList() {
      return this.useInnerList || this.finalUseVirtualList && !this.forceCloseInnerList;
    },
    finalCellKeyName() {
      return this.cellKeyName;
    },
    finalVirtualPageHeight() {
      return this.virtualPageHeight > 0 ? this.virtualPageHeight : this.windowHeight;
    },
    virtualRangePageHeight() {
      return this.finalVirtualPageHeight * this.preloadPage;
    },
    virtualScrollDisTimeStamp() {
      return 1e3 / this.virtualScrollFps;
    }
  },
  methods: {
    _virtualListInit() {
      this.$nextTick(() => {
        setTimeout(() => {
          this._getNodeClientRect(".zp-scroll-view").then((node) => {
            if (node && node.length) {
              this.pagingOrgTop = node[0].top;
              this.virtualPageHeight = node[0].height;
            }
          });
        }, uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.delayTime);
      });
    },
    _updateFixedCellHeight() {
      this.$nextTick(() => {
        const updateFixedCellHeightTimeout = setTimeout(() => {
          this._getNodeClientRect(`#zp-id-${0}`, this.finalUseInnerList).then((cellNode) => {
            const hasCellNode = cellNode && cellNode.length;
            if (!hasCellNode) {
              clearTimeout(updateFixedCellHeightTimeout);
              if (this.getCellHeightRetryCount.fixed > 10) {
                return;
              }
              this.getCellHeightRetryCount.fixed++;
              this._updateFixedCellHeight();
            } else {
              this.virtualCellHeight = cellNode[0].height;
              this._updateVirtualScroll(this.oldScrollTop);
            }
          });
        }, uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.delayTime);
      });
    },
    _updateDynamicCellHeight(list) {
      this.$nextTick(() => {
        const updateDynamicCellHeightTimeout = setTimeout(async () => {
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            const cellNode = await this._getNodeClientRect(`#zp-id-${item[uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.listCellIndexKey]}`, this.finalUseInnerList);
            const hasCellNode = cellNode && cellNode.length;
            const currentHeight = hasCellNode ? cellNode[0].height : 0;
            if (!hasCellNode) {
              clearTimeout(updateDynamicCellHeightTimeout);
              this.virtualHeightCacheList = this.virtualHeightCacheList.slice(-i);
              if (this.getCellHeightRetryCount.dynamic > 10) {
                return;
              }
              this.getCellHeightRetryCount.dynamic++;
              this._updateDynamicCellHeight(list);
              break;
            }
            let lastHeightCache = null;
            if (this.virtualHeightCacheList.length) {
              lastHeightCache = this.virtualHeightCacheList.slice(-1)[0];
            }
            const lastHeight = lastHeightCache ? lastHeightCache.totalHeight : 0;
            this.virtualHeightCacheList.push({
              height: currentHeight,
              lastHeight,
              totalHeight: lastHeight + currentHeight
            });
          }
          this._updateVirtualScroll(this.oldScrollTop);
        }, uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.delayTime);
      });
    },
    _setCellIndex(list, isFirstPage) {
      let lastItem = null;
      let lastItemIndex = 0;
      if (!isFirstPage) {
        lastItemIndex = this.realTotalData.length;
        if (this.realTotalData.length) {
          lastItem = this.realTotalData.slice(-1)[0];
        }
        if (lastItem && lastItem[uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.listCellIndexKey] !== void 0) {
          lastItemIndex = lastItem[uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.listCellIndexKey] + 1;
        }
      } else {
        this._resetDynamicListState();
      }
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (!item || Object.prototype.toString.call(item) !== "[object Object]") {
          item = { item };
        }
        item[uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.listCellIndexKey] = lastItemIndex + i;
        item[uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.listCellIndexUniqueKey] = `${this.virtualListKey}-${item[uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.listCellIndexKey]}`;
        list[i] = item;
      }
      this.getCellHeightRetryCount.dynamic = 0;
      this.cellHeightMode === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.CellHeightMode.Dynamic && this._updateDynamicCellHeight(list);
    },
    _updateVirtualScroll(scrollTop, scrollDiff = 0) {
      const currentTimeStamp = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getTime();
      if (scrollTop === 0) {
        this._resetTopRange();
      }
      if (scrollTop !== 0 && this.virtualScrollTimeStamp && currentTimeStamp - this.virtualScrollTimeStamp <= this.virtualScrollDisTimeStamp) {
        return;
      }
      this.virtualScrollTimeStamp = Number(currentTimeStamp);
      let scrollIndex = 0;
      const cellHeightMode = this.cellHeightMode;
      if (cellHeightMode === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.CellHeightMode.Fixed) {
        scrollIndex = parseInt(scrollTop / this.virtualCellHeight) || 0;
        this._updateFixedTopRangeIndex(scrollIndex);
        this._updateFixedBottomRangeIndex(scrollIndex);
      } else if (cellHeightMode === uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.CellHeightMode.Dynamic) {
        const scrollDirection = scrollDiff > 0 ? "top" : "bottom";
        const rangePageHeight = this.virtualRangePageHeight;
        const topRangePageOffset = scrollTop - rangePageHeight;
        const bottomRangePageOffset = scrollTop + this.finalVirtualPageHeight + rangePageHeight;
        let virtualBottomRangeIndex = 0;
        let virtualPlaceholderBottomHeight = 0;
        let reachedLimitBottom = false;
        let lastHeightCache = null;
        const heightCacheList = this.virtualHeightCacheList;
        if (heightCacheList.length) {
          lastHeightCache = heightCacheList.slice(-1)[0];
        }
        let startTopRangeIndex = this.virtualTopRangeIndex;
        if (scrollDirection === "bottom") {
          for (let i = startTopRangeIndex; i < heightCacheList.length; i++) {
            const heightCacheItem = heightCacheList[i];
            if (heightCacheItem && heightCacheItem.totalHeight > topRangePageOffset) {
              this.virtualTopRangeIndex = i;
              this.virtualPlaceholderTopHeight = heightCacheItem.lastHeight;
              break;
            }
          }
        } else {
          let topRangeMatched = false;
          for (let i = startTopRangeIndex; i >= 0; i--) {
            const heightCacheItem = heightCacheList[i];
            if (heightCacheItem && heightCacheItem.totalHeight < topRangePageOffset) {
              this.virtualTopRangeIndex = i;
              this.virtualPlaceholderTopHeight = heightCacheItem.lastHeight;
              topRangeMatched = true;
              break;
            }
          }
          !topRangeMatched && this._resetTopRange();
        }
        for (let i = this.virtualTopRangeIndex; i < heightCacheList.length; i++) {
          const heightCacheItem = heightCacheList[i];
          if (heightCacheItem && heightCacheItem.totalHeight > bottomRangePageOffset) {
            virtualBottomRangeIndex = i;
            virtualPlaceholderBottomHeight = lastHeightCache.totalHeight - heightCacheItem.totalHeight;
            reachedLimitBottom = true;
            break;
          }
        }
        if (!reachedLimitBottom || this.virtualBottomRangeIndex === 0) {
          this.virtualBottomRangeIndex = this.realTotalData.length ? this.realTotalData.length - 1 : this.pageSize;
          this.virtualPlaceholderBottomHeight = 0;
        } else {
          this.virtualBottomRangeIndex = virtualBottomRangeIndex;
          this.virtualPlaceholderBottomHeight = virtualPlaceholderBottomHeight;
        }
        this._updateVirtualList();
      }
    },
    _updateFixedTopRangeIndex(scrollIndex) {
      let virtualTopRangeIndex = this.virtualCellHeight === 0 ? 0 : scrollIndex - parseInt(this.finalVirtualPageHeight / this.virtualCellHeight) * this.preloadPage;
      virtualTopRangeIndex *= this.virtualListCol;
      virtualTopRangeIndex = Math.max(0, virtualTopRangeIndex);
      this.virtualTopRangeIndex = virtualTopRangeIndex;
      this.virtualPlaceholderTopHeight = virtualTopRangeIndex / this.virtualListCol * this.virtualCellHeight;
    },
    _updateFixedBottomRangeIndex(scrollIndex) {
      let virtualBottomRangeIndex = this.virtualCellHeight === 0 ? this.pageSize : scrollIndex + parseInt(this.finalVirtualPageHeight / this.virtualCellHeight) * (this.preloadPage + 1);
      virtualBottomRangeIndex *= this.virtualListCol;
      virtualBottomRangeIndex = Math.min(this.realTotalData.length, virtualBottomRangeIndex);
      this.virtualBottomRangeIndex = virtualBottomRangeIndex;
      this.virtualPlaceholderBottomHeight = (this.realTotalData.length - virtualBottomRangeIndex) * this.virtualCellHeight / this.virtualListCol;
      this._updateVirtualList();
    },
    _updateVirtualList() {
      const shouldUpdateList = this.updateVirtualListFromDataChange || (this.lastVirtualTopRangeIndex !== this.virtualTopRangeIndex || this.lastVirtualBottomRangeIndex !== this.virtualBottomRangeIndex);
      if (shouldUpdateList) {
        this.updateVirtualListFromDataChange = false;
        this.lastVirtualTopRangeIndex = this.virtualTopRangeIndex;
        this.lastVirtualBottomRangeIndex = this.virtualBottomRangeIndex;
        this.virtualList = this.realTotalData.slice(this.virtualTopRangeIndex, this.virtualBottomRangeIndex + 1);
      }
    },
    _resetDynamicListState(resetVirtualList = false) {
      this.virtualHeightCacheList = [];
      if (resetVirtualList) {
        this.virtualList = [];
      }
      this.virtualTopRangeIndex = 0;
      this.virtualPlaceholderTopHeight = 0;
    },
    _resetTopRange() {
      this.virtualTopRangeIndex = 0;
      this.virtualPlaceholderTopHeight = 0;
      this._updateVirtualList();
    },
    _checkVirtualListScroll() {
      if (this.finalUseVirtualList) {
        this.$nextTick(() => {
          this._getNodeClientRect(".zp-paging-touch-view").then((node) => {
            const hasNode = node && node.length;
            const currentTop = hasNode ? node[0].top : 0;
            if (!hasNode || currentTop === this.pagingOrgTop && this.virtualPlaceholderTopHeight !== 0) {
              this._updateVirtualScroll(0);
            }
          });
        });
      }
    }
  }
};
exports.ZPVirtualList = ZPVirtualList;
