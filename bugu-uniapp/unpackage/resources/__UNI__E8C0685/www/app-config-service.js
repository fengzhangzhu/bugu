
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/bugu/bugu","pages/message/message","pages/mine/mine","pages/publish/publish","pages/bugu-secondary-page/sign-in-lottery/sign-in-lottery","pages/login/login","pages/login/account-login","pages/label-activity/label-activity","pages/label-activity/search-activity","pages/user-home-page/user-home-page","pages/activity-info/activity-info","pages/activity-info/comment-info","pages/setting/setting","pages/setting/report-user/report-user","pages/setting/personal_information/personal_information","pages/setting/personal_information/change-username","pages/setting/bugu-vip/bugu-vip","pages/setting/real-name-authentication/real-name-authentication","pages/setting/school-login/school-login","pages/setting/sound-setting/sound-setting","pages/setting/help/help","pages/setting/about-bugu/about-bugu","pages/setting/about-bugu/update-log","pages/bugu-secondary-page/blind-box/blind-box","pages/bugu-secondary-page/blind-box/my-box","pages/bugu-secondary-page/blind-box/box-tickets","pages/message-secondary-page/chat-content/chat-content","pages/message-secondary-page/chat-history/chat-history","pages/message-secondary-page/official-news-info/official-news-info","pages/mine-secondary-page/fan-list/fan-list","pages/mine-secondary-page/follow-list/follow-list","pages/mine-secondary-page/visitor-list/visitor-list"],"window":{"navigationStyle":"custom","navigationBarTextStyle":"black","navigationBarTitleText":"uni-app","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8"},"tabBar":{"color":"#a0a0a0","selectedColor":"#000000","backgroundColor":"#ffffff","borderStyle":"white","list":[{"pagePath":"pages/bugu/bugu","text":"布咕","iconPath":"/static/icons/bugu.png","selectedIconPath":"/static/icons/bugu-select.png"},{"pagePath":"pages/index/index","text":"广场","iconPath":"/static/icons/index.png","selectedIconPath":"/static/icons/index-select.png"},{"pagePath":"pages/publish/publish","text":"发布","iconPath":"/static/icons/send.png","selectedIconPath":"/static/icons/send-select.png"},{"pagePath":"pages/message/message","text":"消息","iconPath":"/static/icons/message.png","selectedIconPath":"/static/icons/message-select.png"},{"pagePath":"pages/mine/mine","text":"我的","iconPath":"/static/icons/mine.png","selectedIconPath":"/static/icons/mine-select.png"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"bugu-star-uniapp","compilerVersion":"3.3.5","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"uni-app"}},{"path":"/pages/bugu/bugu","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/message/message","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/mine/mine","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/publish/publish","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/bugu-secondary-page/sign-in-lottery/sign-in-lottery","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/login/login","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/login/account-login","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/label-activity/label-activity","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/label-activity/search-activity","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/user-home-page/user-home-page","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/activity-info/activity-info","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/activity-info/comment-info","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/setting","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/report-user/report-user","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/personal_information/personal_information","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/personal_information/change-username","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/bugu-vip/bugu-vip","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/real-name-authentication/real-name-authentication","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/school-login/school-login","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/sound-setting/sound-setting","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/help/help","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/about-bugu/about-bugu","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/setting/about-bugu/update-log","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/bugu-secondary-page/blind-box/blind-box","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/bugu-secondary-page/blind-box/my-box","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/bugu-secondary-page/blind-box/box-tickets","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/message-secondary-page/chat-content/chat-content","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/message-secondary-page/chat-history/chat-history","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/message-secondary-page/official-news-info/official-news-info","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/mine-secondary-page/fan-list/fan-list","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/mine-secondary-page/follow-list/follow-list","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/mine-secondary-page/visitor-list/visitor-list","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
