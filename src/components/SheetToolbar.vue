<template>
  <drawer v-model="showDrawer" @close="showDrawer = false" absolute top class="drawer-top" />
  <w-flex row align-center>
    <div class="mx4">
      <w-tooltip transition="fade" bg-color="yellow-light2" color="black" right>
        <template #activator="{ on }">
          <w-icon v-on="on" xl class="clickable" @click="showDrawer = !showDrawer" :bg-color="showDrawer ? 'blue' : ''" :color="showDrawer ? 'white' : 'blue'">mdi mdi-dots-grid</w-icon>
        </template>{{ $t('Items and conditions drawer.') }}
      </w-tooltip>
    </div>

    <slot name="actions-prepend" />

    <w-menu v-model="showMenu" bottom>
      <template #activator="{ on }">
        <w-button xs round outline v-on="on">
          {{ diceAdvantageLabel }}
        </w-button>
      </template>
      <w-list v-model="diceAdvantage" :items="diceAdvantages" @item-select="showMenu = false">
        <template #item="{ item }">
          <w-flex align-center justify-space-between>
            {{ $t(item.label) }}
            <w-icon md class="ml2">{{ item.icon }}</w-icon>
          </w-flex>
        </template>
      </w-list>
    </w-menu>

    <div v-for="dice in DICE_FACES" :key="dice" class="mx4">
      <dice :faces="dice" :advantage="diceAdvantage" size="xl" color="dice" />
    </div>

    <div v-if="currentSheet">
      <w-flex row align-center class="text-center">
        <w-divider vertical class="pr2" />
        <span class="pr2">{{ $t('Table') }}</span>
        <w-input v-model="currentTable" outline class="my1 w-250" />
        <w-tooltip v-if="$store.getters['tableState']" transition="fade" :bg-color="tableStateColor" detach-to="#sheet-container" color="white" bottom>
          <template #activator="{ on }">
            <w-icon v-on="on" :color="tableStateColor">{{ tableStateIcon }}</w-icon>
          </template>{{ tableStateText }}
        </w-tooltip>
      </w-flex>
    </div>
    <div v-else>
      {{ $t('Please create or load your mouse.') }}
    </div>
  </w-flex>
</template>

<script>
import Drawer from '@/components/Drawer.vue'
import Dice from '@/components/Dice.vue'

const DICE_FACES = [4, 6, 8, 10, 12, 20]

export default {
  name: 'SheetToolbar',
  components: { Drawer, Dice },
  data () {
    return {
      DICE_FACES,
      diceAdvantage: '',
      diceAdvantages: [
        { value: '', label: 'Neutral', icon: 'mdi mdi-tilde' },
        { value: 'a', label: 'With advantage', icon: 'mdi mdi-thumb-up' },
        { value: 'd', label: 'With disadvantage', icon: 'mdi mdi-thumb-down' }
      ],
      showDrawer: false,
      showHirelings: false,
      showMenu: false
    }
  },
  computed: {
    currentSheet () { return this.$store.getters['currentSheet'] },
    currentTable: {
      get () { return this.$store.getters['tableId'] },
      async set (value) {
        try {
          await this.$store.dispatch('setTableId', value || null)
        } catch (error) {
          console.error(error)
        }
      }
    },
    diceAdvantageLabel () {
      let found
      this.diceAdvantages.forEach((type, i) => {
        if (type.value === this.diceAdvantage) found = this.diceAdvantages[i].label
      })
      return this.$t(found) || '?'
    },
    tableStateColor () {
      const status = this.$store.getters['tableState'].status
      if (status > 0 && status < 400) return 'green'
      return 'red'
    },
    tableStateIcon () {
      const status = this.$store.getters['tableState'].status
      if (status > 0 && status < 400) return 'mdi mdi-check'
      return 'mdi mdi-alert-circle'
    },
    tableStateText () {
      const status = this.$store.getters['tableState'] // ?.statusText
      return `${status.status} ${status.statusText}`
    }
  },
  methods: {
    displayDrawer (show = false) {
      this.showDrawer = show
    }
  }
}
</script>
