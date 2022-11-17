"use strict";
var common_vendor = require("../../common/vendor.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
require("../../common/constants.js");
require("../../utils/request.js");
const _sfc_main = {
  name: "fan-item",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    buttontext() {
      return this.isFollowed ? "\u4E92\u76F8\u5173\u6CE8" : "\u5173\u6CE8";
    }
  },
  created() {
    if (this.item.mutual == 1) {
      this.isFollowed = true;
    } else {
      this.isFollowed = false;
    }
  },
  data() {
    return {
      isFollowed: false
    };
  },
  methods: {
    onContentClick() {
      common_vendor.index.navigateTo({
        url: `/pages/user-home-page/user-home-page?userId=${this.item.id}`
      });
    },
    async onFollowButtonClick() {
      if (!this.isFollowed) {
        if (await common_requestFunctions.followUser(this.item.id)) {
          this.isFollowed = true;
        }
      } else {
        let _this = this;
        common_vendor.index.showModal({
          title: "\u53D6\u6D88\u5173\u6CE8",
          content: "\u4F60\u786E\u5B9A\u8981\u53D6\u6D88\u5173\u6CE8\u8FD9\u4E2A\u7528\u6237\u5417\uFF1F",
          success: async function(res) {
            if (res.confirm) {
              if (await common_requestFunctions.cancelAttention(_this.item.id)) {
                _this.isFollowed = false;
              }
            } else if (res.cancel) {
              console.log("\u7528\u6237\u70B9\u51FB\u53D6\u6D88");
            }
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.item.avatar + "?imageView2/1/w/100/h/100",
    b: common_vendor.t($props.item.username),
    c: common_vendor.t($options.buttontext),
    d: $data.isFollowed ? "#bbbbbb" : "#75e4d2",
    e: common_vendor.o((...args) => $options.onFollowButtonClick && $options.onFollowButtonClick(...args)),
    f: common_vendor.o(($event) => $options.onContentClick())
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/fan-item/fan-item.vue"]]);
wx.createComponent(Component);
