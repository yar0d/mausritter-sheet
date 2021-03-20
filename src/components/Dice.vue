<template>
  <w-tooltip transition="fade" bg-color="yellow-light2" color="black" top detach-to=".wrapper">
    <template #activator="{ on }">
      <w-icon v-on="on" v-bind="$attrs" :color="color" class="clickable" :class="cls" :xs="size==='xs'" :sm="size==='sm'" :md="size==='md'" :lg="size==='lg'" :xl="size==='xl'" @click="rollDice">
        {{ icon }}
      </w-icon>
    </template>
    <div>
      {{ 'D' + faces }}
      <div v-if="caption" class="caption">{{ caption }}</div>
    </div>
  </w-tooltip>
  <dice-result ref="dice-result" />
</template>

<script>
import { roll } from '@/services/dice3d'
import { highestOfDices, lowestOfDices } from '@/services/dice-roller'
import DiceResult from './DiceResult.vue'

const STANDARD_DICES = [4, 6, 8, 10, 12, 20]

export default {
  components: { DiceResult },
  name: 'Dice',
  props: {
    advantage: { type: String, default: '' },
    caption: { type: String, default: '' },
    cls: { type: String, default: '' },
    color: { type: String, default: 'dice' },
    context: { type: String, default: '' },
    number: { type: Number, default: 1 },
    faces: { type: Number, default: 6 },
    size: { type: String, default: 'md' }
  },
  emits: ['rolled'],
  data () {
    return {
      roll: 0,
      show: false,
    }
  },
  computed: {
    icon () {
      return STANDARD_DICES.includes(this.faces) ? `mdi mdi-dice-d${this.faces}` : 'mdi mdi-dice-multiple'
    }
  },
  methods: {
    rollDice () {
      let number = this.advantage ? 2 : this.number
      let type = !this.advantage ? '' : (this.advantage === 'a' ? 'w' : 'b')

      roll({
        formula: `${number}d${this.faces}`,
        callbackFn: ({ dices, total }) => {
          this.roll = !this.advantage ? total : (this.advantage ? lowestOfDices(dices) : highestOfDices(dices))
          this.$store.commit('historyAdd', { type: `${type}${number}d${this.faces}`, message: this.roll + ' ' + this.context})
          this.$emit('rolled', { roll: dices, context: this.context, total: this.roll })
          this.$refs['dice-result'].open({ context: this.context, faces: this.faces, dices, score: this.score, total: this.roll })
        }
      })
    }
  }
}
</script>
