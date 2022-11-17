"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
var utils_dateUtils = require("../../utils/dateUtils.js");
const _sfc_main = {
  name: "interactive-message-item",
  props: {
    interactiveData: {
      type: Object,
      required: true
    }
  },
  computed: {
    createTime() {
      return utils_dateUtils.GettimeifferenceOfNow(this.interactiveData.createTime).DistanceNow;
    },
    username() {
      return this.interactiveData.username.length < 7 ? this.interactiveData.username : this.interactiveData.username.slice(0, 7) + "...";
    },
    avatar() {
      return this.interactiveData.avatar + common_constants.avatar_pic_hendle;
    },
    title() {
      let type = this.interactiveData.type;
      let title = "";
      if (type === common_constants.InteractiveType.COMMENT) {
        title = "\u8BC4\u8BBA";
      } else if (type === common_constants.InteractiveType.LIKE) {
        title = "\u559C\u6B22";
      } else if (type === common_constants.InteractiveType.ATTENTION) {
        title = "\u5173\u6CE8";
      } else if (type === common_constants.InteractiveType.PUBLISH) {
        title = "\u53D1\u5E03";
      } else if (type === common_constants.InteractiveType.ANSWER) {
        title = "\u56DE\u7B54";
      } else if (type === common_constants.InteractiveType.AGREE) {
        title = "\u8D5E\u540C";
      }
      return title;
    },
    action() {
      let group = this.interactiveData.group;
      let title = "";
      if (group === common_constants.InteractiveGroup.ACTIVITY) {
        title = "\u52A8\u6001";
      } else if (group === common_constants.InteractiveGroup.QUESTION) {
        title = "\u95EE\u9898";
      } else if (group === common_constants.InteractiveGroup.ANSWER) {
        title = "\u56DE\u7B54";
      }
      return title;
    }
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.interactiveData);
  },
  methods: {
    onAvatarClick() {
      common_vendor.index.navigateTo({
        url: `/pages/user-home-page/user-home-page?userId=${this.interactiveData.userId}`
      });
    },
    onClick() {
      this.$emit("onClick");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.avatar,
    b: common_vendor.o((...args) => $options.onAvatarClick && $options.onAvatarClick(...args)),
    c: common_vendor.t($options.username),
    d: $props.interactiveData.type === "LIKE"
  }, $props.interactiveData.type === "LIKE" ? {} : {
    e: common_vendor.t($options.title)
  }, {
    f: common_vendor.t($options.action),
    g: common_vendor.t($options.createTime),
    h: common_vendor.o((...args) => $options.onClick && $options.onClick(...args))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/interactive-message-item/interactive-message-item.vue"]]);
wx.createComponent(Component);
