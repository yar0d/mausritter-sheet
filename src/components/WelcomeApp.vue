<template>
  <div class="scrollable h-auto">
    <w-toolbar class="background-white-50">
      <w-button xl v-for="lang in LOCALES" :key="lang" :color="locale === lang ? '' : 'primary'" class="mr2" @click="changeLocale(lang)">
        {{ $t(lang) }}
      </w-button>

      <div class="spacer" />

      <w-menu v-if="!isStandaloneApp" v-model="showAppMenu">
        <template #activator="{ on }">
          <w-button text v-on="on" xl @click="showAppMenu = !showAppMenu">
            <w-icon>mdi mdi-application</w-icon>
            {{ $t('Applications...') }}
          </w-button>
        </template>

        TODO
      </w-menu>

      <w-menu v-model="showPrefMenu">
        <template #activator="{ on }">
          <w-button text v-on="on" xl @click="showPrefMenu = !showPrefMenu">
            <w-icon>mdi mdi-menu</w-icon>
            {{ $t('Preferences...') }}
          </w-button>
        </template>

        <preferences />
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
            <w-button lg @click="importSheet" bg-color="blue-grey" color="white" class="ml2">
              {{ $t('Import...') }}
            </w-button>
          </div>
        </w-flex>

        <w-flex column v-for="(slot, key) in slots" :key="key" justify-center class="pb2">
          <w-flex row align-center justify-space-between class="px2 pt2" :class="currentKey === key ? 'brown-dark2--bg white' : ''">
            <div v-if="key === currentKey">
              {{ key }}
            </div>
            <w-button v-else text @click="loadSheet(key)">
              {{ key }}
            </w-button>
            <div>
              <span class="w-25">
                <w-tooltip transition="fade" bg-color="yellow-light2" color="black" left>
                  <template #activator="{ on }">
                    <w-button :disabled="!slot" v-on="on" @click="deleteSheet(key)" bg-color="red" color="white" class="ml4" icon="mdi mdi-delete" />
                  </template>
                  {{ $t('Delete') }}
                </w-tooltip>
              </span>
              <span class="w-25">
                <span v-if="key === currentKey">
                  <w-tooltip transition="fade" bg-color="yellow-light2" color="black" left>
                    <template #activator="{ on }">
                      <w-button :disabled="!slot" v-on="on" @click="exportSheet" bg-color="" color="white" class="ml4" icon="mdi mdi-application-export" />
                    </template>
                    {{ $t('Export') }}
                  </w-tooltip>
                </span>
              </span>
              <span class="w-25">
                <span v-if="key === currentKey">
                  <w-tooltip transition="fade" bg-color="yellow-light2" color="black" left>
                    <template #activator="{ on }">
                      <w-button v-on="on" @click="saveSheet" bg-color="blue" color="white" class="ml4" icon="mdi mdi-content-save" />
                    </template>
                    {{ $t('Save') }}
                  </w-tooltip>
                </span>
              </span>
            </div>
          </w-flex>

          <w-flex v-if="currentKey === key" row class="w-max pl4 pr2 py2 brown-dark2--bg white" justify-space-between>
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
          <w-divider />
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
import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
// import * as dialog from '@tauri-apps/api/dialog'
import DEFINES from '@/services/defines'
import { LOCALES, DEFAULT_LOCALE, loadLocale, saveLocale } from '@/services/locales'
import { decodeJson, encodeJson } from '@/services/storage'
import { copyToClipboard } from '@/services/clipboard'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PromptDialog from './PromptDialog.vue'
import Preferences from './Preferences.vue'

export default {
  name: 'Welcome',
  components: { ConfirmDialog, PromptDialog, Preferences },
  propos: [ 'sheet' ],
  data () {
    return {
      DEFAULT_LOCALE,
      LOCALES,
      currentKey: null,
      decodeJson,
      docDir: null,
      importData: null,
      locale: null,
      showAppMenu: false,
      showPrefMenu: false,
      slots: [],
      slotFiles: {}
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
    },
    isStandaloneApp () { return this.$store.getters['standaloneApp'] }
  },
  methods: {
    advancement () {
      if (this.mausritter.sheet) this.mausritter.sheet.advancement()
    },
    apply (data) {
      if (this.mausritter.sheet) {
        this.mausritter.sheet.setData(data)
        this.currentKey = this.dataSignature(data)
      }
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
      if (this.mausritter.sheet) {
        this.mausritter.sheet.createRandomSheet()
        this.currentKey = this.dataSignature(this.serialize())
        this.saveSheet()
      }
    },
    deleteSheet (key) {
      this.$refs['confirm-dialog'].open(this.$t('Delete'), this.$t('The sheet of “{name}” will be erased. Do you confirm?', { name: key } ))
        .then(async confirmed => {
          if (confirmed) {
            try {
              await fs.removeFile(this.slots[key].path)
            } catch (error) {
              console.error(error)
            }
            this.listSlots() // Refresh slot list
          }
        })
    },
    dataSignature (data) {
      return data.sheet.name + ' - ' + data.sheet.background + ' - ' + this.$t('level {n}', { n: data.sheet.level })
    },
    async exportSheet () {
      try {
        const data = await fs.readTextFile(this.slots[this.currentKey].path)
        await copyToClipboard(data)
        this.$refs['prompt-dialog'].open(this.$t('Export'), this.$t('“{name}” is now copied to clipboard.', { name: this.dataSignature(decodeJson(data)) }), { data })
      } catch (error) {
        console.error(error)
        this.$store.commit('historyAdd', { message: error, secondary: this.slots[this.currentKey].path, color: 'red' })
      }
    },
    async importSheet () {
      this.$refs['prompt-import-dialog'].open(this.$t('Import'), '')
        .then(() => {
          if (this.importData) {
            this.apply(decodeJson(this.importData))
          }
        })
    },
    async listSlots () {
      let slots = {}
      const files = await fs.readDir(this.docDir)
      for(let i = 0; i < files.length; i++) {
        if (files[i] && files[i].name && files[i].name.indexOf(DEFINES.FILE_EXTENSION_MAUSRITTER_SHEET) === files[i].name.length - DEFINES.FILE_EXTENSION_MAUSRITTER_SHEET.length) {
          slots[files[i].name.replace(DEFINES.FILE_EXTENSION_MAUSRITTER_SHEET, '')] = {
            name: files[i].name,
            path: files[i].path
          }
        }
      }
      this.slots = { ...slots }
    },
    async load (key) {
      try {
        const data = await fs.readTextFile(this.slots[key].path)
        this.apply(decodeJson(data))
        this.$store.commit('historyAdd', { type: this.$t('Load'), message: key, secondary: this.slots[key].path })
        this.canLevelUp()
      } catch (error) {
        console.error(error)
        this.$store.commit('historyAdd', { message: error, secondary: this.slots[key].path, color: 'red' })
      }
    },
    loadSheet (key) {
      if (!this.currentKey) {
        this.load(key)
        return
      }

      this.$refs['confirm-dialog'].open(this.$t('Load'), this.$t('Do you want to save the sheet of “{name}”?', { name: this.currentKey } ))
        .then(confirmed => {
          if (confirmed) {
            const data = this.serialize()
            this.save(this.currentKey, data)
          }
          this.load(key)
        })
    },
    async initialize () {
      try {
        this.docDir = await path.resolvePath(DEFINES.FOLDER_MAUSRITTER_SHEET, fs.BaseDirectory.Document)
        await fs.createDir(this.docDir, { recursive: true })
      } catch (error) {
        console.error(error)
      }
      this.$store.commit('historyAdd', { message: this.$t('Mausritter Sheet folder is {folder}', { folder: this.docDir }) })
      // console.log('## [tauri] path.appDir', await path.appDir())
      // console.log('## [tauri] path.audioDir', await path.audioDir())
      // console.log('## [tauri] path.cacheDir', await path.cacheDir())
      // console.log('## [tauri] path.configDir', await path.configDir())
      // console.log('## [tauri] path.dataDir', await path.dataDir())
      // console.log('## [tauri] path.desktopDir', await path.desktopDir())
      // console.log('## [tauri] path.documentDir', await path.documentDir())
      // console.log('## [tauri] path.downloadDir', await path.downloadDir())
      // console.log('## [tauri] path.executableDir', await path.executableDir())
      // console.log('## [tauri] path.fontDir', await path.fontDir())
      // console.log('## [tauri] path.homeDir', await path.homeDir())
      // console.log('## [tauri] path.localDataDir', await path.localDataDir())
      // console.log('## [tauri] path.pictureDir', await path.pictureDir())
      // console.log('## [tauri] path.publicDir', await path.publicDir())
      // console.log('## [tauri] path.resourceDir', await path.resourceDir())
      // console.log('## [tauri] path.runtimeDir', await path.runtimeDir())
      // console.log('## [tauri] path.templateDir', await path.templateDir())
      // console.log('## [tauri] path.videoDir', await path.videoDir())
      this.listSlots() // Refresh file list
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
    async save (key, data) {
      try {
        let path
        if (!this.slots[key]) {
          path = this.docDir + '/' + this.dataSignature(data) + DEFINES.FILE_EXTENSION_MAUSRITTER_SHEET
        } else {
          path = this.slots[key].path
        }
        await fs.writeFile({ contents: encodeJson(data), path }, {})
        this.listSlots() // Refresh slot list
        this.$store.commit('historyAdd', { type: this.$t('Save'), message: key })
      } catch (error) {
        console.error(error)
        this.$store.commit('historyAdd', { message: error, secondary: path, color: 'red' })
      }
    },
    saveSheet () {
      const data = this.serialize()
      this.save(this.currentKey, data)
      // this.$refs['confirm-dialog'].open(this.$t('Save'), this.$t('The sheet of “{dest}” will be overwritten by “{name}”. Do you confirm?', { dest: this.slots[index], name: this.dataSignature(data) } ))
      //   .then(confirmed => {
      //     if (confirmed) {
      //       this.save(index, data)
      //     }
      //   })
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
    this.initialize()
  }
}
</script>