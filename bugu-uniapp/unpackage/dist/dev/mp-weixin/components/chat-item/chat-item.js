"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
const innerAudioContext = common_vendor.index.createInnerAudioContext();
const _sfc_main = {
  name: "chat-item",
  props: {
    chatText: {
      type: String,
      required: true
    },
    messageType: {
      type: Number,
      required: true
    },
    avatarUrl: {
      type: String,
      default: ""
    },
    isMe: {
      type: Boolean,
      default: false
    },
    voiceTime: {
      type: Number,
      default: 0
    },
    isNotRead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPlayVoice: false,
      avatar_pic_hendle: common_constants.avatar_pic_hendle
    };
  },
  methods: {
    onVoicePlayClick() {
      if (this.isPlayVoice) {
        innerAudioContext.stop();
        this.isPlayVoice = false;
      } else {
        innerAudioContext.src = this.chatText;
        innerAudioContext.play();
        this.isPlayVoice = true;
        innerAudioContext.onEnded(() => {
          this.isPlayVoice = false;
        });
      }
    },
    onLongPress() {
      this.$emit("onLongPress");
    },
    onImageClick() {
      common_vendor.index.previewImage({ urls: [this.chatText], current: this.chatText });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.messageType == -1
  }, $props.messageType == -1 ? {
    b: common_vendor.t($props.chatText)
  } : common_vendor.e({
    c: $props.avatarUrl + $data.avatar_pic_hendle,
    d: $props.messageType == 1
  }, $props.messageType == 1 ? {
    e: $props.chatText,
    f: common_vendor.o((...args) => $options.onImageClick && $options.onImageClick(...args))
  } : $props.messageType == 2 ? {
    h: common_vendor.t($data.isPlayVoice ? "\u6B63\u5728\u64AD\u653E" : `${$props.voiceTime}`),
    i: common_vendor.o((...args) => $options.onVoicePlayClick && $options.onVoicePlayClick(...args)),
    j: `${$props.voiceTime / 20 * 100}px`
  } : {
    k: common_vendor.t($props.chatText)
  }, {
    g: $props.messageType == 2,
    l: $props.isNotRead
  }, $props.isNotRead ? {} : {}, {
    m: common_vendor.o((...args) => $options.onLongPress && $options.onLongPress(...args)),
    n: common_vendor.n($props.isMe ? "chat-item-me-content" : "chat-item-content")
  }));
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/chat-item/chat-item.vue"]]);
wx.createComponent(Component);
