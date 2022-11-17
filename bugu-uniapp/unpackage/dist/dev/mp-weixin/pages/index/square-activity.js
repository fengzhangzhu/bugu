"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
var common_requestFunctions = require("../../common/requestFunctions.js");
var common_storageKeys = require("../../common/storageKeys.js");
var utils_request = require("../../utils/request.js");
var pages_index_service = require("./service.js");
const _sfc_main = {
  emits: ["onRefreshing"],
  props: {
    scollerHeight: {
      type: Number,
      require: true
    },
    refresherEnabled: {
      type: Boolean,
      require: true
    },
    myId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      isLoading: false,
      data: [],
      editArticleItem: {},
      hotLabels: [],
      touchY: 0
    };
  },
  async created() {
    this.isLoading = true;
    this.RecommendedLabels = await pages_index_service.getRecommendedLabels();
    this.hotLabels = await common_requestFunctions.getHotLabels(1);
  },
  methods: {
    onContentTouchStart(e) {
      this.touchY = e.changedTouches[0].clientY;
    },
    onContentTouchEnd(e) {
      if (this.touchY - e.changedTouches[0].clientY > 50) {
        if (!this.haveMoreData || this.data.length > 10) {
          return;
        } else {
          this.showBottomLoading = true;
          this.page = this.page + 1;
          this.getSquarearticles(this.page);
        }
      }
    },
    onSearchBarClick() {
      common_vendor.index.navigateTo({
        url: "/pages/label-activity/search-activity"
      });
    },
    onRecommendedClick(item) {
      common_vendor.index.navigateTo({
        url: `../../pages/label-activity/label-activity?labelId=${item.id}&labelContent=${item.content}`
      });
    },
    queryList(pageNo, pageSize) {
      utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: "square",
          data: {
            page: pageNo
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      }).then((res) => {
        if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          this.$refs.squareActivityPaging.complete(res.data.data.list);
        } else {
          this.$refs.squareActivityPaging.complete(false);
        }
        this.isLoading = false;
      }, () => {
        this.$refs.squareActivityPaging.complete(false);
        this.isLoading = false;
      });
    },
    async onFollow(item) {
      if (!item.publisher) {
        return;
      }
      let _this = this;
      if (await common_requestFunctions.followUser(item.publisher.id)) {
        let squareArticles = _this.data;
        for (let i = 0; i < squareArticles.length; i++) {
          if (squareArticles[i].publisher && squareArticles[i].publisher.id == item.publisher.id) {
            squareArticles[i].publisher.isAttention = 1;
          }
        }
        _this.data = squareArticles;
        _this.$refs.articleActionPopup.close();
        common_vendor.index.showToast({
          title: "\u5173\u6CE8\u6210\u529F",
          icon: "success"
        });
      }
    },
    onMoreClick(item) {
      this.$refs.articleActionPopup.open();
      this.editArticleItem = item;
    },
    onActivityItemClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/activity-info?activityId=${item.id}`
      });
    },
    onShareClick(item) {
      this.editArticleItem = item;
    },
    async onCancelFollow(item) {
      if (!item.publisher) {
        return;
      }
      let _this = this;
      common_vendor.index.showModal({
        title: "\u53D6\u6D88\u5173\u6CE8",
        content: `\u4F60\u786E\u5B9A\u8981\u53D6\u6D88\u5173\u6CE8${item.publisher.username}`,
        success: async function(res) {
          if (res.confirm) {
            if (item.publisher) {
              if (await common_requestFunctions.cancelAttention(item.publisher.id)) {
                let squareArticles = _this.data;
                for (let i = 0; i < squareArticles.length; i++) {
                  if (squareArticles[i].publisher && squareArticles[i].publisher.id == item.publisher.id) {
                    squareArticles[i].publisher.isAttention = 0;
                  }
                }
                _this.data = squareArticles;
                _this.$refs.articleActionPopup.close();
                common_vendor.index.showToast({
                  title: "\u53D6\u6D88\u5173\u6CE8",
                  icon: "success"
                });
              }
            }
          }
        }
      });
    },
    async onChatClick(item) {
      if (item.publisher)
        common_vendor.index.navigateTo({
          url: `/pages/message-secondary-page/chat-content/chat-content?fromUserId=${item.publisher.id}`
        });
    },
    onPopupReportClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/setting/report-user/report-user?objectId=${item.id}&objectType=${common_constants.reportObjectType.activity}`
      });
      this.$refs.articleActionPopup.close();
    },
    onPopupDeleteClick() {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u52A8\u6001",
        content: "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u52A8\u6001\u5417",
        success: async function(res) {
          if (res.confirm) {
            if (await common_requestFunctions.deleteMyArticle(_this.editArticleItem.id)) {
              let artices = _this.data;
              for (let i = 0; i < artices.length; i++) {
                if (artices[i].id == _this.editArticleItem.id) {
                  artices.splice(i, 1);
                  break;
                }
              }
              _this.data = artices;
              _this.$refs.articleActionPopup.close();
              common_vendor.index.showToast({
                title: "\u5220\u9664\u6210\u529F",
                icon: "success"
              });
            }
          }
        }
      });
    },
    async playRefreshDynamicSound() {
      let refreshDynamicSound = common_vendor.index.getStorageSync(common_storageKeys.REFRESH_DYNAMIC_SOUND);
      if (!refreshDynamicSound) {
        refreshDynamicSound = common_constants.RingingToneList[6];
      }
      const innerAudioContext = common_vendor.index.createInnerAudioContext();
      innerAudioContext.autoplay = true;
      innerAudioContext.src = refreshDynamicSound.url;
    }
  }
};
if (!Array) {
  const _easycom_activity_skeleton2 = common_vendor.resolveComponent("activity-skeleton");
  const _easycom_activity_item2 = common_vendor.resolveComponent("activity-item");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_activity_skeleton2 + _easycom_activity_item2 + _easycom_z_paging2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_activity_skeleton = () => "../../components/activity-skeleton/activity-skeleton.js";
const _easycom_activity_item = () => "../../components/activity-item/activity-item.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _easycom_action_sheet_item = () => "../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_activity_skeleton + _easycom_activity_item + _easycom_z_paging + _easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.hotLabels, (item, index, i0) => {
      return {
        a: common_vendor.t(item.content),
        b: item.id
      };
    }),
    b: common_vendor.o(($event) => $options.onSearchBarClick()),
    c: common_vendor.f(_ctx.RecommendedLabels, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.content),
        c: "recommended-label" + index,
        d: common_vendor.o(($event) => $options.onRecommendedClick(item), "recommended-label" + index)
      };
    }),
    d: $data.isLoading
  }, $data.isLoading ? {
    e: common_vendor.f([...new Array(5)], (item, index, i0) => {
      return {
        a: "4d246f42-1-" + i0 + ",4d246f42-0",
        b: index
      };
    })
  } : {}, {
    f: common_vendor.w(({
      item,
      index
    }, s0, i0) => {
      return {
        a: "activity-" + item.id,
        b: common_vendor.o(($event) => $options.onFollow(item)),
        c: common_vendor.o(($event) => $options.onMoreClick(item)),
        d: common_vendor.o(($event) => $options.onActivityItemClick(item)),
        e: common_vendor.o(($event) => $options.onShareClick(item)),
        f: "4d246f42-2-" + i0 + ",4d246f42-0",
        g: common_vendor.p({
          articleItem: item,
          isMe: item.isAnonymity != 1 && $props.myId == item.publisher.id
        }),
        h: i0,
        i: s0
      };
    }, {
      name: "cell",
      path: "f",
      vueId: "4d246f42-0"
    }),
    g: common_vendor.sr("squareActivityPaging", "4d246f42-0"),
    h: common_vendor.o($options.queryList),
    i: common_vendor.p({
      ["refresher-enabled"]: true,
      ["default-page-size"]: 5,
      ["use-virtual-list"]: true,
      ["cell-height-mode"]: "dynamic"
    }),
    j: $data.editArticleItem.id
  }, $data.editArticleItem.id ? common_vendor.e({
    k: $data.editArticleItem.isAnonymity
  }, $data.editArticleItem.isAnonymity ? {
    l: common_vendor.o(($event) => $options.onPopupReportClick($data.editArticleItem)),
    m: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  } : common_vendor.e({
    n: $data.editArticleItem.publisher.id == $props.myId
  }, $data.editArticleItem.publisher.id == $props.myId ? {
    o: common_vendor.o($options.onPopupDeleteClick),
    p: common_vendor.p({
      icon: "icon-delete",
      title: "\u5220\u9664"
    })
  } : common_vendor.e({
    q: $data.editArticleItem.publisher.isAttention == 1
  }, $data.editArticleItem.publisher.isAttention == 1 ? {
    r: common_vendor.o(($event) => $options.onCancelFollow($data.editArticleItem)),
    s: common_vendor.p({
      icon: "icon-quxiaoguanzhu",
      title: "\u53D6\u6D88\u5173\u6CE8"
    })
  } : {
    t: common_vendor.o(($event) => $options.onFollow($data.editArticleItem)),
    v: common_vendor.p({
      icon: "icon-guanzhu",
      title: "\u5173\u6CE8"
    })
  }, {
    w: common_vendor.o(($event) => $options.onChatClick($data.editArticleItem)),
    x: common_vendor.p({
      icon: "icon-message",
      title: "\u79C1\u804A"
    }),
    y: common_vendor.o(($event) => $options.onPopupReportClick($data.editArticleItem)),
    z: common_vendor.p({
      icon: "icon-alert",
      title: "\u4E3E\u62A5"
    })
  }))) : {}, {
    A: common_vendor.sr("articleActionPopup", "4d246f42-3"),
    B: common_vendor.p({
      needHead: true,
      title: "\u52A8\u6001\u9009\u62E9",
      needCancelButton: true
    })
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/index/square-activity.nvue"]]);
wx.createComponent(Component);
