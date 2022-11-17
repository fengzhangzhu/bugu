"use strict";
var common_vendor = require("../../../../../../common/vendor.js");
var uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
const ZPNvue = {
  props: {
    nvueListIs: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("nvueListIs", "list")
    },
    nvueWaterfallConfig: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("nvueWaterfallConfig", {});
      }
    },
    nvueBounce: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("nvueBounce", true)
    },
    nvueFastScroll: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("nvueFastScroll", false)
    },
    nvueListId: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("nvueListId", "")
    },
    nvueRefresherStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("nvueRefresherStyle", {});
      }
    },
    nvuePagingEnabled: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("nvuePagingEnabled", false)
    },
    hideNvueBottomTag: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("hideNvueBottomTag", false)
    },
    offsetAccuracy: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("offsetAccuracy", 10)
    }
  },
  data() {
    return {
      nRefresherLoading: false,
      nListIsDragging: false,
      nShowBottom: true,
      nFixFreezing: false,
      nShowRefresherReveal: false,
      nIsFirstPageAndNoMore: false,
      nFirstPageAndNoMoreChecked: false,
      nLoadingMoreFixedHeight: false,
      nShowRefresherRevealHeight: 0,
      nOldShowRefresherRevealHeight: -1,
      nRefresherWidth: common_vendor.index.upx2px(750)
    };
  },
  watch: {
    nIsFirstPageAndNoMore: {
      handler(newVal) {
        const cellStyle = !this.useChatRecordMode || newVal ? {} : { transform: "rotate(180deg)" };
        this.$emit("update:cellStyle", cellStyle);
      },
      immediate: true
    }
  },
  computed: {},
  methods: {}
};
exports.ZPNvue = ZPNvue;
