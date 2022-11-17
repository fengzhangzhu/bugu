"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_textFilter = require("../../utils/textFilter.js");
var common_constants = require("../../common/constants.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
var utils_dateUtils = require("../../utils/dateUtils.js");
require("../../utils/request.js");
const _sfc_main = {
  name: "activity-item",
  props: {
    articleItem: {
      type: Object,
      required: true
    },
    isMe: {
      type: Boolean,
      required: true
    },
    needShowAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      avatar_pic_hendle: common_constants.avatar_pic_hendle,
      activity_pic_hendle: common_constants.activity_pic_hendle,
      AnonymousAvatar: common_constants.AnonymousAvatar,
      imageContentStyle: "",
      numberOfpics: 0,
      maxLength: 100,
      transformTextLength: 0,
      showAll: true,
      isLiked: false,
      likeSum: 0,
      isAttention: 0,
      publishTime: "",
      playVideo: false,
      videoContext: {}
    };
  },
  created() {
    this.isLiked = this.articleItem.isLiked;
    this.likeSum = this.articleItem.likeSum;
    this.publishTime = utils_dateUtils.GettimeifferenceOfNow(this.articleItem.createTime).DistanceNow;
    if (this.articleItem.publisher) {
      this.isAttention = this.articleItem.publisher.isAttention;
    }
    this.initText();
    this.initImageTypesetting();
  },
  computed: {
    articleText() {
      return utils_textFilter.textFilter(this.articleItem.text);
    }
  },
  watch: {
    articleItem(newVal) {
      console.log("articleItem");
      if (newVal.isAnonymity == 0) {
        this.isAttention = newVal.publisher.isAttention;
      }
    }
  },
  methods: {
    onActivityClick() {
      try {
        this.$emit("onClick");
      } catch {
      }
    },
    onAvatarClick() {
      if (this.articleItem.isAnonymity == 0 && !this.isMe) {
        common_vendor.index.navigateTo({
          url: `/pages/user-home-page/user-home-page?userId=${this.articleItem.publisher.id}`
        });
      }
    },
    onChatButtonClick() {
      common_vendor.index.navigateTo({
        url: `/pages/message-secondary-page/chat-content/chat-content?fromUserId=${this.articleItem.publisher.id}`
      });
    },
    onMoreClick() {
      console.log("onMoreClick()");
      this.$emit("onMoreClick");
    },
    onImageClick(item) {
      common_vendor.index.previewImage({ urls: this.articleItem.pic, current: item });
    },
    onVideoClick() {
      this.playVideo = true;
      this.videoContext = common_vendor.index.createVideoContext(`video_${this.articleItem.id}`, this);
      console.log("this.videoContext", this.videoContext);
      this.videoContext.requestFullScreen({ direction: 0 });
      this.videoContext.play();
    },
    onFullscreenChange(e) {
      this.playVideo = e.detail.fullScreen;
      console.log("onFullscreenChange", e);
      if (!this.playVideo) {
        this.videoContext.stop();
      }
    },
    initText() {
      let text = this.articleItem.text;
      let line_breaks = 0;
      let textMatch = text.match(/\n/ig);
      if (textMatch) {
        line_breaks = textMatch.length;
      }
      if (line_breaks <= 0) {
        this.transformTextLength = text.length;
      } else {
        this.transformTextLength = text.length + line_breaks * 19;
        if (this.transformTextLength > 100) {
          let first_break = text.indexOf("\n");
          let temp_break = first_break;
          let real_break = first_break;
          let temp_text = text;
          while (temp_break < 100) {
            temp_text = text.slice(real_break + 1);
            if (temp_text.indexOf("\n") == -1) {
              break;
            }
            temp_break = temp_break + 20 + temp_text.indexOf("\n");
            real_break = real_break + 1 + temp_text.indexOf("\n");
          }
          this.maxLength = real_break;
        }
      }
      let showAll = this.transformTextLength <= 100;
      if (this.needShowAll) {
        this.showAll = true;
      } else {
        this.showAll = showAll;
      }
    },
    initImageTypesetting() {
      let numberOfpics = 0;
      if (this.articleItem.pic.length) {
        numberOfpics = this.articleItem.pic.length;
      }
      if (numberOfpics <= 1) {
        this.imageContentStyle = "picture-typesetting-1";
      } else if (numberOfpics == 2 || numberOfpics == 4) {
        this.imageContentStyle = "picture-typesetting-4";
      } else {
        this.imageContentStyle = "picture-typesetting-9";
      }
      this.numberOfpics = numberOfpics;
    },
    onLabelItemClick(item) {
      common_vendor.index.navigateTo({
        url: `../../pages/label-activity/label-activity?labelId=${item.id}&labelContent=${item.content}`
      });
    },
    onFollowButtonClick() {
      this.$emit("onFollowClick");
    },
    onShareClick() {
      console.log("onShareClick()");
      this.$emit("onShareClick");
    },
    async onLikeButtonClick() {
      let isLikeBefore = this.isLiked;
      let likeSumBefore = this.likeSum;
      if (isLikeBefore == 0) {
        this.isLiked = 1;
        this.likeSum = this.likeSum + 1;
        let res = await common_requestFunctions.LikeThisArtice(this.articleItem.id);
        if (!res) {
          this.isLiked = 0;
          this.likeSum = likeSumBefore;
        }
      } else {
        this.isLiked = 0;
        this.likeSum = this.likeSum - 1;
        let res = await common_requestFunctions.CancleLikeArticle(this.articleItem.id);
        if (!res) {
          this.isLiked = 1;
          this.likeSum = likeSumBefore;
        }
      }
    },
    onShowAllTextClick() {
      this.showAll = !this.showAll;
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
    a: $props.articleItem.isAnonymity == 1 ? $data.AnonymousAvatar : $props.articleItem.publisher.avatar + $data.avatar_pic_hendle,
    b: $props.articleItem.publisher && $props.articleItem.publisher.isVip == 1
  }, $props.articleItem.publisher && $props.articleItem.publisher.isVip == 1 ? {} : {}, {
    c: common_vendor.o(($event) => $options.onAvatarClick()),
    d: common_vendor.t($props.articleItem.isAnonymity == 1 ? "\u67D0\u53EA\u5C0F\u5E03\u5495" : $props.articleItem.publisher.username && $props.articleItem.publisher.username.length > 8 ? $props.articleItem.publisher.username.slice(0, 8) + "..." : $props.articleItem.publisher.username),
    e: $props.articleItem.publisher && $props.articleItem.publisher.isVerify == 1
  }, $props.articleItem.publisher && $props.articleItem.publisher.isVerify == 1 ? {} : {}, {
    f: $props.articleItem.publisher && $props.articleItem.publisher.sex != void 0
  }, $props.articleItem.publisher && $props.articleItem.publisher.sex != void 0 ? {
    g: common_vendor.n($props.articleItem.publisher.sex == 0 ? "iconfont icon-nvxing" : "iconfont icon-nanxing"),
    h: $props.articleItem.publisher.sex == 0 ? "#e86591" : "#528cea"
  } : {}, {
    i: common_vendor.t($data.publishTime),
    j: $props.articleItem.isAnonymity == 0
  }, $props.articleItem.isAnonymity == 0 ? common_vendor.e({
    k: !$props.isMe
  }, !$props.isMe ? common_vendor.e({
    l: $props.articleItem.publisher.isAttention == 0
  }, $props.articleItem.publisher.isAttention == 0 ? {
    m: common_vendor.o(($event) => $options.onFollowButtonClick())
  } : {
    n: common_vendor.o(($event) => $options.onChatButtonClick())
  }) : {}) : {}, {
    o: common_vendor.o(($event) => $options.onMoreClick()),
    p: common_vendor.f($props.articleItem.labels, (item, index, i0) => {
      return {
        a: common_vendor.t(item.content),
        b: item.id,
        c: common_vendor.o(($event) => $options.onLabelItemClick(item), item.id)
      };
    }),
    q: $data.showAll
  }, $data.showAll ? {
    r: common_vendor.t($options.articleText)
  } : {
    s: common_vendor.t($options.articleText.slice(0, $data.maxLength) + "...")
  }, {
    t: $data.transformTextLength > 100
  }, $data.transformTextLength > 100 ? common_vendor.e({
    v: $data.showAll
  }, $data.showAll ? {
    w: common_vendor.t(`
\u6536\u8D77`),
    x: common_vendor.o(($event) => $options.onShowAllTextClick())
  } : {
    y: common_vendor.t(`
\u5C55\u5F00`),
    z: common_vendor.o(($event) => $options.onShowAllTextClick())
  }) : {}, {
    A: $props.articleItem.video == 1
  }, $props.articleItem.video == 1 ? {
    B: common_vendor.f($props.articleItem.pic, (item, k0, i0) => {
      return {
        a: item + "?vframe/jpg/offset/0",
        b: item,
        c: "2e13c2c5-0-" + i0,
        d: common_vendor.o((...args) => $options.onVideoClick && $options.onVideoClick(...args), item),
        e: item
      };
    }),
    C: !$data.playVideo,
    D: $data.playVideo,
    E: `video_${$props.articleItem.id}`,
    F: common_vendor.o((...args) => $options.onFullscreenChange && $options.onFullscreenChange(...args)),
    G: common_vendor.p({
      customPrefix: "customicons",
      type: "videocam-filled",
      color: "#c5c5c5dc",
      size: "100"
    }),
    H: !$data.playVideo
  } : {}, {
    I: $props.articleItem.video != 1
  }, $props.articleItem.video != 1 ? {
    J: common_vendor.f($props.articleItem.pic, (item, index, i0) => {
      return {
        a: item,
        b: index,
        c: common_vendor.o(($event) => $options.onImageClick(item), index)
      };
    }),
    K: $data.numberOfpics <= 1 ? "widthFix" : "aspectFill",
    L: common_vendor.n("activity-body-image " + $data.imageContentStyle)
  } : {}, {
    M: $props.articleItem.video != 1 && $data.numberOfpics <= 1 ? "60vw" : "100%",
    N: common_vendor.o(($event) => $options.onShareClick()),
    O: common_vendor.n($data.isLiked == 0 ? "iconfont icon-dianzan" : $props.articleItem.isLiked == 0 ? "iconfont icon-dianzan1 is-activity" : "iconfont icon-dianzan1"),
    P: $data.isLiked == 0 ? "#b8b8b8" : "#83dbcd",
    Q: common_vendor.t($data.likeSum),
    R: common_vendor.o(($event) => $options.onLikeButtonClick()),
    S: common_vendor.t($props.articleItem.commentSum),
    T: common_vendor.o((...args) => $options.onActivityClick && $options.onActivityClick(...args))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/activity-item/activity-item.vue"]]);
wx.createComponent(Component);
