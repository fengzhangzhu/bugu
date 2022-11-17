const state = () => ({
 isConnectSocket:false
})

// getters
const getters = {
  
}

// actions
const actions = {

}

// mutations
const mutations = {
	/**
	 * @description 设置连接状态
	 * @param {Object} state
	 * @param {boolean} isConnected 是否连接
	 */
  onSocketConnected(state, isConnected){
	   state.isConnectSocket=isConnected
  }
}
/**
 * @description socket连接状态
 */
export const socketStateStore = {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}