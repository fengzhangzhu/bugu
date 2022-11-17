import { createStore } from 'vuex'
import {messageStore} from "./modules/messageStore"
import {socketStateStore} from "./modules/socketStateStore"


export default createStore({
  modules:{
	messageStore,
	  socketStateStore
  }
})