"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
const _sfc_main = {
  name: "question-item",
  props: {
    questionData: {
      type: Object,
      required: true
    },
    answerData: {
      type: Object,
      required: false
    }
  },
  setup(props) {
    const { questionData, answerData } = props;
    return {
      questionData,
      answerData
    };
  },
  computed: {
    answerTips() {
      if (!this.answerData) {
        return "";
      } else {
        if (this.answerData.isAnonymity == 1) {
          return "";
        } else {
          if (this.answerData.publisher) {
            if (this.answerData.publisher.beAttentionSum > 1e3) {
              return "\u8D85\u8FC7" + this.answerData.publisher.beAttentionSum / 1e3 + "\u7528\u6237\u5173\u6CE8\u4E86TA";
            } else if (this.answerData.publisher.beAttentionSum > 50) {
              return "\u8D85\u8FC7" + this.answerData.publisher.beAttentionSum + "\u7528\u6237\u5173\u6CE8\u4E86TA";
            } else {
              return "";
            }
          } else {
            return "";
          }
        }
      }
    },
    noAnswer() {
      if (!this.answerData) {
        return true;
      } else {
        return false;
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
            return this.answerData.pic[0] + common_constants.activity_pic_hendle;
          }
        } else {
          return "";
        }
      }
    },
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
        if (this.answerData.isAnonymity === 1) {
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
    }
  },
  data() {
    return {};
  },
  methods: {
    onQuetionItemClick() {
      this.$emit("click");
    },
    moreClick() {
      this.$emit("moreClick");
    },
    onWriteAnswerClick() {
      common_vendor.index.navigateTo({
        url: `/pages/publish/write-answers/write-answers?questionTitle=${encodeURIComponent(JSON.stringify(JSON.stringify(this.questionData.title)))}&questionId=${this.questionData.id}`
      });
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
    a: $options.noAnswer
  }, $options.noAnswer ? {
    b: common_vendor.o((...args) => $options.moreClick && $options.moreClick(...args))
  } : {}, {
    c: common_vendor.t($setup.questionData.title),
    d: !$options.noAnswer
  }, !$options.noAnswer ? common_vendor.e({
    e: $options.answerAvatar,
    f: common_vendor.t($options.answerUsername),
    g: common_vendor.t($options.answerTips),
    h: $setup.answerData.text
  }, $setup.answerData.text ? {
    i: common_vendor.t($setup.answerData.text)
  } : {}, {
    j: $options.answerImage && $setup.answerData.text
  }, $options.answerImage && $setup.answerData.text ? {
    k: $options.answerImage,
    l: common_vendor.p({
      customPrefix: "customicons",
      type: "videocam-filled",
      color: "#c5c5c5dc",
      size: "30"
    }),
    m: $options.hadVideo
  } : {}) : {}, {
    n: $options.answerImage && !$setup.answerData.text
  }, $options.answerImage && !$setup.answerData.text ? {
    o: $options.answerImage,
    p: common_vendor.p({
      customPrefix: "customicons",
      type: "videocam-filled",
      color: "#c5c5c5dc",
      size: "80"
    }),
    q: $options.hadVideo
  } : {}, {
    r: $options.noAnswer
  }, $options.noAnswer ? {
    s: common_vendor.t($setup.questionData.viewSum),
    t: common_vendor.t($setup.questionData.collectSum),
    v: common_vendor.o((...args) => $options.onWriteAnswerClick && $options.onWriteAnswerClick(...args))
  } : {
    w: common_vendor.t($options.answerAgreeSum),
    x: common_vendor.t($options.answerCommentSum),
    y: common_vendor.o((...args) => $options.moreClick && $options.moreClick(...args))
  }, {
    z: common_vendor.o((...args) => $options.onQuetionItemClick && $options.onQuetionItemClick(...args))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/question-item/question-item.vue"]]);
wx.createComponent(Component);
