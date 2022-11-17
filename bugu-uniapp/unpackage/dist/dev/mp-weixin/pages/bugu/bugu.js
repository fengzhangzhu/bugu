"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
var utils_request = require("../../utils/request.js");
var utils_dateUtils = require("../../utils/dateUtils.js");
var utils_tabBarBadgeUtils = require("../../utils/tabBarBadgeUtils.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
require("../../common/globalMsgKeys.js");
require("../../utils/messageUtils/index.js");
require("../../utils/messageUtils/service.js");
require("../../utils/messageUtils/storage.js");
require("../../utils/messageUtils/storageKeys.js");
const Keywords = {
  "sunny": /晴/,
  "shower": /阵雨/,
  "thunder-shower": /雷阵雨/,
  "overcast": /阴/,
  "cloudy": /多云/,
  "rainy-storm": /暴雨/,
  "raniy-large": /大雨/,
  "raniy-lightning": /雷|电/,
  "raniy-mid": /中雨/,
  "raniy-small": /小雨/,
  "snow-small": /小雪|雪/,
  "snow-mid": /中雪/,
  "sleet": /雨夹雪/,
  "snow-large": /大雪/,
  "fog": /雾/,
  "smog": /霾/
};
const _sfc_main = {
  data() {
    return {
      nbTitle: "\u5E03\u5495",
      backgroundColor: "#fff",
      frontColor: common_constants.TitleColor,
      bannerList: [],
      weatherResult: {
        adcode: "110108",
        city: "\u6B66\u6C49",
        humidity: "N/A",
        province: "\u6E56\u5317",
        reporttime: "",
        temperature: "N/A",
        weather: "N/A",
        winddirection: "N/A",
        windpower: "N/A"
      },
      helloText: "",
      timeNow: "",
      weatherIcon: "",
      InviteCode: ""
    };
  },
  onShow() {
    utils_tabBarBadgeUtils.changeUnreadMessageSum();
  },
  onShareAppMessage() {
    return {
      title: "\u5E03\u5495\u661F\u7403",
      path: `/pages/index/index?inviteCode=${this.InviteCode}`,
      imageUrl: ""
    };
  },
  onShareTimeline() {
    return {
      title: "\u5E03\u5495\u661F\u7403",
      path: `/pages/index/index?inviteCode=${this.InviteCode}`
    };
  },
  methods: {
    onSignCardClick() {
      common_vendor.index.navigateTo({
        url: "/pages/bugu-secondary-page/sign-in-lottery/sign-in-lottery"
      });
    },
    onBoxCardClick() {
      common_vendor.index.navigateTo({
        url: "/pages/bugu-secondary-page/blind-box/blind-box"
      });
    },
    onNightPhoneClick() {
      common_vendor.index.showModal({
        title: "\u665A\u5B89\u7535\u8BDD",
        content: "\u672A\u5230\u5F00\u653E\u65F6\u95F4\u54E6~"
      });
    },
    OnInviteClick() {
      common_vendor.index.showModal({
        title: "\u9080\u8BF7\u83B7\u5956",
        content: "\u70B9\u51FB\u53F3\u4E0A\u89D2\u5C06\u5E03\u5495\u661F\u7403\u5206\u4EAB\u7ED9\u597D\u53CB\uFF0C\u597D\u53CB\u70B9\u5F00\u94FE\u63A5\u5E76\u767B\u5F55\uFF0C\u4F60\u53EF\u4EE5\u83B7\u53D65\u5929vip\u54E6~"
      });
    }
  },
  async mounted() {
    this.bannerList = await getBannerList();
    this.helloText = getHellowText();
    this.timeNow = utils_dateUtils.GetNowDate().MonthAndDay;
    this.InviteCode = await common_requestFunctions.getInviteUserCode();
    let _this = this;
    common_vendor.index.getLocation({
      type: "wgs84",
      success: async function(res) {
        let weatherInfo = await getWeather(res.latitude, res.longitude);
        if (weatherInfo) {
          _this.weatherResult = weatherInfo.weatherResult;
          _this.weatherIcon = weatherInfo.weatherIcon;
        }
      }
    });
  }
};
async function getWeather(latitude, longitude) {
  let res = await utils_request.getWeatherInfo(latitude, longitude);
  if (res.data.code === "0000") {
    let weatherResult = res.data.data.lives[0];
    let weatherIcon = "";
    for (let weather in Keywords)
      if (Keywords[weather].test(weatherResult.weather))
        weatherIcon = weather;
    return {
      weatherResult,
      weatherIcon
    };
  }
}
async function getBannerList() {
  let res = await utils_request.request({
    data: {
      method: "GET",
      group: "banner",
      action: "list",
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return res.data.data;
  } else {
    return [];
  }
}
function getHellowText() {
  let date = new Date();
  if (date.getHours() >= 0 && date.getHours() < 12) {
    return "Good morning";
  } else if (date.getHours() >= 12 && date.getHours() < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
if (!Math) {
  _easycom_uni_nav_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      statusBar: "true",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080"
    }),
    b: common_vendor.f($data.bannerList, (item, k0, i0) => {
      return {
        a: item.pic,
        b: item.id
      };
    }),
    c: common_vendor.o((...args) => _ctx.imageError && _ctx.imageError(...args)),
    d: _ctx.indicatorDots,
    e: _ctx.autoplay,
    f: _ctx.interval,
    g: _ctx.duration,
    h: common_vendor.t($data.weatherResult.city),
    i: common_vendor.t($data.timeNow),
    j: common_vendor.t($data.weatherResult.weather),
    k: common_vendor.t($data.weatherResult.winddirection),
    l: common_vendor.t($data.weatherResult.windpower),
    m: common_vendor.t($data.weatherResult.humidity),
    n: $data.weatherIcon
  }, $data.weatherIcon ? {
    o: `/static/weather/${$data.weatherIcon}.png`
  } : {}, {
    p: common_vendor.t($data.weatherResult.temperature),
    q: common_vendor.o(($event) => $options.onNightPhoneClick()),
    r: common_vendor.o(($event) => $options.onSignCardClick()),
    s: common_vendor.o(($event) => $options.onBoxCardClick()),
    t: common_vendor.o(($event) => $options.OnInviteClick())
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/bugu/bugu.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
