<template>
  <w-menu v-model="showMenu" left>
    <template #activator="{ on: menuOn }">
      <w-icon v-on="{ ...menuOn }" class="clickable dice" :xs="size==='xs'" :sm="size==='sm'" :md="size==='md'" :lg="size==='lg'" :xl="size==='xl'">
        {{ DICES_FACES.includes(faces) ? 'mdi mdi-dice-d' + faces : 'mdi mdi-dice-multiple' }}
      </w-icon>
    </template>
    <div class="text-center">
      <div v-if="context" class="py1">{{ context }}</div>
      <w-divider />
      <w-flex v-for="(item, index) in diceAdvantages" :key="index" justify-start>
        <div class="clickable grow text-left my2" @click="rollDice(item.value)">
          <w-icon md class="mr2">{{ item.icon }}</w-icon>
          {{ $t(item.label) }}
        </div>
      </w-flex>
    </div>
  </w-menu>
  <dice-result ref="dice-result" />
</template>

<script>
import { roll } from '@/services/dice3d'
import { highestOfDices, lowestOfDices } from '@/services/dice-roller'
import DiceResult from './DiceResult.vue'

const DICES_FACES = [4, 6, 8, 10, 12, 20]

export default {
  name: 'Checker',
  components: { DiceResult },
  emits: [ 'rolled' ],
  props: {
    context: { type: String, required: true },
    faces: { type: Number, required: true },
    score: { type: Number, required: true },
    size: { type: String, default: 'md' }
  },
  data () {
    return {
      DICES_FACES,
      diceAdvantage: '',
      diceAdvantages: [
        { value: '', label: 'Neutral', icon: 'mdi mdi-tilde' },
        { value: 'a', label: 'With advantage', icon: 'mdi mdi-thumb-up' },
        { value: 'd', label: 'With disadvantage', icon: 'mdi mdi-thumb-down' }
      ],
      showMenu: false,
    }
  },
  methods: {
    rollDice (advantage) {
      this.showMenu = false
      let number = advantage ? 2 : 1
      let type = !advantage ? '' : (advantage === 'a' ? 'w' : 'b')
      // const result = rollCustom(`${type}${number}d${this.faces}`)

      roll({
        formula: `${number}d${this.faces}`,
        callbackFn: ({ dices, total }) => {
          const roll = !advantage ? total : (advantage === 'a' ? lowestOfDices(dices) : highestOfDices(dices))
          const success = roll <= this.score

          this.$store.commit('historyAdd', {
            type: `${type}${number}d${this.faces}`,
            message: this.context + ' -> ' + (success ? this.$t('SUCCESS') : this.$t('FAILED')),
            color: success ? 'success' : 'failed',
            secondary: this.$t('Need {score} or lower, roll {roll}.', { score: this.score, roll }) +
              (dices.length > 1 ? ' [' + dices.join(', ') + ']' : '') })

          this.$emit('rolled', { roll: dices, context: this.context, total: roll, success: success, score: this.score })

          this.$refs['dice-result'].open({ context: this.context, faces: this.faces, dices, score: this.score, total: roll, success, failed: !success, advantage })
        }
      })
    }
  }
}
</script>
