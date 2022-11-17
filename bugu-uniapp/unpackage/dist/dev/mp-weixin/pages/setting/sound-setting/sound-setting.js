"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_constants = require("../../../common/constants.js");
var common_storageKeys = require("../../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      RingingToneList: common_constants.RingingToneList,
      refreshDynamicSound: {},
      newMessageSound: {},
      REFRESH_DYNAMIC_SOUND: common_storageKeys.REFRESH_DYNAMIC_SOUND,
      NEW_MESSAGE_SOUND: common_storageKeys.NEW_MESSAGE_SOUND,
      ringingToneSelected: 0,
      selectType: common_storageKeys.REFRESH_DYNAMIC_SOUND
    };
  },
  onLoad() {
    let refreshDynamicSound = common_vendor.index.getStorageSync(common_storageKeys.REFRESH_DYNAMIC_SOUND);
    if (!refreshDynamicSound) {
      refreshDynamicSound = common_constants.RingingToneList[6];
    }
    this.refreshDynamicSound = refreshDynamicSound;
    let newMessageSound = common_vendor.index.getStorageSync(common_storageKeys.NEW_MESSAGE_SOUND);
    if (!newMessageSound) {
      newMessageSound = common_constants.RingingToneList[0];
    }
    this.newMessageSound = newMessageSound;
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onChangeSoundItemClick(type) {
      this.selectType = type;
      if (type === common_storageKeys.REFRESH_DYNAMIC_SOUND) {
        this.ringingToneSelected = this.refreshDynamicSound.value;
      } else if (type === common_storageKeys.NEW_MESSAGE_SOUND) {
        this.ringingToneSelected = this.newMessageSound.value;
      }
      this.$refs.soundSelectPopup.open();
    },
    onRadioItemClick(item) {
      this.ringingToneSelected = item.value;
      const innerAudioContext = common_vendor.index.createInnerAudioContext();
      innerAudioContext.autoplay = true;
      innerAudioContext.src = item.url;
      this.changeSound(item, this.selectType);
    },
    async changeSound(ringingTone, type) {
      await common_vendor.index.setStorage({
        key: type,
        data: ringingTone
      });
      if (type === common_storageKeys.REFRESH_DYNAMIC_SOUND) {
        this.refreshDynamicSound = ringingTone;
      } else if (type === common_storageKeys.NEW_MESSAGE_SOUND) {
        this.newMessageSound = ringingTone;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_list_item = () => "../../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../../uni_modules/uni-list/components/uni-list/uni-list.js";
const _easycom_action_sheet = () => "../../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_list_item + _easycom_uni_list + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.onNarLeftClick),
    b: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    c: common_vendor.o(($event) => $options.onChangeSoundItemClick($data.REFRESH_DYNAMIC_SOUND)),
    d: common_vendor.p({
      clickable: true,
      showArrow: true,
      title: "\u5237\u65B0\u52A8\u6001",
      rightText: $data.refreshDynamicSound.label
    }),
    e: common_vendor.o(($event) => $options.onChangeSoundItemClick($data.NEW_MESSAGE_SOUND)),
    f: common_vendor.p({
      clickable: true,
      showArrow: true,
      title: "\u6D88\u606F\u901A\u77E5",
      rightText: $data.newMessageSound.label
    }),
    g: common_vendor.f($data.RingingToneList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: item,
        c: item.value == $data.ringingToneSelected,
        d: common_vendor.o(($event) => $options.onRadioItemClick(item), item),
        e: item
      };
    }),
    h: common_vendor.sr("soundSelectPopup", "2a076ff0-4"),
    i: common_vendor.p({
      needHead: true,
      title: "\u94C3\u58F0\u9009\u62E9"
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/setting/sound-setting/sound-setting.vue"]]);
wx.createPage(MiniProgramPage);
