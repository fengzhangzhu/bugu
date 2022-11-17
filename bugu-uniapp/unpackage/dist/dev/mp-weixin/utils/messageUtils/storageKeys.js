"use strict";
function getUserMessageListKey(userId) {
  return `user_message_list_${userId}`;
}
function getChatRecordKey(userId, toUserId) {
  return `chat_record_${userId}_${toUserId}`;
}
function getInteractiveMessageListKey(userId, type) {
  return `interactive_message_list_${userId}_${type}`;
}
function getOfficeNewsListKey(userId) {
  return `offical_news_list_${userId}`;
}
function getOfficeTypeNewsListKey(userId, type) {
  return `offical_type_news_${userId}_${type}`;
}
exports.getChatRecordKey = getChatRecordKey;
exports.getInteractiveMessageListKey = getInteractiveMessageListKey;
exports.getOfficeNewsListKey = getOfficeNewsListKey;
exports.getOfficeTypeNewsListKey = getOfficeTypeNewsListKey;
exports.getUserMessageListKey = getUserMessageListKey;
