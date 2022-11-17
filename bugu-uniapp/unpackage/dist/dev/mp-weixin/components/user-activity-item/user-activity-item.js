"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
require("../../utils/request.js");
const _sfc_main = {
  name: "user-activity-item",
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
    },
    avatar: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imageContentStyle: "",
      numberOfpics: 0,
      maxLength: 20,
      transformTextLength: 0,
      showAll: true,
      isLiked: false,
      likeSum: 0,
      privateSettingGroup: common_constants.privateSettingGroup,
      playVideo: false,
      videoContext: {}
    };
  },
  beforeMount() {
    this.isLiked = this.articleItem.isLiked;
    this.likeSum = this.articleItem.likeSum;
    this.initText();
    this.initImageTypesetting();
  },
  methods: {
    onClick() {
      this.$emit("onClick");
    },
    onMoreClick() {
      this.$emit("onMoreClick");
    },
    onImageClick(item) {
      common_vendor.index.previewImage({
        urls: this.articleItem.pic,
        current: item
      });
    },
    onVideoClick() {
      this.playVideo = true;
      this.videoContext = common_vendor.index.createVideoContext(`video_${this.articleItem.id}`, this);
      this.videoContext.requestFullScreen({
        direction: 0
      });
      this.videoContext.play();
    },
    onFullscreenChange(e) {
      this.playVideo = e.detail.fullScreen;
      if (!this.playVideo) {
        this.videoContext.stop();
      }
    },
    onLabelItemClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/label-activity/label-activity?labelId=${item.id}&labelContent=${item.content}`
      });
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
        if (this.transformTextLength > 20) {
          let first_break = text.indexOf("\n");
          let temp_break = first_break;
          let real_break = first_break;
          let temp_text = text;
          while (temp_break < 20) {
            temp_text = text.slice(real_break + 1);
            if (temp_text.indexOf("\n") == -1) {
              break;
            }
            temp_break = temp_break + 20 + temp_text.indexOf("\n");
            real_break = real_break + 1 + temp_text.indexOf("\n");
          }
          if (real_break < 20) {
            this.maxLength = real_break;
          }
        }
      }
      console.log(this.maxLength);
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
    a: $props.isMe
  }, $props.isMe ? {
    b: common_vendor.t($props.articleItem.isAnonymity == 1 ? "\u5495\u5495\u72B6\u6001" : $data.privateSettingGroup[$props.articleItem.visibility])
  } : {}, {
    c: common_vendor.o(($event) => $options.onMoreClick()),
    d: $props.articleItem.video == 1
  }, $props.articleItem.video == 1 ? common_vendor.e({
    e: $props.articleItem.pic.length > 0
  }, $props.articleItem.pic.length > 0 ? {
    f: $data.playVideo,
    g: $props.articleItem.pic[0],
    h: `video_${$props.articleItem.id}`,
    i: common_vendor.o((...args) => $options.onFullscreenChange && $options.onFullscreenChange(...args)),
    j: !$data.playVideo,
    k: $props.articleItem.pic[0] + "?vframe/jpg/offset/0",
    l: common_vendor.p({
      customPrefix: "customicons",
      type: "videocam-filled",
      color: "#c5c5c5dc",
      size: "60"
    }),
    m: !$data.playVideo,
    n: common_vendor.o((...args) => $options.onVideoClick && $options.onVideoClick(...args))
  } : {}) : {}, {
    o: $props.articleItem.video != 1
  }, $props.articleItem.video != 1 ? common_vendor.e({
    p: $props.articleItem.pic.length > 0
  }, $props.articleItem.pic.length > 0 ? {
    q: $props.articleItem.pic[0]
  } : {}) : {}, {
    r: common_vendor.t($props.articleItem.text.length <= $data.maxLength ? $props.articleItem.text : $props.articleItem.text.slice(0, $data.maxLength) + "..."),
    s: $props.avatar + "?imageView2/1/w/100/h/100",
    t: common_vendor.t($props.username),
    v: common_vendor.t($data.likeSum),
    w: common_vendor.o(($event) => $options.onLikeButtonClick()),
    x: common_vendor.o((...args) => $options.onClick && $options.onClick(...args))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/user-activity-item/user-activity-item.vue"]]);
wx.createComponent(Component);
