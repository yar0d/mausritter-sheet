import { createStore } from 'vuex'

export const store = createStore({
  state () {
    return {
      locale: null,
      matrinames: [],
      names: []
    }
  },
  getters: {
    matrinames: state => { return state.matrinames || [] },
    names: state => { return state.names || [] }
  },
  mutations: {
    setLocale (state, locale) {
      state.locale = locale
    },
    setMatrinames (state, names) {
      state.matrinames = names
    },
    setNames (state, names) {
      state.names = names
    }
  },
  actions: {
    changeLocale (context, locale) {
      context.commit('setLocale', locale)
      const module = require(`../locales/mouse-names.${locale}.js`)
      context.commit('setMatrinames', module.matrinames )
      context.commit('setNames', module.names )
    }
  }
})
