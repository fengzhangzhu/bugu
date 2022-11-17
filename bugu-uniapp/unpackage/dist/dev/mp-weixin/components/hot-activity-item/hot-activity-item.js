"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "hot-activity-item",
  props: {
    hotNumber: {
      type: Number,
      required: true
    },
    hotText: {
      type: String,
      required: true
    },
    hotPic: {
      type: String,
      required: true
    },
    isVideo: {
      type: Boolean,
      default: false
    },
    ranking: {
      type: Number,
      required: true
    }
  },
  computed: {
    hot() {
      let hot = this.hotNumber;
      let hotText = hot;
      if (hot > 1e3) {
        hotText = hot / 1e3 + "k";
      }
      return hotText;
    }
  },
  emits: ["onClick"],
  methods: {
    onClick() {
      this.$emit("onClick");
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($props.ranking),
    b: $props.ranking == 1 ? "8rpx solid #EF4F4A" : $props.ranking == 2 ? "8rpx solid #FD930D" : $props.ranking == 3 ? "8rpx solid #F0C174" : "8rpx solid #56CDBA",
    c: $props.ranking == 1 ? "#EF4F4A" : $props.ranking == 2 ? "#FD930D" : $props.ranking == 3 ? "#F0C174" : "#56CDBA",
    d: common_vendor.t($props.hotText),
    e: common_vendor.t($options.hot),
    f: $props.hotPic
  }, $props.hotPic ? common_vendor.e({
    g: $props.isVideo
  }, $props.isVideo ? {
    h: $props.hotPic + "?vframe/jpg/offset/0",
    i: common_vendor.p({
      customPrefix: "customicons",
      type: "videocam-filled",
      color: "#c5c5c5dc",
      size: "30"
    })
  } : {
    j: $props.hotPic
  }) : {}, {
    k: common_vendor.o(($event) => $options.onClick())
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-28a80e28"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/hot-activity-item/hot-activity-item.vue"]]);
wx.createComponent(Component);
