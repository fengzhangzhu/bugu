"use strict";
var utils_request = require("../../utils/request.js");
var common_constants = require("../../common/constants.js");
const getRecommendedLabels = async () => {
  let res = await utils_request.request({
    data: {
      method: "GET",
      group: "activity",
      action: `label/recommended`,
      data: {},
      header: {
        "content-type": "application/x-www-form-urlencoded"
      }
    }
  });
  if (res.data.code === common_constants.REQUEST_SUCCEEDED_CODE) {
    return res.data.data;
  } else {
    return [];
  }
};
exports.getRecommendedLabels = getRecommendedLabels;
