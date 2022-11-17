"use strict";
const state = () => ({
  isConnectSocket: false
});
const getters = {};
const actions = {};
const mutations = {
  onSocketConnected(state2, isConnected) {
    state2.isConnectSocket = isConnected;
  }
};
const socketStateStore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
exports.socketStateStore = socketStateStore;
