"use strict";
var common_vendor = require("../../../common/vendor.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
const _sfc_main = {
  data() {
    return {
      tabSelected: 0,
      tookBoxInfos: [],
      tookBoxPage: 1,
      tookBoxSum: 0,
      tookBoxDetail: {},
      putBoxInfos: [],
      putBoxPage: 1,
      putBoxSum: 0,
      putBoxDetail: {}
    };
  },
  onLoad() {
    this.tookBoxLog(1);
    this.putBoxLog(1);
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onTabChange(tab) {
      this.tabSelected = tab;
    },
    tookBoxPageChange(e) {
      this.tookBoxPage = e.current;
      this.tookBoxLog(this.tookBoxPage);
    },
    putBoxPageChange(e) {
      this.putBoxPage = e.current;
      this.putBoxLog(this.putBoxPage);
    },
    onTookBoxItemClick(item) {
      this.tookBoxDetail = item;
      this.$refs.tookBoxDetailPopup.open();
    },
    onPutBoxItemClick(item) {
      this.putBoxDetail = item;
      this.$refs.putBoxDetailPopup.open();
    },
    onDeleteButtonClick(item) {
      let _this = this;
      common_vendor.index.showModal({
        title: "\u5220\u9664\u76D2\u5B50",
        content: "\u4F60\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u76D2\u5B50\u5417\uFF1F\u5DF2\u7ECF\u88AB\u6536\u53D6\u7684\u76D2\u5B50\u65E0\u6CD5\u5220\u9664\u54E6",
        success: function(res) {
          if (res.confirm) {
            _this.deleteBox(item.id);
            _this.$refs.putBoxDetailPopup.close();
          }
        }
      });
    },
    async tookBoxLog(page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "blindBox",
          action: "collect/log",
          data: {
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        this.tookBoxInfos = res.data.data.list;
        this.tookBoxSum = res.data.data.total;
      }
    },
    async putBoxLog(page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "blindBox",
          action: "deliver/log",
          data: {
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        this.putBoxInfos = res.data.data.list;
        this.putBoxSum = res.data.data.total;
      }
    },
    onGoToHomepageClick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/user-home-page/user-home-page?userId=${id}`
      });
    },
    async deleteBox(id) {
      let res = await utils_request.request({
        data: {
          method: "DELETE",
          group: "blindBox",
          action: `${id}/delete`,
          data: {
            id
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        for (let i = 0; i < this.putBoxInfos.length; i++) {
          if (this.putBoxInfos[i].id == id) {
            this.putBoxInfos[i].isDeleted = 1;
            break;
          }
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_my_box_item2 = common_vendor.resolveComponent("my-box-item");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_my_box_item2 + _easycom_uni_pagination2 + _easycom_uni_transition2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_my_box_item = () => "../../../components/my-box-item/my-box-item.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_uni_transition = () => "../../../uni_modules/uni-transition/components/uni-transition/uni-transition.js";
const _easycom_uni_list_item = () => "../../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_action_sheet = () => "../../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_my_box_item + _easycom_uni_pagination + _easycom_uni_transition + _easycom_uni_list_item + _easycom_uni_list + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $options.onNarLeftClick()),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: $data.tabSelected == 0 ? "#ffd5a9" : "#fff",
    d: $data.tabSelected == 0 ? "#000" : "#8a8a8a",
    e: common_vendor.o(($event) => $options.onTabChange(0)),
    f: $data.tabSelected == 1 ? "#ffd5a9" : "#fff",
    g: $data.tabSelected == 1 ? "#000" : "#8a8a8a",
    h: common_vendor.o(($event) => $options.onTabChange(1)),
    i: $data.tabSelected == 0
  }, $data.tabSelected == 0 ? {
    j: common_vendor.f($data.tookBoxInfos, (item, index, i0) => {
      return {
        a: item.id,
        b: common_vendor.o(($event) => $options.onTookBoxItemClick(item), item.id),
        c: "635704d2-2-" + i0 + ",635704d2-1",
        d: common_vendor.p({
          myBoxData: {
            time: item.collectTime,
            id: item.id,
            sex: item.sex,
            text: item.text,
            userId: item.userId,
            isCollected: 0,
            isDeleted: 0
          }
        })
      };
    }),
    k: common_vendor.o($options.tookBoxPageChange),
    l: common_vendor.p({
      total: $data.tookBoxSum,
      prevText: "\u4E0A\u4E00\u9875",
      nextText: "\u4E0B\u4E00\u9875",
      pageSize: "5",
      pagerCount: $data.tookBoxPage
    }),
    m: common_vendor.p({
      ["mode-class"]: "slide-left",
      show: $data.tabSelected == 0
    })
  } : {}, {
    n: $data.tabSelected == 1
  }, $data.tabSelected == 1 ? {
    o: common_vendor.f($data.putBoxInfos, (item, index, i0) => {
      return {
        a: item.id,
        b: common_vendor.o(($event) => $options.onPutBoxItemClick(item), item.id),
        c: "635704d2-5-" + i0 + ",635704d2-4",
        d: common_vendor.p({
          myBoxData: {
            time: item.createTime,
            id: item.id,
            sex: item.sex,
            text: item.text,
            userId: item.userId,
            isCollected: item.isCollected,
            isDeleted: item.isDeleted
          }
        })
      };
    }),
    p: common_vendor.o($options.putBoxPageChange),
    q: common_vendor.p({
      total: $data.putBoxSum,
      prevText: "\u4E0A\u4E00\u9875",
      nextText: "\u4E0B\u4E00\u9875",
      pageSize: "5",
      pagerCount: $data.putBoxPage
    }),
    r: common_vendor.p({
      ["mode-class"]: "slide-right",
      show: $data.tabSelected == 1
    })
  } : {}, {
    s: $data.tookBoxDetail.id
  }, $data.tookBoxDetail.id ? {
    t: common_vendor.p({
      title: "\u83B7\u53D6\u65F6\u95F4",
      rightText: $data.tookBoxDetail.collectTime
    }),
    v: common_vendor.p({
      title: "\u5185\u5BB9",
      note: $data.tookBoxDetail.text
    }),
    w: common_vendor.p({
      title: "\u6027\u522B",
      rightText: $data.tookBoxDetail.sex == 0 ? "\u5973" : "\u7537"
    })
  } : {}, {
    x: common_vendor.o(($event) => $options.onGoToHomepageClick($data.tookBoxDetail.userId)),
    y: common_vendor.sr("tookBoxDetailPopup", "635704d2-7"),
    z: common_vendor.p({
      needHead: true,
      title: "\u76D2\u5B50\u8BE6\u60C5"
    }),
    A: $data.putBoxDetail.id
  }, $data.putBoxDetail.id ? {
    B: common_vendor.p({
      title: "\u521B\u5EFA\u65F6\u95F4",
      rightText: $data.putBoxDetail.createTime
    }),
    C: common_vendor.p({
      title: "\u5185\u5BB9",
      note: $data.putBoxDetail.text
    }),
    D: common_vendor.p({
      title: "\u6027\u522B",
      rightText: $data.putBoxDetail.sex == 0 ? "\u5973" : "\u7537"
    })
  } : {}, {
    E: $data.putBoxDetail.isDeleted != 1
  }, $data.putBoxDetail.isDeleted != 1 ? {
    F: common_vendor.o(($event) => $options.onDeleteButtonClick($data.putBoxDetail))
  } : {}, {
    G: common_vendor.sr("putBoxDetailPopup", "635704d2-12"),
    H: common_vendor.p({
      needHead: true,
      title: "\u76D2\u5B50\u8BE6\u60C5"
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/bugu-secondary-page/blind-box/my-box.vue"]]);
wx.createPage(MiniProgramPage);
