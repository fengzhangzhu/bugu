"use strict";var e=require("../../utils/request.js"),t=require("../../common/constants.js");exports.getRecommendedLabels=async()=>{let a=await e.request({data:{method:"GET",group:"activity",action:"label/recommended",data:{},header:{"content-type":"application/x-www-form-urlencoded"}}});return a.data.code===t.REQUEST_SUCCEEDED_CODE?a.data.data:[]};