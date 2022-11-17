"use strict";var e=require("../common/vendor.js"),t=require("../store/index.js"),s=require("../common/constants.js"),o=require("../common/storageKeys.js"),a=require("./tabBarBadgeUtils.js"),n=require("./messageUtils/storage.js"),r=require("../common/storageFunctions.js");function c(e){e=JSON.parse(e),t.store.commit("messageStore/onNewMessage",e);let s=t.store.state;console.log(s.messageStore.newMessage)}exports.connectSocket=async function(){let i=e.index.getStorageSync(o.TOKEN),l=await r.getMyUserInfo();if(console.log(`${i}`),i){let r=e.index.connectSocket({url:`${s.SoketUrl}${i}`,success:function(){console.log("connect success")}});r.onOpen((function(){t.store.commit("socketStateStore/onSocketConnected",!0),setInterval((()=>{console.log("onOpen"),r.send({data:"我已经上线"})}),3e4)})),r.onMessage((async function(t){console.log("onMessage: ",t);let r=t.data,i=JSON.parse(r);if(console.log("socketResult.type",i.type),i.type===s.USER_MESSAGE){let i=e.index.getStorageSync(o.NEW_MESSAGE_SOUND);i||(i=s.RingingToneList[0]);const g=e.index.createInnerAudioContext();g.autoplay=!0,g.src=i.url;let d=JSON.parse(r);await n.saveUserMessageList(d,l.id),await n.saveChatRecord(d,l.id),a.changeUnreadMessageSum(1),c(t.data)}else if(i.type===s.WITHDRAW){let e=JSON.parse(r);await n.saveWithDrawChatRecord(e,l.id),await n.saveUserMessageListWhenWithDraw(e,l.id),c(t.data)}else if(i.type===s.ALREADY_READ){let e=JSON.parse(r);await n.saveAlreadyRead(e,l.id),c(t.data)}else if(i.type===s.INTERACTIVE){a.changeUnreadMessageSum(1);let e=JSON.parse(r);await n.saveInteractiveMessageItem(e,l.id),c(t.data)}})),r.onError((function(){console.log("onError"),e.index.closeSocket({})})),r.onClose((()=>{t.store.commit("socketStateStore/onSocketConnected",!1)}))}};
