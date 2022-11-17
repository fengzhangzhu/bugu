"use strict";
var utils_textFilter = require("../../utils/textFilter.js");
var common_constants = require("../../common/constants.js");
var utils_request = require("../../utils/request.js");
var utils_dateUtils = require("../../utils/dateUtils.js");
var services_answerServices = require("../../services/answerServices.js");
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "comment-item",
  props: {
    commentType: {
      type: String,
      default: "activity"
    },
    commentData: {
      type: Object,
      required: true
    },
    replyData: {
      type: Array,
      default: []
    },
    needRefresh: {
      type: Boolean,
      default: false
    },
    authorId: {
      type: Number,
      default: 0
    },
    needShowAll: {
      type: Boolean,
      default: false
    },
    replyAlign: {
      type: Boolean,
      default: false
    },
    showReplyCount: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    needRefresh(newVal) {
      console.log("needRefresh", newVal);
      if (newVal) {
        this.refreshReply();
      }
    }
  },
  computed: {
    publishTime() {
      return utils_dateUtils.GettimeifferenceOfNow(this.commentData.createTime).DistanceNow;
    },
    avatar() {
      if (this.commentData.publisher && this.commentData.publisher.id) {
        return this.commentData.publisher.avatar + common_constants.avatar_pic_hendle;
      } else {
        return common_constants.AnonymousAvatar;
      }
    },
    username() {
      if (this.commentData.publisher && this.commentData.publisher.id) {
        return this.commentData.publisher.username;
      } else {
        return "\u67D0\u53EA\u5C0F\u5E03\u5495";
      }
    },
    commentText() {
      return utils_textFilter.textFilter(this.commentData.content);
    },
    publisherId() {
      return this.commentData.publisher ? this.commentData.publisher.id : 0;
    }
  },
  data() {
    return {
      replyCommentDatas: [],
      likeSum: 0,
      isLiked: false,
      showAll: true,
      replySum: 0,
      page: 1,
      havaMoreData: true,
      showBottomLoading: false
    };
  },
  async created() {
    console.log("this.commentData", this.commentData);
    this.isLiked = this.commentData.isLiked || this.commentData.isLike;
    this.likeSum = this.commentData.likeSum;
    this.replySum = this.commentData.responseSum;
    if (this.needShowAll) {
      this.showBottomLoading = true;
      this.replyCommentDatas = await this.getCommentReply(this.commentData.id, this.page);
      this.showBottomLoading = false;
    } else {
      this.replyCommentDatas = this.replyData;
      if (this.replySum > 3) {
        this.showAll = false;
      } else {
        this.showAll = true;
      }
    }
  },
  methods: {
    onClick() {
      this.$emit("onCommentClick");
    },
    onMoreClick() {
      this.$emit("onCommentMoreClick");
    },
    onReplyClick(item, index) {
      this.$emit("onReplyClick", this.commentData, item, index);
    },
    async onReplyMoreClick(item, index) {
      await this.$emit("onReplyMoreClick", this.commentData, item, index);
    },
    onShowAllClick() {
      this.$emit("onShowAllClick", this.isLiked);
    },
    async getMoreReplys() {
      if (this.havaMoreData) {
        this.showBottomLoading = true;
        this.page = this.page + 1;
        let newDatas = await this.getCommentReply(this.commentData.id, this.page);
        if (newDatas.length > 0) {
          this.replyCommentDatas = this.replyCommentDatas.concat(newDatas);
        } else {
          this.havaMoreData = false;
        }
        this.showBottomLoading = false;
      }
    },
    addReplyItem(replyItem) {
      this.replyCommentDatas.push(replyItem);
    },
    deleteReplyItem(replyId) {
      let replyCommentDatas = this.replyCommentDatas;
      for (let i = 0; i < replyCommentDatas.length; i++) {
        if (replyCommentDatas[i].id == replyId) {
          replyCommentDatas[i].isDeleted = 1;
          break;
        }
      }
      this.replyCommentDatas = replyCommentDatas;
    },
    async onLikeButtonClick() {
      if (!this.isLiked) {
        this.likeSum = this.likeSum + 1;
        this.isLiked = true;
        let res = await this.likeThisComment(this.commentData.id);
        if (!res) {
          this.likeSum = this.likeSum - 1;
          this.isLiked = false;
        }
      } else {
        this.likeSum = this.likeSum - 1;
        this.isLiked = false;
        let res = await this.CancelikeThisComment(this.commentData.id);
        if (!res) {
          this.likeSum = this.likeSum + 1;
          this.isLiked = true;
        }
      }
    },
    async refreshReply() {
      this.page = 1;
      this.havaMoreData = true;
      let replyCommentDatas = await this.getCommentReply(this.commentData.id, this.page);
      this.replySum = replyCommentDatas.length;
      if (this.replySum <= 3 || this.needShowAll) {
        this.showAll = true;
        this.replyCommentDatas = replyCommentDatas;
      } else {
        this.showAll = false;
        this.replyCommentDatas = replyCommentDatas.splice(0, 3);
      }
    },
    async likeThisComment(id) {
      let res = {};
      if (this.commentType === "activity") {
        res = await utils_request.request({
          data: {
            method: "PUT",
            group: "activity/comment",
            action: `${id}/like`,
            data: {
              id
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          }
        });
        if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          return true;
        } else {
          return false;
        }
      } else if (this.commentType === "answer") {
        return await services_answerServices.likeAnwserComment(id);
      }
    },
    async CancelikeThisComment(id) {
      if (this.commentType === "activity") {
        let res2 = await utils_request.request({
          data: {
            method: "DELETE",
            group: "activity/comment",
            action: `${id}/like/remove`,
            data: {
              id
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          }
        });
        if (res2.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          console.log(res2.data);
          return true;
        } else {
          console.log(res2);
          return false;
        }
      } else if (this.commentType === "answer") {
        return await services_answerServices.cancelLikeAnwserComment(id);
      }
    },
    async getCommentReply(id, page) {
      if (this.commentType === "activity") {
        let res = await utils_request.request({
          data: {
            method: "GET",
            group: "activity/comment",
            action: `${id}/responseList`,
            data: {
              id,
              pageSize: 10,
              startPage: page
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          }
        });
        if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          return res.data.data;
        } else {
          return [];
        }
      } else if (this.commentType === "answer") {
        let res = await utils_request.request({
          data: {
            method: "GET",
            group: "answer/comment",
            action: `comment/${id}/responseList`,
            data: {
              id,
              pageSize: 10,
              startPage: page
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          }
        });
        console.log("getCommentReply", res.data);
        if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          return res.data.data;
        } else {
          return [];
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_reply_item2 = common_vendor.resolveComponent("reply-item");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_reply_item2 + _easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_reply_item = () => "../reply-item/reply-item.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_reply_item + _easycom_uni_icons + _easycom_uni_load_more)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.avatar,
    b: common_vendor.t($options.username),
    c: !$props.commentData.publisher
  }, !$props.commentData.publisher ? {} : {}, {
    d: $props.commentData.isDeleted == 0
  }, $props.commentData.isDeleted == 0 ? {
    e: common_vendor.o(($event) => $options.onMoreClick())
  } : {}, {
    f: $props.commentData.isDeleted == 1
  }, $props.commentData.isDeleted == 1 ? {} : {
    g: common_vendor.t($options.commentText)
  }, {
    h: common_vendor.t($options.publishTime),
    i: $props.commentData.isDeleted == 0
  }, $props.commentData.isDeleted == 0 ? common_vendor.e({
    j: $data.isLiked
  }, $data.isLiked ? {} : {}, {
    k: common_vendor.t($data.likeSum),
    l: common_vendor.o(($event) => $options.onLikeButtonClick())
  }) : {}, {
    m: common_vendor.o(($event) => $options.onClick()),
    n: $props.showReplyCount
  }, $props.showReplyCount ? {
    o: common_vendor.t($data.replyCommentDatas.length)
  } : {}, {
    p: common_vendor.f($data.replyCommentDatas, (item, index, i0) => {
      return {
        a: item.id,
        b: common_vendor.o(($event) => $options.onReplyClick(item, index), item.id),
        c: common_vendor.o(($event) => $options.onReplyMoreClick(item, index), item.id),
        d: "1bd30e01-0-" + i0,
        e: common_vendor.p({
          replyCommentData: item,
          isAuthor: $props.authorId == item.fromUserId,
          isLead: $options.publisherId == item.fromUserId
        })
      };
    }),
    q: !$data.showAll
  }, !$data.showAll ? {
    r: common_vendor.t($data.replySum),
    s: common_vendor.o((...args) => $options.onShowAllClick && $options.onShowAllClick(...args)),
    t: common_vendor.p({
      customPrefix: "customicons",
      type: "right",
      color: "#808080",
      size: "15"
    })
  } : {}, {
    v: $props.needShowAll
  }, $props.needShowAll ? {
    w: common_vendor.p({
      status: $data.havaMoreData ? $data.showBottomLoading ? "loading" : "more" : "noMore",
      contentText: {
        contentdown: "\u4E0A\u62C9\u663E\u793A\u66F4\u591A",
        contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
        contentnomore: "\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86"
      },
      iconType: "circle"
    })
  } : {}, {
    x: $props.replyAlign ? "0rpx" : "90rpx",
    y: $props.showReplyCount ? "2px solid #F5F5F5" : "none",
    z: `comment_${$props.commentData.id}`
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/comment-item/comment-item.vue"]]);
wx.createComponent(Component);
