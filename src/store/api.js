import Vue from 'vue'

export default {
  namespaced: true,
  state: {},
  getters: {},
  actions: {
    sendDiceResult ({ commit, rootState }, { tableId, sheetSignature, diceResult }) {
      return Vue.http.post(`${rootState.config.SERVER_API_URL}/dices.php?vtable=${tableId}&sheet=${sheetSignature}`, diceResult)
        .then((response) => {
          return response
        })
        .catch((error) => {
          commit('API_FAILURE', error)
        })
    }
  },
  mutations: {
    API_FAILURE: (error) => {
      throw error
    }
  }
}
