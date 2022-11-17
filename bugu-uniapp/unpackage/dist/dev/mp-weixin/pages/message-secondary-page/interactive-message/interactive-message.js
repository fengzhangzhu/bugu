"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var utils_messageUtils_storage = require("../../../utils/messageUtils/storage.js");
var utils_tabBarBadgeUtils = require("../../../utils/tabBarBadgeUtils.js");
var common_constants = require("../../../common/constants.js");
require("../../../common/storageKeys.js");
require("../../../utils/messageUtils/storageKeys.js");
require("../../../utils/dateUtils.js");
require("../../../common/requestFunctions.js");
require("../../../utils/request.js");
require("../../../common/globalMsgKeys.js");
require("../../../utils/messageUtils/index.js");
require("../../../utils/messageUtils/service.js");
const _sfc_main = {
  data() {
    return {
      type: common_constants.InteractiveType.LIKE,
      userInfo: {},
      interactiveMessageList: { unreadSum: 0, data: [] }
    };
  },
  async onLoad(params) {
    this.type = params.type;
    this.userInfo = await common_storageFunctions.getMyUserInfo();
    if (this.userInfo.id) {
      let interactiveMessageList = await utils_messageUtils_storage.getInteractiveMessageList(this.userInfo.id, this.type);
      this.interactiveMessageList = interactiveMessageList;
      utils_tabBarBadgeUtils.changeUnreadMessageSum(-interactiveMessageList.unreadSum);
      utils_messageUtils_storage.interactiveMessageALLRead(this.userInfo.id, this.type);
    }
  },
  computed: {
    title() {
      if (utils_messageUtils_storage.likeGroup.indexOf(this.type) > -1) {
        return "\u6211\u6536\u5230\u7684\u559C\u6B22\u548C\u8D5E\u540C";
      } else if (utils_messageUtils_storage.commentGroup.indexOf(this.type) > -1) {
        return "\u6211\u6536\u5230\u7684\u56DE\u7B54\u548C\u8BC4\u8BBA";
      }
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onInteractiveMessageItemClick(item) {
      if (item.type == common_constants.InteractiveType.ATTENTION) {
        common_vendor.index.navigateTo({ url: `/pages/user-home-page/user-home-page?userId=${item.userId}` });
      } else if (item.group === common_constants.InteractiveGroup.ACTIVITY) {
        common_vendor.index.navigateTo({
          url: `/pages/activity-info/activity-info?activityId=${item.contentId}`
        });
      } else if (item.group === common_constants.InteractiveGroup.QUESTION) {
        common_vendor.index.navigateTo({
          url: `/pages/activity-info/question-info/question-info?questionId=${item.contentId}`
        });
      } else if (item.group === common_constants.InteractiveGroup.ANSWER) {
        common_vendor.index.navigateTo({
          url: `/pages/activity-info/answer-info/answer-info?answerId=${item.contentId}`
        });
      }
    },
    onDeleteAllInteractiveMessageClick() {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u6E05\u9664\u5168\u90E8",
        content: "\u4F60\u786E\u5B9A\u8981\u6E05\u9664\u6240\u6709\u6D88\u606F\u5417\uFF1F",
        success: function(res) {
          if (res.confirm) {
            utils_messageUtils_storage.deleteAllInteractiveMessage(_this.userInfo.id, _this.type);
            _this.interactiveMessageList = { unreadSum: 0, data: [] };
            common_vendor.index.showToast({
              title: "\u6E05\u9664\u6210\u529F"
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_interactive_message_item2 = common_vendor.resolveComponent("interactive-message-item");
  (_easycom_uni_nav_bar2 + _easycom_interactive_message_item2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_interactive_message_item = () => "../../../components/interactive-message-item/interactive-message-item.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_interactive_message_item)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.title),
    b: common_vendor.o(($event) => $options.onNarLeftClick()),
    c: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    d: $data.interactiveMessageList.data.length > 0
  }, $data.interactiveMessageList.data.length > 0 ? {
    e: common_vendor.t($data.interactiveMessageList.data.length),
    f: common_vendor.o((...args) => $options.onDeleteAllInteractiveMessageClick && $options.onDeleteAllInteractiveMessageClick(...args))
  } : {}, {
    g: $data.interactiveMessageList.data.length > 0
  }, $data.interactiveMessageList.data.length > 0 ? {
    h: common_vendor.f($data.interactiveMessageList.data, (item, index, i0) => {
      return {
        a: item.createTime,
        b: common_vendor.o(($event) => $options.onInteractiveMessageItemClick(item), item.createTime),
        c: "507da3fe-1-" + i0,
        d: common_vendor.p({
          interactiveData: item
        })
      };
    })
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/message-secondary-page/interactive-message/interactive-message.vue"]]);
wx.createPage(MiniProgramPage);
