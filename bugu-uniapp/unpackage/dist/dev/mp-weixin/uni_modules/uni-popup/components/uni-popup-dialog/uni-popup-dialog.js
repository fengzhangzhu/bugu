"use strict";
var uni_modules_uniPopup_components_uniPopup_popup = require("../uni-popup/popup.js");
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "uniPopupDialog",
  mixins: [uni_modules_uniPopup_components_uniPopup_popup.popup],
  emits: ["confirm", "close"],
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    placeholder: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: "error"
    },
    mode: {
      type: String,
      default: "base"
    },
    title: {
      type: String,
      default: ""
    },
    customOkText: {
      type: String,
      default: "\u786E\u5B9A"
    },
    customCancelText: {
      type: String,
      default: "\u53D6\u6D88"
    },
    content: {
      type: String,
      default: ""
    },
    beforeClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogType: "error",
      focus: false,
      val: ""
    };
  },
  computed: {
    okText() {
      return this.customOkText;
    },
    cancelText() {
      return this.customCancelText;
    },
    placeholderText() {
      return this.placeholder;
    },
    titleText() {
      return this.title;
    }
  },
  watch: {
    type(val) {
      this.dialogType = val;
    },
    mode(val) {
      if (val === "input") {
        this.dialogType = "info";
      }
    },
    value(val) {
      this.val = val;
    }
  },
  created() {
    this.popup.disableMask();
    if (this.mode === "input") {
      this.dialogType = "info";
      this.val = this.value;
    } else {
      this.dialogType = this.type;
    }
  },
  mounted() {
    this.focus = true;
  },
  methods: {
    onOk() {
      if (this.mode === "input") {
        this.$emit("confirm", this.val);
      } else {
        this.$emit("confirm");
      }
      if (this.beforeClose)
        return;
      this.popup.close();
    },
    closeDialog() {
      this.$emit("close");
      if (this.beforeClose)
        return;
      this.popup.close();
    },
    close() {
      this.popup.close();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.titleText),
    b: common_vendor.n("uni-popup__" + $data.dialogType),
    c: $props.mode === "base"
  }, $props.mode === "base" ? {
    d: common_vendor.t($props.content)
  } : {
    e: $options.placeholderText,
    f: $data.focus,
    g: $data.val,
    h: common_vendor.o(($event) => $data.val = $event.detail.value)
  }, {
    i: common_vendor.t($options.cancelText),
    j: common_vendor.o((...args) => $options.closeDialog && $options.closeDialog(...args)),
    k: common_vendor.t($options.okText),
    l: common_vendor.o((...args) => $options.onOk && $options.onOk(...args))
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6f54520a"], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.vue"]]);
wx.createComponent(Component);
