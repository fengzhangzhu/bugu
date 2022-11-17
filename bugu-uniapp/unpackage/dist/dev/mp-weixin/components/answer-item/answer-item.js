"use strict";
var utils_dateUtils = require("../../utils/dateUtils.js");
var common_constants = require("../../common/constants.js");
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "answer-item",
  props: {
    answerData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { answerData, click, moreClick } = props;
    return {
      answerData,
      click,
      moreClick
    };
  },
  emits: ["click", "moreClick"],
  computed: {
    answerAvatar() {
      if (!this.answerData) {
        return "";
      } else {
        if (this.answerData.isAnonymity == 1) {
          return common_constants.AnonymousAvatar;
        } else {
          if (this.answerData.publisher) {
            return this.answerData.publisher.avatar + common_constants.avatar_pic_hendle;
          } else {
            return "";
          }
        }
      }
    },
    answerUsername() {
      if (!this.answerData) {
        return "";
      } else {
        if (this.answerData.isAnonymity == 1) {
          return "\u67D0\u53EA\u5C0F\u5E03\u5495";
        } else {
          if (this.answerData.publisher) {
            return this.answerData.publisher.username;
          } else {
            return "";
          }
        }
      }
    },
    hadVideo() {
      if (!this.answerData) {
        return false;
      } else {
        if (this.answerData.isVideo === 1) {
          return true;
        } else {
          return false;
        }
      }
    },
    answerImage() {
      if (!this.answerData) {
        return "";
      } else {
        if (this.answerData.pic.length > 0) {
          if (this.answerData.isVideo === 1) {
            return this.answerData.pic[0] + "?vframe/jpg/offset/0";
          } else {
            return this.answerData.pic[0];
          }
        } else {
          return "";
        }
      }
    },
    answerAgreeSum() {
      if (!this.answerData) {
        return 0;
      } else {
        if (this.answerData.agreeSum < 1e3) {
          return this.answerData.agreeSum;
        } else {
          return this.answerData.agreeSum / 1e3 + "K";
        }
      }
    },
    answerCommentSum() {
      if (!this.answerData) {
        return 0;
      } else {
        if (this.answerData.commentSum < 1e3) {
          return this.answerData.commentSum;
        } else {
          return this.answerData.commentSum / 1e3 + "K";
        }
      }
    },
    publishTime() {
      if (!this.answerData) {
        return "";
      } else {
        return utils_dateUtils.GettimeifferenceOfNow(this.answerData.publishTime).DistanceNow;
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    onAnserItemClick() {
      this.$emit("click");
    },
    moreClick() {
      this.$emit("moreClick");
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
    a: $options.answerAvatar,
    b: common_vendor.t($options.answerUsername),
    c: $options.answerImage
  }, $options.answerImage ? {
    d: $options.answerImage,
    e: common_vendor.p({
      customPrefix: "customicons",
      type: "videocam-filled",
      color: "#c5c5c5dc",
      size: "80"
    }),
    f: $options.hadVideo
  } : {}, {
    g: common_vendor.t($setup.answerData.text),
    h: common_vendor.t($options.answerAgreeSum),
    i: common_vendor.t($options.answerCommentSum),
    j: common_vendor.t($options.publishTime),
    k: common_vendor.o((...args) => $options.moreClick && $options.moreClick(...args)),
    l: common_vendor.o(($event) => $options.onAnserItemClick())
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/answer-item/answer-item.vue"]]);
wx.createComponent(Component);
