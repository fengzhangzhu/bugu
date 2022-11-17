import { RingingToneItem } from "./dataClass";

export const AppName = "布咕星球";
export const TitleColor = "#808080";
// 主色调
export const MainColor = "#4eccb8";
export const Local = false;
export const DebugMode = false;
export const Protocol = Local ? "http" : DebugMode ? "https" : "https";
export const AppVersion = "2.0.3";
export const ServerDomain = Local
    ? "localhost:20000"
    : DebugMode
    ? "your_url.example"
    : "your_url.example";
export const SoketUrl = Local
    ? "wss://localhost:20000/webSocketServer/"
    : DebugMode
    ? "wss://your_url.example/webSocketServer/"
    : "wss://your_url.example/webSocketServer/";
export const UploadUrl = DebugMode
    ? "https://up-z2.qiniup.com/"
    : "https://up-z2.qiniup.com/";
export const UseProtocolUrl = "https://your_url.example/bugu-use-protocol";
export const PrivacyPolicyUrl = "https://your_url.example/bugu-privacy-policy";
export const key = "your key";
export const timestamp = new Date().getTime() * 1000; //获取当前时间戳
export function random16String() {
    //生成一个长度为16的随机字符串
    let len = 16;
    let $chars = "your key";
    let maxPos = $chars.length;
    let pwd = "";
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
//图片默认下载地址
export const ImageFatherPath = DebugMode
    ? "http://test.file.your_url.example/"
    : "http://file.your_url.example/";
export const AnonymousAvatar = DebugMode
    ? "http://test.file.your_url.example/user/anonymous_avatar/anonymous_avatar.png"
    : "http://file.your_url.example/user/anonymous_avatar/anonymous_avatar.png";

//默认字符串
//消息类型
export const WITHDRAW = "WITHDRAW";
export const USER_MESSAGE = "USER_MESSAGE";
export const ALREADY_READ = "ALREADY_READ";
export const INTERACTIVE = "INTERACTIVE";
export enum OfficeMessageType {
    ACTIVITY = "ACTIVITY",
}

export enum InteractiveGroup {
    ACTIVITY = "ACTIVITY",
    QUESTION = "QUESTION",
    ANSWER = "ANSWER",
}
export enum InteractiveType {
    LIKE = "LIKE",
    ATTENTION = "ATTENTION",
    COMMENT = "COMMENT",
    PUBLISH = "PUBLISH",
    COLLECT = "COLLECT",
    AGREE = "AGREE",
    OPPOSE = "OPPOSE",
    ANSWER = "ANSWER",
}

//官方消息类型
export const ACTIVITY = "activity";
export const PUNISH = "punish";
//问答消息类型
export const COMMENT_ON_ISSUE = "COMMENT_ON_ISSUE";
export const COMMENT_ON_COMMENT = "COMMENT_ON_COMMENT";
export const COMMENT_ON_SON_OR_GRANTSON_COMMENT =
    "COMMENT_ON_SON_OR_GRANTSON_COMMENT";
export const LIKE_ON_ISSUE = "LIKE_ON_ISSUE"; //点赞问题
export const LIKE_ON_COMMENT = "LIKE_ON_COMMENT"; //点赞回答
export const LIKE_ON_SON_COMMENT = "LIKE_ON_SON_COMMENT"; //点赞评论
//    COMMENT_ON_ISSUE:在问题下面发布回答,通知对应的问题发布者
//    COMMENT_ON_COMMENT:在回答进行进行评论,通知对应的回答发布者
//    COMMENT_ON_SON_OR_GRANTSON_COMMENT:对儿子或者同级孙子进行评论,通知对应的评论发布者
//成功返回的code
export const REQUEST_SUCCEEDED_CODE = "00000";
//铃声
export const RingingToneList: RingingToneItem[] = [
    {
        value: 0,
        label: "默认",
        url: `${ImageFatherPath}user/sound/new_message.mp3`,
    },
    {
        value: 1,
        label: "三全音",
        url: `${ImageFatherPath}user/sound/threetone.mp3`,
    },
    {
        value: 2,
        label: "溪流",
        url: `${ImageFatherPath}user/sound/stream.mp3`,
    },
    {
        value: 3,
        label: "冒出",
        url: `${ImageFatherPath}user/sound/emerge.mp3`,
    },
    {
        value: 4,
        label: "喵喵",
        url: `${ImageFatherPath}user/sound/cat.mp3`,
    },
    {
        value: 5,
        label: "皮卡丘",
        url: `${ImageFatherPath}user/sound/Pikachu.mp3`,
    },
    {
        value: 6,
        label: "水滴",
        url: `${ImageFatherPath}user/sound/drip.mp3`,
    },
    {
        value: 7,
        label: "YOHU~",
        url: `${ImageFatherPath}user/sound/YOHO.mp3`,
    },
    {
        value: 8,
        label: "哆啦A梦",
        url: `${ImageFatherPath}user/sound/Doraemon.mp3`,
    },
    {
        value: 9,
        label: "简短",
        url: `${ImageFatherPath}user/sound/brief.mp3`,
    },
    {
        value: 10,
        label: "胡巴",
        url: `${ImageFatherPath}user/sound/huba.mp3`,
    },
    {
        value: 11,
        label: "无",
        url: "",
    },
];
//匿名头像
export const AnonymousAvatars = [
    `${ImageFatherPath}user/anonymous_avatar/earth.png`,
    `${ImageFatherPath}user/anonymous_avatar/neptune.png`,
    `${ImageFatherPath}user/anonymous_avatar/mercury.png`,
    `${ImageFatherPath}user/anonymous_avatar/jupiter.png`,
    `${ImageFatherPath}user/anonymous_avatar/pluto.png`,
    `${ImageFatherPath}user/anonymous_avatar/venus.png`,
    `${ImageFatherPath}user/anonymous_avatar/mars.png`,
    `${ImageFatherPath}user/anonymous_avatar/sun.png`,
    `${ImageFatherPath}user/anonymous_avatar/uranus.png`,
    `${ImageFatherPath}user/anonymous_avatar/moon.png`,
    `${ImageFatherPath}user/anonymous_avatar/saturn.png`,
];
//动态权限
export const privateSettingGroup = ["所有人可见", "主页可见", "仅自己可见"];

//表情
export const emojiList = [
    "😀",
    "😁",
    "😃",
    "😄",
    "😅",
    "😆",
    "😉",
    "😊",
    "😋",
    "😎",
    "😍",
    "😘",
    "😗",
    "😙",
    "😚",
    "☺",
    "😇",
    "😐",
    "😑",
    "😶",
    "😏",
    "😣",
    "😥",
    "😮",
    "😯",
    "😪",
    "😫",
    "😴",
    "😌",
    "😛",
    "😜",
    "😝",
    "😒",
    "😓",
    "😔",
    "😕",
    "😲",
    "😷",
    "😖",
    "😞",
    "😟",
    "😤",
    "😢",
    "😭",
    "😦",
    "😧",
    "😨",
    "😬",
    "😰",
    "😱",
    "😳",
    "😵",
    "😡",
    "😠",
    "👦",
    "👧",
    "👨",
    "👩",
    "👴",
    "👵",
    "👶",
    "👱",
    "👮",
    "👲",
    "👳",
    "👷",
    "👸",
    "💂",
    "🎅",
    "👰",
    "👼",
    "💆",
    "💇",
    "🙍",
    "🙎",
    "🙅",
    "🙆",
    "💁",
    "🙋",
    "🙇",
    "🙌",
    "🙏",
    "👤",
    "👥",
    "🚶",
    "🏃",
    "👯",
    "💃",
    "👫",
    "👬",
    "👭",
    "💏",
    "💑",
    "👪",
    "💪",
    "👈",
    "👉",
    "☝",
    "👆",
    "👇",
    "✌",
    "✋",
    "👌",
    "👍",
    "👎",
    "✊",
    "👊",
    "👋",
    "👏",
    "👐",
    "✍",
    "👣",
    "👀",
    "👂",
    "👃",
    "👅",
    "👄",
    "💋",
    "👓",
    "👔",
    "👙",
    "👛",
    "👜",
    "👝",
    "🎒",
    "💼",
    "👞",
    "👟",
    "👠",
    "👡",
    "👢",
    "👑",
    "👒",
    "🎩",
    "🎓",
    "💄",
    "💅",
    "💍",
    "🌂",
    "📶",
    "📳",
    "📴",
    "♻",
    "🏧",
    "🚮",
    "🚰",
    "♿",
    "🚹",
    "🚺",
    "🚻",
    "🚼",
    "🚾",
    "⚠",
    "🚸",
    "⛔",
    "🚫",
    "🚳",
    "🚭",
    "🚯",
    "🚱",
    "🚷",
    "🔞",
    "💈",
    "🙈",
    "🐒",
    "🐶",
    "🐕",
    "🐩",
    "🐺",
    "🐱",
    "🐈",
    "🐯",
    "🐅",
    "🐆",
    "🐴",
    "🐎",
    "🐮",
    "🐂",
    "🐃",
    "🐄",
    "🐷",
    "🐖",
    "🐗",
    "🐽",
    "🐏",
    "🐑",
    "🐐",
    "🐪",
    "🐫",
    "🐘",
    "🐭",
    "🐁",
    "🐀",
    "🐹",
    "🐰",
    "🐇",
    "🐻",
    "🐨",
    "🐼",
    "🐾",
    "🐔",
    "🐓",
    "🐣",
    "🐤",
    "🐥",
    "🐦",
    "🐧",
    "🐸",
    "🐊",
    "🐢",
    "🐍",
    "🐲",
    "🐉",
    "🐳",
    "🐋",
    "🐬",
    "🐟",
    "🐠",
    "🐡",
    "🐙",
    "🐚",
    "🐌",
    "🐛",
    "🐜",
    "🐝",
    "🐞",
    "🦋",
    "💐",
    "🌸",
    "💮",
    "🌹",
    "🌺",
    "🌻",
    "🌼",
    "🌷",
    "🌱",
    "🌲",
    "🌳",
    "🌴",
    "🌵",
    "🌾",
    "🌿",
    "🍀",
    "🍁",
    "🍂",
    "🍃",
    "🌍",
    "🌎",
    "🌏",
    "🌐",
    "🌑",
    "🌒",
    "🌓",
    "🌔",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🌙",
    "🌚",
    "🌛",
    "🌜",
    "☀",
    "🌝",
    "🌞",
    "⭐",
    "🌟",
    "🌠",
    "☁",
    "⛅",
    "☔",
    "⚡",
    "❄",
    "🔥",
    "💧",
    "🌊",
    "🏀",
    "🏈",
    "🏉",
    "🎾",
    "🎱",
    "🎳",
    "⛳",
    "🎣",
    "🎽",
    "🎿",
    "😈",
    "👿",
    "👹",
    "👺",
    "💀",
    "☠",
    "👻",
    "👽",
    "👾",
    "💣",
    "🌋",
    "🗻",
    "🏠",
    "🏡",
    "🏢",
    "🏣",
    "🏤",
    "🏥",
    "🏦",
    "🏨",
    "⛲",
    "🌁",
    "🌃",
    "🌆",
    "🌇",
    "🎠",
    "🎡",
    "🎢",
    "🚂",
    "🚌",
    "🚍",
    "🚎",
    "🚏",
    "🚐",
    "🚑",
    "🚒",
    "🚓",
    "🚔",
    "🚕",
    "🚖",
    "🚗",
    "🚘",
    "💌",
    "💎",
    "🔪",
    "💈",
    "🚪",
    "🚽",
    "🚿",
    "🛁",
    "⌛",
    "⏳",
    "⌚",
    "⏰",
    "🎈",
    "🎉",
    "💤",
    "💢",
    "💬",
    "💭",
    "♨",
    "🌀",
    "🔔",
    "🔕",
    "✡",
    "✝",
    "🔯",
    "📛",
    "🔰",
    "🔱",
    "⭕",
    "✅",
    "☑",
    "✔",
    "✖",
    "❌",
    "❎",
    "➕",
    "➖",
    "➗",
    "➰",
    "➿",
    "〽",
    "✳",
    "✴",
    "❇",
    "‼",
    "⁉",
    "❓",
    "❔",
    "❕",
    "❗",
    "🕛",
    "🕧",
    "🕐",
    "🕜",
    "🕑",
    "🕝",
    "🕒",
    "🕞",
    "🕓",
    "🕟",
    "🕔",
    "🕠",
    "🕕",
    "🕡",
    "🕖",
    "🕢",
    "🕗",
    "🕣",
    "🕘",
    "🕤",
    "🕙",
    "🕥",
    "🕚",
    "🕦",
    "⏱",
    "⏲",
    "🕰",
    "💘",
    "❤",
    "💓",
    "💔",
    "💕",
    "💖",
    "💗",
    "💙",
    "💚",
    "💛",
    "💜",
    "💝",
    "💞",
    "💟❣",
    "🍇",
    "🍈",
    "🍉",
    "🍊",
    "🍋",
    "🍌",
    "🍍",
    "🍎",
    "🍏",
    "🍐",
    "🍑",
    "🍒",
    "🍓",
];
//举报分类
export const reportTypes = [
    "垃圾广告信息",
    "不实信息",
    "辱骂人身攻击等不友善行为",
    "有害信息",
    "涉嫌侵权",
    "诱导赞同关注等行为",
    "骚扰",
    "清朗行动专项举报",
    "有人意图自杀或自残",
    "其他",
];
//举报对象的类型 动态为activity,评论为comment,私聊为chat,评论的回复是commentResponse
export const reportObjectType = {
    activity: "activity",
    comment: "comment",
    chat: "chat",
    commentResponse: "commentResponse",
    question: "issue", //问题
    answer: "comment", //回答
    answerComment: "son_comment", //回答的评论
    answerCommentResponse: "grant_son_comment", //回答的孙子评论
};
//性别选项
export const sexGrounp = ["女", "男"];
//更新日志
export const updateLogs = [
    {
        version: "2.0.3",
        logTexts: ["修复了消息提示的问题", "修复了消息图片无法打开的问题"],
    },
    {
        version: "2.0.2",
        logTexts: ["盲盒无法跳转的问题"],
    },
    {
        version: "2.0.1",
        logTexts: [
            "修复IOS无法输入的问题",
            "修复部分页面点击动态无法跳转到详情页的问题",
        ],
    },
    {
        version: "2.0.0",
        logTexts: [
            "布咕星球正式版发布",
            "新增问答模块",
            "代码迁移到uniapp",
            "优化部分ui",
            "优化代码逻辑",
            "修复若干bug",
        ],
    },
    {
        version: "1.0.6",
        logTexts: ["可以自定义表情了", "修复一些bug"],
    },
    {
        version: "1.0.5",
        logTexts: [
            "可以搜索并添加用户了",
            "现在可以发布视频动态了",
            "优化登录界面逻辑",
            "优化部分代码逻辑",
        ],
    },
    {
        version: "1.0.4",
        logTexts: [
            "新增热门动态",
            "修复无法显示搜索历史的问题",
            "优化消息通知显示",
            "修复动态匿名回复的问题",
        ],
    },
    {
        version: "1.0.3",
        logTexts: [
            "修复发布动态时容易重复发送的问题",
            "修复评论时容易重复的问题",
            "底部消息按钮增加红点提示",
            "修复聊天记录偶尔错位的问题",
            "修复修改名字含有表情不正确提示的问题",
            "优化部分代码逻辑",
        ],
    },
    {
        version: "1.0.2",
        logTexts: ["内测版正式发布", "增加登录认证"],
    },
    {
        version: "1.0.1",
        logTexts: ["增加布咕页面-包括天气信息、banner、签到、和邀请获奖"],
    },
    {
        version: "1.0.0",
        logTexts: ["完善大部分功能"],
    },
];
const globalData = {};
export const setGlobalData = (global_key, val) => {
    globalData[global_key] = val;
};
export const getGlobalData = (global_key) => {
    return globalData[global_key];
};
//动态图片处理
export const activity_pic_hendle =
    "?imageView2/0/q/75|watermark/2/text/5biD5ZKV5pif55CD/font/5qW35L2T/fontsize/600/fill/I0ZBRkFGQQ==/dissolve/100/gravity/SouthEast/dx/10/dy/10|imageslim";
export const avatar_pic_hendle = "?imageView2/1/w/200/h/200/q/75|imageslim";
