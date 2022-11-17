"use strict";
var common_vendor = require("../../../common/vendor.js");
var utils_tabBarBadgeUtils = require("../../../utils/tabBarBadgeUtils.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var utils_messageUtils_storage = require("../../../utils/messageUtils/storage.js");
var utils_messageUtils_storageKeys = require("../../../utils/messageUtils/storageKeys.js");
require("../../../common/globalMsgKeys.js");
require("../../../utils/messageUtils/index.js");
require("../../../utils/messageUtils/service.js");
require("../../../common/requestFunctions.js");
require("../../../common/storageKeys.js");
require("../../../utils/dateUtils.js");
const _sfc_main = {
  data() {
    return {
      type: common_constants.PUNISH,
      officialNews: [],
      navHeight: 0,
      contentHeight: 0,
      scrollInto: ""
    };
  },
  onReady() {
    let _this = this;
    common_vendor.index.getSystemInfo({
      success(res) {
        _this.contentHeight = res.windowHeight;
      }
    });
    let titleH = common_vendor.index.createSelectorQuery().select("#news-scrollview");
    titleH.boundingClientRect((data) => {
      _this.navHeight = data.top;
    }).exec();
  },
  async onLoad(params) {
    let type = params.type;
    this.type = type;
    let userInfo = await common_storageFunctions.getMyUserInfo();
    let officialNews = await utils_messageUtils_storage.getTypeOfficalNews(userInfo.id, type);
    this.officialNews = officialNews.reverse();
    if (this.officialNews.length > 0) {
      this.scrollInto = `news_${this.officialNews[this.officialNews.length - 1].id}`;
    }
    officialNews.reverse();
    let newOfficialNews = await this.getUnreadTypeofficialNews(type);
    officialNews = officialNews.concat(newOfficialNews);
    this.officialNews = officialNews.reverse();
    if (this.officialNews.length > 0) {
      this.scrollInto = `news_${this.officialNews[this.officialNews.length - 1].id}`;
    }
    let OFFICE_TYPE_NEWS = utils_messageUtils_storageKeys.getOfficeTypeNewsListKey(userInfo.id, type);
    common_vendor.index.setStorage({
      key: OFFICE_TYPE_NEWS,
      data: officialNews
    });
    let officialNewsList = await utils_messageUtils_storage.getOfficalList(userInfo.id);
    for (let i = 0; i < officialNewsList.length; i++) {
      if (officialNewsList[i].type === type) {
        utils_tabBarBadgeUtils.changeUnreadMessageSum(-officialNewsList[i].unreadSum);
        officialNewsList[i].unreadSum = 0;
        break;
      }
    }
    let OFFICE_NEWS_LIST = utils_messageUtils_storageKeys.getOfficeNewsListKey(userInfo.id);
    common_vendor.index.setStorage({
      key: OFFICE_NEWS_LIST,
      data: officialNewsList
    });
  },
  computed: {
    scollerHeight() {
      return this.contentHeight - this.navHeight;
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    async getUnreadTypeofficialNews(type) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "message",
          action: "official/unread/special",
          data: {
            type
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let officialNews = res.data.data;
        return officialNews;
      } else {
        return [];
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _component_Text = common_vendor.resolveComponent("Text");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_nav_bar2 + _component_Text + _easycom_uni_card2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_card = () => "../../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onNarLeftClick),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: common_vendor.f($data.officialNews, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.createTime),
        b: common_vendor.t(item.text),
        c: "626c1f44-2-" + i0 + "," + ("626c1f44-1-" + i0),
        d: "626c1f44-1-" + i0,
        e: item.id,
        f: `news_${item.id}`
      };
    }),
    d: common_vendor.p({
      extra: "\u6709\u4EFB\u4F55\u95EE\u9898\u8BF7\u8054\u7CFB\u5B98\u65B9\u5BA2\u670D",
      title: "\u5B98\u65B9\u6D88\u606F"
    }),
    e: $data.scrollInto,
    f: $options.scollerHeight + "px"
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/message-secondary-page/official-news-info/official-news-info.vue"]]);
wx.createPage(MiniProgramPage);
