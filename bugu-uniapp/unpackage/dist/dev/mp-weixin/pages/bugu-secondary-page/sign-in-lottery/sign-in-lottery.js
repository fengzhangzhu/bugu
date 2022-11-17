"use strict";
var common_vendor = require("../../../common/vendor.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
const _sfc_main = {
  data() {
    return {
      signInfo: {
        signInDays: 0,
        signInToday: false,
        getGiftToday: false
      }
    };
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    async onSignButtonClick() {
      if (this.signInfo.signInDays >= 7) {
        if (this.signInfo.getGiftToday) {
          common_vendor.index.showToast({
            title: "\u5956\u54C1\u5DF2\u9886\u53D6",
            icon: "none"
          });
        } else {
          getSignGift();
        }
        return;
      }
      if (this.signInfo.signInToday) {
        return;
      } else {
        let res = await signIn();
        if (res) {
          this.signInfo = await getSignInfo();
        }
      }
    }
  },
  async mounted() {
    this.signInfo = await getSignInfo();
  }
};
async function signIn() {
  let res = await utils_request.request({
    data: {
      method: "PUT",
      group: "signIn",
      action: `signIn`,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    common_vendor.index.showToast({
      title: "\u7B7E\u5230\u6210\u529F",
      icon: "success"
    });
    return true;
  } else {
    return false;
  }
}
async function getSignInfo() {
  let res = await utils_request.request({
    data: {
      method: "GET",
      group: "signIn",
      action: `info`,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    let signInfo = res.data.data;
    return signInfo;
  } else {
    return {
      signInDays: 0,
      signInToday: false,
      getGiftToday: false
    };
  }
}
async function getSignGift() {
  let res = await utils_request.request({
    data: {
      method: "POST",
      group: "signIn",
      action: `getGift`,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    common_vendor.index.showToast({
      title: "\u5956\u54C1\u9886\u53D6\u6210\u529F"
    });
  }
}
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  _easycom_uni_nav_bar2();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
if (!Math) {
  _easycom_uni_nav_bar();
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
    c: $data.signInfo.signInDays / 7 * 100 + "%",
    d: common_vendor.t($data.signInfo.signInDays),
    e: common_vendor.f([1, 2, 3, 4, 5, 6], (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(index + 1),
        c: index < $data.signInfo.signInDays ? "linear-gradient(to bottom, #42e1e3, #40e399);" : "#ffe6cb",
        d: index,
        e: (index + 1) % 3 == 2 ? "center" : (index + 1) % 3 == 0 ? "flex-end" : "flex-start",
        f: (index + 1) % 3 == 2 ? "center" : (index + 1) % 3 == 0 ? "flex-end" : "left"
      };
    }),
    f: $data.signInfo.signInDays >= 7 ? "linear-gradient(to bottom, #42e1e3, #40e399);" : "#ffe6cb",
    g: common_vendor.t($data.signInfo.signInDays >= 7 ? $data.signInfo.getGiftToday ? "\u5956\u54C1\u5DF2\u7ECF\u9886\u53D6" : "\u9886\u53D6\u5956\u54C1" : $data.signInfo.signInToday ? "\u4ECA\u65E5\u5DF2\u7B7E\u5230" : "\u7B7E\u5230"),
    h: common_vendor.o(($event) => $options.onSignButtonClick())
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/bugu-secondary-page/sign-in-lottery/sign-in-lottery.vue"]]);
wx.createPage(MiniProgramPage);
