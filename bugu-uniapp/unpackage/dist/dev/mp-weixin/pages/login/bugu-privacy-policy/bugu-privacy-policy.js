"use strict";
var common_constants = require("../../../common/constants.js");
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      PrivacyPolicyUrl: common_constants.PrivacyPolicyUrl
    };
  },
  methods: {}
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.PrivacyPolicyUrl
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/login/bugu-privacy-policy/bugu-privacy-policy.vue"]]);
wx.createPage(MiniProgramPage);
