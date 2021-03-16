<template>
  <w-app id="app">
    <main class="grow">
      <w-flex basis-zero wrap class="h-max">
        <w-flex row align-start justify-space-between>
          <w-flex column justify-space-between>
            <sheet id="sheet" ref="sheet"/>
            <sheet-toolbar ref="sheet-toolbar" />
          </w-flex>


          <w-flex column class="w-max h-max">
            <w-toolbar no-border class="toolbar-pager">
              <div class="title3">Mausritter Sheet</div>
              <div class="spacer"></div>
              <w-button lg class="px8" :text="!showWelcome" @click="showPanel({ home: true, history: false, hirelings: false })">
                <w-icon class="mr1" xl>
                  mdi mdi-rodent
                </w-icon>
                {{ $t('Welcome') }}
              </w-button>

              <w-button lg class="px8" :text="!showHistory" @click="showPanel({ home: false, history: true, hirelings: false })">
                <w-icon class="mr1" xl>
                  mdi mdi-history
                </w-icon>
                {{ $t('History') }}
              </w-button>

              <w-button lg class="px8" :text="!showHirelings" @click="showPanel({ home: false, history: false, hirelings: true })">
                <w-icon class="mr1" xl>
                  mdi mdi-donkey
                </w-icon>
                {{ $t('Hirelings') }}
                <chips :value="hirelingsCount" />
              </w-button>
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
  </w-app>
</template>

<script>
import Sheet from '@/components/Sheet.vue'
import SheetToolbar from '@/components/SheetToolbar.vue'
import History from '@/components/History.vue'
import Hirelings from '@/components/Hirelings.vue'
import Welcome from './components/Welcome.vue'
import Chips from './components/Chips.vue'

export default {
  name: 'App',
  components: { Sheet, SheetToolbar, History, Hirelings, Welcome, Chips },
  data () {
    return {
      tabs: [],
      showWelcome: true,
      showHistory: false,
      showHirelings: false,
    }
  },
  computed: {
    hirelingsCount () { return this.$store.getters['hirelings'].length }
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
  }
}
</script>
