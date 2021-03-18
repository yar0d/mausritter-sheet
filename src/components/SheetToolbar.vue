<template>
  <w-flex row justify-space-between align-center class="pb1 px1">
    <drawer v-model="showDrawer" />
    <div class="ml2">
      <w-tooltip transition="fade" bg-color="yellow-light2" color="black" right>
        <template #activator="{ on }">
          <w-icon v-on="on" xl class="clickable" @click="showDrawer = !showDrawer" :bg-color="showDrawer ? 'blue' : ''" :color="showDrawer ? 'white' : 'blue'">mdi mdi-dots-grid</w-icon>
        </template>{{ $t('Items and conditions drawer.') }}
      </w-tooltip>
    </div>
    <slot name="actions-prepend" />
    <w-divider vertical />
    <div v-for="dice in DICE_FACES" :key="dice">
      <dice :faces="dice" :advantage="diceAdvantage" size="xl" color="dice" />
    </div>
    <w-menu v-model="showMenu" top>
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
    <w-divider vertical />
    <slot name="actions-append" />
    <img :src="require('@/assets/compatible-with-mausritter-88x32.png')" contain class="clickable" @click="$refs['about-dialog'].show()" />
  </w-flex>
  <about ref="about-dialog" />
</template>

<script>
import Drawer from '@/components/Drawer.vue'
import Dice from '@/components/Dice.vue'
import About from './About.vue'
// import History from './History.vue'
// import Hirelings from './Hirelings.vue'

const DICE_FACES = [4, 6, 8, 10, 12, 20]

export default {
  name: 'SheetToolbar',
  components: { Drawer, Dice, About /*, History, Hirelings */ },
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
    diceAdvantageLabel () {
      let found
      this.diceAdvantages.forEach((type, i) => {
        if (type.value === this.diceAdvantage) found = this.diceAdvantages[i].label
      })
      return this.$t(found) || '?'
    }
  },
  methods: {
    displayDrawer (show = false) {
      this.showDrawer = show
    }
  }
}
</script>
