"use strict";
var common_vendor = require("../../../common/vendor.js");
var utils_request = require("../../../utils/request.js");
var common_constants = require("../../../common/constants.js");
const _sfc_main = {
  data() {
    return {
      boxTicketsAvailableSum: 0,
      tickets: [],
      total: 0,
      pageNumber: 1
    };
  },
  onLoad() {
    this.getBoxTicketsInfo(this.pageNumber);
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onPageChange(e) {
      this.pageNumber = e.current;
      this.getBoxTicketsInfo(this.pageNumber);
    },
    async getBoxTicketsInfo(page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "blindBox",
          action: "ticket/list",
          data: {
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let ticketsResult = res.data.data;
        this.boxTicketsAvailableSum = ticketsResult.list.availableSum, this.tickets = ticketsResult.list.tickets, this.total = ticketsResult.total;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_nav_bar2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_uni_pagination2 + _easycom_uni_card2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_list_item = () => "../../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_uni_card = () => "../../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_list_item + _easycom_uni_list + _easycom_uni_pagination + _easycom_uni_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.onNarLeftClick()),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: common_vendor.f($data.tickets, (item, index, i0) => {
      return {
        a: item.id,
        b: "d72c6770-3-" + i0 + ",d72c6770-2",
        c: common_vendor.p({
          title: "\u83B7\u53D6\u65F6\u95F4",
          note: item.createTime,
          rightText: item.isUsed == 1 ? "\u5DF2\u4F7F\u7528" : "\u672A\u4F7F\u7528"
        })
      };
    }),
    d: common_vendor.o($options.onPageChange),
    e: common_vendor.p({
      total: $data.total,
      prevText: "\u4E0A\u4E00\u9875",
      nextText: "\u4E0B\u4E00\u9875",
      pageSize: "5",
      pagerCount: $data.pageNumber
    }),
    f: common_vendor.p({
      title: "\u6211\u7684\u76F2\u76D2\u52B5",
      extra: `\u5269\u4F59${$data.boxTicketsAvailableSum}\u5F20`
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/bugu-secondary-page/blind-box/box-tickets.vue"]]);
wx.createPage(MiniProgramPage);
