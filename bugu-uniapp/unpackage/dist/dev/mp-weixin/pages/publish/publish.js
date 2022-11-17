"use strict";
var common_vendor = require("../../common/vendor.js");
var common_storageFunctions = require("../../common/storageFunctions.js");
var utils_aes_export = require("../../utils/aes/export.js");
var common_constants = require("../../common/constants.js");
var utils_request = require("../../utils/request.js");
require("../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      articleText: "",
      imageFiles: [],
      videoFiles: [],
      labels: [],
      labelSelect: [],
      labelSelectIds: [],
      isAnonymity: 0,
      privateSelect: 0,
      privateSettingGroup: common_constants.privateSettingGroup,
      showEmojiPicker: false,
      labelPage: 1,
      isShowAnonymity: false,
      buttonIsLoading: false,
      labelSearchText: ""
    };
  },
  async beforeMount() {
    this.isShowAnonymity = await this.getAnonymityState();
    this.getLabels(this.labelPage);
  },
  onLoad(params) {
    let labelId = params.labelId;
    let labelContent = params.labelContent;
    if (labelId && labelContent) {
      this.labelSelect = [{
        id: labelId,
        content: labelContent,
        hot: 0
      }];
      this.labelSelectIds = [labelId];
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onTextareaInput(e) {
      this.articleText = e.detail.value;
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
    setEmoj(item) {
      this.articleText = this.articleText + item;
    },
    onSwitchClick() {
      this.isAnonymity = this.isAnonymity == 1 ? 0 : 1;
    },
    onPrivaterChooseClick() {
      this.$refs.privateSelectPopup.open();
    },
    onPrivaterAdioChange(evt) {
      for (let i = 0; i < this.privateSettingGroup.length; i++) {
        if (this.privateSettingGroup[i] === evt.detail.value) {
          this.privateSelect = i;
          break;
        }
      }
    },
    onAddLabelClick() {
      this.$refs.labelPopup.open();
    },
    onChooseLabelClick(item) {
      let labelSelect = this.labelSelect;
      let labelSelectIds = this.labelSelectIds;
      if (labelSelectIds.indexOf(item.id) == -1) {
        if (this.labelSelect.length >= 5) {
          common_vendor.index.showToast({
            title: "\u6700\u591A\u53EA\u80FD\u9009\u62E9\u4E94\u4E2A\u54E6~",
            icon: "none"
          });
          return;
        }
        labelSelectIds.push(item.id);
        labelSelect.push(item);
      } else {
        for (let i = 0; i < labelSelectIds.length; i++) {
          if (labelSelectIds[i] == item.id) {
            labelSelectIds.splice(i, 1);
            break;
          }
        }
        for (let i = 0; i < labelSelect.length; i++) {
          if (labelSelect[i].id == item.id) {
            labelSelect.splice(i, 1);
            break;
          }
        }
      }
      this.labelSelect = labelSelect;
      this.labelSelectIds = labelSelectIds;
    },
    onSearchInput(e) {
      this.labelSearchText = e;
    },
    onSearchConfirm() {
      if (this.labelSearchText.length < 1) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u8F93\u5165\u5185\u5BB9",
          icon: "none"
        });
      } else {
        this.searchLabels(this.labelSearchText);
      }
    },
    onRefreshLabelClick() {
      this.getLabels(this.labelPage);
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
      if (this.imageFiles.length > 0) {
        common_vendor.index.showModal({
          title: "\u65E0\u6CD5\u9009\u62E9\u89C6\u9891",
          content: "\u4E00\u4E2A\u52A8\u6001\u4E0D\u652F\u6301\u540C\u65F6\u53D1\u5E03\u89C6\u9891\u548C\u56FE\u7247\u54E6~"
        });
        return;
      }
      if (this.videoFiles.length >= 1) {
        common_vendor.index.showModal({
          title: "\u65E0\u6CD5\u9009\u62E9\u89C6\u9891",
          content: "\u4E00\u4E2A\u52A8\u6001\u53EA\u80FD\u9009\u62E9\u4E00\u4E2A\u89C6\u9891"
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
    onEmojiIconClick() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    onEmojiPickerCloseClick() {
      this.showEmojiPicker = false;
    },
    async searchLabels(context) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: "label/query",
          data: {
            content: context
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let labels = res.data.data;
        if (labels.length <= 0) {
          let label_id = await this.addLabel(context);
          if (label_id != 0) {
            this.labels = [{
              id: label_id,
              content: this.labelSearchText,
              hot: 0
            }];
            this.labelSearchText = "";
          }
        } else {
          this.labels = labels;
          this.labelSearchText = "";
        }
      } else {
        common_vendor.index.showToast({
          title: res.data.userMSg,
          icon: "none"
        });
      }
    },
    async addLabel(content) {
      let res = await utils_request.request({
        data: {
          method: "PUT",
          group: "activity",
          action: "label/add",
          data: {
            content
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        return res.data.data;
      } else {
        return 0;
      }
    },
    async getLabels(page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: "label/list",
          data: {
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let result = res.data.data;
        let labels = res.data.data.list;
        if (page < result.pageSum) {
          this.labelPage = this.labelPage + 1;
        } else {
          this.labelPage = 1;
        }
        for (let i = 0; i < this.labelSelect.length; i++) {
          let hava_data = false;
          for (let j = 0; j < labels.length; j++) {
            if (labels[j].id == this.labelSelect[i].id) {
              hava_data = true;
              break;
            }
          }
          if (!hava_data) {
            labels.push(this.labelSelect[i]);
          }
        }
        this.labels = labels;
      }
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
          success: function(res2) {
            if (res2.confirm) {
              common_vendor.index.navigateTo({
                url: "../login/login"
              });
            }
          }
        });
        return;
      }
      if (this.articleText.length <= 0 && this.imageFiles.length <= 0 && this.videoFiles.length <= 0) {
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
      let isVideo = 0;
      let uploadMedias = [];
      let mediaFiles = [];
      var _this = this;
      let filesNumber = 0;
      if (this.imageFiles.length > 0) {
        filesNumber = this.imageFiles.length;
        mediaFiles = this.imageFiles;
        if (this.videoFiles.length > 0) {
          common_vendor.index.showModal({
            title: "\u53D1\u5E03\u5931\u8D25",
            content: "\u4E00\u4E2A\u52A8\u6001\u4E0D\u80FD\u540C\u65F6\u53D1\u5E03\u89C6\u9891\u548C\u56FE\u7247\u54E6~"
          });
          return;
        }
      } else {
        if (this.videoFiles.length > 0) {
          if (userInfo.isVerify == 1 && userInfo.vip && userInfo.vip.remainDays > 0) {
            isVideo = 1;
            filesNumber = this.videoFiles.length;
            mediaFiles = this.videoFiles;
          } else {
            common_vendor.index.showModal({
              title: "\u53D1\u5E03\u5931\u8D25",
              content: "\u53EA\u6709\u5B9E\u540D\u8BA4\u8BC1\u5E76\u4E14\u4E3Avip\u7528\u6237\u624D\u80FD\u53D1\u5E03\u89C6\u9891\u54E6~"
            });
            return;
          }
        }
      }
      if (filesNumber < 1) {
        this.publishArticle(this.articleText, uploadMedias, this.privateSelect, this.isAnonymity, this.labelSelectIds);
        return;
      }
      let FileVouchers;
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: "publish/getToken",
          data: {
            sum: filesNumber
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        FileVouchers = res.data.data;
      } else {
        common_vendor.index.showToast({
          title: "\u6CA1\u6709\u6743\u9650\uFF0C\u8BF7\u5148\u767B\u5F55",
          icon: "none"
        });
        return;
      }
      FileVouchers.forEach((item) => {
        uploadMedias.push(item.fileName);
      });
      mediaFiles.forEach(async (item, index) => {
        common_vendor.index.uploadFile({
          url: common_constants.UploadUrl,
          filePath: item.url,
          name: "file",
          formData: {
            "key": FileVouchers[index].fileName,
            "token": utils_aes_export.aes.decrypt(FileVouchers[index].token)
          },
          success(fileRes) {
            if (index === mediaFiles.length - 1) {
              _this.publishArticle(_this.articleText, uploadMedias, _this.privateSelect, _this.isAnonymity, _this.labelSelectIds, isVideo);
            }
          }
        });
      });
    },
    async publishArticle(text, uploadMedias, visibility, isAnonymity, labelIds, video = 0) {
      let res = await utils_request.request({
        data: {
          method: "POST",
          group: "activity",
          action: "publish",
          data: {
            text,
            pic: JSON.stringify(uploadMedias),
            visibility,
            isAnonymity,
            labelIds: labelIds.length > 0 ? JSON.stringify(labelIds) : "",
            video
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
        this.articleText = "";
        this.imageFiles = [];
        this.labelSelect = [];
        this.labelSelectIds = [];
        this.videoFiles = [];
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_file_picker2 = common_vendor.resolveComponent("uni-file-picker");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_emoji2 = common_vendor.resolveComponent("emoji");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_uni_file_picker2 + _easycom_uni_tag2 + _easycom_uni_icons2 + _easycom_emoji2 + _easycom_uni_transition2 + _easycom_uni_search_bar2 + _easycom_uni_popup2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_file_picker = () => "../../uni_modules/uni-file-picker/components/uni-file-picker/uni-file-picker.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_emoji = () => "../../components/emoji/emoji.js";
const _easycom_uni_transition = () => "../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_file_picker + _easycom_uni_tag + _easycom_uni_icons + _easycom_emoji + _easycom_uni_transition + _easycom_uni_search_bar + _easycom_uni_popup + _easycom_action_sheet)();
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
    c: $data.articleText,
    d: common_vendor.o((...args) => $options.onTextareaInput && $options.onTextareaInput(...args)),
    e: $data.imageFiles.length > 0
  }, $data.imageFiles.length > 0 ? {
    f: common_vendor.o($options.onImageFilesSelect),
    g: common_vendor.o(($event) => $data.imageFiles = $event),
    h: common_vendor.p({
      fileMediatype: "image",
      mode: "grid",
      limit: "9",
      modelValue: $data.imageFiles
    })
  } : {}, {
    i: common_vendor.f($data.videoFiles, (item, index, i0) => {
      return {
        a: `video_${index}`,
        b: item.url,
        c: index
      };
    }),
    j: common_vendor.f($data.labelSelect, (item, index, i0) => {
      return {
        a: item.id,
        b: "555d53e9-2-" + i0,
        c: common_vendor.p({
          size: "small",
          text: `#${item.content}`,
          circle: true
        })
      };
    }),
    k: $data.isShowAnonymity
  }, $data.isShowAnonymity ? {
    l: $data.isAnonymity == 1,
    m: common_vendor.o(($event) => $options.onSwitchClick())
  } : {}, {
    n: common_vendor.o(($event) => $options.onAddLabelClick()),
    o: common_vendor.t($data.privateSettingGroup[$data.privateSelect]),
    p: common_vendor.p({
      color: "#b4b4b4",
      type: "right",
      size: "20"
    }),
    q: common_vendor.o(($event) => $options.onPrivaterChooseClick()),
    r: common_vendor.o(($event) => $options.onImageIconClick()),
    s: common_vendor.o(($event) => $options.onCameraIconClick()),
    t: common_vendor.o(($event) => $options.onVideoIconClick()),
    v: common_vendor.o(($event) => $options.onEmojiIconClick()),
    w: common_vendor.t($data.articleText.length),
    x: common_vendor.o(($event) => $options.prepareBeforePublic()),
    y: $data.buttonIsLoading,
    z: common_vendor.o(($event) => $options.onEmojiPickerCloseClick()),
    A: common_vendor.p({
      customPrefix: "customicons",
      type: "closeempty",
      color: "#808080",
      size: "25"
    }),
    B: common_vendor.o($options.setEmoj),
    C: common_vendor.p({
      ["mode-class"]: "slide-bottom",
      show: $data.showEmojiPicker
    }),
    D: common_vendor.o(($event) => $options.onSearchConfirm()),
    E: common_vendor.o(($event) => $data.labelSearchText = $event),
    F: common_vendor.p({
      placeholder: "\u641C\u7D22\u6807\u7B7E",
      cancelButton: "none",
      modelValue: $data.labelSearchText
    }),
    G: common_vendor.o(($event) => $options.onSearchConfirm()),
    H: common_vendor.f($data.labels, (item, k0, i0) => {
      return {
        a: item.id,
        b: common_vendor.o(($event) => $options.onChooseLabelClick(item), item.id),
        c: "555d53e9-9-" + i0 + ",555d53e9-7",
        d: common_vendor.p({
          type: $data.labelSelectIds.indexOf(item.id) != -1 ? "primary" : "default",
          text: item.content,
          size: "default",
          circle: true
        })
      };
    }),
    I: common_vendor.o(($event) => $options.onRefreshLabelClick()),
    J: common_vendor.sr("labelPopup", "555d53e9-7"),
    K: common_vendor.p({
      backgroundColor: "#ffffff",
      type: "bottom"
    }),
    L: common_vendor.f($data.privateSettingGroup, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: item,
        c: index === $data.privateSelect,
        d: item
      };
    }),
    M: common_vendor.o((...args) => $options.onPrivaterAdioChange && $options.onPrivaterAdioChange(...args)),
    N: common_vendor.sr("privateSelectPopup", "555d53e9-10"),
    O: common_vendor.p({
      needHead: true,
      title: "\u6743\u9650\u8BBE\u7F6E"
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/publish/publish.vue"]]);
wx.createPage(MiniProgramPage);
