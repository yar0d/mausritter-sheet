<template>
  <w-menu v-model="showMenu" left>
    <template #activator="{ on: menuOn }">
      <w-tooltip transition="fade" bg-color="yellow-light2" color="black" left>
        <template #activator="{ on: tooltipOn }">
          <w-icon v-on="{ ...menuOn, ...tooltipOn }" class="clickable dice" :xs="size==='xs'" :sm="size==='sm'" :md="size==='md'" :lg="size==='lg'" :xl="size==='xl'">
            {{ DICES_FACES.includes(faces) ? 'mdi mdi-dice-d' + faces : 'mdi mdi-dice-multiple' }}
          </w-icon>
        </template>
        {{ context }}
      </w-tooltip>
    </template>
    <div class="text-center">
      <div v-if="context" class="py1">{{ context }}</div>
      <w-divider />
      <w-list v-model="diceAdvantage" :items="diceAdvantages" @item-select="showMenu = false">
        <template #item="{ item }">
          <w-flex align-center justify-space-between @click="roll(item.value)">
            {{ $t(item.label) }}
            <w-icon md class="ml2">{{ item.icon }}</w-icon>
          </w-flex>
        </template>
      </w-list>
    </div>
  </w-menu>
  <dice-result ref="dice-result" />
</template>

<script>
import { rollCustom } from '@/services/dice-roller'
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
    roll (advantage) {
      this.showNotification = false
      let number = advantage ? 2 : 1
      let type = !advantage ? '' : (advantage === 'a' ? 'w' : 'b')
      const result = rollCustom(`${type}${number}d${this.faces}`)
      const success = result.total <= this.score

      this.$store.commit('historyAdd', {
        type: `${type}${number}d${this.faces}`,
        message: this.context + ' -> ' + (success ? this.$t('SUCCESS') : this.$t('FAILED')),
        color: success ? 'success' : 'failed',
        secondary: this.$t('Need {score} or lower, roll {roll}.', { score: this.score, roll: result.total }) +
          (result.dices.length > 1 ? ' [' + result.dices.join(', ') + ']' : '') })

      this.$emit('rolled', { roll: result, context: this.context, total: result.total, success: success, score: this.score })

      this.$refs['dice-result'].open({ context: this.context, roll: result, score: this.score, success, failed: !success })
    }
  }
}
</script>
