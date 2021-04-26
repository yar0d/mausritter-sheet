<template>
  <w-app id="app" :class="`font-${fontIndex}`">
    <main class="grow">
      <div id="dice-canvas" class="dice3d-canvas" />

      <w-flex basis-zero wrap class="h-max">
        <w-flex :row="!isMobileDevice" :column="isMobileDevice" align-start justify-start>
          <w-flex id="sheet-container" :class="isMobileDevice ? 'mb1' : ''" column justify-start>
            <sheet-toolbar ref="sheet-toolbar" />
            <sheet id="sheet" ref="sheet"/>
          </w-flex>

          <w-flex column class="h-max" :class="isMobileDevice ? 'fixed-tabs' : ''">
            <w-toolbar no-border class="toolbar-pager px0">
              <w-button lg :class="isMobileDevice ? 'px2' : 'px8'" :text="!show.welcome" @click="showPanel('welcome')">
                <w-icon xl>
                  mdi mdi-rodent
                </w-icon>
                <span class="ml1 text-small">{{ $t('Welcome') }}</span>
              </w-button>

              <w-button lg :class="isMobileDevice ? 'px2' : 'px8'" :text="!show.history" @click="showPanel('history')">
                <w-icon xl>
                  mdi mdi-history
                </w-icon>
                <span class="ml1 text-small">{{ $t('History') }}</span>
              </w-button>

              <w-button lg :class="isMobileDevice ? 'px2' : 'px8'" :text="!show.bank" @click="showPanel('bank')">
                <w-icon xl>
                  mdi mdi-bank
                </w-icon>
                <span class="ml1 text-small">{{ $t('Bank') }}</span>
              </w-button>

              <w-button lg :class="isMobileDevice ? 'px2' : 'px8'" :text="!show.hirelings" @click="showPanel('hirelings')">
                <w-icon xl>
                  mdi mdi-donkey
                </w-icon>
                <span class="ml1 text-small">{{ $t('Hirelings') }}</span>
                <chips :value="hirelingsCount" />
              </w-button>

              <div class="spacer" />
              <img :src="require('@/assets/compatible-with-mausritter-88x32.png')" contain class="clickable" @click="$refs['about-dialog'].show()" />
            </w-toolbar>

            <div v-show="show.history" class="history-background h-max card-bordered">
              <history />
            </div>

            <div v-show="show.bank" class="bank-background w-max h-max card-bordered">
              <bank ref="bank" />
            </div>

            <div v-show="show.hirelings" class="hirelings-background h-max card-bordered">
              <hirelings ref="hirelings"/>
            </div>

            <div v-show="show.welcome" class="welcome-background h-max card-bordered">
              <welcome />
            </div>
          </w-flex>
        </w-flex>
      </w-flex>
    </main>
    <about ref="about-dialog" />
  </w-app>
</template>

<script>
import * as app from '@tauri-apps/api/app'
import { isMobileDevice } from '@/services/responsive'
import dices3D from '@/services/dice3d'
import About from '@/components/About.vue'
import Sheet from '@/components/Sheet.vue'
import SheetToolbar from '@/components/SheetToolbar.vue'
import History from '@/components/History.vue'
import Hirelings from '@/components/Hirelings.vue'
import Welcome from './components/Welcome.vue'
import Chips from './components/Chips.vue'
import Bank from './components/Bank.vue'

export default {
  name: 'App',
  components: { About, Sheet, SheetToolbar, History, Hirelings, Welcome, Chips, Bank },
  data () {
    return {
      tabs: [],
      show: {
        bank: false,
        hirelings: false,
        history: false,
        welcome: true
      }
    }
  },
  computed: {
    hirelingsCount () { return this.$store.getters['hirelings'].length },
    isMobileDevice () { return isMobileDevice(this.$waveui.breakpoint.name) },
    prefs () { return this.$store.getters['preferences'] || {} },
    fontIndex () { return this.prefs.fontIndex || 0 }
  },
  methods: {
    showPanel (panelId) {
      Object.keys(this.show).forEach(id => {
        this.show[id] = id === panelId
      })
    }
  },
  created () {
    this.$store.dispatch('loadPreferences')
  },
  async mounted () {
    this.mausritter.bank = this.$refs['bank']
    this.mausritter.sheet = this.$refs['sheet']
    this.mausritter.sheetToolbar = this.$refs['sheettoolbar']
    this.mausritter.hirelings = this.$refs['hirelings']
    dices3D.initialize('dice-canvas')

    try {
      const tauri = await app.getTauriVersion()
      this.$store.commit('setStandaloneApp', true)
      this.$store.commit('historyAdd', { message: this.$t('Welcome to Mausrittes Sheet!'), secondary: '(tauri ' + tauri + ')' })
    } catch (error) {
      this.$store.commit('setStandaloneApp', false)
      this.$store.commit('historyAdd', { message: this.$t('Welcome to Mausrittes Sheet!') })
    }
  }
}
</script>
