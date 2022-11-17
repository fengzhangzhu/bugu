"use strict";
const state = () => ({
  newMessage: {}
});
const getters = {};
const actions = {};
const mutations = {
  onNewMessage(state2, newMessage) {
    state2.newMessage = newMessage;
  }
};
const messageStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.messageStore = messageStore;
