"use strict";
var common_vendor = require("../../common/vendor.js");
var common_storageKeys = require("../../common/storageKeys.js");
var common_constants = require("../../common/constants.js");
var utils_request = require("../../utils/request.js");
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
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.getHotArticles(1, 10);
  },
  methods: {
    onActivityItemClick(item) {
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/activity-info?activityId=${item.id}`
      });
    },
    onQuestionItemClick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/activity-info/question-info/question-info?questionId=${id}`
      });
    },
    async getHotArticles(page, pageSize, notPlaySound = false) {
      utils_request.request({
        data: {
          method: "GET",
          group: "activity",
          action: "hot",
          data: {
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      }).then((res) => {
        if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          res.data.data.pageSum;
          let articles = res.data.data.list;
          this.$refs.hotActivityPaging.complete(articles);
        } else {
          this.$refs.hotActivityPaging.complete(false);
        }
      }, () => {
        this.$refs.hotActivityPaging.complete(false);
      });
    },
    async getHotQuestions(page, pageSize, notPlaySound = false) {
      utils_request.request({
        data: {
          method: "GET",
          group: "question",
          action: "hot",
          data: {
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      }).then((res) => {
        if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
          let pageInfo = res.data.data;
          let hotQuestions = pageInfo.list;
          this.$refs.hotQuestionPaging.complete(hotQuestions);
        } else {
          this.$refs.hotQuestionPaging.complete(false);
        }
      }, () => {
        this.$refs.hotQuestionPaging.complete(false);
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
  const _easycom_hot_activity_item2 = common_vendor.resolveComponent("hot-activity-item");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_easycom_hot_activity_item2 + _easycom_z_paging2)();
}
const _easycom_hot_activity_item = () => "../../components/hot-activity-item/hot-activity-item.js";
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (_easycom_hot_activity_item + _easycom_z_paging)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.w(({
      item,
      index
    }, s0, i0) => {
      return {
        a: "hot" + item.id,
        b: common_vendor.o(($event) => $options.onActivityItemClick(item)),
        c: "07ce04a4-1-" + i0 + ",07ce04a4-0",
        d: common_vendor.p({
          hotNumber: item.hot,
          hotText: item.text,
          hotPic: item.pic && item.pic.length > 0 ? item.pic[0] : "",
          isVideo: item.video == 1,
          ranking: index + 1
        }),
        e: i0,
        f: s0
      };
    }, {
      name: "cell",
      path: "a",
      vueId: "07ce04a4-0"
    }),
    b: common_vendor.sr("hotActivityPaging", "07ce04a4-0"),
    c: common_vendor.o($options.getHotArticles),
    d: common_vendor.p({
      ["default-page-size"]: 10,
      ["use-virtual-list"]: true,
      ["cell-height-mode"]: "dynamic"
    })
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/index/hot-articles.nvue"]]);
wx.createComponent(Component);
