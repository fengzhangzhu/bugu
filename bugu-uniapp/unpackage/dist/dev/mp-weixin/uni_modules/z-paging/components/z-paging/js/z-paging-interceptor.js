"use strict";
function handleQuery(callback) {
  try {
    setTimeout(function() {
      _getApp().globalData.zp_handleQueryCallback = callback;
    }, 1);
  } catch (e) {
  }
}
function _handleQuery(pageNo, pageSize, from) {
  const handleQueryCallback = _getApp().globalData.zp_handleQueryCallback;
  if (handleQueryCallback) {
    return handleQueryCallback(pageNo, pageSize, from);
  }
  return [pageNo, pageSize, from];
}
function _getApp() {
  return getApp();
}
var interceptor = {
  handleQuery,
  _handleQuery
};
exports.interceptor = interceptor;
