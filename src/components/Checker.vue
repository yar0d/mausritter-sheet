<template>
  <w-menu v-model="showMenu" left>
    <template #activator="{ on }">
      <w-icon v-on="on" class="clickable" :xs="size==='xs'" :sm="size==='sm'" :md="size==='md'" :lg="size==='lg'" :xl="size==='xl'">mdi mdi-dice-multiple</w-icon>
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
  <w-notification v-show="result" bg-color="yellow-light3" color="black" plain shadow transition="bounce" bottom left dismiss>
    <template #default>
      <div v-if="context" class="caption">{{ context }}</div>
      <w-flex v-if="result" column justify-center>
        <div class="title1">{{ success ? $t('SUCCESS') : $t('FAILED') }}</div>
        <div class="caption">{{ $t('Need {score} or lower, roll {roll}.', { score, roll: result.total }) }}</div>
        <div v-if="result && result.dices && result.dices.length > 1">D{{ faces }} : {{ result.dices.join(', ') }}</div>
      </w-flex>
    </template>
  </w-notification>
</template>

<script>
import { rollCustom } from '@/services/dice-roller'

export default {
  name: 'Checker',
  emits: [ 'rolled' ],
  props: {
    context: { type: String, required: true },
    faces: { type: Number, required: true },
    score: { type: Number, required: true },
    size: { type: String, default: 'md' }
  },
  data () {
    return {
      diceAdvantage: '',
      diceAdvantages: [
        { value: '', label: 'Neutral', icon: 'mdi mdi-slash-forward' },
        { value: 'a', label: 'With advantage', icon: 'mdi mdi-thumb-up' },
        { value: 'd', label: 'With disadvantage', icon: 'mdi mdi-thumb-down' }
      ],
      result: null,
      showMenu: false
    }
  },
  methods: {
    roll (advantage) {
      this.result = null
      console.log('##[checker] roll', advantage, this.$props)
      let number = advantage ? 2 : 1
      let type = !advantage ? '' : (advantage === 'a' ? 'w' : 'b')
      this.result = rollCustom(`${type}${number}d${this.faces}`)
      this.success = this.result.total <= this.score
      this.$emit('rolled', { roll: this.result, context: this.context, total: this.result.total, success: this.success, score: this.score })
    }
  }
}
</script>