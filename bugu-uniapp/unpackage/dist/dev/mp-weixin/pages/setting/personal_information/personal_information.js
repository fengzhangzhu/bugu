"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_storageKeys = require("../../../common/storageKeys.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var common_requestFunctions = require("../../../common/requestFunctions.js");
var common_constants = require("../../../common/constants.js");
var utils_aes_export = require("../../../utils/aes/export.js");
var utils_request = require("../../../utils/request.js");
var common_globalMsgKeys = require("../../../common/globalMsgKeys.js");
const _sfc_main = {
  data() {
    return {
      userId: 0,
      username: "",
      avatar: "",
      sex: 0,
      isVerify: 0,
      sexGrounp: common_constants.sexGrounp
    };
  },
  onLoad() {
    this.refreshUserInfo();
  },
  onShow() {
    let _this = this;
    common_vendor.index.$once(common_globalMsgKeys.REFRESH_USERINFO, function(data) {
      if (data.needRefresh) {
        _this.refreshUserInfo();
      }
    });
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    async refreshUserInfo() {
      let userInfoBefore = await common_storageFunctions.getMyUserInfo();
      let userInfoNow = await common_requestFunctions.getUserinfo(userInfoBefore.id);
      if (userInfoNow) {
        common_vendor.index.setStorage({
          key: common_storageKeys.USER_INFO,
          data: userInfoNow
        });
        this.id = userInfoNow.id;
        this.username = userInfoNow.username;
        this.avatar = userInfoNow.avatar;
        this.sex = userInfoNow.sex == null ? -1 : userInfoNow.sex;
        this.isVerify = userInfoNow.isVerify;
      }
    },
    onChangeAvatarClick() {
      this.$refs.changeAvatarPopup.open();
    },
    onSexPickerChange(e) {
      this.changeSex(e.detail.value);
    },
    onSeletImage(type) {
      let _this = this;
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: [type],
        success: function(res) {
          var tempFiles = res.tempFilePaths;
          _this.changeAvatar(tempFiles[0]);
        }
      });
    },
    async changeAvatar(fileUrl) {
      common_vendor.index.showLoading({
        title: "\u6B63\u5728\u53D1\u5E03"
      });
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "user",
          action: "avatar/token",
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
            let AvatarChangeRes = await utils_request.request({
              data: {
                method: "POST",
                group: "user",
                action: "avatar/change",
                data: {
                  fileName
                },
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                }
              }
            });
            if (AvatarChangeRes.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
              common_vendor.index.showToast({
                title: "\u66F4\u6362\u5934\u50CF\u6210\u529F"
              });
              _this.$refs.changeAvatarPopup.close();
              _this.refreshUserInfo();
              common_vendor.index.$emit(common_globalMsgKeys.REFRESH_USERINFO, { needRefresh: true });
            }
          }
        });
      }
    },
    async changeSex(sex) {
      common_vendor.index.showLoading({
        title: "\u4FEE\u6539\u4E2D"
      });
      let res = await utils_request.request({
        data: {
          method: "POST",
          group: "user",
          action: "sex/update",
          data: {
            sex
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        common_vendor.index.showToast({
          title: "\u4FEE\u6539\u6027\u522B\u6210\u529F"
        });
        this.refreshUserInfo();
        common_vendor.index.$emit(common_globalMsgKeys.REFRESH_USERINFO, { needRefresh: true });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_nav_bar2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_uni_popup2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_list_item = () => "../../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_list_item + _easycom_uni_list + _easycom_uni_popup)();
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
    c: common_vendor.o($options.onChangeAvatarClick),
    d: common_vendor.p({
      clickable: true,
      thumb: $data.avatar,
      thumbSize: "lg",
      showArrow: true,
      rightText: "\u4FEE\u6539\u5934\u50CF"
    }),
    e: common_vendor.p({
      clickable: true,
      showArrow: true,
      link: true,
      to: `/pages/setting/personal_information/change-username?username=${$data.username}`,
      title: "\u6635\u79F0",
      rightText: $data.username
    }),
    f: common_vendor.p({
      clickable: true,
      showArrow: true,
      title: "\u6027\u522B",
      rightText: $data.sex == -1 ? "\u672A\u8BBE\u7F6E" : $data.sexGrounp[$data.sex]
    }),
    g: $data.sexGrounp,
    h: $data.sex,
    i: common_vendor.o((...args) => $options.onSexPickerChange && $options.onSexPickerChange(...args)),
    j: common_vendor.p({
      clickable: true,
      showArrow: true,
      title: "\u662F\u5426\u5B9E\u540D\u8BA4\u8BC1",
      rightText: $data.isVerify == 1 ? "\u5DF2\u5B9E\u540D\u8BA4\u8BC1" : "\u672A\u5B9E\u540D\u8BA4\u8BC1"
    }),
    k: $data.avatar
  }, $data.avatar ? {
    l: $data.avatar,
    m: common_vendor.o(($event) => $options.onSeletImage("camera")),
    n: common_vendor.o(($event) => $options.onSeletImage("album"))
  } : {}, {
    o: common_vendor.sr("changeAvatarPopup", "17479eaa-6"),
    p: common_vendor.p({
      type: "center"
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/personal_information/personal_information.vue"]]);
wx.createPage(MiniProgramPage);
