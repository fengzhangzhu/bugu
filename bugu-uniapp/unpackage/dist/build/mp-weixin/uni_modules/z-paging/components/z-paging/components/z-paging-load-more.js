"use strict";var e=require("../js/z-paging-static.js"),t=require("../../../../../common/vendor.js");const i={name:"z-paging-load-more",data:()=>({base64Arrow:e.zStatic.base64Arrow,base64Flower:e.zStatic.base64Flower,base64FlowerWhite:e.zStatic.base64FlowerWhite}),props:["zConfig"],computed:{ownLoadingMoreText(){return this.statusTextArr[this.finalStatus]},statusTextArr(){return[this.zConfig.defaultText,this.zConfig.loadingText,this.zConfig.noMoreText,this.zConfig.failText]},finalStatus(){return this.zConfig.defaultAsLoading&&0===this.zConfig.status?1:this.zConfig.status}},methods:{doClick(){this.$emit("doClick")}}};var o=t._export_sfc(i,[["render",function(e,i,o,n,l,a){return t.e({a:!o.zConfig.hideContent},o.zConfig.hideContent?{}:t.e({b:o.zConfig.showNoMoreLine&&2===a.finalStatus},o.zConfig.showNoMoreLine&&2===a.finalStatus?{c:t.n("white"===o.zConfig.defaultThemeStyle?"zp-l-line zp-l-line-white":"zp-l-line zp-l-line-black"),d:t.s(o.zConfig.noMoreLineCustomStyle)}:{},{e:1===a.finalStatus&&o.zConfig.loadingIconCustomImage.length},1===a.finalStatus&&o.zConfig.loadingIconCustomImage.length?{f:o.zConfig.loadingIconCustomImage,g:t.s(o.zConfig.iconCustomStyle),h:o.zConfig.loadingAnimated?1:""}:{},{i:1===a.finalStatus&&"flower"===o.zConfig.loadingIconType&&!o.zConfig.loadingIconCustomImage.length},1!==a.finalStatus||"flower"!==o.zConfig.loadingIconType||o.zConfig.loadingIconCustomImage.length?{}:{j:t.s(o.zConfig.iconCustomStyle),k:"white"===o.zConfig.defaultThemeStyle?l.base64FlowerWhite:l.base64Flower},{l:1===a.finalStatus&&"circle"===o.zConfig.loadingIconType&&!o.zConfig.loadingIconCustomImage.length},1!==a.finalStatus||"circle"!==o.zConfig.loadingIconType||o.zConfig.loadingIconCustomImage.length?{}:{m:t.n("white"===o.zConfig.defaultThemeStyle?"zp-l-line-loading-view zp-l-line-loading-view-white":"zp-l-line-loading-view zp-l-line-loading-view-black"),n:t.s(o.zConfig.iconCustomStyle)},{o:t.t(a.ownLoadingMoreText),p:t.n("white"===o.zConfig.defaultThemeStyle?"zp-l-text zp-l-text-white":"zp-l-text zp-l-text-black"),q:t.s(o.zConfig.titleCustomStyle),r:o.zConfig.showNoMoreLine&&2===a.finalStatus},o.zConfig.showNoMoreLine&&2===a.finalStatus?{s:t.n("white"===o.zConfig.defaultThemeStyle?"zp-l-line zp-l-line-white":"zp-l-line zp-l-line-black"),t:t.s(o.zConfig.noMoreLineCustomStyle)}:{}),{v:t.s(o.zConfig.customStyle),w:t.o(((...e)=>a.doClick&&a.doClick(...e)))})}],["__scopeId","data-v-0917ac9d"]]);wx.createComponent(o);
