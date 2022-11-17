"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_request = require("../../utils/request.js");
var common_constants = require("../../common/constants.js");
var utils_dateUtils = require("../../utils/dateUtils.js");
const _sfc_main = {
  name: "visitor-item",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      unlocked: false,
      visitorInfo: {}
    };
  },
  computed: {
    avatar() {
      return this.unlocked && this.visitorInfo.avatar ? this.visitorInfo.avatar : this.item.avatar;
    },
    username() {
      return this.unlocked && this.visitorInfo.username ? this.visitorInfo.username : `\u5DF2\u7ECF\u8BBF\u95EE\u8FC7\u4F60${this.item.visitSum}\u6B21\u4E86`;
    },
    lastTime() {
      return utils_dateUtils.GettimeifferenceOfNow(this.item.lastTime).DistanceNow;
    }
  },
  methods: {
    onUnlockButtonClick() {
      if (this.unlocked) {
        common_vendor.index.navigateTo({
          url: `/pages/user-home-page/user-home-page?userId=${this.visitorInfo.id}&isAttention=${this.visitorInfo.isAttention}`
        });
      } else {
        this.unLockVisitor(this.item.visitorId);
      }
    },
    async unLockVisitor(visitorId) {
      common_vendor.index.showLoading({
        title: "\u6B63\u5728\u89E3\u9501"
      });
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "user/visitor",
          action: `${visitorId}/unlock`,
          data: {
            visitorId
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      common_vendor.index.hideLoading();
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        this.unlocked = true, this.visitorInfo = res.data.data;
        common_vendor.index.showToast({
          title: "\u89E3\u9501\u6210\u529F",
          icon: "success"
        });
        return true;
      } else if (res.data.code === "A0203") {
        common_vendor.index.showModal({
          title: "\u6CA1\u6709\u6743\u9650",
          content: "\u53EA\u6709vip\u624D\u80FD\u67E5\u770B\u8BBF\u5BA2\u54E6~",
          cancelText: "\u6211\u77E5\u9053\u4E86",
          confirmText: "\u7ACB\u5373\u5145\u503C",
          success: function(e) {
            if (e.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/setting/bugu-vip/bugu-vip"
              });
            } else if (e.cancel) {
              console.log("\u7528\u6237\u70B9\u51FB\u53D6\u6D88");
            }
          }
        });
      } else {
        return false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.avatar + "?imageView2/1/w/100/h/100",
    b: $data.unlocked ? "none" : " blur(10rpx)",
    c: common_vendor.t($options.username),
    d: common_vendor.t($options.lastTime),
    e: common_vendor.t($data.unlocked ? "\u53BBTa\u7684\u4E3B\u9875" : "\u89E3\u9501\u8BBF\u5BA2"),
    f: common_vendor.o((...args) => $options.onUnlockButtonClick && $options.onUnlockButtonClick(...args))
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/visitor-item/visitor-item.vue"]]);
wx.createComponent(Component);
