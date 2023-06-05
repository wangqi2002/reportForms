import { createStore } from 'vuex'

export default createStore({
  state: {
    tableHead: { title: null },
    striper: null,
    filter: null,
    sort: null,
  },
  getters: {
  },
  mutations: {
    changeTablehead(state, newTablehead) {
      state.tableHead.title = newTablehead.title
    },
    changeStriper(state, newStriper) {
      state.striper = newStriper
    },
    changeFilter(state, newFilter) {
      state.filter = newFilter
    },
    changeSort(state, newSort) {
      state.sort = newSort
    }
  },
  actions: {
  },
  modules: {
  }
})
