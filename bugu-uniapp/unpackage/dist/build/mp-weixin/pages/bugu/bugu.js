"use strict";var e=require("../../common/vendor.js"),t=require("../../common/constants.js"),i=require("../../utils/request.js"),n=require("../../utils/dateUtils.js"),r=require("../../utils/tabBarBadgeUtils.js"),o=require("../../common/requestFunctions.js");require("../../common/globalMsgKeys.js"),require("../../utils/messageUtils/index.js"),require("../../utils/messageUtils/service.js"),require("../../utils/messageUtils/storage.js"),require("../../utils/messageUtils/storageKeys.js");const a={sunny:/晴/,shower:/阵雨/,"thunder-shower":/雷阵雨/,overcast:/阴/,cloudy:/多云/,"rainy-storm":/暴雨/,"raniy-large":/大雨/,"raniy-lightning":/雷|电/,"raniy-mid":/中雨/,"raniy-small":/小雨/,"snow-small":/小雪|雪/,"snow-mid":/中雪/,sleet:/雨夹雪/,"snow-large":/大雪/,fog:/雾/,smog:/霾/},s={data:()=>({nbTitle:"布咕",backgroundColor:"#fff",frontColor:t.TitleColor,bannerList:[],weatherResult:{adcode:"110108",city:"武汉",humidity:"N/A",province:"湖北",reporttime:"",temperature:"N/A",weather:"N/A",winddirection:"N/A",windpower:"N/A"},helloText:"",timeNow:"",weatherIcon:"",InviteCode:""}),onShow(){r.changeUnreadMessageSum()},onShareAppMessage(){return{title:"布咕星球",path:`/pages/index/index?inviteCode=${this.InviteCode}`,imageUrl:""}},onShareTimeline(){return{title:"布咕星球",path:`/pages/index/index?inviteCode=${this.InviteCode}`}},methods:{onSignCardClick(){e.index.navigateTo({url:"/pages/bugu-secondary-page/sign-in-lottery/sign-in-lottery"})},onBoxCardClick(){e.index.navigateTo({url:"/pages/bugu-secondary-page/blind-box/blind-box"})},onNightPhoneClick(){e.index.showModal({title:"晚安电话",content:"未到开放时间哦~"})},OnInviteClick(){e.index.showModal({title:"邀请获奖",content:"点击右上角将布咕星球分享给好友，好友点开链接并登录，你可以获取5天vip哦~"})}},async mounted(){this.bannerList=await async function(){let e=await i.request({data:{method:"GET",group:"banner",action:"list",data:{},header:{"content-type":"application/x-www-form-urlencoded"}}});return e.data.code===t.REQUEST_SUCCEEDED_CODE?e.data.data:[]}(),this.helloText=function(){let e=new Date;return e.getHours()>=0&&e.getHours()<12?"Good morning":e.getHours()>=12&&e.getHours()<18?"Good afternoon":"Good evening"}(),this.timeNow=n.GetNowDate().MonthAndDay,this.InviteCode=await o.getInviteUserCode();let r=this;e.index.getLocation({type:"wgs84",success:async function(e){let t=await async function(e,t){let n=await i.getWeatherInfo(e,t);if("0000"===n.data.code){let e=n.data.data.lives[0],t="";for(let i in a)a[i].test(e.weather)&&(t=i);return{weatherResult:e,weatherIcon:t}}}(e.latitude,e.longitude);t&&(r.weatherResult=t.weatherResult,r.weatherIcon=t.weatherIcon)}})}};if(!Array){e.resolveComponent("uni-nav-bar")()}Math;var l=e._export_sfc(s,[["render",function(t,i,n,r,o,a){return e.e({a:e.p({statusBar:"true",fixed:"true",backgroundColor:"#fff",color:"#808080"}),b:e.f(o.bannerList,((e,t,i)=>({a:e.pic,b:e.id}))),c:e.o(((...e)=>t.imageError&&t.imageError(...e))),d:t.indicatorDots,e:t.autoplay,f:t.interval,g:t.duration,h:e.t(o.weatherResult.city),i:e.t(o.timeNow),j:e.t(o.weatherResult.weather),k:e.t(o.weatherResult.winddirection),l:e.t(o.weatherResult.windpower),m:e.t(o.weatherResult.humidity),n:o.weatherIcon},o.weatherIcon?{o:`/static/weather/${o.weatherIcon}.png`}:{},{p:e.t(o.weatherResult.temperature),q:e.o((e=>a.onNightPhoneClick())),r:e.o((e=>a.onSignCardClick())),s:e.o((e=>a.onBoxCardClick())),t:e.o((e=>a.OnInviteClick()))})}]]);s.__runtimeHooks=6,wx.createPage(l);