import { createApp, h } from 'vue'
import App from './App.vue'
import WaveUI from 'wave-ui'
import '@mdi/font/css/materialdesignicons.min.css'
import './assets/styles/wave-ui.css' // Mandatory to build this app. Copy of node_modules/wave-ui/dist/wave-ui.css
import './assets/styles/fonts.css'
import './assets/styles/common.css'
import './assets/styles/items.css'

import { createI18n } from 'vue-i18n'

import { datetimeFormats, DEFAULT_LOCALE, MESSAGES } from './services/locales.js'

// Set locales
export const i18n = createI18n({
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { ...MESSAGES },
  datetimeFormats
})

import '../public/libs/dice3d/dice.css'

import { store } from './store'

const app = createApp({
  render: () => h(App)
})
new WaveUI(app, {
  colors: {
    primary: '#000000',
    minor: '#cccccc',
    selected: '#ffe70f',
    dice: '#4d9dda',
    failed: '#bb2727'
  },
  breakpoints: {
    xs: 600,
    sm: 900,
    md: 1200,
    lg: 1700
    // Xl doesn't need to be overridden:
    // it always starts from lg & goes to infinity.
  }
})
app.use(i18n).use(store)

app.config.globalProperties.mausritter = {
  bank: null,
  hirelings: null,
  inventory: null,
  sheet: null,
  sheetToolbar: null
}

app.mount('#app')
