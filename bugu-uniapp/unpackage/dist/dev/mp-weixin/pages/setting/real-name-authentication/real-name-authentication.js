"use strict";
var common_vendor = require("../../../common/vendor.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
var utils_aes_export = require("../../../utils/aes/export.js");
const _sfc_main = {
  data() {
    return {
      isSuccessed: false,
      fileUrl: ""
    };
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onImageContentClick() {
      let _this = this;
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["camera"],
        success: function(res) {
          var tempFiles = res.tempFilePaths;
          _this.fileUrl = tempFiles[0];
        }
      });
    },
    onPrivacyPolicyClick() {
      common_vendor.index.navigateTo({
        url: "/pages/login/bugu-privacy-policy/bugu-privacy-policy"
      });
    },
    onSubmitButtonClick() {
      if (!this.fileUrl) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u9009\u62E9\u7167\u7247",
          icon: "error"
        });
        return;
      }
      this.submit_authentication(this.fileUrl);
    },
    async submit_authentication(fileUrl) {
      common_vendor.index.showLoading({
        title: "\u6B63\u5728\u63D0\u4EA4"
      });
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "user",
          action: "verify/token",
          data: {},
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let fileName = res.data.data.fileName;
        let fileToken = res.data.data.token;
        let _this = this;
        common_vendor.index.uploadFile({
          url: common_constants.UploadUrl,
          filePath: fileUrl,
          name: "file",
          formData: {
            "key": fileName,
            "token": utils_aes_export.aes.decrypt(fileToken)
          },
          async success(fileRes) {
            let authenticationChangeRes = await utils_request.request({
              data: {
                method: "PUT",
                group: "user",
                action: "verify/submit",
                data: {
                  verifyPic: fileName
                },
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                }
              }
            });
            common_vendor.index.hideLoading();
            if (authenticationChangeRes.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
              _this.isSuccessed = true;
            }
          }
        });
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
    c: common_vendor.p({
      ["mode-class"]: "zoom-in",
      show: $data.isSuccessed
    }),
    d: !$data.isSuccessed
  }, !$data.isSuccessed ? common_vendor.e({
    e: $data.fileUrl
  }, $data.fileUrl ? {
    f: $data.fileUrl
  } : {}, {
    g: common_vendor.o(($event) => $options.onImageContentClick()),
    h: common_vendor.o((...args) => $options.onPrivacyPolicyClick && $options.onPrivacyPolicyClick(...args)),
    i: common_vendor.o(($event) => $options.onSubmitButtonClick())
  }) : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/real-name-authentication/real-name-authentication.vue"]]);
wx.createPage(MiniProgramPage);
