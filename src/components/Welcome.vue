<template>
  <div class="scrollable h-auto pb4">
    <w-toolbar class="background-white-50">
      <w-icon lg class="clickable" @click="toggleTheme">
        mdi mdi-theme-light-dark
      </w-icon>
      
      <w-divider class="mx4" vertical />

      <w-button v-for="lang in LOCALES" :key="lang" :color="locale === lang ? '' : 'primary'" class="mr2" @click="changeLocale(lang)">
        {{ $t(lang) }}
      </w-button>

      <div class="spacer" />

      <w-menu v-model="showPrefMenu">
        <template #activator="{ on }">
          <w-button v-on="on" text @click="showPrefMenu = !showPrefMenu">
            <w-icon>mdi mdi-menu</w-icon>
            {{ $t('Preferences...') }}
          </w-button>
        </template>

        <preferences />
      </w-menu>
    </w-toolbar>

    <w-flex column align-center justify-center class="mt4">
      <w-card content-class=" px0 background-white-50">
        <template #title>
          <w-toolbar>
            <div class="title2">{{ $t('Manage your characters.') }}</div>
          </w-toolbar>
        </template>

        <w-flex row class="w-max mb2 px2" justify-space-between>
          <div>
            <w-button lg @click="createRandomSheet">
              <w-icon class="mr1">mdi mdi-plus</w-icon>
              {{ $t('Create a new character...') }}
            </w-button>
          </div>

          <div>
            <w-button lg @click="importSheet(index)" bg-color="blue-grey" color="white" class="ml2">
              {{ $t('Import...') }}
            </w-button>
          </div>
        </w-flex>

        <w-flex column v-for="(slot, index) in slots" :key="index" justify-center class="pb2">
          <w-flex row align-center justify-space-between class="px2 pt2" :class="currentSlotIndex === index ? 'brown-dark2--bg white' : ''">
            <div class="mr2">{{ index + 1 }}</div>
            <div v-if="!slot" class="caption">
            {{ $t('Empty') }}
            </div>
            <div v-else-if="index === currentSlotIndex">
              {{ slotName(index) }}
            </div>
            <w-button v-else text @click="loadSheet(index)">
              {{ slotName(index) }}
            </w-button>

            <div v-show="loading === index || saving === index">
              <w-spinner class="toolbar-pager" xs />
            </div>
            <div v-show="loading < 0 || saving < 0">
              <span class="w-25">
                <w-tooltip transition="fade" bg-color="yellow-light2" color="black" left>
                  <template #activator="{ on }">
                    <w-button :disabled="!slot" v-on="on" @click="deleteSheet(index)" bg-color="red" color="white" class="ml4" icon="mdi mdi-delete" />
                  </template>
                  {{ $t('Delete') }}
                </w-tooltip>
              </span>
              <span class="w-25">
                <w-tooltip transition="fade" bg-color="yellow-light2" color="black" left>
                  <template #activator="{ on }">
                    <w-button :disabled="!slot" v-on="on" @click="exportSheet(index)" bg-color="" color="white" class="ml4" icon="mdi mdi-application-export" />
                  </template>
                  {{ $t('Export') }}
                </w-tooltip>
              </span>
              <span class="w-25">
                <w-tooltip transition="fade" bg-color="yellow-light2" color="black" left>
                  <template #activator="{ on }">
                    <w-button v-on="on" @click="saveSheet(index)" bg-color="blue" color="white" class="ml4" icon="mdi mdi-content-save" />
                  </template>
                  {{ $t('Save') }}
                </w-tooltip>
              </span>
            </div>
          </w-flex>

          <w-flex v-if="currentSlotIndex === index" row class="w-max pl4 pr2 py2 brown-dark2--bg white" justify-space-between>
            <w-button sm bg-color="brown-light2" color="white" @click="restShort">
              <w-icon class="mr1">mdi mdi-cup-water</w-icon>
              {{ $t('Short rest...') }}
            </w-button>

            <w-button sm bg-color="brown-light1" color="white" class="ml1" @click="restLong">
              <w-icon class="mr1">mdi mdi-silverware</w-icon>
              {{ $t('Long rest...') }}
            </w-button>

            <w-button sm bg-color="brown" color="white" class="ml1" @click="restFull">
              <w-icon class="mr1">mdi mdi-bed</w-icon>
              {{ $t('Full rest...') }}
            </w-button>

            <w-button v-if="canLevelUp()" lg bg-color="blue" color="white" class="ml1" @click="advancement">
              <w-icon class="mr1">mdi mdi-stairs-up</w-icon>
              {{ $t('Advancement...') }}
            </w-button>
          </w-flex>
          <w-divider v-if="index + 1 < slots.length" />
        </w-flex>
      </w-card>
    </w-flex>

    <confirm-dialog ref="confirm-dialog" />
    <prompt-dialog ref="prompt-dialog" />
    <prompt-dialog ref="prompt-import-dialog">
      <template #content>
        <w-textarea v-model="importData" :placeholder="$t('Paste your character here...')" />
        <w-card class="mt2">
          {{ importSignature }}
        </w-card>
      </template>
    </prompt-dialog>
  </div>
</template>

<script>
import sha256 from 'hash.js/lib/hash/sha/256'
import { LOCALES, DEFAULT_LOCALE, loadLocale, saveLocale } from '@/services/locales'
import { deleteSlot, listSlots, loadSlot, saveSlot, decodeJson, encodeJson } from '@/services/storage'
import { copyToClipboard } from '@/services/clipboard'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PromptDialog from './PromptDialog.vue'
import Preferences from './Preferences.vue'

import { PREF_THEME_DEFAULT, PREF_THEME, THEME_DARK, THEME_LIGHT } from '@/services/defines'

export default {
  name: 'Welcome',
  components: { ConfirmDialog, PromptDialog, Preferences },
  propos: [ 'sheet' ],
  data () {
    return {
      currentHash: null,
      DEFAULT_LOCALE,
      LOCALES,
      importData: null,
      loading: -1,
      locale: null,
      saving: -1,
      showAppMenu: false,
      showPrefMenu: false,
      slots: []
    }
  },
  computed: {
    currentSlotIndex () { return this.$store.getters['currentSlotIndex'] },
    importSignature () {
      if (!this.importData) return ''
      try {
        const data = decodeJson(this.importData)
        return this.dataSignature(data)
      } catch (error) {
        return error.message
      }
    },
    isStandaloneApp () { return this.$store.getters['standaloneApp'] },
    prefs () { return this.$store.getters['preferences'] || {} },
    theme: {
      get () {
        return this.prefs[PREF_THEME] || PREF_THEME_DEFAULT
      },
      set (value) {
        this.$waveui.switchTheme(value)
        this.$store.dispatch('savePreferences', { key: PREF_THEME, value: value || PREF_THEME_DEFAULT })
        this.$emit('theme-change')
      }
    }
  },
  methods: {
    advancement () {
      if (this.mausritter.sheet) this.mausritter.sheet.advancement()
    },
    async apply (data, serializedData) {
      await this.$store.commit('setTableId', null) // Reset table ID
      if (this.mausritter.sheet) this.mausritter.sheet.setData(data)
      if (data.hirelings && this.mausritter.hirelings) {
        this.$store.dispatch('hirelingsSet', data.hirelings)
        .then(() => {
          this.mausritter.hirelings.refresh(data.hirelings)
        })
      }
      if (this.mausritter.sheetToolbar) this.mausritter.sheetToolbar.setData(data.toolbar)
      this.$store.commit('currentSheet', { json: data, raw: serializedData })
    },
    applyPreferences () {
      this.$waveui.switchTheme(this.theme)
      this.changeLocale(loadLocale())
    },
    canLevelUp () { return this.mausritter.sheet ? this.mausritter.sheet.canLevelUp() : false },
    changeLocale (newLocale) {
      this.locale = newLocale || DEFAULT_LOCALE
      this.$i18n.locale = this.locale
      this.$store.dispatch('changeLocale', this.locale)
      saveLocale(this.locale)
    },
    createRandomSheet () {
      if (this.mausritter.sheetToolbar) this.mausritter.sheetToolbar.displayDrawer(false)
      if (this.mausritter.sheet) this.mausritter.sheet.createRandomSheet()
      this.$store.commit('setCurrentSlot', null)
      this.$store.commit('currentSheet', { json: this.serialize(), raw: this.serialize(true) })
    },
    deleteSheet (index) {
      this.$refs['confirm-dialog'].open(this.$t('Delete'), this.$t('The sheet of {name} will be erased. Do you confirm?', { name: this.slotName(index) } ))
        .then(confirmed => {
          if (confirmed) {
            deleteSlot(index)
            this.slots = listSlots() // Refresh slot list
          }
        })
    },
    dataSignature (data) {
      return data.sheet.name + '|' + data.sheet.background + '|' + data.sheet.level + '|' + new Date(data.date).toLocaleString(this.locale)
    },
    async exportSheet (index) {
      const data = loadSlot(index)
      await copyToClipboard(data.raw)
      this.$refs['prompt-dialog'].open(this.$t('Export'), this.$t('{name} is now copied to clipboard.', { name: this.dataSignature(data.json) }), { data: data.raw })
    },
    async importSheet () {
      this.$refs['prompt-import-dialog'].open(this.$t('Import...'), '')
        .then(() => {
          if (this.importData) {
            this.apply(decodeJson(this.importData), this.importData)
          }
        })
    },
    isDirty () {
      const newHash = sha256().update(this.serialize(true, false)).digest('hex')
      return this.currentHash !== newHash
    },
    async load (index) {
      this.loading = index
      setTimeout(() => {
        try {
            const data = loadSlot(index)
            this.apply(data.json, data.raw)
            this.$store.commit('setCurrentSlot', index)
            this.$store.commit('historyAdd', { type: this.$t('Load'), message: this.slots[index] })
            this.canLevelUp()
            this.currentHash = sha256().update(this.serialize(true, false)).digest('hex')
        } finally {
          setTimeout(() => this.loading = -1, 500)
        }
      }, 100)
    },
    loadSheet (index) {
      if (this.currentSlotIndex < 0 || !this.isDirty()) {
        this.load(index)
        return
      }

      this.$refs['confirm-dialog'].open(this.$t('Load'), this.$t('Do you want to save the sheet of {name}?', { name: this.slots[this.currentSlotIndex] } ))
        .then(confirmed => {
          if (confirmed) {
            setTimeout(() => {
              this.saving = this.currentSlotIndex
              const data = this.serialize()
              this.save(this.currentSlotIndex, data)
            }, 100)
          }
          this.load(index)
        })
    },
    async refresh () { this.slots = listSlots() },
    restFull () { if (this.mausritter.sheet) this.mausritter.sheet.restFull() },
    restLong () { if (this.mausritter.sheet) this.mausritter.sheet.restLong() },
    restShort () { if (this.mausritter.sheet) this.mausritter.sheet.restShort() },
    slotName (index) {
      const parts = this.slots[index].split('|')
      let result = parts[0]
      if (parts.length > 1) result += ' — ' + parts[1]
      if (parts.length > 2) result += ' — ' + this.$t('Level') + ' ' + parts[2]
      if (parts.length > 3) result += ' (' + parts[3] + ')'
      return result
    },
    save (index, data) {
      try {
        this.saving = index
        saveSlot(index, data, this.dataSignature(data))
        this.slots = listSlots() // Refresh slot list
        this.$store.commit('setCurrentSlot', index)
        this.$store.commit('historyAdd', { type: this.$t('Save'), message: this.slots[index] })
        this.currentHash = sha256().update(this.serialize(true, false)).digest('hex')
      } finally {
        setTimeout(() => this.saving = -1, 500)
      }
    },
    saveSheet (index) {
      const data = this.serialize()
      if (this.slots[index] === null || this.slots[index] === this.dataSignature(data)) {
        this.save(index, data)
        return
      }

      this.$refs['confirm-dialog'].open(this.$t('Save'), this.$t('The sheet of {dest} will be overwritten by {name}. Do you confirm?', { dest: this.slots[index], name: this.dataSignature(data) } ))
        .then(confirmed => {
          if (confirmed) {
            this.save(index, data)
          }
        })
    },
    serialize (encode = false, setDate = true) {
      let data
      if (this.mausritter.sheet) data = this.mausritter.sheet.serialize()
      if (this.mausritter.hirelings) data.hirelings = this.mausritter.hirelings.serialize()
      if (this.mausritter.sheetToolbar) data.toolbar = this.mausritter.sheetToolbar.serialize()
      data.version = 2
      if (setDate) data.date = new Date().toISOString()
      return encode ? encodeJson(data) : data
    },
    toggleTheme () {
      if (this.theme === THEME_LIGHT) this.theme = THEME_DARK
      else this.theme = THEME_LIGHT
    }
  },
  created () {
    this.applyPreferences()
  },
  mounted () {
    this.slots = listSlots()
  }
}
</script>