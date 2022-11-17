"use strict";
const TitleColor = "#808080";
const MainColor = "#4eccb8";
const Protocol = "https";
const AppVersion = "2.0.3";
const ServerDomain = "bgxq.kaleer.cn";
const SoketUrl = "wss://bgxq.kaleer.cn/webSocketServer/";
const UploadUrl = "https://up-z2.qiniup.com/";
const UseProtocolUrl = "https://www.mulantools.top/bugu-use-protocol";
const PrivacyPolicyUrl = "https://www.mulantools.top/bugu-privacy-policy";
const key = "%7GsMTFD#Rv)ff_oTAWSH1PSRaecv10l-";
const timestamp = new Date().getTime() * 1e3;
function random16String() {
  let len = 16;
  let $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz123456789";
  let maxPos = $chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
const ImageFatherPath = "http://file.bgxq.kaleer.cn/";
const AnonymousAvatar = "http://file.bgxq.kaleer.cn/user/anonymous_avatar/anonymous_avatar.png";
const WITHDRAW = "WITHDRAW";
const USER_MESSAGE = "USER_MESSAGE";
const ALREADY_READ = "ALREADY_READ";
const INTERACTIVE = "INTERACTIVE";
var OfficeMessageType = /* @__PURE__ */ ((OfficeMessageType2) => {
  OfficeMessageType2["ACTIVITY"] = "ACTIVITY";
  return OfficeMessageType2;
})(OfficeMessageType || {});
var InteractiveGroup = /* @__PURE__ */ ((InteractiveGroup2) => {
  InteractiveGroup2["ACTIVITY"] = "ACTIVITY";
  InteractiveGroup2["QUESTION"] = "QUESTION";
  InteractiveGroup2["ANSWER"] = "ANSWER";
  return InteractiveGroup2;
})(InteractiveGroup || {});
var InteractiveType = /* @__PURE__ */ ((InteractiveType2) => {
  InteractiveType2["LIKE"] = "LIKE";
  InteractiveType2["ATTENTION"] = "ATTENTION";
  InteractiveType2["COMMENT"] = "COMMENT";
  InteractiveType2["PUBLISH"] = "PUBLISH";
  InteractiveType2["COLLECT"] = "COLLECT";
  InteractiveType2["AGREE"] = "AGREE";
  InteractiveType2["OPPOSE"] = "OPPOSE";
  InteractiveType2["ANSWER"] = "ANSWER";
  return InteractiveType2;
})(InteractiveType || {});
const PUNISH = "punish";
const REQUEST_SUCCEEDED_CODE = "00000";
const RingingToneList = [
  {
    value: 0,
    label: "\u9ED8\u8BA4",
    url: `${ImageFatherPath}user/sound/new_message.mp3`
  },
  {
    value: 1,
    label: "\u4E09\u5168\u97F3",
    url: `${ImageFatherPath}user/sound/threetone.mp3`
  },
  {
    value: 2,
    label: "\u6EAA\u6D41",
    url: `${ImageFatherPath}user/sound/stream.mp3`
  },
  {
    value: 3,
    label: "\u5192\u51FA",
    url: `${ImageFatherPath}user/sound/emerge.mp3`
  },
  {
    value: 4,
    label: "\u55B5\u55B5",
    url: `${ImageFatherPath}user/sound/cat.mp3`
  },
  {
    value: 5,
    label: "\u76AE\u5361\u4E18",
    url: `${ImageFatherPath}user/sound/Pikachu.mp3`
  },
  {
    value: 6,
    label: "\u6C34\u6EF4",
    url: `${ImageFatherPath}user/sound/drip.mp3`
  },
  {
    value: 7,
    label: "YOHU~",
    url: `${ImageFatherPath}user/sound/YOHO.mp3`
  },
  {
    value: 8,
    label: "\u54C6\u5566A\u68A6",
    url: `${ImageFatherPath}user/sound/Doraemon.mp3`
  },
  {
    value: 9,
    label: "\u7B80\u77ED",
    url: `${ImageFatherPath}user/sound/brief.mp3`
  },
  {
    value: 10,
    label: "\u80E1\u5DF4",
    url: `${ImageFatherPath}user/sound/huba.mp3`
  },
  {
    value: 11,
    label: "\u65E0",
    url: ""
  }
];
const privateSettingGroup = ["\u6240\u6709\u4EBA\u53EF\u89C1", "\u4E3B\u9875\u53EF\u89C1", "\u4EC5\u81EA\u5DF1\u53EF\u89C1"];
const emojiList = [
  "\u{1F600}",
  "\u{1F601}",
  "\u{1F603}",
  "\u{1F604}",
  "\u{1F605}",
  "\u{1F606}",
  "\u{1F609}",
  "\u{1F60A}",
  "\u{1F60B}",
  "\u{1F60E}",
  "\u{1F60D}",
  "\u{1F618}",
  "\u{1F617}",
  "\u{1F619}",
  "\u{1F61A}",
  "\u263A",
  "\u{1F607}",
  "\u{1F610}",
  "\u{1F611}",
  "\u{1F636}",
  "\u{1F60F}",
  "\u{1F623}",
  "\u{1F625}",
  "\u{1F62E}",
  "\u{1F62F}",
  "\u{1F62A}",
  "\u{1F62B}",
  "\u{1F634}",
  "\u{1F60C}",
  "\u{1F61B}",
  "\u{1F61C}",
  "\u{1F61D}",
  "\u{1F612}",
  "\u{1F613}",
  "\u{1F614}",
  "\u{1F615}",
  "\u{1F632}",
  "\u{1F637}",
  "\u{1F616}",
  "\u{1F61E}",
  "\u{1F61F}",
  "\u{1F624}",
  "\u{1F622}",
  "\u{1F62D}",
  "\u{1F626}",
  "\u{1F627}",
  "\u{1F628}",
  "\u{1F62C}",
  "\u{1F630}",
  "\u{1F631}",
  "\u{1F633}",
  "\u{1F635}",
  "\u{1F621}",
  "\u{1F620}",
  "\u{1F466}",
  "\u{1F467}",
  "\u{1F468}",
  "\u{1F469}",
  "\u{1F474}",
  "\u{1F475}",
  "\u{1F476}",
  "\u{1F471}",
  "\u{1F46E}",
  "\u{1F472}",
  "\u{1F473}",
  "\u{1F477}",
  "\u{1F478}",
  "\u{1F482}",
  "\u{1F385}",
  "\u{1F470}",
  "\u{1F47C}",
  "\u{1F486}",
  "\u{1F487}",
  "\u{1F64D}",
  "\u{1F64E}",
  "\u{1F645}",
  "\u{1F646}",
  "\u{1F481}",
  "\u{1F64B}",
  "\u{1F647}",
  "\u{1F64C}",
  "\u{1F64F}",
  "\u{1F464}",
  "\u{1F465}",
  "\u{1F6B6}",
  "\u{1F3C3}",
  "\u{1F46F}",
  "\u{1F483}",
  "\u{1F46B}",
  "\u{1F46C}",
  "\u{1F46D}",
  "\u{1F48F}",
  "\u{1F491}",
  "\u{1F46A}",
  "\u{1F4AA}",
  "\u{1F448}",
  "\u{1F449}",
  "\u261D",
  "\u{1F446}",
  "\u{1F447}",
  "\u270C",
  "\u270B",
  "\u{1F44C}",
  "\u{1F44D}",
  "\u{1F44E}",
  "\u270A",
  "\u{1F44A}",
  "\u{1F44B}",
  "\u{1F44F}",
  "\u{1F450}",
  "\u270D",
  "\u{1F463}",
  "\u{1F440}",
  "\u{1F442}",
  "\u{1F443}",
  "\u{1F445}",
  "\u{1F444}",
  "\u{1F48B}",
  "\u{1F453}",
  "\u{1F454}",
  "\u{1F459}",
  "\u{1F45B}",
  "\u{1F45C}",
  "\u{1F45D}",
  "\u{1F392}",
  "\u{1F4BC}",
  "\u{1F45E}",
  "\u{1F45F}",
  "\u{1F460}",
  "\u{1F461}",
  "\u{1F462}",
  "\u{1F451}",
  "\u{1F452}",
  "\u{1F3A9}",
  "\u{1F393}",
  "\u{1F484}",
  "\u{1F485}",
  "\u{1F48D}",
  "\u{1F302}",
  "\u{1F4F6}",
  "\u{1F4F3}",
  "\u{1F4F4}",
  "\u267B",
  "\u{1F3E7}",
  "\u{1F6AE}",
  "\u{1F6B0}",
  "\u267F",
  "\u{1F6B9}",
  "\u{1F6BA}",
  "\u{1F6BB}",
  "\u{1F6BC}",
  "\u{1F6BE}",
  "\u26A0",
  "\u{1F6B8}",
  "\u26D4",
  "\u{1F6AB}",
  "\u{1F6B3}",
  "\u{1F6AD}",
  "\u{1F6AF}",
  "\u{1F6B1}",
  "\u{1F6B7}",
  "\u{1F51E}",
  "\u{1F488}",
  "\u{1F648}",
  "\u{1F412}",
  "\u{1F436}",
  "\u{1F415}",
  "\u{1F429}",
  "\u{1F43A}",
  "\u{1F431}",
  "\u{1F408}",
  "\u{1F42F}",
  "\u{1F405}",
  "\u{1F406}",
  "\u{1F434}",
  "\u{1F40E}",
  "\u{1F42E}",
  "\u{1F402}",
  "\u{1F403}",
  "\u{1F404}",
  "\u{1F437}",
  "\u{1F416}",
  "\u{1F417}",
  "\u{1F43D}",
  "\u{1F40F}",
  "\u{1F411}",
  "\u{1F410}",
  "\u{1F42A}",
  "\u{1F42B}",
  "\u{1F418}",
  "\u{1F42D}",
  "\u{1F401}",
  "\u{1F400}",
  "\u{1F439}",
  "\u{1F430}",
  "\u{1F407}",
  "\u{1F43B}",
  "\u{1F428}",
  "\u{1F43C}",
  "\u{1F43E}",
  "\u{1F414}",
  "\u{1F413}",
  "\u{1F423}",
  "\u{1F424}",
  "\u{1F425}",
  "\u{1F426}",
  "\u{1F427}",
  "\u{1F438}",
  "\u{1F40A}",
  "\u{1F422}",
  "\u{1F40D}",
  "\u{1F432}",
  "\u{1F409}",
  "\u{1F433}",
  "\u{1F40B}",
  "\u{1F42C}",
  "\u{1F41F}",
  "\u{1F420}",
  "\u{1F421}",
  "\u{1F419}",
  "\u{1F41A}",
  "\u{1F40C}",
  "\u{1F41B}",
  "\u{1F41C}",
  "\u{1F41D}",
  "\u{1F41E}",
  "\u{1F98B}",
  "\u{1F490}",
  "\u{1F338}",
  "\u{1F4AE}",
  "\u{1F339}",
  "\u{1F33A}",
  "\u{1F33B}",
  "\u{1F33C}",
  "\u{1F337}",
  "\u{1F331}",
  "\u{1F332}",
  "\u{1F333}",
  "\u{1F334}",
  "\u{1F335}",
  "\u{1F33E}",
  "\u{1F33F}",
  "\u{1F340}",
  "\u{1F341}",
  "\u{1F342}",
  "\u{1F343}",
  "\u{1F30D}",
  "\u{1F30E}",
  "\u{1F30F}",
  "\u{1F310}",
  "\u{1F311}",
  "\u{1F312}",
  "\u{1F313}",
  "\u{1F314}",
  "\u{1F315}",
  "\u{1F316}",
  "\u{1F317}",
  "\u{1F318}",
  "\u{1F319}",
  "\u{1F31A}",
  "\u{1F31B}",
  "\u{1F31C}",
  "\u2600",
  "\u{1F31D}",
  "\u{1F31E}",
  "\u2B50",
  "\u{1F31F}",
  "\u{1F320}",
  "\u2601",
  "\u26C5",
  "\u2614",
  "\u26A1",
  "\u2744",
  "\u{1F525}",
  "\u{1F4A7}",
  "\u{1F30A}",
  "\u{1F3C0}",
  "\u{1F3C8}",
  "\u{1F3C9}",
  "\u{1F3BE}",
  "\u{1F3B1}",
  "\u{1F3B3}",
  "\u26F3",
  "\u{1F3A3}",
  "\u{1F3BD}",
  "\u{1F3BF}",
  "\u{1F608}",
  "\u{1F47F}",
  "\u{1F479}",
  "\u{1F47A}",
  "\u{1F480}",
  "\u2620",
  "\u{1F47B}",
  "\u{1F47D}",
  "\u{1F47E}",
  "\u{1F4A3}",
  "\u{1F30B}",
  "\u{1F5FB}",
  "\u{1F3E0}",
  "\u{1F3E1}",
  "\u{1F3E2}",
  "\u{1F3E3}",
  "\u{1F3E4}",
  "\u{1F3E5}",
  "\u{1F3E6}",
  "\u{1F3E8}",
  "\u26F2",
  "\u{1F301}",
  "\u{1F303}",
  "\u{1F306}",
  "\u{1F307}",
  "\u{1F3A0}",
  "\u{1F3A1}",
  "\u{1F3A2}",
  "\u{1F682}",
  "\u{1F68C}",
  "\u{1F68D}",
  "\u{1F68E}",
  "\u{1F68F}",
  "\u{1F690}",
  "\u{1F691}",
  "\u{1F692}",
  "\u{1F693}",
  "\u{1F694}",
  "\u{1F695}",
  "\u{1F696}",
  "\u{1F697}",
  "\u{1F698}",
  "\u{1F48C}",
  "\u{1F48E}",
  "\u{1F52A}",
  "\u{1F488}",
  "\u{1F6AA}",
  "\u{1F6BD}",
  "\u{1F6BF}",
  "\u{1F6C1}",
  "\u231B",
  "\u23F3",
  "\u231A",
  "\u23F0",
  "\u{1F388}",
  "\u{1F389}",
  "\u{1F4A4}",
  "\u{1F4A2}",
  "\u{1F4AC}",
  "\u{1F4AD}",
  "\u2668",
  "\u{1F300}",
  "\u{1F514}",
  "\u{1F515}",
  "\u2721",
  "\u271D",
  "\u{1F52F}",
  "\u{1F4DB}",
  "\u{1F530}",
  "\u{1F531}",
  "\u2B55",
  "\u2705",
  "\u2611",
  "\u2714",
  "\u2716",
  "\u274C",
  "\u274E",
  "\u2795",
  "\u2796",
  "\u2797",
  "\u27B0",
  "\u27BF",
  "\u303D",
  "\u2733",
  "\u2734",
  "\u2747",
  "\u203C",
  "\u2049",
  "\u2753",
  "\u2754",
  "\u2755",
  "\u2757",
  "\u{1F55B}",
  "\u{1F567}",
  "\u{1F550}",
  "\u{1F55C}",
  "\u{1F551}",
  "\u{1F55D}",
  "\u{1F552}",
  "\u{1F55E}",
  "\u{1F553}",
  "\u{1F55F}",
  "\u{1F554}",
  "\u{1F560}",
  "\u{1F555}",
  "\u{1F561}",
  "\u{1F556}",
  "\u{1F562}",
  "\u{1F557}",
  "\u{1F563}",
  "\u{1F558}",
  "\u{1F564}",
  "\u{1F559}",
  "\u{1F565}",
  "\u{1F55A}",
  "\u{1F566}",
  "\u23F1",
  "\u23F2",
  "\u{1F570}",
  "\u{1F498}",
  "\u2764",
  "\u{1F493}",
  "\u{1F494}",
  "\u{1F495}",
  "\u{1F496}",
  "\u{1F497}",
  "\u{1F499}",
  "\u{1F49A}",
  "\u{1F49B}",
  "\u{1F49C}",
  "\u{1F49D}",
  "\u{1F49E}",
  "\u{1F49F}\u2763",
  "\u{1F347}",
  "\u{1F348}",
  "\u{1F349}",
  "\u{1F34A}",
  "\u{1F34B}",
  "\u{1F34C}",
  "\u{1F34D}",
  "\u{1F34E}",
  "\u{1F34F}",
  "\u{1F350}",
  "\u{1F351}",
  "\u{1F352}",
  "\u{1F353}"
];
const reportTypes = ["\u5783\u573E\u5E7F\u544A\u4FE1\u606F", "\u4E0D\u5B9E\u4FE1\u606F", "\u8FB1\u9A82\u4EBA\u8EAB\u653B\u51FB\u7B49\u4E0D\u53CB\u5584\u884C\u4E3A", "\u6709\u5BB3\u4FE1\u606F", "\u6D89\u5ACC\u4FB5\u6743", "\u8BF1\u5BFC\u8D5E\u540C\u5173\u6CE8\u7B49\u884C\u4E3A", "\u9A9A\u6270", "\u6E05\u6717\u884C\u52A8\u4E13\u9879\u4E3E\u62A5", "\u6709\u4EBA\u610F\u56FE\u81EA\u6740\u6216\u81EA\u6B8B", "\u5176\u4ED6"];
const reportObjectType = {
  activity: "activity",
  comment: "comment",
  chat: "chat",
  commentResponse: "commentResponse",
  question: "issue",
  answer: "comment",
  answerComment: "son_comment",
  answerCommentResponse: "grant_son_comment"
};
const sexGrounp = ["\u5973", "\u7537"];
const updateLogs = [
  {
    version: "2.0.3",
    logTexts: ["\u4FEE\u590D\u4E86\u6D88\u606F\u63D0\u793A\u7684\u95EE\u9898", "\u4FEE\u590D\u4E86\u6D88\u606F\u56FE\u7247\u65E0\u6CD5\u6253\u5F00\u7684\u95EE\u9898"]
  },
  {
    version: "2.0.2",
    logTexts: ["\u76F2\u76D2\u65E0\u6CD5\u8DF3\u8F6C\u7684\u95EE\u9898"]
  },
  {
    version: "2.0.1",
    logTexts: ["\u4FEE\u590DIOS\u65E0\u6CD5\u8F93\u5165\u7684\u95EE\u9898", "\u4FEE\u590D\u90E8\u5206\u9875\u9762\u70B9\u51FB\u52A8\u6001\u65E0\u6CD5\u8DF3\u8F6C\u5230\u8BE6\u60C5\u9875\u7684\u95EE\u9898"]
  },
  {
    version: "2.0.0",
    logTexts: ["\u5E03\u5495\u661F\u7403\u6B63\u5F0F\u7248\u53D1\u5E03", "\u65B0\u589E\u95EE\u7B54\u6A21\u5757", "\u4EE3\u7801\u8FC1\u79FB\u5230uniapp", "\u4F18\u5316\u90E8\u5206ui", "\u4F18\u5316\u4EE3\u7801\u903B\u8F91", "\u4FEE\u590D\u82E5\u5E72bug"]
  },
  {
    version: "1.0.6",
    logTexts: ["\u53EF\u4EE5\u81EA\u5B9A\u4E49\u8868\u60C5\u4E86", "\u4FEE\u590D\u4E00\u4E9Bbug"]
  },
  {
    version: "1.0.5",
    logTexts: [
      "\u53EF\u4EE5\u641C\u7D22\u5E76\u6DFB\u52A0\u7528\u6237\u4E86",
      "\u73B0\u5728\u53EF\u4EE5\u53D1\u5E03\u89C6\u9891\u52A8\u6001\u4E86",
      "\u4F18\u5316\u767B\u5F55\u754C\u9762\u903B\u8F91",
      "\u4F18\u5316\u90E8\u5206\u4EE3\u7801\u903B\u8F91"
    ]
  },
  {
    version: "1.0.4",
    logTexts: [
      "\u65B0\u589E\u70ED\u95E8\u52A8\u6001",
      "\u4FEE\u590D\u65E0\u6CD5\u663E\u793A\u641C\u7D22\u5386\u53F2\u7684\u95EE\u9898",
      "\u4F18\u5316\u6D88\u606F\u901A\u77E5\u663E\u793A",
      "\u4FEE\u590D\u52A8\u6001\u533F\u540D\u56DE\u590D\u7684\u95EE\u9898"
    ]
  },
  {
    version: "1.0.3",
    logTexts: [
      "\u4FEE\u590D\u53D1\u5E03\u52A8\u6001\u65F6\u5BB9\u6613\u91CD\u590D\u53D1\u9001\u7684\u95EE\u9898",
      "\u4FEE\u590D\u8BC4\u8BBA\u65F6\u5BB9\u6613\u91CD\u590D\u7684\u95EE\u9898",
      "\u5E95\u90E8\u6D88\u606F\u6309\u94AE\u589E\u52A0\u7EA2\u70B9\u63D0\u793A",
      "\u4FEE\u590D\u804A\u5929\u8BB0\u5F55\u5076\u5C14\u9519\u4F4D\u7684\u95EE\u9898",
      "\u4FEE\u590D\u4FEE\u6539\u540D\u5B57\u542B\u6709\u8868\u60C5\u4E0D\u6B63\u786E\u63D0\u793A\u7684\u95EE\u9898",
      "\u4F18\u5316\u90E8\u5206\u4EE3\u7801\u903B\u8F91"
    ]
  },
  {
    version: "1.0.2",
    logTexts: ["\u5185\u6D4B\u7248\u6B63\u5F0F\u53D1\u5E03", "\u589E\u52A0\u767B\u5F55\u8BA4\u8BC1"]
  },
  {
    version: "1.0.1",
    logTexts: ["\u589E\u52A0\u5E03\u5495\u9875\u9762-\u5305\u62EC\u5929\u6C14\u4FE1\u606F\u3001banner\u3001\u7B7E\u5230\u3001\u548C\u9080\u8BF7\u83B7\u5956"]
  },
  {
    version: "1.0.0",
    logTexts: ["\u5B8C\u5584\u5927\u90E8\u5206\u529F\u80FD"]
  }
];
const globalData = {};
const setGlobalData = (global_key, val) => {
  globalData[global_key] = val;
};
const getGlobalData = (global_key) => {
  return globalData[global_key];
};
const activity_pic_hendle = "?imageView2/0/q/75|watermark/2/text/5biD5ZKV5pif55CD/font/5qW35L2T/fontsize/600/fill/I0ZBRkFGQQ==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim";
const avatar_pic_hendle = "?imageView2/1/w/200/h/200/q/75|imageslim";
exports.ALREADY_READ = ALREADY_READ;
exports.AnonymousAvatar = AnonymousAvatar;
exports.AppVersion = AppVersion;
exports.INTERACTIVE = INTERACTIVE;
exports.ImageFatherPath = ImageFatherPath;
exports.InteractiveGroup = InteractiveGroup;
exports.InteractiveType = InteractiveType;
exports.MainColor = MainColor;
exports.OfficeMessageType = OfficeMessageType;
exports.PUNISH = PUNISH;
exports.PrivacyPolicyUrl = PrivacyPolicyUrl;
exports.Protocol = Protocol;
exports.REQUEST_SUCCEEDED_CODE = REQUEST_SUCCEEDED_CODE;
exports.RingingToneList = RingingToneList;
exports.ServerDomain = ServerDomain;
exports.SoketUrl = SoketUrl;
exports.TitleColor = TitleColor;
exports.USER_MESSAGE = USER_MESSAGE;
exports.UploadUrl = UploadUrl;
exports.UseProtocolUrl = UseProtocolUrl;
exports.WITHDRAW = WITHDRAW;
exports.activity_pic_hendle = activity_pic_hendle;
exports.avatar_pic_hendle = avatar_pic_hendle;
exports.emojiList = emojiList;
exports.getGlobalData = getGlobalData;
exports.key = key;
exports.privateSettingGroup = privateSettingGroup;
exports.random16String = random16String;
exports.reportObjectType = reportObjectType;
exports.reportTypes = reportTypes;
exports.setGlobalData = setGlobalData;
exports.sexGrounp = sexGrounp;
exports.timestamp = timestamp;
exports.updateLogs = updateLogs;
