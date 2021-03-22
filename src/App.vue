<template>
  <w-app id="app">
    <main class="grow">
      <div id="dice-canvas" class="dice3d-canvas" />

      <w-flex basis-zero wrap class="h-max">
        <w-flex row align-start justify-start>
          <w-flex id="sheet-container" column justify-start>
            <sheet-toolbar ref="sheet-toolbar" />
            <sheet id="sheet" ref="sheet"/>
          </w-flex>

          <w-flex column class="h-max" :class="isMobileDevice ? 'fixed-tabs' : ''">
            <w-toolbar no-border class="toolbar-pager">
              <w-button lg :class="isMobileDevice ? 'px2' : 'px8'" :text="!showWelcome" @click="showPanel({ home: true, history: false, hirelings: false })">
                <w-icon class="mr1" xl>
                  mdi mdi-rodent
                </w-icon>
                <span class="text-small">{{ $t('Welcome') }}</span>
              </w-button>

              <w-button lg :class="isMobileDevice ? 'px2' : 'px8'" :text="!showHistory" @click="showPanel({ home: false, history: true, hirelings: false })">
                <w-icon class="mr1" xl>
                  mdi mdi-history
                </w-icon>
                <span class="text-small">{{ $t('History') }}</span>
              </w-button>

              <w-button lg :class="isMobileDevice ? 'px2' : 'px8'" :text="!showHirelings" @click="showPanel({ home: false, history: false, hirelings: true })">
                <w-icon class="mr1" xl>
                  mdi mdi-donkey
                </w-icon>
                <span class="text-small">{{ $t('Hirelings') }}</span>
                <chips :value="hirelingsCount" />
              </w-button>

              <div class="spacer" />
              <img :src="require('@/assets/compatible-with-mausritter-88x32.png')" contain class="clickable" @click="$refs['about-dialog'].show()" />
            </w-toolbar>

            <div v-show="showHistory" class="history-background h-max">
              <history />
            </div>

            <div v-show="showHirelings" class="hirelings-background h-max">
              <hirelings ref="hirelings"/>
            </div>

            <div v-show="showWelcome" class="welcome-background h-max">
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
import { isMobileDevice } from '@/services/responsive'
import dices3D from '@/services/dice3d'
import About from '@/components/About.vue'
import Sheet from '@/components/Sheet.vue'
import SheetToolbar from '@/components/SheetToolbar.vue'
import History from '@/components/History.vue'
import Hirelings from '@/components/Hirelings.vue'
import Welcome from './components/Welcome.vue'
import Chips from './components/Chips.vue'

export default {
  name: 'App',
  components: { About, Sheet, SheetToolbar, History, Hirelings, Welcome, Chips },
  data () {
    return {
      tabs: [],
      showWelcome: true,
      showHistory: false,
      showHirelings: false,
    }
  },
  computed: {
    hirelingsCount () { return this.$store.getters['hirelings'].length },
    isMobileDevice () { return isMobileDevice(this.$waveui.breakpoint.name) }
  },
  methods: {
    showPanel ({ home, history, hirelings }) {
      this.showWelcome = home
      this.showHistory = history
      this.showHirelings = hirelings
    }
  },
  mounted () {
    this.mausritter.sheet = this.$refs['sheet']
    this.mausritter.sheetToolbar = this.$refs['sheettoolbar']
    this.mausritter.hirelings = this.$refs['hirelings']
    dices3D.initialize('dice-canvas')
  }
}
</script>
