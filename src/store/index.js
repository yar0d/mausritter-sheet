import { createStore } from 'vuex'
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

import config from '@/config'
import { d6 } from '@/services/dice-roller'
import { loadPrefs, savePrefsKey } from '@/services/preferences'

function uuidValidateV5 (uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 5;
}

export const store = createStore({
  state () {
    return {
      config,
      currentSheet: null,
      currentSheetRaw: null,
      currentSlotIndex: -1,
      hirelings: [],
      history: [],
      locale: null,
      matrinames: [],
      names: [],
      preferences: {},
      standaloneApp: false, // This is true if this app is a computer application. By default this app is a web page
      tableId: null
    }
  },
  getters: {
    config: state => { return state.config || {} },
    currentSheet: state => { return state.currentSheet || null },
    currentSheetRaw: state => { return state.currentSheetRaw || null },
    currentSlotIndex: state => { return state.currentSlotIndex },
    hirelings: state => { return state.hirelings || [] },
    hirelingByIndex: state => index => { return state.hirelings[index] || {} },
    history: state => { return state.history || [] },
    locale: state => { return state.locale },
    matrinames: state => { return state.matrinames || [] },
    names: state => { return state.names || [] },
    preferences: state => { return state.preferences || {} },
    sheetSignature: state => { return state.currentSheet.sheet ? state.currentSheet.sheet.name + ` (${state.currentSheet.sheet.background})`: null },
    standaloneApp: state => { return state.standaloneApp },
    tableId: state => { return state.tableId }
  },
  mutations: {
    FAILURE (state, error) {
      console.trace('[ERROR]', error)
      throw error
    },
    currentSheet (state, { json, raw }) {
      state.currentSheet = json
      state.currentSheetRaw = raw
    },
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
    },
    setStandaloneApp (state, standaloneApp) {
      state.standaloneApp = standaloneApp
    },
    setTableId (state, tableId) {
      state.tableId = tableId
    }
  },
  actions: {
    async sendDiceResult ({ getters, commit }, { diceResult }) {
      if (!getters['tableId'] || !getters['sheetSignature'] || !diceResult) {
        commit('FAILURE', 'Cannot send dice result to colony.')
        return
      }

      const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diceResult)
      }
      return fetch(`${getters['config'].SERVER_API_URL}/dices.php?vtable=${getters['tableId']}&sheet=${getters['sheetSignature']}`, options)
        .then((response) => {
          return response
        })
        .catch((error) => {
          commit('FAILURE', error)
        })
    },
    async sendCurrentSheet ({ getters, commit }) {
      if (!getters['tableId'] || !getters['sheetSignature'] || !getters['currentSheet']) {
        commit('FAILURE', 'Cannot send sheet to colony!')
        return
      }

      const hirelings = []
      if (getters['currentSheet'].hirelings.length) {
        getters['currentSheet'].hirelings.forEach(h => {
          hirelings.push({ name: h.sheet.name, desc: h.sheet.desc, str: h.sheet.currentStr, str_max: h.sheet.maxStr, dex: h.sheet.currentDex, dex_max: h.sheet.maxDex, wil: h.sheet.currentWil, wil_max: h.sheet.maxWil, hp: h.sheet.currentHP, hp_max: h.sheet.maxHP, level: h.sheet.level })
        })
      }
      const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: '',
          hirelings
        })
      }
      try {
        const response = await fetch(`${getters['config'].SERVER_API_URL}/sheets.php?vtable=${getters['tableId']}&name=${getters['sheetSignature']}&str=${getters['currentSheet'].sheet.currentStr}&str_max=${getters['currentSheet'].sheet.maxStr}&dex=${getters['currentSheet'].sheet.currentDex}&dex_max=${getters['currentSheet'].sheet.maxDex}&wil=${getters['currentSheet'].sheet.currentWil}&wil_max=${getters['currentSheet'].sheet.maxWil}&hp=${getters['currentSheet'].sheet.currentHP}&hp_max=${getters['currentSheet'].sheet.maxHP}&level=${getters['currentSheet'].sheet.level}`, options)
        console.log('## sendCurrentSheet response:', response.body)
      } catch(error) {
        commit('FAILURE', error)
      }
    },
    setTableId ({ commit, state, dispatch }, tableId) {
      commit('setTableId', tableId)
      if (uuidValidateV5(tableId) && state.currentSheet) {
        dispatch('sendCurrentSheet', tableId)
          .catch ((error) => {
            commit('FAILURE', error)
          })
      }
    },
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
