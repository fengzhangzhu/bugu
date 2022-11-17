"use strict";var e=require("../../../../../../common/vendor.js"),t=require("../z-paging-utils.js"),a=require("../z-paging-constant.js"),i=require("../z-paging-enum.js"),o=require("../z-paging-interceptor.js");const s={props:{defaultPageNo:{type:[Number,String],default:t.u.gc("defaultPageNo",1),observer:function(e,t){this.pageNo=e}},defaultPageSize:{type:[Number,String],default:t.u.gc("defaultPageSize",10),validator:e=>(e<=0&&t.u.consoleErr("default-page-size必须大于0！"),e>0)},dataKey:{type:[Number,String,Object],default:function(){return t.u.gc("dataKey",null)}},autowireListName:{type:String,default:function(){return t.u.gc("autowireListName","")}},autowireQueryName:{type:String,default:function(){return t.u.gc("autowireQueryName","")}},mountedAutoCallReload:{type:Boolean,default:t.u.gc("mountedAutoCallReload",!0)},auto:{type:Boolean,default:t.u.gc("auto",!0)},reloadWhenRefresh:{type:Boolean,default:t.u.gc("reloadWhenRefresh",!0)},autoScrollToTopWhenReload:{type:Boolean,default:t.u.gc("autoScrollToTopWhenReload",!0)},autoCleanListWhenReload:{type:Boolean,default:t.u.gc("autoCleanListWhenReload",!0)},showRefresherWhenReload:{type:Boolean,default:t.u.gc("showRefresherWhenReload",!1)},showLoadingMoreWhenReload:{type:Boolean,default:t.u.gc("showLoadingMoreWhenReload",!1)},createdReload:{type:Boolean,default:t.u.gc("createdReload",!1)},localPagingLoadingTime:{type:[Number,String],default:t.u.gc("localPagingLoadingTime",200)},insideMore:{type:Boolean,default:t.u.gc("insideMore",!1)},useChatRecordMode:{type:Boolean,default:t.u.gc("useChatRecordMode",!1)},concat:{type:Boolean,default:t.u.gc("concat",!0)},value:{type:Array,default:function(){return[]}},modelValue:{type:Array,default:function(){return[]}}},data:()=>({currentData:[],totalData:[],realTotalData:[],totalLocalPagingList:[],pageNo:1,isLocalPaging:!1,isAddedData:!1,isTotalChangeFromAddData:!1,privateConcat:!0,myParentQuery:-1,firstPageLoaded:!1,pagingLoaded:!1,loaded:!1,isUserReload:!0,fromEmptyViewReload:!1,listRendering:!1}),computed:{pageSize(){return this.defaultPageSize},finalConcat(){return this.concat&&this.privateConcat},isFirstPage(){return this.pageNo===this.defaultPageNo}},watch:{totalData(e,t){this._totalDataChange(e,t)},currentData(e,t){this._currentDataChange(e,t)},useChatRecordMode(e,t){e&&(this.nLoadingMoreFixedHeight=!1)},value:{handler(e){this.realTotalData=e},immediate:!0},modelValue:{handler(e){this.realTotalData=e},immediate:!0}},methods:{complete(e,t=!0){this.customNoMore=-1,this.addData(e,t)},end(e,t=!0){this.complete(e,t)},completeByKey(e,t=null,a=!0){null===t||null===this.dataKey||t===this.dataKey?(this.customNoMore=-1,this.addData(e,a)):this.isFirstPage&&this.endRefresh()},endByKey(e,t=null,a=!0){this.completeByKey(e,t,a)},completeByTotalCount(e,t,a=!0){if("undefined"==t)this.customNoMore=-1;else{let i=this._checkDataType(e,a,!1);if(e=i.data,a=i.success,t>=0&&a)return void this.$nextTick((()=>{let i=!0,o=this.realTotalData.length;this.pageNo==this.defaultPageNo&&(o=0);let s=o+e.length-t;s>=0&&(i=!1,s=this.defaultPageSize-s,s>0&&s<e.length&&(e=e.splice(0,s))),this.completeByNoMore(e,i,a)}))}this.addData(e,a)},completeByTotal(e,t,a=!0){this.completeByTotalCount(e,t,a)},endByTotalCount(e,t,a=!0){this.completeByTotalCount(e,t,a)},endByTotal(e,t,a=!0){this.completeByTotalCount(e,t,a)},completeByNoMore(e,t,a=!0){"undefined"!=t&&(this.customNoMore=1==t?1:0),this.addData(e,a)},endByNoMore(e,t,a=!0){this.completeByNoMore(e,t,a)},addData(e,a=!0){this.fromCompleteEmit||(this.disabledCompleteEmit=!0,this.fromCompleteEmit=!1);const i=t.u.getTime();let o=0;const s=i-this.requestTimeStamp;let l=this.minDelay;this.isFirstPage&&this.finalShowRefresherWhenReload&&(l=Math.max(400,l)),this.requestTimeStamp>0&&s<l&&(o=l-s),this.$nextTick((()=>{let t=this.delay>0?this.delay:o;setTimeout((()=>{this._addData(e,a,!1)}),t)}))},addDataFromTop(e,t=!0,i=!0){"[object Array]"!==Object.prototype.toString.call(e)&&(e=[e]),this.totalData=[...e,...this.totalData],t&&setTimeout((()=>{this._scrollToTop(i)}),a.c.delayTime)},resetTotalData(e){if(null==e)return void(this.showConsoleError&&t.u.consoleErr("方法resetTotalData参数缺失！"));this.isTotalChangeFromAddData=!0,"[object Array]"!==Object.prototype.toString.call(e)&&(e=[e]),this.totalData=e},addChatRecordData(e,t=!0,i=!0){"[object Array]"!==Object.prototype.toString.call(e)&&(e=[e]),this.useChatRecordMode&&(this.isTotalChangeFromAddData=!0,this.totalData=[...this.totalData,...e],t&&setTimeout((()=>{this._scrollToBottom(i)}),a.c.delayTime))},setLocalPaging(e,t=!0){this.isLocalPaging=!0,this.$nextTick((()=>{this._addData(e,t,!0)}))},reload(e=this.showRefresherWhenReload){e&&(this.privateShowRefresherWhenReload=e,this.isUserPullDown=!0),this._preReload(e,!1)},refresh(){if(!this.realTotalData.length)return void this.reload();const e=this.pageNo-this.defaultPageNo+1;if(e>=1){this.loading=!0,this.privateConcat=!1;const t=e*this.pageSize;this._emitQuery(this.defaultPageNo,t,i.Enum.QueryFrom.Refresh),this._callMyParentQuery(this.defaultPageNo,t)}},clean(){this._reload(!0),this._addData([],!0,!1)},clear(){this.clean()},doChatRecordLoadMore(){this.useChatRecordMode&&this._onLoadingMore("click")},_preReload(e=this.showRefresherWhenReload,t=!0){this.isUserReload=!0,this.loadingType=i.Enum.LoadingType.Refresher,e?(this.privateShowRefresherWhenReload=e,this.useCustomRefresher?this._doRefresherRefreshAnimate():this.refresherTriggered=!0):this._refresherEnd(!1,!1,!1,!1),this._reload(!1,t)},_reload(e=!1,a=!1,o=!1){if(this.isAddedData=!1,this.cacheScrollNodeHeight=-1,this.insideOfPaging=-1,this.pageNo=this.defaultPageNo,this._cleanRefresherEndTimeout(),!this.privateShowRefresherWhenReload&&!e&&this._startLoading(!0),this.firstPageLoaded=!0,this.isTotalChangeFromAddData=!1,this.totalData=[],!e){this._emitQuery(this.pageNo,this.defaultPageSize,o?i.Enum.QueryFrom.UserPullDown:i.Enum.QueryFrom.Reload),setTimeout((()=>{this._callMyParentQuery()}),0),!a&&this.autoScrollToTopWhenReload&&this._scrollToTop(!1),!this.usePageScroll&&this.useChatRecordMode&&this.showConsoleError&&t.u.consoleWarn("使用聊天记录模式时，建议使用页面滚动，可将usePageScroll设置为true以启用页面滚动！！")}this.$nextTick((()=>{}))},_addData(o,s,l){this.isAddedData=!0,this.fromEmptyViewReload=!1,this.isTotalChangeFromAddData=!0,this.refresherTriggered=!1,!this.useCustomRefresher&&e.index.stopPullDownRefresh();const h=this.isUserPullDown;this.showRefresherUpdateTime&&this.isFirstPage&&(t.u.setRefesrherTime(t.u.getTime(),this.refresherUpdateTimeKey),this.tempLanguageUpdateKey=t.u.getTime(),this.$refs.refresh&&this.$refs.refresh.updateTime()),h&&this.isFirstPage&&(this.isUserPullDown=!1);let r=this._checkDataType(o,s,l);o=r.data,s=r.success;let n=a.c.delayTime;if(this.loadingForNow=!1,setTimeout((()=>{this.pagingLoaded=!0,this.$nextTick((()=>{this._refresherEnd(n>0,!0,h)}))}),n),this.isFirstPage&&(this.isLoadFailed=!s),s)if(!1===this.privateConcat&&this.loadingStatus===i.Enum.More.NoMore||(this.loadingStatus=i.Enum.More.Default),l)this.totalLocalPagingList=o,this._localPagingQueryList(this.defaultPageNo,this.defaultPageSize,0,(e=>{this.complete(e)}));else{setTimeout((()=>{this._currentDataChange(o,this.currentData)}),0)}else this._currentDataChange(o,this.currentData),this.loadingStatus=i.Enum.More.Fail,this.loadingType===i.Enum.LoadingType.LoadingMore&&this.pageNo--},_totalDataChange(e,t,a=!0){(this.isUserReload&&this.autoCleanListWhenReload||!this.firstPageLoaded||e.length||!t.length)&&(this._doCheckScrollViewShouldFullHeight(e),this.realTotalData.length||e.length||(a=!1),this.realTotalData=e,a&&(this.$emit("input",e),this.$emit("update:modelValue",e),this.$emit("update:list",e),this.$emit("listChange",e),this._callMyParentList(e)),this.firstPageLoaded=!1,this.isTotalChangeFromAddData=!1,this.$nextTick((()=>{setTimeout((()=>{this._getNodeClientRect(".zp-paging-container-content").then((e=>{e&&this.$emit("contentHeightChanged",e[0].height)}))}),this.isIos?100:300)})))},_currentDataChange(e,a){if(e=[...e],this.listRendering=!0,this.$nextTick((()=>{setTimeout((()=>{this.listRendering=!1}),50)})),this.finalUseVirtualList&&this._setCellIndex(e,0===this.totalData.length),this.useChatRecordMode&&e.reverse(),this.isFirstPage&&this.finalConcat&&(this.totalData=[]),-1!==this.customNoMore?0!==this.customNoMore&&e.length||(this.loadingStatus=i.Enum.More.NoMore):(!e.length||e.length&&e.length<this.defaultPageSize)&&(this.loadingStatus=i.Enum.More.NoMore),this.totalData.length)if(this.useChatRecordMode){const t=e.length;let a=`z-paging-${t}`;this.totalData=[...e,...this.totalData],this.pageNo!==this.defaultPageNo?(this.privateScrollWithAnimation=0,this.$emit("update:chatIndex",t),setTimeout((()=>{this._scrollIntoView(a,30+Math.max(0,this.cacheTopHeight),!1,(()=>{this.$emit("update:chatIndex",0)}))}),this.usePageScroll?50:200)):this.$nextTick((()=>{this._scrollToBottom(!1)}))}else if(this.finalConcat){const a=this.oldScrollTop;this.totalData=[...this.totalData,...e],this.isIos||this.refresherOnly||this.usePageScroll||!e.length||(this.loadingMoreTimeStamp=t.u.getTime(),this.$nextTick((()=>{this.scrollToY(a)})))}else this.totalData=e;else this.finalConcat&&(this.totalData=e),this.useChatRecordMode&&this.$nextTick((()=>{this._scrollToBottom(!1)}));this.privateConcat=!0},_localPagingQueryList(e,t,a,i){if(e=parseInt(e),t=parseInt(t),e<0||t<=0)return void this._localPagingQueryResult(i,[],a);e=Math.max(1,e);let o=[...this.totalLocalPagingList],s=(e-1)*t;s+t<=o.length?this._localPagingQueryResult(i,o.splice(s,t),a):s<o.length?this._localPagingQueryResult(i,o.splice(s,o.length-s),a):this._localPagingQueryResult(i,[],a)},_localPagingQueryResult(e,t,a){setTimeout((()=>{e(t)}),a)},_callMyParentList(e){if(this.autowireListName.length){const a=t.u.getParent(this.$parent);a&&a[this.autowireListName]&&(a[this.autowireListName]=e)}},_callMyParentQuery(e=0,a=0){if(this.autowireQueryName){if(-1===this.myParentQuery){const e=t.u.getParent(this.$parent);e&&e[this.autowireQueryName]&&(this.myParentQuery=e[this.autowireQueryName])}-1!==this.myParentQuery&&(a>0?this.myParentQuery(e,a):this.myParentQuery(this.pageNo,this.defaultPageSize))}},_emitQuery(e,a,i){this.requestTimeStamp=t.u.getTime(),this.$emit("query",...o.interceptor._handleQuery(e,a,i))},_checkDataType(e,a,i){const o=Object.prototype.toString.call(e);if("[object Boolean]"===o)a=e,e=[];else if("[object Null]"===o)e=[];else if("[object Array]"!==o){e=[];let a=i?"setLocalPaging":"complete";"[object Undefined]"!==o&&this.showConsoleError&&t.u.consoleErr(`${a}参数类型不正确，第一个参数类型必须为Array!`)}return{data:e,success:a}}}};exports.ZPData=s;
