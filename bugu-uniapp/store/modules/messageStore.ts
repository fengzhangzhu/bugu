
const state = () => ({
 newMessage:{}
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
	 * @description 有新消息时
	 * @param {Object} state
	 * @param {Object} newMessage 新消息内容
	 */
	onNewMessage(state, newMessage){
	   state.newMessage=newMessage
	}
}
/**
 * @description 新消息的状态仓库
 */
export const messageStore = {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}