"use strict";
const SEARCH_USER_HISTORY = "search_user_history";
const SEARCH_ACTIVITY_HISTORY = "search_history";
const SEARCH_QUESTION_HISTORY = "search_question_history";
const USER_INFO = "userInfo";
const TOKEN = "token";
const REFRESH_DYNAMIC_SOUND = "refresh_dynamic_sound";
const NEW_MESSAGE_SOUND = "new_message_sound";
function getFansNumberChangedKey(userId) {
  return `${userId}_fansNumberChanged`;
}
function getFollowedNumberChangedKey(userId) {
  return `${userId}_followedNumberChanged`;
}
function getViewsNumberChangedKey(userId) {
  return `${userId}_viewsNumberChanged`;
}
exports.NEW_MESSAGE_SOUND = NEW_MESSAGE_SOUND;
exports.REFRESH_DYNAMIC_SOUND = REFRESH_DYNAMIC_SOUND;
exports.SEARCH_ACTIVITY_HISTORY = SEARCH_ACTIVITY_HISTORY;
exports.SEARCH_QUESTION_HISTORY = SEARCH_QUESTION_HISTORY;
exports.SEARCH_USER_HISTORY = SEARCH_USER_HISTORY;
exports.TOKEN = TOKEN;
exports.USER_INFO = USER_INFO;
exports.getFansNumberChangedKey = getFansNumberChangedKey;
exports.getFollowedNumberChangedKey = getFollowedNumberChangedKey;
exports.getViewsNumberChangedKey = getViewsNumberChangedKey;
