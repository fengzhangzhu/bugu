"use strict";
var common_vendor = require("../../../common/vendor.js");
var utils_dateUtils = require("../../../utils/dateUtils.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var utils_messageUtils_storage = require("../../../utils/messageUtils/storage.js");
var common_requestFunctions = require("../../../common/requestFunctions.js");
var common_constants = require("../../../common/constants.js");
var utils_request = require("../../../utils/request.js");
var utils_messageUtils_storageKeys = require("../../../utils/messageUtils/storageKeys.js");
var common_globalMsgKeys = require("../../../common/globalMsgKeys.js");
require("../../../common/storageKeys.js");
const _sfc_main = {
  data() {
    return {
      fromUserInfo: {},
      myUserInfo: {},
      historyChats: [],
      scrollInto: "",
      page: 1,
      haveMoreData: true,
      GettimeifferenceOfNow: utils_dateUtils.GettimeifferenceOfNow,
      navHeight: 0,
      contentHeight: 0,
      selectChatItem: {},
      moreText: "more",
      datePickerList: [],
      daySelected: "all"
    };
  },
  onReady() {
    let _this = this;
    common_vendor.index.getSystemInfo({
      success(res) {
        _this.contentHeight = res.windowHeight;
      }
    });
    let titleH = common_vendor.index.createSelectorQuery().select("#chat-scrollview");
    titleH.boundingClientRect((data) => {
      _this.navHeight = data.top;
    }).exec();
  },
  async onLoad(params) {
    let fromUserId = params.fromUserId;
    let fromUserInfo = await common_requestFunctions.getUserinfo(fromUserId);
    let myUserInfo = await common_storageFunctions.getMyUserInfo();
    this.myUserInfo = myUserInfo;
    this.fromUserInfo = fromUserInfo;
    this.getAllChatHistory(fromUserId, this.page);
    this.getHistoryDateList(fromUserId);
  },
  computed: {
    fromUsername() {
      if (!this.fromUserInfo.username) {
        return "";
      } else {
        return this.fromUserInfo.username.length > 7 ? this.fromUserInfo.username.slice(0, 7) + "..." : this.fromUserInfo.username;
      }
    },
    scollerHeight() {
      return this.contentHeight - this.navHeight - 70;
    }
  },
  methods: {
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    onScrollToUpper() {
      if (!this.haveMoreData) {
        return;
      }
      if (this.fromUserInfo) {
        this.page = this.page + 1;
        if (this.daySelected === "all") {
          this.getAllChatHistory(this.fromUserInfo.id, this.page);
        } else {
          this.getHistoryByDate(this.formUserInfo.id, this.daySelected, this.page);
        }
      }
    },
    onDatePikcerChange(e) {
      this.daySelected = e.detail.value[1].value;
      this.page = 1;
      this.getHistoryByDate(this.fromUserInfo.id, this.daySelected, this.page);
    },
    onCopyTextClick() {
      common_vendor.index.setClipboardData({ data: this.selectChatItem.content });
      this.$refs.chatItemActionPopup.close();
    },
    onAddExpressionClick() {
      let fileName = this.selectChatItem.content.replace(common_constants.ImageFatherPath, "");
      this.addExpression(fileName);
      this.$refs.chatItemActionPopup.close();
    },
    onDeleteTextClick() {
      this.deleteMessage(this.selectChatItem.id);
      this.$refs.chatItemActionPopup.close();
    },
    onChatItemLongPress(chatItem) {
      this.selectChatItem = chatItem;
      this.$refs.chatItemActionPopup.open();
    },
    showChatCreatTime(index) {
      let historyChats = this.historyChats;
      let showtime = false;
      if (index == 0) {
        showtime = true;
      } else {
        let menit = utils_dateUtils.GetNumberOfMenit(historyChats[index - 1].createTime, historyChats[index].createTime);
        if (menit > 1) {
          showtime = true;
        }
      }
      return showtime;
    },
    async addExpression(filename) {
      let res = await utils_request.request({
        data: {
          method: "POST",
          group: "message",
          action: "emoticon/add",
          data: {
            filename
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        common_vendor.index.showToast({
          title: "\u6DFB\u52A0\u6210\u529F",
          icon: "success"
        });
        common_vendor.index.$emit(common_globalMsgKeys.REFRESH_CHAT_CONTENT, { needRefresh: true });
        return true;
      } else {
        return false;
      }
    },
    async deleteMessage(id) {
      if (this.historyChats) {
        let historyChats = this.historyChats;
        for (let i = historyChats.length - 1; i >= 0; i--) {
          if (historyChats[i].id == id) {
            historyChats.splice(i, 1);
            break;
          }
        }
        this.historyChats = historyChats;
        let messageGroup = await utils_messageUtils_storage.getChatRecord(this.myUserInfo.id, this.fromUserInfo.id);
        if (messageGroup) {
          let messages = messageGroup.messages;
          let deleteIndex = 0;
          for (let i = 0; i < messages.length; i++) {
            if (id == messages[i].id) {
              messages.splice(i, 1);
              deleteIndex = i;
              break;
            }
          }
          messageGroup.messages = messages;
          let ChatRecordKey = utils_messageUtils_storageKeys.getChatRecordKey(this.myUserInfo.id, this.fromUserInfo.id);
          common_vendor.index.setStorage({ key: ChatRecordKey, data: messageGroup });
          if (messages.length > 0 && deleteIndex == messages.length) {
            let userMessageList = await utils_messageUtils_storage.getUserMessageList(this.myUserInfo.id);
            for (let i = 0; i < userMessageList.length; i++) {
              if (userMessageList[i].userId == this.fromUserInfo.id) {
                let userMessageListItem = userMessageList[i];
                userMessageListItem.lastMessage = messages[messages.length - 1].content;
                userMessageListItem.lastMessageType = messages[messages.length - 1].type;
                userMessageListItem.lastTime = messages[messages.length - 1].createTime;
                userMessageListItem.unreadSum = 0;
                userMessageList.splice(i, 1);
                userMessageList.push(userMessageListItem);
                break;
              }
            }
            let UserMessageListKey = utils_messageUtils_storageKeys.getUserMessageListKey(this.myUserInfo.id);
            common_vendor.index.setStorage({ key: UserMessageListKey, data: userMessageList });
          }
        }
        await utils_request.request({
          data: {
            method: "POST",
            group: "message",
            action: `${id}/delete`,
            data: {
              id
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            }
          }
        });
        common_vendor.index.$emit(common_globalMsgKeys.REFRESH_CHAT_CONTENT, { needRefresh: true });
      }
    },
    async getAllChatHistory(userId, page) {
      this.moreText = "loading";
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "message",
          action: `history`,
          data: {
            page,
            userId
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code == common_constants.REQUEST_SUCCEEDED_CODE) {
        let result = res.data.data;
        let chat_historys = res.data.data.list;
        if (result.pageSum <= page) {
          this.haveMoreData = false;
          this.moreText = "noMore";
        } else {
          this.haveMoreData = true;
          this.moreText = "more";
        }
        let historyChats = [];
        if (page > 1) {
          historyChats = this.historyChats;
        }
        historyChats = historyChats.reverse().concat(chat_historys);
        this.scrollInto = `chat_${chat_historys[0].id}`;
        this.historyChats = historyChats.reverse();
      }
    },
    async getHistoryByDate(userId, date, page) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "message",
          action: `history/byDate`,
          data: {
            userId,
            date,
            page
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code == common_constants.REQUEST_SUCCEEDED_CODE) {
        let result = res.data.data;
        let chat_historys = res.data.data.list;
        if (result.pageSum <= page) {
          this.haveMoreData = false;
          this.moreText = "noMore";
        } else {
          this.haveMoreData = true;
          this.moreText = "more";
        }
        let historyChats = [];
        if (page > 1) {
          historyChats = this.historyChats;
        }
        historyChats = historyChats.reverse().concat(chat_historys);
        this.scrollInto = `chat_${chat_historys[0].id}`;
        this.historyChats = historyChats.reverse();
      }
    },
    async getHistoryDateList(userId) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "message",
          action: `history/dateList`,
          data: {
            userId
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code == common_constants.REQUEST_SUCCEEDED_CODE) {
        let dateList = res.data.data;
        let datePickerList = [];
        dateList.forEach((item) => {
          let monthData = {
            text: item.month,
            value: item.month,
            children: []
          };
          item.day.forEach((item2) => {
            let dayItem = { text: item2, value: item2 };
            monthData.children.push(dayItem);
          });
          datePickerList.push(monthData);
        });
        this.datePickerList = datePickerList;
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_chat_item2 = common_vendor.resolveComponent("chat-item");
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_uni_load_more2 + _easycom_chat_item2 + _easycom_uni_data_picker2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_load_more = () => "../../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_chat_item = () => "../../../components/chat-item/chat-item.js";
const _easycom_uni_data_picker = () => "../../../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_action_sheet_item = () => "../../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_load_more + _easycom_chat_item + _easycom_uni_data_picker + _easycom_action_sheet_item + _easycom_action_sheet)();
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
    c: $data.historyChats.length > 0
  }, $data.historyChats.length > 0 ? {
    d: common_vendor.p({
      status: $data.moreText,
      contentText: {
        contentdown: "\u4E0B\u62C9\u663E\u793A\u66F4\u591A",
        contentrefresh: "\u6B63\u5728\u52A0\u8F7D...",
        contentnomore: "\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86"
      }
    }),
    e: common_vendor.f($data.historyChats, (item, index, i0) => {
      return common_vendor.e({
        a: $options.showChatCreatTime(index)
      }, $options.showChatCreatTime(index) ? {
        b: common_vendor.t($data.GettimeifferenceOfNow(item.createTime).Detailed)
      } : {}, {
        c: common_vendor.o(($event) => $options.onChatItemLongPress(item)),
        d: "329e6624-2-" + i0,
        e: common_vendor.p({
          avatarUrl: item.my ? $data.myUserInfo.avatar : $data.fromUserInfo.avatar,
          chatText: item.content,
          isMe: item.my,
          voiceTime: item.time,
          messageType: item.type
        }),
        f: item.id,
        g: "chat_" + item.id
      });
    }),
    f: common_vendor.o(($event) => _ctx.onContentClick()),
    g: $data.scrollInto,
    h: $options.scollerHeight + "px",
    i: common_vendor.o((...args) => $options.onScrollToUpper && $options.onScrollToUpper(...args))
  } : {}, {
    j: $data.datePickerList.length > 0
  }, $data.datePickerList.length > 0 ? {
    k: common_vendor.o($options.onDatePikcerChange),
    l: common_vendor.o(_ctx.onDatePikcerNodeClick),
    m: common_vendor.p({
      placeholder: "\u8BF7\u9009\u62E9\u65E5\u671F",
      localdata: $data.datePickerList,
      ["popup-title"]: "\u8BF7\u9009\u62E9\u65E5\u671F"
    })
  } : {}, {
    n: $data.selectChatItem.id
  }, $data.selectChatItem.id ? common_vendor.e({
    o: $data.selectChatItem.type == 0
  }, $data.selectChatItem.type == 0 ? {
    p: common_vendor.o($options.onCopyTextClick),
    q: common_vendor.p({
      title: "\u590D\u5236"
    })
  } : {}, {
    r: $data.selectChatItem.type == 1
  }, $data.selectChatItem.type == 1 ? {
    s: common_vendor.o($options.onAddExpressionClick),
    t: common_vendor.p({
      title: "\u6DFB\u52A0\u5230\u8868\u60C5"
    })
  } : {}, {
    v: common_vendor.o($options.onDeleteTextClick),
    w: common_vendor.p({
      title: "\u5220\u9664"
    })
  }) : {}, {
    x: common_vendor.sr("chatItemActionPopup", "329e6624-4"),
    y: common_vendor.p({
      needHead: true,
      title: "\u8BBE\u7F6E\u6D88\u606F",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/message-secondary-page/chat-history/chat-history.vue"]]);
wx.createPage(MiniProgramPage);
