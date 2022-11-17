"use strict";
var common_constants = require("../../../common/constants.js");
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      UseProtocolUrl: common_constants.UseProtocolUrl
    };
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.UseProtocolUrl
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/login/bugu-use-protocol/bugu-use-protocol.vue"]]);
wx.createPage(MiniProgramPage);
