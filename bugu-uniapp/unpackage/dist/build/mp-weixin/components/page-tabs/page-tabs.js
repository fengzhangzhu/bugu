"use strict";var e=Object.defineProperty,t=Object.defineProperties,a=Object.getOwnPropertyDescriptors,r=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,d=Object.prototype.propertyIsEnumerable,o=(t,a,r)=>a in t?e(t,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[a]=r,b=require("../../common/vendor.js");const l={name:"page-tabs",props:{index:{type:Number,default:0},labels:{type:Array,default:[]},flex:{type:Boolean,default:!1},tabPadding:{type:Number,default:20},borderBottom:{type:Boolean,default:!1},activeColor:{type:String,default:"#000000"},defaultColor:{type:String,default:"#aaaaaa"},defaultFontSize:{type:Number,default:16},activeFontSize:{type:Number,default:16},underLineType:{type:String,default:"default"}},emits:["changeIndex"],setup(e,l){console.log(e.index);const i=b.reactive({tabList:e.labels?e.labels:["默认"],translateX:-100*+e.index,transition:!1===e.animation?0:.2,scrollId:"tab_0",tabPadding:e.tabPadding?e.tabPadding:20});return setTimeout((()=>{i.scrollId="tab_"+(e.index-1)}),100),p=((e,t)=>{for(var a in t||(t={}))n.call(t,a)&&o(e,a,t[a]);if(r)for(var a of r(t))d.call(t,a)&&o(e,a,t[a]);return e})({},b.toRefs(i)),t(p,a({tabChange:e=>{if(i.tabIndex==e)return!1;i.tabIndex=e,i.translateX=-100*i.tabIndex,i.scrollId="tab_"+(e-1),l.emit("changeIndex",e)}}));var p},computed:{tabIndex(){return this.index?+this.index:0}}};var i=b._export_sfc(l,[["render",function(e,t,a,r,n,d){return{a:b.f(e.tabList,((e,t,n)=>b.e({a:b.t(e.title),b:e.badge},e.badge?{c:b.t(e.badge<100?e.badge:"99+"),d:e.badge<10?"-5rpx":e.badge<100?"-10rpx":"-20rpx"}:{},{e:b.n(d.tabIndex===t?"active underline-"+a.underLineType:""),f:`tab_${t}`,g:d.tabIndex===t?a.activeColor:a.defaultColor,h:d.tabIndex===t?a.activeFontSize+"px":a.defaultFontSize+"px",i:t,j:b.o((e=>r.tabChange(t)),t)}))),b:`0 ${a.tabPadding}rpx`,c:b.n("tab-bar-flex-"+a.flex),d:b.n("tab-bar-borde-bottom"+a.borderBottom),e:e.scrollId}}],["__scopeId","data-v-c256d398"]]);wx.createComponent(i);