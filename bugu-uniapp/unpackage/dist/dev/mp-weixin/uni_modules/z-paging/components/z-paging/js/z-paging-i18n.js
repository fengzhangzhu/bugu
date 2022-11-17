"use strict";
var common_vendor = require("../../../../../common/vendor.js");
const i18nUpdateKey = "z-paging-i18n-update";
const t = {
  refresherDefaultText: {
    "en": "Pull down to refresh",
    "zh-cn": "\u7EE7\u7EED\u4E0B\u62C9\u5237\u65B0",
    "zh-hant-cn": "\u7E7C\u7E8C\u4E0B\u62C9\u91CD\u7E6A"
  },
  refresherPullingText: {
    "en": "Release to refresh",
    "zh-cn": "\u677E\u5F00\u7ACB\u5373\u5237\u65B0",
    "zh-hant-cn": "\u9B06\u958B\u7ACB\u5373\u91CD\u7E6A"
  },
  refresherRefreshingText: {
    "en": "Refreshing...",
    "zh-cn": "\u6B63\u5728\u5237\u65B0...",
    "zh-hant-cn": "\u6B63\u5728\u91CD\u7E6A..."
  },
  refresherCompleteText: {
    "en": "Refresh succeeded",
    "zh-cn": "\u5237\u65B0\u6210\u529F",
    "zh-hant-cn": "\u91CD\u7E6A\u6210\u529F"
  },
  loadingMoreDefaultText: {
    "en": "Click to load more",
    "zh-cn": "\u70B9\u51FB\u52A0\u8F7D\u66F4\u591A",
    "zh-hant-cn": "\u9EDE\u64CA\u52A0\u8F09\u66F4\u591A"
  },
  loadingMoreLoadingText: {
    "en": "Loading...",
    "zh-cn": "\u6B63\u5728\u52A0\u8F7D...",
    "zh-hant-cn": "\u6B63\u5728\u52A0\u8F09..."
  },
  loadingMoreNoMoreText: {
    "en": "No more data",
    "zh-cn": "\u6CA1\u6709\u66F4\u591A\u4E86",
    "zh-hant-cn": "\u6C92\u6709\u66F4\u591A\u4E86"
  },
  loadingMoreFailText: {
    "en": "Load failed,click to reload",
    "zh-cn": "\u52A0\u8F7D\u5931\u8D25\uFF0C\u70B9\u51FB\u91CD\u65B0\u52A0\u8F7D",
    "zh-hant-cn": "\u52A0\u8F09\u5931\u6557\uFF0C\u9EDE\u64CA\u91CD\u65B0\u52A0\u8F09"
  },
  emptyViewText: {
    "en": "No data",
    "zh-cn": "\u6CA1\u6709\u6570\u636E\u54E6~",
    "zh-hant-cn": "\u6C92\u6709\u6578\u64DA\u54E6~"
  },
  emptyViewReloadText: {
    "en": "Reload",
    "zh-cn": "\u91CD\u65B0\u52A0\u8F7D",
    "zh-hant-cn": "\u91CD\u65B0\u52A0\u8F09"
  },
  emptyViewErrorText: {
    "en": "Sorry,load failed",
    "zh-cn": "\u5F88\u62B1\u6B49\uFF0C\u52A0\u8F7D\u5931\u8D25",
    "zh-hant-cn": "\u5F88\u62B1\u6B49\uFF0C\u52A0\u8F09\u5931\u6557"
  },
  systemLoadingText: {
    "en": "Loading...",
    "zh-cn": "\u52A0\u8F7D\u4E2D...",
    "zh-hant-cn": "\u52A0\u8F09\u4E2D..."
  },
  refresherUpdateTimeText: {
    "en": "Last update: ",
    "zh-cn": "\u6700\u540E\u66F4\u65B0\uFF1A",
    "zh-hant-cn": "\u6700\u5F8C\u66F4\u65B0\uFF1A"
  },
  refresherUpdateTimeNoneText: {
    "en": "None",
    "zh-cn": "\u65E0",
    "zh-hant-cn": "\u7121"
  },
  refresherUpdateTimeTodayText: {
    "en": "Today",
    "zh-cn": "\u4ECA\u5929",
    "zh-hant-cn": "\u4ECA\u5929"
  },
  refresherUpdateTimeYesterdayText: {
    "en": "Yesterday",
    "zh-cn": "\u6628\u5929",
    "zh-hant-cn": "\u6628\u5929"
  }
};
function getLanguage(followSystemLanguage = true) {
  return _getPrivateLanguage(false, followSystemLanguage);
}
function getLanguageName(followSystemLanguage = true) {
  const language = getLanguage(followSystemLanguage);
  const languageNameMap = {
    "zh-cn": "\u7B80\u4F53\u4E2D\u6587",
    "zh-hant-cn": "\u7E41\u9AD4\u4E2D\u6587",
    "en": "English"
  };
  return languageNameMap[language];
}
function setLanguage(myLanguage) {
  common_vendor.index.setStorageSync(i18nUpdateKey, myLanguage);
  common_vendor.index.$emit(i18nUpdateKey, myLanguage);
}
function _getPrivateLanguage(myLanguage, followSystemLanguage = true) {
  let systemLanguage = "";
  if (followSystemLanguage) {
    systemLanguage = common_vendor.index.getSystemInfoSync().language;
  }
  let language = myLanguage || common_vendor.index.getStorageSync(i18nUpdateKey) || systemLanguage;
  language = language.toLowerCase();
  const reg = new RegExp("_", "");
  language = language.replace(reg, "-");
  if (language.indexOf("zh") !== -1) {
    if (language === "zh" || language === "zh-cn" || language.indexOf("zh-hans") !== -1) {
      return "zh-cn";
    }
    return "zh-hant-cn";
  }
  if (language.indexOf("en") !== -1) {
    return "en";
  }
  return "zh-cn";
}
var zI18n = {
  t,
  getLanguage,
  getLanguageName,
  setLanguage,
  _getPrivateLanguage
};
exports.zI18n = zI18n;
