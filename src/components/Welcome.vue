<template>
  <div class="scrollable h-auto">
    <w-toolbar class="background-white-50">
      <w-button xl v-for="lang in LOCALES" :key="lang" :color="locale === lang ? '' : 'primary'" class="mr2" @click="changeLocale(lang)">
        {{ $t(lang) }}
      </w-button>

      <div class="spacer" />

      <w-menu v-model="showMenu">
        <template #activator="{ on }">
          <w-button v-on="on" xl @click="showMenu = !showMenu">
            <w-icon>mdi mdi-menu</w-icon>
            {{ $t('Preferences...') }}
          </w-button>
        </template>

        <div class="text-center">
           <w-checkbox v-model="useAltFont">{{ $t('Use alternate font') }}</w-checkbox>

        </div>
      </w-menu>
    </w-toolbar>

    <w-flex column align-center justify-center class="mt4 mb2">
      <w-card content-class=" px0 background-white-50">
        <template #title>
          <w-toolbar>
            <div class="title3">{{ $t('Manage your characters.') }}</div>
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
            {{ $t('Empty') }} "{{currentSlotIndex}}"
            </div>
            <div v-else-if="index === currentSlotIndex">
              {{ slotName(index) }}
            </div>
            <w-button v-else text @click="loadSheet(index)">
              {{ slotName(index) }}
            </w-button>
            <div>
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
import { LOCALES, DEFAULT_LOCALE, loadLocale, saveLocale } from '@/services/locales'
import { deleteSlot, listSlots, loadSlot, saveSlot, decodeJson, encodeJson } from '@/services/storage'
import { copyToClipboard } from '@/services/clipboard'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PromptDialog from './PromptDialog.vue'

export default {
  name: 'Welcome',
  components: { ConfirmDialog, PromptDialog },
  propos: [ 'sheet' ],
  data () {
    return {
      decodeJson,
      DEFAULT_LOCALE,
      LOCALES,
      importData: null,
      locale: null,
      showMenu: false,
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
    useAltFont: {
      get () {
        return this.$store.dispatch('loadPreferences')['useAltFont']
      },
      set (value) {
        this.$store.dispatch('savePreferences', { key: 'useAltFont', value })
      }
    }
  },
  methods: {
    advancement () {
      if (this.mausritter.sheet) this.mausritter.sheet.advancement()
    },
    apply (data) {
      if (this.mausritter.sheet) this.mausritter.sheet.setData(data)
      if (data.hirelings && this.mausritter.hirelings) {
        this.$store.dispatch('hirelingsSet', data.hirelings)
        .then(() => {
          this.mausritter.hirelings.refresh(data.hirelings)
        })
      }
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
    },
    deleteSheet (index) {
      this.$refs['confirm-dialog'].open(this.$t('Delete'), this.$t('The sheet of “{name}” will be erased. Do you confirm?', { name: this.slotName(index) } ))
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
      await copyToClipboard(encodeJson(data))
      this.$refs['prompt-dialog'].open(this.$t('Export'), this.$t('“{name}” is now copied to clipboard.', { name: this.dataSignature(data) }), { data: encodeJson(data) })
    },
    async importSheet () {
      this.$refs['prompt-import-dialog'].open(this.$t('Import'), '')
        .then(() => {
          if (this.importData) {
            this.apply(decodeJson(this.importData))
          }
        })
    },
    async load (index) {
      const data = loadSlot(index)
      this.apply(data)
      this.$store.commit('setCurrentSlot', index)
      this.$store.commit('historyAdd', {
        type: this.$t('Load'),
        message: this.slots[index]
      })
      this.canLevelUp()
    },
    loadSheet (index) {
      if (this.currentSlotIndex < 0) {
        this.load(index)
        return
      }

      this.$refs['confirm-dialog'].open(this.$t('Load'), this.$t('Do you want to save the sheet of “{name}”?', { name: this.slots[this.currentSlotIndex] } ))
        .then(confirmed => {
          if (confirmed) {
            const data = this.serialize()
            this.save(this.currentSlotIndex, data)
          }
          this.load(index)
        })
    },
    restFull () {
      if (this.mausritter.sheet) this.mausritter.sheet.restFull()
    },
    restLong () {
      if (this.mausritter.sheet) this.mausritter.sheet.restLong()
    },
    restShort () {
      if (this.mausritter.sheet) this.mausritter.sheet.restShort()
    },
    slotName (index) {
      const parts = this.slots[index].split('|')
      let result = parts[0]
      if (parts.length > 1) result += ' — ' + parts[1]
      if (parts.length > 2) result += ' — ' + this.$t('Level') + ' ' + parts[2]
      if (parts.length > 3) result += ' (' + parts[3] + ')'
      return result
    },
    save (index, data) {
      saveSlot(index, data, this.dataSignature(data))
      this.slots = listSlots() // Refresh slot list
      this.$store.commit('setCurrentSlot', index)
      this.$store.commit('historyAdd', {
        type: this.$t('Save'),
        message: this.slots[index]
      })
    },
    saveSheet (index) {
      const data = this.serialize()
      if (this.slots[index] === null || this.slots[index] === this.dataSignature(data)) {
        this.save(index, data)
        return
      }

      this.$refs['confirm-dialog'].open(this.$t('Save'), this.$t('The sheet of “{dest}” will be overwritten by “{name}”. Do you confirm?', { dest: this.slots[index], name: this.dataSignature(data) } ))
        .then(confirmed => {
          if (confirmed) {
            this.save(index, data)
          }
        })
    },
    serialize () {
      let data
      if (this.mausritter.sheet) data = this.mausritter.sheet.serialize()
      if (this.mausritter.hirelings) data.hirelings = this.mausritter.hirelings.serialize()
      data.version = 1
      data.date = new Date().toISOString()
      return data
    }
  },
  created () {
    this.changeLocale(loadLocale())
    this.$store.commit('historyAdd', { message: this.$t('Welcome to Mausrittes Sheet!') })
  },
  mounted () {
    this.slots = listSlots()
  },
}
</script>