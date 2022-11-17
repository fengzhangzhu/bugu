"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_storageKeys = require("../../../common/storageKeys.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
const _sfc_main = {
  data() {
    return {
      searchText: "",
      searchHistory: [],
      searchResult: [],
      showSeacrhHistory: true
    };
  },
  async onLoad() {
    let searchHistory = await common_vendor.index.getStorageSync(common_storageKeys.SEARCH_USER_HISTORY);
    if (searchHistory) {
      this.searchHistory = searchHistory;
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onHistoryTextClick(labelText) {
      this.searchText = labelText;
      this.searchUsers(this.searchText);
    },
    onSearchInput(e) {
      this.searchText = e;
    },
    onSearchConfirm() {
      if (this.searchText.length < 1) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u8F93\u5165\u5173\u952E\u8BCD"
        });
        return;
      }
      this.searchUsers(this.searchText);
    },
    async searchUsers(username) {
      common_vendor.index.showLoading({
        title: "\u641C\u7D22\u4E2D"
      });
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "social",
          action: "searchUser",
          data: {
            username
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      common_vendor.index.hideLoading();
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let users = res.data.data;
        this.searchResult = users;
        this.showSeacrhHistory = false;
      }
      let searchHistory = common_vendor.index.getStorageSync(common_storageKeys.SEARCH_USER_HISTORY);
      if (!searchHistory) {
        searchHistory = [];
      }
      if (searchHistory.indexOf(username) == -1) {
        searchHistory.push(username);
        if (searchHistory.length > 10) {
          searchHistory.splice(0, 1);
        }
      } else {
        searchHistory.splice(searchHistory.indexOf(username), 1);
        searchHistory.push(username);
      }
      common_vendor.index.setStorage({
        key: common_storageKeys.SEARCH_USER_HISTORY,
        data: searchHistory
      });
      this.searchHistory = searchHistory.reverse();
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_search_user_item2 = common_vendor.resolveComponent("search-user-item");
  (_easycom_uni_nav_bar2 + _easycom_uni_search_bar2 + _easycom_search_user_item2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_search_bar = () => "../../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_search_user_item = () => "../../../components/search-user-item/search-user-item.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_search_bar + _easycom_search_user_item)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.onNarLeftClick()),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: common_vendor.o($options.onSearchInput),
    d: common_vendor.o(($event) => $options.onSearchConfirm()),
    e: common_vendor.o(($event) => $data.searchText = $event),
    f: common_vendor.p({
      placeholder: "\u641C\u7D22\u7528\u6237",
      cancelButton: "none",
      modelValue: $data.searchText
    }),
    g: common_vendor.o(($event) => $options.onSearchConfirm()),
    h: $data.showSeacrhHistory
  }, $data.showSeacrhHistory ? common_vendor.e({
    i: $data.searchHistory.length > 0
  }, $data.searchHistory.length > 0 ? {
    j: common_vendor.f($data.searchHistory, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: common_vendor.o(($event) => $options.onHistoryTextClick(item), item)
      };
    })
  } : {}) : common_vendor.e({
    k: common_vendor.f($data.searchResult, (item, k0, i0) => {
      return {
        a: item.id,
        b: "4fc53a66-2-" + i0,
        c: common_vendor.p({
          item
        })
      };
    }),
    l: $data.searchResult.length <= 0
  }, $data.searchResult.length <= 0 ? {} : {}));
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/message-secondary-page/search-user/search-user.vue"]]);
wx.createPage(MiniProgramPage);
