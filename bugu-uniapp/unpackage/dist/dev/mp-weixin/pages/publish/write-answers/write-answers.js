"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var utils_aes_export = require("../../../utils/aes/export.js");
var common_constants = require("../../../common/constants.js");
var utils_request = require("../../../utils/request.js");
require("../../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      questionTitle: "",
      questionId: 0,
      answerText: "",
      imageFiles: [],
      videoFiles: [],
      isAnonymity: 0,
      isShowAnonymity: false,
      buttonIsLoading: false
    };
  },
  async onLoad(params) {
    this.isShowAnonymity = await this.getAnonymityState();
    this.questionTitle = JSON.parse(JSON.parse(decodeURIComponent(params.questionTitle)));
    this.questionId = params.questionId;
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onTextareaInput(e) {
      this.answerText = e.detail.value;
    },
    onImageFilesSelect(e) {
      let tempFiles = this.imageFiles;
      e.tempFilePaths.forEach((item, index) => {
        tempFiles.push({
          url: item,
          file: e.tempFiles[index]
        });
      });
      this.imageFiles = tempFiles;
    },
    onSwitchClick() {
      this.isAnonymity = this.isAnonymity == 1 ? 0 : 1;
    },
    onImageIconClick() {
      if (this.videoFiles.length > 0) {
        common_vendor.index.showModal({
          title: "\u65E0\u6CD5\u9009\u62E9\u56FE\u7247",
          content: "\u4E00\u4E2A\u52A8\u6001\u4E0D\u652F\u6301\u540C\u65F6\u53D1\u5E03\u89C6\u9891\u548C\u56FE\u7247\u54E6~"
        });
        return;
      }
      let _this = this;
      let maxNumber = 9 - this.imageFiles.length;
      if (maxNumber <= 0) {
        common_vendor.index.showToast({
          title: "\u6700\u591A\u9009\u62E99\u5F20\u54E6~",
          icon: "none"
        });
      } else {
        common_vendor.index.chooseImage({
          count: maxNumber,
          sizeType: ["original", "compressed"],
          sourceType: ["album"],
          success: function(res) {
            let tempFiles = _this.imageFiles;
            if (Array.isArray(res.tempFilePaths)) {
              res.tempFilePaths.forEach((item, index) => {
                tempFiles.push({
                  url: item,
                  file: res.tempFiles[index]
                });
              });
            }
            _this.imageFiles = tempFiles;
          }
        });
      }
    },
    onCameraIconClick() {
      let _this = this;
      let maxNumber = 9 - this.imageFiles.length;
      if (maxNumber <= 0) {
        common_vendor.index.showToast({
          title: "\u6700\u591A\u9009\u62E99\u5F20\u54E6~",
          icon: "none"
        });
      } else {
        common_vendor.index.chooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: [
            "camera"
          ],
          success: function(res) {
            var tempFiles = _this.imageFiles;
            if (Array.isArray(res.tempFilePaths)) {
              res.tempFilePaths.forEach((item, index) => {
                tempFiles.push({
                  url: item,
                  file: res.tempFiles[index]
                });
              });
              _this.imageFiles = tempFiles;
            }
          }
        });
      }
    },
    async onVideoIconClick() {
      let userInfo = await common_storageFunctions.getMyUserInfo();
      if (!userInfo) {
        common_vendor.index.showModal({
          title: "\u65E0\u6CD5\u9009\u62E9",
          content: "\u60A8\u8FD8\u672A\u767B\u5F55\uFF0C\u8BF7\u5148\u767B\u5F55",
          success: function(res) {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "../login/login"
              });
            }
          }
        });
        return;
      } else {
        if (userInfo.isVerify == 1 && userInfo.vip && userInfo.vip.remainDays > 0)
          ;
        else {
          common_vendor.index.showModal({
            title: "\u9009\u62E9\u5931\u8D25",
            content: "\u53EA\u6709\u5B9E\u540D\u8BA4\u8BC1\u5E76\u4E14\u4E3Avip\u7528\u6237\u624D\u80FD\u53D1\u5E03\u89C6\u9891\u54E6~"
          });
          return;
        }
      }
      if (this.videoFiles.length >= 1) {
        common_vendor.index.showModal({
          title: "\u65E0\u6CD5\u9009\u62E9\u89C6\u9891",
          content: "\u4E00\u4E2A\u56DE\u7B54\u53EA\u80FD\u9009\u62E9\u4E00\u4E2A\u89C6\u9891"
        });
        return;
      }
      common_vendor.index.chooseVideo({
        sourceType: ["camera", "album"],
        maxDuration: 60,
        camera: "back",
        success: (res) => {
          if (res.duration > 210) {
            common_vendor.index.showModal({
              title: "\u9009\u62E9\u5931\u8D25",
              content: "\u53EA\u80FD\u9009\u62E93\u520630\u79D2\u4EE5\u4E0B\u7684\u89C6\u5C4F\u54E6~"
            });
            return;
          }
          this.videoFiles = [{
            url: res.tempFilePath
          }];
        }
      });
    },
    async getAnonymityState() {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: "anonymity/state",
          data: {},
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        return res.data.data;
      } else {
        return false;
      }
    },
    async prepareBeforePublic() {
      let userInfo = await common_storageFunctions.getMyUserInfo();
      if (!userInfo) {
        common_vendor.index.showModal({
          title: "\u53D1\u5E03\u5931\u8D25",
          content: "\u60A8\u8FD8\u672A\u767B\u5F55\uFF0C\u8BF7\u5148\u767B\u5F55",
          success: function(res) {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "../login/login"
              });
            }
          }
        });
        return;
      }
      if (this.answerText.length <= 0 && this.imageFiles.length <= 0 && this.videoFiles.length <= 0) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u8F93\u5165\u5185\u5BB9",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "\u6B63\u5728\u53D1\u5E03"
      });
      this.buttonIsLoading = true;
      var _this = this;
      let imgs = [];
      let fileVouchers = [];
      let isVideo = 0;
      if (this.imageFiles.length > 0 && this.videoFiles.length > 0) {
        common_vendor.index.showModal({
          title: "\u53D1\u5E03\u5931\u8D25",
          content: "\u4E00\u4E2A\u56DE\u7B54\u4E0D\u80FD\u540C\u65F6\u53D1\u5E03\u89C6\u9891\u548C\u56FE\u7247"
        });
        return;
      } else if (this.videoFiles.length > 0) {
        isVideo = 1;
      }
      let mediaFiles = isVideo === 0 ? this.imageFiles : this.videoFiles;
      if (mediaFiles.length > 0) {
        let sum = mediaFiles.length;
        let res = await utils_request.request({
          data: {
            method: "GET",
            group: "answer",
            action: "publish/getToken",
            data: {
              sum
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          }
        });
        if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          fileVouchers = res.data.data;
        } else {
          common_vendor.index.showToast({
            title: res.data.userMsg,
            icon: "none"
          });
          return;
        }
        fileVouchers.forEach((item) => {
          imgs.push(item.fileName);
        });
      }
      if (mediaFiles.length < 1) {
        this.publishAnswer(this.questionId, this.answerText, [], this.isAnonymity, 0);
        return;
      }
      mediaFiles.forEach(async (item, index) => {
        common_vendor.index.uploadFile({
          url: common_constants.UploadUrl,
          filePath: item.url,
          name: "file",
          formData: {
            "key": fileVouchers[index].fileName,
            "token": utils_aes_export.aes.decrypt(fileVouchers[index].token)
          },
          success(fileRes) {
            if (index === mediaFiles.length - 1) {
              _this.publishAnswer(_this.questionId, _this.answerText, imgs, _this.isAnonymity, isVideo);
            }
          }
        });
      });
    },
    async publishAnswer(questionId, text, pic, isAnonymity, isVideo) {
      let res = await utils_request.request({
        data: {
          method: "POST",
          group: "answer",
          action: "publish",
          data: {
            questionId,
            text,
            pic: JSON.stringify(pic),
            isVideo,
            isAnonymity
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      common_vendor.index.hideLoading();
      this.buttonIsLoading = false;
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        common_vendor.index.showToast({
          title: "\u53D1\u5E03\u6210\u529F",
          icon: "success"
        });
        this.answerText = "";
        this.imageFiles = [];
        this.videoFiles = [];
        common_vendor.index.navigateBack();
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  (_easycom_uni_nav_bar2 + _easycom_uni_file_picker2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_file_picker = () => "../../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_file_picker)();
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
    c: common_vendor.t($data.questionTitle),
    d: $data.answerText,
    e: common_vendor.o((...args) => $options.onTextareaInput && $options.onTextareaInput(...args)),
    f: $data.imageFiles.length > 0
  }, $data.imageFiles.length > 0 ? {
    g: common_vendor.o($options.onImageFilesSelect),
    h: common_vendor.o(($event) => $data.imageFiles = $event),
    i: common_vendor.p({
      fileMediatype: "image",
      mode: "grid",
      limit: "9",
      modelValue: $data.imageFiles
    })
  } : {}, {
    j: common_vendor.f($data.videoFiles, (item, index, i0) => {
      return {
        a: `video_${index}`,
        b: item.url,
        c: index
      };
    }),
    k: $data.isShowAnonymity
  }, $data.isShowAnonymity ? {
    l: $data.isAnonymity == 1,
    m: common_vendor.o(($event) => $options.onSwitchClick())
  } : {}, {
    n: common_vendor.o(($event) => $options.onImageIconClick()),
    o: common_vendor.o(($event) => $options.onCameraIconClick()),
    p: common_vendor.o(($event) => $options.onVideoIconClick()),
    q: common_vendor.t($data.answerText.length),
    r: common_vendor.o(($event) => $options.prepareBeforePublic()),
    s: $data.buttonIsLoading
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/publish/write-answers/write-answers.vue"]]);
wx.createPage(MiniProgramPage);
