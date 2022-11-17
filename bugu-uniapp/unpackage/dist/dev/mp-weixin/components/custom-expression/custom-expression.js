"use strict";
var common_vendor = require("../../common/vendor.js");
var common_constants = require("../../common/constants.js");
var utils_request = require("../../utils/request.js");
const _sfc_main = {
  name: "custom-expression",
  props: {
    contentHeight: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      haveMore: true,
      page: 1,
      expressions: [],
      editExpression: {},
      editIndex: 0
    };
  },
  async created() {
    this.expressions = await this.getExpressions(this.page);
  },
  methods: {
    onExpressionItemClick(item, index) {
      this.$emit("onItemClick", item, index);
    },
    onLongPress(item, index) {
      this.editExpression = item;
      this.editIndex = index;
      this.$refs.expressionItemActionPopup.open();
    },
    onDeleteTextClick() {
      this.deleteExpression(this.editExpression.id, this.editIndex);
      this.$refs.expressionItemActionPopup.close();
    },
    async refresh() {
      this.page = 1;
      this.expressions = await this.getExpressions(this.page);
    },
    async onScroolToLower() {
      if (this.haveMore) {
        this.page = this.page + 1;
        let more_expression = await this.getExpressions(this.page);
        let expressions = this.expressions;
        expressions = expressions.concat(more_expression);
        this.expressions = expressions;
      }
    },
    async getExpressions(page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "message",
          action: "emoticon/list",
          data: {
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let expressionList = res.data.data.list;
        console.log("expressionList", expressionList);
        let pageSum = res.data.data.pageSum;
        if (pageSum <= page) {
          this.haveMore = false;
        }
        return expressionList;
      } else {
        return [];
      }
    },
    async deleteExpression(id, index) {
      let res = await utils_request.request({
        data: {
          method: "DELETE",
          group: "message",
          action: "emoticon/delete",
          data: {
            id
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let expressions = this.expressions;
        expressions.splice(index, 1);
        this.expressions = expressions;
        common_vendor.index.showToast({
          title: "\u5220\u9664\u6210\u529F",
          icon: "success"
        });
        return true;
      } else {
        return false;
      }
    }
  }
};
if (!Array) {
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_action_sheet_item = () => "../action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.expressions, (item, index, i0) => {
      return {
        a: common_vendor.o(($event) => $options.onExpressionItemClick(item, index)),
        b: common_vendor.o(($event) => $options.onLongPress(item, index)),
        c: item.url,
        d: item.id
      };
    }),
    b: $data.expressions.length < 1
  }, $data.expressions.length < 1 ? {} : {}, {
    c: $props.contentHeight ? $props.contentHeight + "px" : 300 + "px",
    d: common_vendor.o((...args) => $options.onScroolToLower && $options.onScroolToLower(...args)),
    e: $data.editExpression.id
  }, $data.editExpression.id ? {
    f: common_vendor.o($options.onDeleteTextClick),
    g: common_vendor.p({
      title: "\u5220\u9664"
    })
  } : {}, {
    h: common_vendor.sr("expressionItemActionPopup", "3dd540cb-0"),
    i: common_vendor.p({
      needHead: true,
      title: "\u8BBE\u7F6E\u6D88\u606F",
      needCancelButton: true
    })
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/components/custom-expression/custom-expression.vue"]]);
wx.createComponent(Component);
