"use strict";var t=require("../../../../common/vendor.js");const e={name:"UniBadge",emits:["click"],props:{type:{type:String,default:"error"},inverted:{type:Boolean,default:!1},isDot:{type:Boolean,default:!1},maxNum:{type:Number,default:99},absolute:{type:String,default:""},offset:{type:Array,default:()=>[0,0]},text:{type:[String,Number],default:""},size:{type:String,default:"small"},customStyle:{type:Object,default:()=>({})}},data:()=>({}),computed:{width(){return 8*String(this.text).length+12},classNames(){const{inverted:t,type:e,size:i,absolute:o}=this;return[t?"uni-badge--"+e+"-inverted":"","uni-badge--"+e,"uni-badge--"+i,o?"uni-badge--absolute":""].join(" ")},positionStyle(){if(!this.absolute)return{};let t=this.width/2,e=10;this.isDot&&(t=5,e=5);const i=`${-t+this.offset[0]}px`,o=`${-e+this.offset[1]}px`,s={rightTop:{right:i,top:o},rightBottom:{right:i,bottom:o},leftBottom:{left:i,bottom:o},leftTop:{left:i,top:o}},r=s[this.absolute];return r||s.rightTop},badgeWidth(){return{width:`${this.width}px`}},dotStyle(){return this.isDot?{width:"10px",height:"10px",borderRadius:"10px"}:{}},displayValue(){const{isDot:t,text:e,maxNum:i}=this;return t?"":Number(e)>i?`${i}+`:e}},methods:{onClick(){this.$emit("click")}}};var i=t._export_sfc(e,[["render",function(e,i,o,s,r,a){return t.e({a:o.text},o.text?{b:t.t(a.displayValue),c:t.n(a.classNames),d:t.s(a.badgeWidth),e:t.s(a.positionStyle),f:t.s(o.customStyle),g:t.s(a.dotStyle),h:t.o((t=>a.onClick()))}:{})}],["__scopeId","data-v-a2cf781e"]]);wx.createComponent(i);
