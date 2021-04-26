<template>
  <drawer v-model="showDrawer" @close="showDrawer = false" absolute top class="drawer-top" />
  <w-flex row justify-space-between align-center class="pb1 px1">
    <div class="ml2">
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

    <div v-for="dice in DICE_FACES" :key="dice">
      <dice :faces="dice" :advantage="diceAdvantage" size="xl" color="dice" />
    </div>

    <slot name="actions-append" />
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
