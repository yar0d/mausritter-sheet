import { createStore } from 'vuex'

export const store = createStore({
  state () {
    return {
      history: [],
      locale: null,
      matrinames: [],
      names: []
    }
  },
  getters: {
    history: state => { return state.history || [] },
    locale: state => { return state.locale },
    matrinames: state => { return state.matrinames || [] },
    names: state => { return state.names || [] }
  },
  mutations: {
    historyAdd (state, { type, message }) {
      state.history.unshift({ type, message, date: new Date() })
    },
    historyClear (state) {
      state.history = []
    },
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
    },
    historyClear (context) {
      context.commit('historyClear')
    }
  }
})
