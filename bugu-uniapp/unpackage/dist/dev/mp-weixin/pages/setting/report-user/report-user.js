"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_constants = require("../../../common/constants.js");
var utils_request = require("../../../utils/request.js");
const _sfc_main = {
  data() {
    return {
      modular: "activity",
      reportTypes: common_constants.reportTypes,
      reportSelected: common_constants.reportTypes[common_constants.reportTypes.length - 1],
      reportReason: "",
      reportSuccess: false,
      objectId: -1,
      objectType: ""
    };
  },
  onLoad(params) {
    this.objectId = params.objectId;
    this.objectType = params.objectType;
    let modular = params.modular;
    if (modular) {
      this.modular = modular;
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onReportTypesChange(evt) {
      this.reportSelected = evt.detail.value;
    },
    onTextInput(e) {
      this.reportReason = e.detail.value;
    },
    async onReportButtonClick() {
      if (this.reportSelected === "\u5176\u4ED6" && this.reportReason.length < 1) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u8F93\u5165\u539F\u56E0\uFF01",
          icon: "none"
        });
        return;
      }
      this.reportSuccess = await this.reportUser(this.objectId, this.objectType, this.reportSelected + "-" + this.reportReason);
    },
    async reportUser(objectId, objectType, reason) {
      let res = {};
      if (this.modular === "question") {
        res = await utils_request.request({
          data: {
            method: "POST",
            modular: "dhy",
            group: "helping",
            action: "inform",
            data: {
              objectId,
              objectType,
              reason
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          }
        });
      } else {
        res = await utils_request.request({
          data: {
            method: "POST",
            group: "user",
            action: "inform",
            data: {
              objectId,
              objectType,
              reason
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          }
        });
      }
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        return true;
      } else {
        return false;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  (_easycom_uni_nav_bar2 + _easycom_uni_transition2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_transition = () => "../../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_transition)();
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
    c: !$data.reportSuccess
  }, !$data.reportSuccess ? {
    d: common_vendor.f($data.reportTypes, (item, k0, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: item === $data.reportSelected,
        d: item
      };
    }),
    e: common_vendor.o((...args) => $options.onReportTypesChange && $options.onReportTypesChange(...args)),
    f: $data.reportReason,
    g: 49 - $data.reportSelected.length,
    h: $data.reportSelected === "\u5176\u4ED6" ? "\u4E3E\u62A5\u8BE6\u7EC6\u8BF4\u660E(\u5FC5\u586B)" : "\u4E3E\u62A5\u8BE6\u7EC6\u8BF4\u660E(\u9009\u586B)",
    i: common_vendor.o((...args) => $options.onTextInput && $options.onTextInput(...args)),
    j: common_vendor.o((...args) => $options.onReportButtonClick && $options.onReportButtonClick(...args))
  } : {}, {
    k: common_vendor.t(`\u4E3E\u62A5\u6210\u529F,\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u5904\u7406
					  \u611F\u8C22\u60A8\u4E3A\u7EF4\u62A4\u793E\u533A\u6C1B\u56F4\u505A\u51FA\u7684\u8D21\u732E`),
    l: common_vendor.p({
      ["mode-class"]: "zoom-in",
      show: $data.reportSuccess
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/report-user/report-user.vue"]]);
wx.createPage(MiniProgramPage);
