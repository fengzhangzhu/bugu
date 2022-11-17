"use strict";var e=require("../z-paging-utils.js");const t={props:{hideEmptyView:{type:Boolean,default:e.u.gc("hideEmptyView",!1)},emptyViewText:{type:[String,Object],default:e.u.gc("emptyViewText",null)},showEmptyViewReload:{type:Boolean,default:e.u.gc("showEmptyViewReload",!1)},showEmptyViewReloadWhenError:{type:Boolean,default:e.u.gc("showEmptyViewReloadWhenError",!0)},emptyViewReloadText:{type:[String,Object],default:e.u.gc("emptyViewReloadText",null)},emptyViewImg:{type:String,default:e.u.gc("emptyViewImg","")},emptyViewErrorText:{type:[String,Object],default:e.u.gc("emptyViewErrorText",null)},emptyViewErrorImg:{type:String,default:e.u.gc("emptyViewErrorImg","")},emptyViewStyle:{type:Object,default:function(){return e.u.gc("emptyViewStyle",{})}},emptyViewSuperStyle:{type:Object,default:function(){return e.u.gc("emptyViewSuperStyle",{})}},emptyViewImgStyle:{type:Object,default:function(){return e.u.gc("emptyViewImgStyle",{})}},emptyViewTitleStyle:{type:Object,default:function(){return e.u.gc("emptyViewTitleStyle",{})}},emptyViewReloadStyle:{type:Object,default:function(){return e.u.gc("emptyViewReloadStyle",{})}},emptyViewFixed:{type:Boolean,default:function(){return e.u.gc("emptyViewFixed",!1)}},emptyViewCenter:{type:Boolean,default:function(){return e.u.gc("emptyViewCenter",!0)}},autoHideEmptyViewWhenLoading:{type:Boolean,default:e.u.gc("autoHideEmptyViewWhenLoading",!0)},autoHideEmptyViewWhenPull:{type:Boolean,default:e.u.gc("autoHideEmptyViewWhenPull",!0)},emptyViewZIndex:{type:Number,default:e.u.gc("emptyViewZIndex",9)}},computed:{finalEmptyViewImg(){return this.isLoadFailed?this.emptyViewErrorImg:this.emptyViewImg},finalShowEmptyViewReload(){return this.isLoadFailed?this.showEmptyViewReloadWhenError:this.showEmptyViewReload},showEmpty(){return!(this.refresherOnly||this.hideEmptyView||this.totalData.length)&&(!this.autoHideEmptyViewWhenLoading||(!(!this.isAddedData||this.firstPageLoaded||this.loading)||!this.autoHideEmptyViewWhenPull&&!this.isUserReload))}},methods:{_emptyViewReload(){let e=!1;this.$emit("emptyViewReload",(t=>{void 0!==t&&!0!==t||(this.fromEmptyViewReload=!0,this.reload()),e=!0})),this.$nextTick((()=>{e||(this.fromEmptyViewReload=!0,this.reload())}))},_emptyViewClick(){this.$emit("emptyViewClick")}}};exports.ZPEmptyView=t;
