"use strict";
var common_vendor = require("../../../common/vendor.js");
var utils_dateUtils = require("../../../utils/dateUtils.js");
var common_storageFunctions = require("../../../common/storageFunctions.js");
var utils_messageUtils_storage = require("../../../utils/messageUtils/storage.js");
var common_requestFunctions = require("../../../common/requestFunctions.js");
var common_constants = require("../../../common/constants.js");
var utils_request = require("../../../utils/request.js");
var utils_messageUtils_storageKeys = require("../../../utils/messageUtils/storageKeys.js");
var store_index = require("../../../store/index.js");
var utils_aes_export = require("../../../utils/aes/export.js");
var common_globalMsgKeys = require("../../../common/globalMsgKeys.js");
var utils_tabBarBadgeUtils = require("../../../utils/tabBarBadgeUtils.js");
require("../../../common/storageKeys.js");
require("../../../store/modules/messageStore.js");
require("../../../store/modules/socketStateStore.js");
require("../../../utils/messageUtils/index.js");
require("../../../utils/messageUtils/service.js");
const _sfc_main = {
  data() {
    return {
      sendText: "",
      inputFocus: false,
      onLineState: false,
      fromUserInfo: {},
      myUserInfo: {},
      messageGroup: {},
      keyboardHeight: 0,
      emojiContentHeight: 300,
      showEmojiPicker: false,
      expressionTabPage: 0,
      isRecording: false,
      sendVoice: false,
      scrollInto: "",
      state: store_index.store.state,
      GettimeifferenceOfNow: utils_dateUtils.GettimeifferenceOfNow,
      navHeight: 0,
      contentHeight: 0,
      recorderManager: common_vendor.index.getRecorderManager(),
      touchY: 0,
      cancelSendVoice: false,
      showSendVoiceToast: false,
      voiceFile: {},
      voiceTime: 0,
      stopTimer: false,
      selectChatItem: {},
      isIOS: false
    };
  },
  onReady() {
    let _this = this;
    common_vendor.index.getSystemInfo({
      success(res) {
        _this.contentHeight = res.windowHeight, _this.isIOS = res.system.indexOf("iOS") != -1;
      }
    });
    let titleH = common_vendor.index.createSelectorQuery().select("#chat-scrollview");
    titleH.boundingClientRect((data) => {
      _this.navHeight = data.top;
    }).exec();
  },
  onShow() {
    let _this = this;
    common_vendor.index.$once(common_globalMsgKeys.REFRESH_CHAT_CONTENT, async function(data) {
      if (data.needRefresh) {
        _this.$refs.customExpression.refresh();
        let beforeMessageGroup = await utils_messageUtils_storage.getChatRecord(_this.myUserInfo.id, _this.fromUserInfo.id);
        _this.messageGroup = beforeMessageGroup;
        let messages = _this.messageGroup.messages;
        let messagesSize = messages.length;
        if (messagesSize > 0) {
          _this.scrollInto = `chat_${messages[messages.length - 1].id}`;
        }
      }
    });
  },
  async onLoad(params) {
    this.initRecorderAndKeyboardManager();
    common_vendor.index.showLoading({
      title: "\u52A0\u8F7D\u4E2D"
    });
    let fromUserId = params.fromUserId;
    let myUserInfo = await common_storageFunctions.getMyUserInfo();
    if (!fromUserId || !myUserInfo) {
      return;
    }
    this.myUserInfo = myUserInfo;
    let beforeMessageGroup = await utils_messageUtils_storage.getChatRecord(myUserInfo.id, fromUserId);
    this.messageGroup = beforeMessageGroup;
    let messages = this.messageGroup.messages;
    let messagesSize = messages.length;
    common_vendor.index.hideLoading();
    this.onLineState = await common_requestFunctions.GetonlineState(fromUserId);
    this.fromUserInfo = await common_requestFunctions.getUserinfo(fromUserId);
    if (messagesSize > 0) {
      this.scrollInto = `chat_${messages[messagesSize - 1].id}`;
      this.setMessageListUnReadSum(myUserInfo.id, fromUserId);
      if (messages[messagesSize - 1].isMe && messages[messagesSize - 1].isNotRead) {
        let IsBeenRead = await this.getIsBeenRead([messages[messagesSize - 1].id]);
        if (!IsBeenRead[0].unread) {
          for (let i = messagesSize - 1; i >= 0; i--) {
            if (messages[i].isMe && messages[i].isNotRead) {
              messages[i].isNotRead = false;
            } else {
              break;
            }
          }
        }
      }
    }
    this.messageGroup.messages = await this.messageDataProcessing(messages, fromUserId);
    if (this.messageGroup.messages.length > 0) {
      this.scrollInto = `chat_${messages[messages.length - 1].id}`;
    }
    this.saveNewestMessageGroup();
  },
  computed: {
    fromUsername() {
      if (!this.fromUserInfo.username) {
        return "";
      } else {
        return this.fromUserInfo.username.length > 7 ? this.fromUserInfo.username.slice(0, 7) + "..." : this.fromUserInfo.username;
      }
    },
    newMessage() {
      return this.state.messageStore.newMessage;
    },
    scollerHeight() {
      let keyboardHeight = this.showEmojiPicker ? this.emojiContentHeight : this.keyboardHeight;
      return this.contentHeight - keyboardHeight - this.navHeight - 110;
    }
  },
  watch: {
    newMessage: async function(new_message) {
      if (new_message.type === common_constants.WITHDRAW) {
        if (new_message.data.userId == this.fromUserInfo.id) {
          if (this.messageGroup) {
            let messages = this.messageGroup.messages;
            for (let j = messages.length - 1; j >= 0; j--) {
              if (messages[j].id == new_message.data.messageId) {
                messages[j] = {
                  content: "\u5BF9\u65B9\u64A4\u56DE\u4E86\u4E00\u6761\u6D88\u606F",
                  type: -1,
                  id: new_message.data.messageId,
                  createTime: messages[j].createTime,
                  isMe: false
                };
                break;
              }
            }
            this.messageGroup.messages = messages;
            this.scrollInto = `chat_${messages[messages.length - 1].id}`;
          }
        }
      } else if (new_message.type === common_constants.USER_MESSAGE) {
        if (new_message.data.fromUserId == this.fromUserInfo.id) {
          this.getUnReadMessage(this.fromUserInfo.id);
          if (this.messageGroup) {
            let messages = this.messageGroup.messages;
            messages.push({
              content: new_message.data.content,
              type: new_message.data.type,
              id: new_message.data.id,
              isMe: false,
              createTime: utils_dateUtils.getTime(),
              time: new_message.data.time
            });
            this.messageGroup.messages = messages;
            this.scrollInto = `chat_${messages[messages.length - 1].id}`;
          }
        }
      } else if (new_message.type === common_constants.ALREADY_READ) {
        if (new_message.data.userId == this.fromUserInfo.id) {
          if (this.messageGroup) {
            let messages = this.messageGroup.messages;
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].isMe && messages[i].isNotRead) {
                messages[i].isNotRead = false;
              } else {
                break;
              }
            }
            this.messageGroup.messages = messages;
          }
        }
      }
      this.saveNewestUserMessage();
    }
  },
  methods: {
    initRecorderAndKeyboardManager() {
      common_vendor.index.onKeyboardHeightChange(async (res) => {
        if (res.height != 0) {
          this.keyboardHeight = res.height;
          this.emojiContentHeight = res.height;
          this.showEmojiPicker = false, this.scrollInto = "show_keyboard";
        } else {
          this.keyboardHeight = 0;
          this.scrollInto = "";
        }
      });
      this.recorderManager.onStop(async (res) => {
        clearInterval();
        if (this.cancelSendVoice)
          ;
        else {
          let time = Math.floor(res.duration / 1e3);
          if (time < 1) {
            common_vendor.index.showToast({
              title: "\u65F6\u95F4\u8FC7\u77ED",
              icon: "none"
            });
          } else {
            this.uploadImageOrVoice([res.tempFilePath], 2, time);
          }
        }
        this.touchY = 0, this.cancelSendVoice = false;
        this.voiceTime = 0;
        this.$refs.recordingPopup.close();
      });
      this.recorderManager.onFrameRecorded((res) => {
      });
    },
    onNarLeftClick() {
      common_vendor.index.navigateBack({
        delta: 1
      });
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
    onWithdrawTextClick() {
      this.withdrawMessage(this.selectChatItem.id);
      this.$refs.chatItemActionPopup.close();
    },
    onInputFocus() {
      this.inputFocus = true;
    },
    onContentClick() {
      this.inputFocus = false;
      this.showEmojiPicker = false;
      common_vendor.index.hideKeyboard();
    },
    onChatItemLongPress(chatItem) {
      this.selectChatItem = chatItem;
      this.$refs.chatItemActionPopup.open();
    },
    onInput(e) {
      this.sendText = e.detail.value;
    },
    onVoiceButtonTouchStart(e) {
      if (this.myUserInfo.isVerify == 0) {
        common_vendor.index.showToast({
          title: "\u53EA\u6709\u8BA4\u8BC1\u8FC7\u7684\u7528\u6237\u624D\u53EF\u4EE5\u53D1\u9001\u8BED\u97F3\u6D88\u606F\u54E6",
          icon: "none"
        });
        return;
      }
      this.touchY = e.changedTouches[0].clientY, this.$refs.recordingPopup.open();
      this.recorderManager.start(this.options);
      this.voiceTimer();
    },
    onVoiceButtonTouchEnd() {
      this.$refs.recordingPopup.close();
      this.recorderManager.stop();
      this.stopTimer = true;
    },
    onVoiceButtonTouchMove(e) {
      if (this.touchY - e.changedTouches[0].clientY > 50) {
        this.cancelSendVoice = true;
      } else {
        this.cancelSendVoice = false;
      }
    },
    sendButtonClick() {
      if (this.sendVoice)
        ;
      else {
        if (this.sendText) {
          this.sendMessage(this.fromUserInfo.id, this.sendText);
        }
      }
    },
    onChangeSendTypeClick() {
      this.sendVoice = !this.sendVoice;
      if (this.sendVoice) {
        this.inputFocus = false;
        this.showEmojiPicker = false;
        common_vendor.index.hideKeyboard();
      }
    },
    onImageChooseClick() {
      let _this = this;
      common_vendor.index.chooseImage({
        count: 9,
        sizeType: ["original", "compressed"],
        sourceType: ["album"],
        success: function(res) {
          var tempFilePaths = res.tempFilePaths;
          _this.uploadImageOrVoice(tempFilePaths);
        }
      });
    },
    onCameraIconClick() {
      let _this = this;
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["camera"],
        success: function(res) {
          var tempFilePaths = res.tempFilePaths;
          _this.uploadImageOrVoice(tempFilePaths);
        }
      });
    },
    onSmileIconClick() {
      this.showEmojiPicker = !this.showEmojiPicker;
      this.scrollInto = "show_keyboard";
      if (this.showEmojiPicker) {
        this.inputFocus = false;
        common_vendor.index.hideKeyboard();
      }
    },
    onSwiperChange(e) {
      this.expressionTabPage = e.detail.current;
    },
    onExpressionTabClick(page) {
      this.expressionTabPage = page;
    },
    onEmojiItemClick(item) {
      this.sendText = this.sendText + item;
    },
    onCustomExpressionClick(item) {
      this.sendMessage(this.fromUserInfo.id, item.url.replace(common_constants.ImageFatherPath, ""), 1);
    },
    onHistoryIconClick() {
      common_vendor.index.navigateTo({
        url: `/pages/message-secondary-page/chat-history/chat-history?fromUserId=${this.fromUserInfo.id}`
      });
    },
    showChatCreatTime(index) {
      let messages = this.messageGroup.messages;
      let showtime = false;
      if (index == 0) {
        showtime = true;
      } else {
        let menit = utils_dateUtils.GetNumberOfMenit(messages[index - 1].createTime, messages[index].createTime);
        if (menit > 1) {
          showtime = true;
        }
      }
      return showtime;
    },
    voiceTimer() {
      if (this.voiceTime >= 59) {
        return;
      }
      if (this.stopTimer) {
        this.stopTimer = false;
        return;
      }
      let _this = this;
      setTimeout(function() {
        _this.voiceTime = _this.voiceTime + 1;
        _this.voiceTimer();
      }, 1e3);
    },
    async setMessageListUnReadSum(userId, fromUserId, unReadSum = 0) {
      let beforeUserMessageList = await utils_messageUtils_storage.getUserMessageList(userId);
      for (let i = 0; i < beforeUserMessageList.length; i++) {
        if (fromUserId == beforeUserMessageList[i].userId) {
          try {
            utils_tabBarBadgeUtils.changeUnreadMessageSum(-beforeUserMessageList[i].unReadSum);
          } catch {
          }
          beforeUserMessageList[i].unReadSum = unReadSum;
          let storageKey = utils_messageUtils_storageKeys.getUserMessageListKey(userId);
          await common_vendor.index.setStorage({
            key: storageKey,
            data: beforeUserMessageList
          });
          break;
        }
      }
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
        this.$refs.customExpression.refresh();
        common_vendor.index.showToast({
          title: "\u6DFB\u52A0\u6210\u529F",
          icon: "success"
        });
        return true;
      } else {
        return false;
      }
    },
    async deleteMessage(id) {
      if (this.messageGroup) {
        let messages = this.messageGroup.messages;
        for (let i = messages.length - 1; i >= 0; i--) {
          if (messages[i].id == id) {
            messages.splice(i, 1);
            break;
          }
        }
        this.messageGroup.messages = messages;
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
        this.saveNewestMessageGroup();
        this.saveNewestUserMessage();
      }
    },
    async withdrawMessage(id) {
      let res = await utils_request.request({
        data: {
          method: "POST",
          group: "message",
          action: `${id}/withdraw`,
          data: {
            id
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code == common_constants.REQUEST_SUCCEEDED_CODE) {
        if (this.messageGroup) {
          let messages = this.messageGroup.messages;
          for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].id == id) {
              messages[i] = {
                id,
                content: "\u4F60\u64A4\u56DE\u4E86\u4E00\u6761\u6D88\u606F",
                type: -1,
                isMe: true,
                createTime: messages[i].createTime
              };
              break;
            }
          }
          this.messageGroup.messages = messages;
          this.saveNewestMessageGroup();
          this.saveNewestUserMessage();
        }
      }
    },
    async sendMessage(toUserId, text, type = 0, voiceLen = 0) {
      let res = await utils_request.request({
        data: {
          method: "POST",
          group: "message",
          action: "send",
          data: {
            content: text,
            type,
            toUserId,
            time: voiceLen
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === "00000") {
        this.sendText = "";
        let result = res.data.data;
        if (this.messageGroup.messages) {
          this.messageGroup.messages.push({
            content: type == 0 ? text : result.url + text,
            type,
            id: result.messageId,
            isMe: true,
            createTime: utils_dateUtils.getTime(),
            isNotRead: true,
            time: voiceLen
          });
        } else {
          this.messageGroup = {
            fromUserId: toUserId,
            type: "",
            badgeNumber: 0,
            messages: [{
              content: type == 1 ? result.url + text : text,
              type,
              isMe: true,
              id: result.messageId,
              createTime: utils_dateUtils.getTime(),
              isNotRead: true,
              time: voiceLen
            }]
          };
        }
        this.scrollInto = `chat_${result.messageId}`;
        this.saveNewestUserMessage();
        this.saveNewestMessageGroup();
      }
    },
    async getIsBeenRead(ids) {
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "message",
          action: `unread/check`,
          data: {
            ids: JSON.stringify(ids)
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code == common_constants.REQUEST_SUCCEEDED_CODE) {
        return res.data.data;
      } else {
        return [];
      }
    },
    async messageDataProcessing(messages, fromUserId) {
      let unReadMessage = await this.getUnReadMessage(fromUserId);
      messages = messages.concat(unReadMessage);
      let iDs = [];
      let tempMessages = [];
      messages.forEach((item) => {
        if (iDs.indexOf(item.id) == -1) {
          iDs.push(item.id);
          tempMessages.push(item);
        }
      });
      tempMessages.sort(function(a, b) {
        let id_a = a.id;
        let id_b = b.id;
        return id_a >= id_b ? 1 : -1;
      });
      return tempMessages;
    },
    async getUnReadMessage(userId) {
      let res = await utils_request.request({
        data: {
          method: "DELETE",
          group: "message",
          action: "unRead/message",
          data: {
            userId
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        let unReadMessage = res.data.data;
        return unReadMessage;
      } else {
        return [];
      }
    },
    async saveNewestMessageGroup() {
      let storageKey = utils_messageUtils_storageKeys.getChatRecordKey(this.myUserInfo.id, this.fromUserInfo.id);
      common_vendor.index.setStorage({
        key: storageKey,
        data: this.messageGroup
      });
    },
    async saveNewestUserMessage() {
      if (this.messageGroup.messages) {
        let userMessageListItems = await utils_messageUtils_storage.getUserMessageList(this.myUserInfo.id);
        let have_data = false;
        let lastMessage = this.messageGroup.messages[this.messageGroup.messages.length - 1];
        for (let i = 0; i < userMessageListItems.length; i++) {
          if (userMessageListItems[i].userId === this.fromUserInfo.id) {
            let userMessageListItem = userMessageListItems[i];
            utils_tabBarBadgeUtils.changeUnreadMessageSum(-userMessageListItem.unReadSum);
            userMessageListItem.lastMessage = lastMessage.content;
            userMessageListItem.lastMessageType = lastMessage.type;
            userMessageListItem.lastTime = lastMessage.createTime;
            userMessageListItem.unReadSum = 0;
            userMessageListItems.splice(i, 1);
            userMessageListItems.push(userMessageListItem);
            have_data = true;
            break;
          }
        }
        if (this.fromUserInfo) {
          if (!have_data) {
            userMessageListItems.push({
              avatar: this.fromUserInfo.avatar,
              lastMessage: lastMessage.content,
              lastMessageType: lastMessage.type,
              lastTime: lastMessage.createTime,
              online: this.onLineState,
              unReadSum: 0,
              userId: this.fromUserInfo.id,
              username: this.fromUserInfo.username
            });
          }
        }
        let storageKey = utils_messageUtils_storageKeys.getUserMessageListKey(this.myUserInfo.id);
        common_vendor.index.setStorage({ key: storageKey, data: userMessageListItems });
      }
    },
    async uploadImageOrVoice(filePath, type = 1, voiceLen) {
      let _this = this;
      let uploadImageOrVoices = [];
      let filesNumber = filePath.length;
      if (type == 2) {
        if (this.myUserInfo.isVerify == 0) {
          common_vendor.index.showToast({
            title: "\u53EA\u6709\u8BA4\u8BC1\u8FC7\u7684\u7528\u6237\u624D\u53EF\u4EE5\u53D1\u9001\u8BED\u97F3\u6D88\u606F\u54E6",
            icon: "none"
          });
          return;
        }
      }
      if (filesNumber < 1) {
        return;
      }
      let FileVouchers;
      let res = await utils_request.request({
        data: {
          method: "GET",
          group: "message",
          action: "tokens",
          data: {
            sum: filesNumber
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          }
        }
      });
      if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
        FileVouchers = res.data.data;
      } else {
        return;
      }
      FileVouchers.forEach((item) => {
        uploadImageOrVoices.push(item.fileName);
      });
      filePath.forEach(async (item, index) => {
        if (type == 1) {
          common_vendor.index.showLoading({
            title: `\u6B63\u5728\u53D1\u9001${index + 1}/${filesNumber}`
          });
        }
        await common_vendor.index.uploadFile({
          url: common_constants.UploadUrl,
          filePath: item,
          name: "file",
          formData: {
            "key": FileVouchers[index].fileName,
            "token": utils_aes_export.aes.decrypt(FileVouchers[index].token)
          },
          success() {
            _this.sendMessage(_this.fromUserInfo.id, FileVouchers[index].fileName, type, voiceLen);
          }
        });
      });
      common_vendor.index.hideLoading();
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_chat_item2 = common_vendor.resolveComponent("chat-item");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_emoji2 = common_vendor.resolveComponent("emoji");
  const _easycom_custom_expression2 = common_vendor.resolveComponent("custom-expression");
  const _easycom_action_sheet_item2 = common_vendor.resolveComponent("action-sheet-item");
  const _easycom_action_sheet2 = common_vendor.resolveComponent("action-sheet");
  (_easycom_uni_nav_bar2 + _easycom_chat_item2 + _easycom_uni_popup2 + _easycom_emoji2 + _easycom_custom_expression2 + _easycom_action_sheet_item2 + _easycom_action_sheet2)();
}
const _easycom_uni_nav_bar = () => "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_chat_item = () => "../../../components/chat-item/chat-item.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_emoji = () => "../../../components/emoji/emoji.js";
const _easycom_custom_expression = () => "../../../components/custom-expression/custom-expression.js";
const _easycom_action_sheet_item = () => "../../../components/action-sheet-item/action-sheet-item.js";
const _easycom_action_sheet = () => "../../../components/action-sheet/action-sheet.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_chat_item + _easycom_uni_popup + _easycom_emoji + _easycom_custom_expression + _easycom_action_sheet_item + _easycom_action_sheet)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.fromUsername),
    b: $data.onLineState ? "#2ee98e" : "#979797",
    c: common_vendor.t($data.onLineState ? "\u5728\u7EBF" : "\u79BB\u7EBF"),
    d: common_vendor.o(($event) => $options.onNarLeftClick()),
    e: common_vendor.p({
      ["left-icon"]: "back",
      fixed: "true",
      backgroundColor: "#fff",
      color: "#808080",
      statusBar: "true"
    }),
    f: $data.messageGroup.messages
  }, $data.messageGroup.messages ? common_vendor.e({
    g: common_vendor.f($data.messageGroup.messages, (item, index, i0) => {
      return common_vendor.e({
        a: $options.showChatCreatTime(index)
      }, $options.showChatCreatTime(index) ? {
        b: common_vendor.t($data.GettimeifferenceOfNow(item.createTime).Detailed)
      } : {}, {
        c: common_vendor.o(($event) => $options.onChatItemLongPress(item)),
        d: "1d211244-1-" + i0,
        e: common_vendor.p({
          avatarUrl: item.isMe ? $data.myUserInfo.avatar : $data.fromUserInfo.avatar,
          chatText: item.content,
          isMe: item.isMe,
          voiceTime: item.time,
          isNotRead: item.isMe && item.isNotRead,
          messageType: item.type
        }),
        f: item.id,
        g: "chat_" + item.id
      });
    }),
    h: $data.keyboardHeight != 0 || $data.showEmojiPicker
  }, $data.keyboardHeight != 0 || $data.showEmojiPicker ? {} : {}, {
    i: $data.cancelSendVoice ? "/static/svgs/chat-cancel.svg" : "/static/svgs/chat-recording.svg",
    j: common_vendor.t($data.cancelSendVoice ? "\u677E\u624B\u53D6\u6D88\u53D1\u9001" : `\u6B63\u5728\u5F55\u97F3 ${$data.voiceTime}S \u4E0A\u5212\u53D6\u6D88`),
    k: common_vendor.sr("recordingPopup", "1d211244-2"),
    l: common_vendor.o(($event) => $options.onContentClick()),
    m: $data.scrollInto,
    n: $options.scollerHeight > 0 ? $options.scollerHeight + "px" : "80vh"
  }) : {}, {
    o: $data.sendVoice
  }, $data.sendVoice ? {
    p: $data.isRecording ? "#dddddd" : "#FFF",
    q: common_vendor.o((...args) => $options.onVoiceButtonTouchStart && $options.onVoiceButtonTouchStart(...args)),
    r: common_vendor.o((...args) => $options.onVoiceButtonTouchEnd && $options.onVoiceButtonTouchEnd(...args)),
    s: common_vendor.o((...args) => $options.onVoiceButtonTouchMove && $options.onVoiceButtonTouchMove(...args))
  } : {}, {
    t: $data.isIOS
  }, $data.isIOS ? {
    v: !$data.sendVoice && $data.inputFocus,
    w: $data.inputFocus,
    x: common_vendor.o((...args) => $options.onInputFocus && $options.onInputFocus(...args)),
    y: $data.sendText,
    z: common_vendor.o(($event) => $data.sendText = $event.detail.value)
  } : {
    A: !$data.sendVoice && $data.inputFocus,
    B: $data.inputFocus,
    C: common_vendor.o((...args) => $options.onInputFocus && $options.onInputFocus(...args)),
    D: $data.sendText,
    E: common_vendor.o(($event) => $data.sendText = $event.detail.value)
  }, {
    F: common_vendor.t($data.sendText),
    G: !$data.sendVoice && !$data.inputFocus,
    H: common_vendor.o((...args) => $options.onInputFocus && $options.onInputFocus(...args)),
    I: common_vendor.o(($event) => $options.sendButtonClick()),
    J: $data.sendVoice
  }, $data.sendVoice ? {
    K: common_vendor.o((...args) => $options.onChangeSendTypeClick && $options.onChangeSendTypeClick(...args))
  } : {
    L: common_vendor.o((...args) => $options.onChangeSendTypeClick && $options.onChangeSendTypeClick(...args))
  }, {
    M: common_vendor.o((...args) => $options.onImageChooseClick && $options.onImageChooseClick(...args)),
    N: common_vendor.o((...args) => $options.onCameraIconClick && $options.onCameraIconClick(...args)),
    O: common_vendor.o((...args) => $options.onSmileIconClick && $options.onSmileIconClick(...args)),
    P: common_vendor.o((...args) => $options.onHistoryIconClick && $options.onHistoryIconClick(...args)),
    Q: common_vendor.o(($event) => $options.onExpressionTabClick(0)),
    R: $data.expressionTabPage == 0 ? "#fff" : "",
    S: common_vendor.o(($event) => $options.onExpressionTabClick(1)),
    T: $data.expressionTabPage == 1 ? "#fff" : "",
    U: common_vendor.o($options.onEmojiItemClick),
    V: common_vendor.p({
      contentHeight: $data.emojiContentHeight - 45
    }),
    W: common_vendor.sr("customExpression", "1d211244-4"),
    X: common_vendor.o($options.onCustomExpressionClick),
    Y: common_vendor.p({
      contentHeight: $data.emojiContentHeight - 45
    }),
    Z: $data.expressionTabPage,
    aa: $data.emojiContentHeight - 45 + "px",
    ab: common_vendor.o((...args) => $options.onSwiperChange && $options.onSwiperChange(...args)),
    ac: $data.showEmojiPicker,
    ad: $data.showEmojiPicker ? $data.emojiContentHeight + "px" : $data.keyboardHeight + "px",
    ae: $data.selectChatItem.id
  }, $data.selectChatItem.id ? common_vendor.e({
    af: $data.selectChatItem.type == 0
  }, $data.selectChatItem.type == 0 ? {
    ag: common_vendor.o($options.onCopyTextClick),
    ah: common_vendor.p({
      title: "\u590D\u5236"
    })
  } : {}, {
    ai: $data.selectChatItem.type == 1
  }, $data.selectChatItem.type == 1 ? {
    aj: common_vendor.o($options.onAddExpressionClick),
    ak: common_vendor.p({
      title: "\u6DFB\u52A0\u5230\u8868\u60C5"
    })
  } : {}, {
    al: common_vendor.o($options.onDeleteTextClick),
    am: common_vendor.p({
      title: "\u5220\u9664"
    }),
    an: $data.selectChatItem.isMe
  }, $data.selectChatItem.isMe ? {
    ao: common_vendor.o($options.onWithdrawTextClick),
    ap: common_vendor.p({
      title: "\u64A4\u56DE"
    })
  } : {}) : {}, {
    aq: common_vendor.sr("chatItemActionPopup", "1d211244-5"),
    ar: common_vendor.p({
      needHead: true,
      title: "\u8BBE\u7F6E\u6D88\u606F",
      needCancelButton: true
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Project/Vue/Uniapp/bugu_uniapp-master/pages/message-secondary-page/chat-content/chat-content.vue"]]);
wx.createPage(MiniProgramPage);
