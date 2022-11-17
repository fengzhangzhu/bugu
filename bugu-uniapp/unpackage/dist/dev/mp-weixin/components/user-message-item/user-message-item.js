"use strict";
var utils_dateUtils = require("../../utils/dateUtils.js");
var common_constants = require("../../common/constants.js");
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "user-message-item",
  props: {
    badgeNumber: {
      type: Number,
      default: 0
    },
    avatar: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    note: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    needOnlineState: {
      type: Boolean,
      default: false
    },
    onLineState: {
      type: Boolean,
      default: false
    },
    messageType: {
      type: String,
      default: "user"
    }
  },
  computed: {
    lastTime() {
      return utils_dateUtils.GettimeifferenceOfNow(this.time).Detailed;
    },
    messageAvatr() {
      if (this.messageType === "official") {
        return this.avatar;
      } else {
        return this.avatar + common_constants.avatar_pic_hendle;
      }
    }
  },
  data() {
    return {
      avatar_pic_hendle: common_constants.avatar_pic_hendle
    };
  },
  emits: ["onClick", "onMoreClick"],
  methods: {
    onClick() {
      this.$emit("onClick");
    },
    onMoreClick() {
      this.$emit("onMoreClick");
    }
  }
};
if (!Array) {
  const _component_Text = common_vendor.resolveComponent("Text");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_component_Text + _easycom_uni_icons2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.messageAvatr,
    b: $props.needOnlineState
  }, $props.needOnlineState ? {
    c: $props.onLineState ? "#3bd8bf" : "#c4c4c4"
  } : {}, {
    d: common_vendor.t($props.title),
    e: common_vendor.t($options.lastTime),
    f: common_vendor.p({
      customPrefix: "customicons",
      type: "more-filled",
      color: "#a1a1a1",
      size: "20"
    }),
    g: common_vendor.o(($event) => $options.onMoreClick()),
    h: $props.note
  }, $props.note ? common_vendor.e({
    i: common_vendor.t($props.note.length > 15 ? $props.note.slice(0, 15) + "..." : $props.note),
    j: $props.badgeNumber > 0
  }, $props.badgeNumber > 0 ? {
    k: common_vendor.t($props.badgeNumber > 99 ? "\xB7\xB7\xB7" : $props.badgeNumber)
  } : {}) : {}, {
    l: common_vendor.o(($event) => $options.onClick())
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/user-message-item/user-message-item.vue"]]);
wx.createComponent(Component);
