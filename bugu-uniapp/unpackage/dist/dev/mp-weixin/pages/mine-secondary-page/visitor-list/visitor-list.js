"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_storageKeys = require("../../../common/storageKeys.js");
var common_constants = require("../../../common/constants.js");
var utils_request = require("../../../utils/request.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
const _sfc_main = {
  data() {
    return {
      isRefresh: false,
      navHeight: 0,
      contentHeight: 0,
      visitorList: []
    };
  },
  onReady() {
    let _this = this;
    common_vendor.index.getSystemInfo({
      success(res) {
        _this.contentHeight = res.windowHeight;
      }
    });
    let titleH = common_vendor.index.createSelectorQuery().select("#visitor-scrollview");
    titleH.boundingClientRect((data) => {
      _this.navHeight = data.top;
    }).exec();
  },
  async onLoad() {
    let userInfo = await common_storageFunctions.getMyUserInfo();
    let VIEWS_NUMBER_CHANGED = common_storageKeys.getViewsNumberChangedKey(userInfo.id);
    common_vendor.index.setStorage({ key: VIEWS_NUMBER_CHANGED, data: 0 });
    this.visitorList = await this.getMyVisitors(userInfo.id);
  },
  computed: {
    scollerHeight() {
      let keyboardHeight = this.showEmojiPicker ? this.emojiContentHeight : this.keyboardHeight;
      return this.contentHeight - keyboardHeight - this.navHeight - 110;
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onScrollRefresheRrefresh() {
    },
    async getMyVisitors(userId) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "user",
          action: `visitor/list`,
          data: {
            userId
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      setTimeout(() => {
        this.isRefresh = false;
      }, 500);
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        return res.data.data;
      } else {
        return [];
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_visitor_item2 = common_vendor.resolveComponent("visitor-item");
  (_easycom_uni_nav_bar2 + _easycom_visitor_item2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_visitor_item = () => "../../../components/visitor-item/visitor-item.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_visitor_item)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.onNarLeftClick()),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: common_vendor.f($data.visitorList, (item, k0, i0) => {
      return {
        a: item.visitorId,
        b: "fbfe8848-1-" + i0,
        c: common_vendor.p({
          item
        })
      };
    }),
    d: $options.scollerHeight + "px",
    e: $data.isRefresh,
    f: common_vendor.o(($event) => $options.onScrollRefresheRrefresh())
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/mine-secondary-page/visitor-list/visitor-list.vue"]]);
wx.createPage(MiniProgramPage);
