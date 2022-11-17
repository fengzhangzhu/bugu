"use strict";
var common_vendor = require("../../../../../../common/vendor.js");
var uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
var uni_modules_zPaging_components_zPaging_js_zPagingConstant = require("../z-paging-constant.js");
var uni_modules_zPaging_components_zPaging_js_zPagingI18n = require("../z-paging-i18n.js");
const systemInfo = common_vendor.index.getSystemInfoSync();
const ZPI18n = {
  props: {
    language: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("language", "")
    },
    followSystemLanguage: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("followSystemLanguage", true)
    }
  },
  data() {
    return {
      tempLanguageUpdateKey: 0
    };
  },
  computed: {
    tempLanguage() {
      let systemLanguage = false;
      this.tempLanguageUpdateKey;
      if (this.followSystemLanguage) {
        systemLanguage = systemInfo.language;
      }
      return common_vendor.index.getStorageSync(uni_modules_zPaging_components_zPaging_js_zPagingConstant.c.i18nUpdateKey) || systemLanguage || "zh-cn";
    },
    finalTempLanguage() {
      return this.language.length ? this.language : this.tempLanguage;
    },
    finalLanguage() {
      let language = this.finalTempLanguage.toLowerCase();
      return uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n._getPrivateLanguage(language, this.followSystemLanguage);
    },
    finalRefresherDefaultText() {
      return this._getI18nText("refresherDefaultText", this.refresherDefaultText);
    },
    finalRefresherPullingText() {
      return this._getI18nText("refresherPullingText", this.refresherPullingText);
    },
    finalRefresherRefreshingText() {
      return this._getI18nText("refresherRefreshingText", this.refresherRefreshingText);
    },
    finalRefresherCompleteText() {
      return this._getI18nText("refresherCompleteText", this.refresherCompleteText);
    },
    finalLoadingMoreDefaultText() {
      return this._getI18nText("loadingMoreDefaultText", this.loadingMoreDefaultText);
    },
    finalLoadingMoreLoadingText() {
      return this._getI18nText("loadingMoreLoadingText", this.loadingMoreLoadingText);
    },
    finalLoadingMoreNoMoreText() {
      return this._getI18nText("loadingMoreNoMoreText", this.loadingMoreNoMoreText);
    },
    finalLoadingMoreFailText() {
      return this._getI18nText("loadingMoreFailText", this.loadingMoreFailText);
    },
    finalEmptyViewText() {
      return this.isLoadFailed ? this.finalEmptyViewErrorText : this._getI18nText("emptyViewText", this.emptyViewText);
    },
    finalEmptyViewReloadText() {
      return this._getI18nText("emptyViewReloadText", this.emptyViewReloadText);
    },
    finalEmptyViewErrorText() {
      return this._getI18nText("emptyViewErrorText", this.emptyViewErrorText);
    },
    finalSystemLoadingText() {
      return this._getI18nText("systemLoadingText", this.systemLoadingText);
    }
  },
  methods: {
    setI18n(language) {
      uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n.setLanguage(language);
    },
    getLanguage() {
      return this.finalLanguage;
    },
    _getI18nText(key, value) {
      const dataType = Object.prototype.toString.call(value);
      if (dataType === "[object Object]") {
        const nextValue = value[this.finalLanguage];
        if (nextValue)
          return nextValue;
      } else if (dataType === "[object String]") {
        return value;
      }
      return uni_modules_zPaging_components_zPaging_js_zPagingI18n.zI18n.t[key][this.finalLanguage];
    }
  }
};
exports.ZPI18n = ZPI18n;
