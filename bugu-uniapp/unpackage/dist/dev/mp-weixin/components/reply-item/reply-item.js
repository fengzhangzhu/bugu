"use strict";
var common_constants = require("../../common/constants.js");
var utils_textFilter = require("../../utils/textFilter.js");
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "reply-item",
  props: {
    replyCommentData: {
      type: Object,
      required: true
    },
    isAuthor: {
      type: Boolean,
      default: false
    },
    isLead: {
      type: Boolean,
      default: false
    },
    commentType: {
      type: String,
      default: "activity"
    }
  },
  data() {
    return {};
  },
  computed: {
    replyText() {
      return utils_textFilter.textFilter(this.replyCommentData.content);
    },
    avatar() {
      return this.replyCommentData.fromUserAvatar ? this.replyCommentData.fromUserAvatar + common_constants.avatar_pic_hendle : common_constants.AnonymousAvatar;
    },
    username() {
      return this.replyCommentData.fromUsername ? this.replyCommentData.fromUsername : "\u67D0\u53EA\u5C0F\u5E03\u5495";
    }
  },
  methods: {
    onClick() {
      if (this.replyCommentData.isDeleted != 1) {
        this.$emit("onClick");
      }
    },
    onMoreClick() {
      this.$emit("onMoreClick");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.avatar,
    b: common_vendor.t($options.username),
    c: $props.isAuthor
  }, $props.isAuthor ? {} : $props.isLead ? {} : {}, {
    d: $props.isLead,
    e: $props.replyCommentData.isDeleted != 1
  }, $props.replyCommentData.isDeleted != 1 ? {
    f: common_vendor.o(($event) => $options.onMoreClick())
  } : {}, {
    g: $props.replyCommentData.isDeleted == 1
  }, $props.replyCommentData.isDeleted == 1 ? {} : common_vendor.e({
    h: $props.replyCommentData.toUserId != 0
  }, $props.replyCommentData.toUserId != 0 ? {
    i: common_vendor.t($props.replyCommentData.toUserId == -1 ? "\u67D0\u53EA\u5C0F\u5E03\u5495" : $props.replyCommentData.toUsername)
  } : {}, {
    j: common_vendor.t($options.replyText)
  }), {
    k: common_vendor.o(($event) => $options.onClick()),
    l: `reply_${$props.replyCommentData.id}`
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/reply-item/reply-item.vue"]]);
wx.createComponent(Component);
