<template>
  <div class="scrollable h-auto">
    <w-toolbar class="background-white-50">
      <w-button xl v-for="lang in LOCALES" :key="lang" :color="locale === lang ? '' : 'primary'" class="mr2" @click="changeLocale(lang)">
        {{ $t(lang) }}
      </w-button>
    </w-toolbar>

    <w-flex column align-center justify-center class="mt4">
      <w-card content-class="px1 background-white-50">
        <template #title>
          <w-toolbar>
            <div class="title3">{{ $t('Manage your characters.') }}</div>
          </w-toolbar>
        </template>
        <w-flex column v-for="(slot, index) in slots" :key="index" justify-center>
          <w-flex row align-center justify-space-between class="py2">
            {{ index + 1 }}
            <div v-if="!slot" class="caption">
            {{ $t('Empty') }}
            </div>
            <w-button v-else :text="index !== currentSlot" :disabled="index === currentSlot" @click="loadSheet(index)">
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
          <w-divider />
        </w-flex>

        <w-flex row class="w-max mt4 px2" justify-space-between>
          <div>
            <w-button xl @click="createRandomSheet">
              <w-icon>mdi mdi-plus</w-icon>
              {{ $t('Create a new character...') }}
            </w-button>
          </div>

          <div>
            <w-button xl @click="importSheet(index)" bg-color="blue-grey" color="white" class="ml2">
              {{ $t('Import') }}
            </w-button>
          </div>
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
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PromptDialog from './PromptDialog.vue'

export default {
  name: 'Welcome',
  components: { ConfirmDialog, PromptDialog },
  propos: [ 'sheet' ],
  data () {
    return {
      currentSlot: null,
      decodeJson,
      DEFAULT_LOCALE,
      LOCALES,
      importData: null,
      locale: null,
      slots: []
    }
  },
  computed: {
    importSignature () {
      if (!this.importData) return ''
      try {
        const data = decodeJson(this.importData)
        return this.dataSignature(data)
      } catch (error) {
        return error.message
      }
     }
  },
  methods: {
    apply (data) {
      if (this.mausritter.sheet) this.mausritter.sheet.setData(data)
      if (data.hirelings && this.mausritter.hirelings) {
        this.$store.dispatch('hirelingsSet', data.hirelings)
        .then(() => {
          this.mausritter.hirelings.refresh(data.hirelings)
        })
      }
    },
    changeLocale (newLocale) {
      this.locale = newLocale || DEFAULT_LOCALE
      this.$i18n.locale = this.locale
      this.$store.dispatch('changeLocale', this.locale)
      saveLocale(this.locale)
    },
    createRandomSheet () {
      if (this.mausritter.sheetToolbar) this.mausritter.sheetToolbar.displayDrawer(false)
      if (this.mausritter.sheet) this.mausritter.sheet.createRandomSheet()
      this.currentSlot = null
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
      await navigator.clipboard.writeText(encodeJson(data))
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
      this.currentSlot = index
      this.$store.commit('historyAdd', {
        type: this.$t('Load'),
        message: this.slots[index]
      })
    },
    loadSheet (index) {
      if (!this.currentSlot) {
        this.load(index)
        return
      }

      this.$refs['confirm-dialog'].open(this.$t('Load'), this.$t('The current sheet will be overwritten by “{name}”. Do you confirm?', { name: this.slots[index] } ))
        .then(confirmed => {
          if (confirmed) {
            this.load(index)
          }
        })
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
      this.currentSlot = index
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
  },
  mounted () {
    this.slots = listSlots()
  },
}
</script>