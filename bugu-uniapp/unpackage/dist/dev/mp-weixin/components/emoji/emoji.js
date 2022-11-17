"use strict";
var common_constants = require("../../common/constants.js");
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    contentHeight: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      emojiList: common_constants.emojiList
    };
  },
  methods: {
    setEmoj(item, index) {
      this.$nextTick(() => {
        this.$emit("setEmoj", item, index);
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.emojiList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.o(($event) => $options.setEmoj(item, index)),
        c: index
      };
    }),
    b: $props.contentHeight + "px"
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7b8efcd2"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/emoji/emoji.vue"]]);
wx.createComponent(Component);
