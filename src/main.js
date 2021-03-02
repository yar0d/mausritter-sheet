import { createApp } from 'vue'
import { store } from './store'

import App from './App.vue'
import { createI18n } from 'vue-i18n'
import en_US from './locales/en_US.json'
import mouse_en_US from './locales/mouse.en_US.json'
import items_en_US from './locales/items.en_US.json'
import spells_en_US from './locales/spells.en_US.json'
import hirelings_en_US from './locales/hirelings.en_US.json'
import fr_FR from './locales/fr_FR.json'
import mouse_fr_FR from './locales/mouse.fr_FR.json'
import items_fr_FR from './locales/items.fr_FR.json'
import spells_fr_FR from './locales/spells.fr_FR.json'
import hirelings_fr_FR from './locales/hirelings.fr_FR.json'

import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'
import '@mdi/font/css/materialdesignicons.min.css'
import './assets/styles/fonts.css'
import './assets/styles/common.css'
import './assets/styles/items.css'

const i18n = createI18n({
  locale: 'en_US',
  messages: {
    en_US: { ...en_US, ...mouse_en_US, ...items_en_US, ...hirelings_en_US, ...spells_en_US },
    fr_FR: { ...fr_FR, ...mouse_fr_FR, ...items_fr_FR, ...hirelings_fr_FR, ...spells_fr_FR }
  }
})

const app = createApp(App).use(i18n).use(store)
new WaveUI(app, {
  colors: {
    primary: '#000000',
    minor: '#cccccc',
    selected: '#ffe70f',
    dice: '#4d9dda'
  }
})

app.mount('#app')
