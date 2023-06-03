import { createStore } from 'vuex'

export default createStore({
  state: {
    tableHead: { title: null }
  },
  getters: {
  },
  mutations: {
    changeTablehead(state, newTablehead) {
      state.tableHead.title = newTablehead.title
    }
  },
  actions: {
  },
  modules: {
  }
})
