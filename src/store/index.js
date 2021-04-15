import { createStore } from 'vuex'
import { d6 } from '@/services/dice-roller'
import { loadPrefs, savePrefsKey } from '@/services/preferences'

export const store = createStore({
  state () {
    return {
      currentSlotIndex: -1,
      hirelings: [],
      history: [],
      locale: null,
      matrinames: [],
      names: [],
      preferences: {}
    }
  },
  getters: {
    currentSlotIndex: state => { return state.currentSlotIndex },
    hirelings: state => { return state.hirelings || [] },
    hirelingByIndex: state => index => {
      return state.hirelings[index] || {}
    },
    history: state => { return state.history || [] },
    locale: state => { return state.locale },
    matrinames: state => { return state.matrinames || [] },
    names: state => { return state.names || [] },
    preferences: state => { return state.preferences || [] }
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
    setCurrentSlot (state, index) {
      state.currentSlotIndex = index
    },
    setLocale (state, locale) {
      state.locale = locale
    },
    setMatrinames (state, names) {
      state.matrinames = names
    },
    setNames (state, names) {
      state.names = names
    },
    setPrefs (state, preferences) {
      state.preferences = preferences
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
    },
    loadPreferences (context) {
      context.commit('setPrefs', loadPrefs())
    },
    savePreferences (context, { key, value }) {
      context.commit('setPrefs', savePrefsKey(key, value))
    }
  }
})
