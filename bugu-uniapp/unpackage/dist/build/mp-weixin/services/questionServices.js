"use strict";var e=require("../utils/request.js"),t=require("../common/constants.js");exports.cancelCollectQuestion=async function(a){return(await e.request({data:{method:"POST",group:"question",action:`${a}/collect/remove`,data:{},header:{"content-type":"application/x-www-form-urlencoded"}}})).data.code===t.REQUEST_SUCCEEDED_CODE},exports.cancelLikeQuestion=async function(a){return(await e.request({data:{method:"POST",group:"question",action:`${a}/like/remove`,data:{},header:{"content-type":"application/x-www-form-urlencoded"}}})).data.code===t.REQUEST_SUCCEEDED_CODE},exports.collectQuestion=async function(a){let o=await e.request({data:{method:"POST",group:"question",action:`${a}/collect`,data:{},header:{"content-type":"application/x-www-form-urlencoded"}}});return o.data.code===t.REQUEST_SUCCEEDED_CODE||"请勿重复点赞"===o.data.errMsg},exports.deleteQuestion=async function(a){return(await e.request({data:{method:"DELETE",group:"question",action:`${a}/delete`,data:{},header:{"content-type":"application/x-www-form-urlencoded"}}})).data.code===t.REQUEST_SUCCEEDED_CODE},exports.likeQuestion=async function(a){let o=await e.request({data:{method:"POST",group:"question",action:`${a}/like`,data:{},header:{"content-type":"application/x-www-form-urlencoded"}}});return o.data.code===t.REQUEST_SUCCEEDED_CODE||"请勿重复点赞"===o.data.errMsg};
