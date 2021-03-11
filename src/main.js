import { createApp, h } from 'vue'
import App from './App.vue'
import WaveUI from 'wave-ui'
import '@mdi/font/css/materialdesignicons.min.css'
import './assets/styles/wave-ui.css' // Mandatory to build this app. Copy of node_modules/wave-ui/dist/wave-ui.css
import './assets/styles/fonts.css'
import './assets/styles/common.css'
import './assets/styles/items.css'

import { store } from './store'

let i18nModule
if (process.env.NODE_ENV !== 'production') i18nModule = require('vue-i18n')
else i18nModule = require('vue-i18n/dist/vue-i18n.runtime.esm-browser.prod')

import en_US from './locales/en-US.json'
import mouse_en_US from './locales/mouse.en-US.json'
import items_en_US from './locales/items.en-US.json'
import conditions_en_US from './locales/conditions.en-US.json'
import spells_en_US from './locales/spells.en-US.json'
import hirelings_en_US from './locales/hirelings.en-US.json'
import fr_FR from './locales/fr-FR.json'
import mouse_fr_FR from './locales/mouse.fr-FR.json'
import items_fr_FR from './locales/items.fr-FR.json'
import conditions_fr_FR from './locales/conditions.fr-FR.json'
import spells_fr_FR from './locales/spells.fr-FR.json'
import hirelings_fr_FR from './locales/hirelings.fr-FR.json'
import { datetimeFormats } from './services/locales.js'


const i18n = i18nModule.createI18n({
  locale: 'en-US',
  messages: {
    'en-US': { ...en_US, ...mouse_en_US, ...items_en_US, ...conditions_en_US, ...hirelings_en_US, ...spells_en_US },
    'fr-FR': { ...fr_FR, ...mouse_fr_FR, ...items_fr_FR, ...conditions_fr_FR, ...hirelings_fr_FR, ...spells_fr_FR }
  },
  datetimeFormats
})

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
  }
})
app.use(i18n).use(store)

app.mount('#app')
