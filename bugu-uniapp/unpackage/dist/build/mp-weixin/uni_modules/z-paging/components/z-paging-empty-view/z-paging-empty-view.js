"use strict";var e=require("../z-paging/js/z-paging-static.js"),t=require("../../../../common/vendor.js");const i={name:"z-paging-empty-view",data:()=>({base64Empty:e.zStatic.base64Empty,base64Error:e.zStatic.base64Error}),props:{emptyViewText:{type:String,default:"没有数据哦~"},emptyViewImg:{type:String,default:""},showEmptyViewReload:{type:Boolean,default:!1},emptyViewReloadText:{type:String,default:"重新加载"},isLoadFailed:{type:Boolean,default:!1},emptyViewStyle:{type:Object,default:function(){return{}}},emptyViewImgStyle:{type:Object,default:function(){return{}}},emptyViewTitleStyle:{type:Object,default:function(){return{}}},emptyViewReloadStyle:{type:Object,default:function(){return{}}},emptyViewZIndex:{type:Number,default:9},emptyViewFixed:{type:Boolean,default:!0}},computed:{emptyImg(){return this.isLoadFailed?this.base64Error:this.base64Empty},finalEmptyViewStyle(){return this.emptyViewStyle["z-index"]=this.emptyViewZIndex,this.emptyViewStyle}},methods:{reloadClick(){this.$emit("reload")},emptyViewClick(){this.$emit("viewClick")}}};var y=t._export_sfc(i,[["render",function(e,i,y,p,m,l){return t.e({a:!y.emptyViewImg.length},y.emptyViewImg.length?{d:t.s(y.emptyViewImgStyle),e:y.emptyViewImg}:{b:t.s(y.emptyViewImgStyle),c:l.emptyImg},{f:t.t(y.emptyViewText),g:t.s(y.emptyViewTitleStyle),h:y.showEmptyViewReload},y.showEmptyViewReload?{i:t.t(y.emptyViewReloadText),j:t.s(y.emptyViewReloadStyle),k:t.o(((...e)=>l.reloadClick&&l.reloadClick(...e)))}:{},{l:y.emptyViewFixed?1:"",m:t.s(l.finalEmptyViewStyle),n:t.o(((...e)=>l.emptyViewClick&&l.emptyViewClick(...e)))})}],["__scopeId","data-v-bdde6808"]]);wx.createComponent(y);
