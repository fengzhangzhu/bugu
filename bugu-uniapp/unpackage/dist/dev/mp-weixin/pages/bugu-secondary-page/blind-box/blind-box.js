"use strict";
var common_vendor = require("../../../common/vendor.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var common_requestFunctions = require("../../../common/requestFunctions.js");
require("../../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      boxSelected: 0,
      femaleBoxSum: 0,
      maleBoxSum: 0,
      lastClickTime: 0,
      boxTicketsAvailableSum: 0,
      userInfo: {},
      boxInfo: {},
      boxOwnerInfo: {}
    };
  },
  async onLoad() {
    this.userInfo = await common_storageFunctions.getMyUserInfo();
    this.getBoxInfo();
    this.getBoxTicketsInfo(1);
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onShowRulesButtonClick() {
      this.$refs.boxRulePopup.open();
    },
    onGetMoreTicketsClick() {
      common_vendor.index.showModal({
        title: "\u83B7\u53D6\u65B9\u6CD5",
        content: "\u6295\u5165\u76F2\u76D2\u5373\u53EF\u83B7\u53D6\u4E00\u5F20\u76F2\u76D2\u52B5\u54E6~"
      });
    },
    onPutBoxButtonClick() {
      if (this.boxSelected == 2) {
        common_vendor.index.navigateTo({
          url: "/pages/bugu-secondary-page/blind-box/my-box"
        });
        return;
      }
      this.$refs.putboxPopup.open();
    },
    onPutBoxConfirm(e) {
      this.putBox(this.boxSelected, e);
    },
    onBoxTicketsButtonClick() {
      common_vendor.index.navigateTo({
        url: "/pages/bugu-secondary-page/blind-box/box-tickets"
      });
    },
    onBoxConfirmClick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/user-home-page/user-home-page?userId=${id}`
      });
    },
    async takeBox(sex) {
      if (this.userInfo.sex == sex) {
        common_vendor.index.showToast({
          title: "\u53EA\u80FD\u83B7\u53D6\u5F02\u6027\u7684\u76F2\u76D2\u54E6",
          icon: "error"
        });
        return;
      }
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "blindBox",
          action: "collect",
          data: {
            sex
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let boxInfo = res.data.data;
        let userInfo = await common_requestFunctions.getUserinfo(boxInfo.userId);
        this.boxInfo = boxInfo;
        this.boxOwnerInfo = userInfo;
        this.getBoxInfo();
        this.$refs.takeboxPopup.open();
      } else {
        common_vendor.index.showModal({
          title: "\u83B7\u53D6\u5931\u8D25",
          content: res.data.userMsg
        });
      }
    },
    onBoxSelected(selected) {
      let clickTime = Date.now();
      if (this.boxSelected == selected) {
        if (this.boxSelected == 2) {
          common_vendor.index.navigateTo({
            url: "/pages/bugu-secondary-page/blind-box/my-box"
          });
          return;
        }
        if (clickTime - this.lastClickTime < 500) {
          return;
        } else {
          this.lastClickTime = clickTime;
        }
        let _this = this;
        common_vendor.index.showModal({
          title: "\u62BD\u53D6\u76F2\u76D2",
          content: `\u4F60\u786E\u5B9A\u8981\u6D88\u8017\u4E00\u5F20\u76F2\u76D2\u52B5\u62BD\u53D6\u4E00\u4E2A${selected == 0 ? "\u5973" : "\u7537"}\u76D2\u5417\uFF1F`,
          success: function(res) {
            if (res.confirm) {
              _this.takeBox(selected);
              _this.lastClickTime = clickTime;
            }
          }
        });
      } else {
        this.boxSelected = selected;
        this.lastClickTime = clickTime;
      }
    },
    async putBox(sex, text) {
      let res = await utils_request.request({
        data: {
          method: "PUT",
          group: "blindBox",
          action: "deliver",
          data: {
            sex,
            text
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        this.getBoxInfo();
        common_vendor.index.showToast({
          title: "\u6295\u9001\u6210\u529F",
          icon: "success"
        });
      }
    },
    async getBoxInfo() {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "blindBox",
          action: "info",
          data: {},
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        this.femaleBoxSum = res.data.data.femaleBoxSum, this.maleBoxSum = res.data.data.maleBoxSum;
      }
    },
    async getBoxTicketsInfo(page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "blindBox",
          action: "ticket/list",
          data: {
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        this.boxTicketsAvailableSum = res.data.data.list.availableSum;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_nav_bar2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_popup_dialog = () => "../../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_popup_dialog + _easycom_uni_popup)();
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
    c: $data.boxSelected == 0 ? `#f0afc7` : $data.boxSelected == 1 ? `#8fd5f1` : "#f9e3ce",
    d: common_vendor.o(($event) => $options.onShowRulesButtonClick()),
    e: common_vendor.t($data.boxSelected == 0 ? `\u5F53\u524D\u6709${$data.femaleBoxSum}\u4E2A\u5973\u751F\u76D2\u5B50` : $data.boxSelected == 1 ? `\u5F53\u524D\u6709${$data.maleBoxSum}\u4E2A\u7537\u751F\u76D2\u5B50` : "\u6211\u6536\u5230\u548C\u6295\u5165\u7684\u76D2\u5B50"),
    f: $data.boxSelected == 0 ? `#f0afc7` : $data.boxSelected == 1 ? `#8fd5f1` : "#f9e3ce",
    g: common_vendor.t($data.boxTicketsAvailableSum),
    h: $data.boxSelected == 0 ? `#f0afc7` : $data.boxSelected == 1 ? `#8fd5f1` : "#f9e3ce",
    i: common_vendor.o((...args) => $options.onBoxTicketsButtonClick && $options.onBoxTicketsButtonClick(...args)),
    j: $data.boxSelected == 0 ? "/static/svgs/box-girl-selected.svg" : "/static/svgs/box-girl.svg",
    k: $data.boxSelected == 0 ? "7px dotted #f0afc7" : "7px dotted #ffffff00",
    l: common_vendor.o(($event) => $options.onBoxSelected(0)),
    m: $data.boxSelected == 1 ? "/static/svgs/box-boy-selected.svg" : "/static/svgs/box-boy.svg",
    n: $data.boxSelected == 1 ? "7px dotted #8fd5f1" : "7px dotted #ffffff00",
    o: common_vendor.o(($event) => $options.onBoxSelected(1)),
    p: $data.boxSelected == 2 ? "/static/svgs/box-me-selected.svg" : "/static/svgs/box-me.svg",
    q: $data.boxSelected == 2 ? "7px dotted #f9e3ce" : "7px dotted #ffffff00",
    r: common_vendor.o(($event) => $options.onBoxSelected(2)),
    s: $data.boxSelected == 0 ? `#f0afc7` : $data.boxSelected == 1 ? `#8fd5f1` : "#f9e3ce",
    t: common_vendor.o(($event) => $options.onGetMoreTicketsClick()),
    v: common_vendor.t($data.boxSelected == 0 ? `\u7559\u4E0B\u5973\u76D2` : $data.boxSelected == 1 ? `\u7559\u4E0B\u7537\u76D2` : "\u6211\u7684\u76D2\u5B50"),
    w: $data.boxSelected == 0 ? `#f0afc7` : $data.boxSelected == 1 ? `#8fd5f1` : "#f9e3ce",
    x: common_vendor.o(($event) => $options.onPutBoxButtonClick()),
    y: $data.boxSelected == 0 ? `linear-gradient(to bottom, #fcf5f7, #fff);` : $data.boxSelected == 1 ? `linear-gradient(to bottom, #f1f5fc, #fff);` : "linear-gradient(to bottom, #fefaf5, #fff);",
    z: $data.boxOwnerInfo.username
  }, $data.boxOwnerInfo.username ? {
    A: common_vendor.t($data.boxInfo.text),
    B: common_vendor.o(($event) => $options.onBoxConfirmClick($data.boxOwnerInfo.id)),
    C: common_vendor.p({
      title: `\u6765\u81EA${$data.boxOwnerInfo.username}\u7684\u76D2\u5B50`,
      customOkText: "\u548Cta\u6253\u58F0\u62DB\u547C",
      customCancelText: "\u518D\u7B49\u4E00\u4F1A\u513F"
    })
  } : {}, {
    D: common_vendor.sr("takeboxPopup", "74a3ce76-1"),
    E: common_vendor.p({
      type: "dialog"
    }),
    F: common_vendor.o($options.onPutBoxConfirm),
    G: common_vendor.p({
      mode: "input",
      title: "\u6295\u653E\u76F2\u76D2",
      placeholder: "\u4ECB\u7ECD\u4E00\u4E0B\u81EA\u5DF1\u5427"
    }),
    H: common_vendor.sr("putboxPopup", "74a3ce76-3"),
    I: common_vendor.p({
      type: "dialog"
    }),
    J: common_vendor.t(`
						1.\u70B9\u51FB\u76D2\u5B50\u5207\u6362\u7C7B\u578B\uFF0C\u518D\u6B21\u70B9\u51FB\u62BD\u53D6\u4E00\u4E2A\u76F2\u76D2
						2.\u6295\u5165\u76F2\u76D2\u53EF\u4EE5\u83B7\u53D6\u4E00\u5F20\u76F2\u76D2\u52B5\uFF0C\u6BCF\u5468\u4E0A\u9650\u4E24\u5F20
						3.\u62BD\u53D6\u76F2\u76D2\u9700\u8981\u6D88\u8017\u4E00\u5F20\u76F2\u76D2\u52B5\u54E6~
						4.\u4E00\u5929\u53EA\u80FD\u62BD\u53D6\u548C\u6295\u5165\u4E00\u4E2A\u76F2\u76D2\u54E6~
						`),
    K: common_vendor.p({
      title: `\u76F2\u76D2\u89C4\u5219\u4ECB\u7ECD`,
      customCancelText: "\u6211\u77E5\u9053\u4E86"
    }),
    L: common_vendor.sr("boxRulePopup", "74a3ce76-5"),
    M: common_vendor.p({
      type: "dialog"
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/bugu-secondary-page/blind-box/blind-box.vue"]]);
wx.createPage(MiniProgramPage);
