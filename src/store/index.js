import { createStore } from 'vuex'
import { d6 } from '@/services/dice-roller'

export const store = createStore({
  state () {
    return {
      hirelings: [],
      history: [],
      locale: null,
      matrinames: [],
      names: []
    }
  },
  getters: {
    hirelings: state => { return state.hirelings || [] },
    hirelingByIndex: state => index => {
      console.log('##hirelingByIndex', index, state.hirelings[index])
      return state.hirelings[index] || {}
    },
    history: state => { return state.history || [] },
    locale: state => { return state.locale },
    matrinames: state => { return state.matrinames || [] },
    names: state => { return state.names || [] }
  },
  mutations: {
    hirelingClear (state) {
      state.hirelings = []
    },
    hirelingCreate (state, hireling) {
      let result = {
        inventory: []
      }
      result.sheet = { ...{
        maxDex: d6() + d6(),
        maxHP: d6(),
        maxStr: d6() + d6(),
        maxWil: d6() + d6(),
        desc: hireling.label || '',
        name: '',
        look: '',
        wages: 0,
        level: 1,
        xp: 0
      }, ...hireling }
      result.sheet.currentDex = result.sheet.maxDex
      result.sheet.currentHP = result.sheet.maxHP
      result.sheet.currentStr = result.sheet.maxStr
      result.sheet.currentWil = result.sheet.maxWil
      state.hirelings.push({ ...result, ...hireling })
    },
    hirelingDismiss (state, index) {
      const tmp = [ ...state.hirelings ]
      tmp.splice(index, 1)
      state.hirelings = tmp
    },
    hirelingsSet (state, hirelings = []) {
      state.hirelings = hirelings
    },
    historyAdd (state, { type, message, color='black', secondary = '' }) {
      state.history.unshift({ type, message, color, secondary, date: new Date() })
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
    },
    hirelingsSet (context, hirelings) {
      context.commit('hirelingsSet', hirelings)
    }
  }
})
