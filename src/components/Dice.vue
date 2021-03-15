<template>
  <w-tooltip transition="fade" bg-color="yellow-light2" color="black" top detach-to=".wrapper">
    <template #activator="{ on }">
      <w-icon v-on="on" v-bind="$attrs" :color="color" class="clickable" :class="cls" :xs="size==='xs'" :sm="size==='sm'" :md="size==='md'" :lg="size==='lg'" :xl="size==='xl'" @click="roll">
        {{ icon }}
      </w-icon>
    </template>
    <div>
      {{ 'D' + faces }}
      <div v-if="caption" class="caption">{{ caption }}</div>
    </div>
  </w-tooltip>


  <w-notification v-show="result && result.total" bg-color="yellow-light3" color="black" plain shadow transition="bounce" bottom left dismiss>
    <template #default>
      <div v-if="context" class="caption">{{ context }}</div>
      <w-flex row align-center>
        <w-icon xl>{{ icon }}</w-icon> <span class="title1 ml2">{{ result.total }}</span>
        <span v-if="result && result.dices && result.dices.length > 1" class="mx2">[{{ result.dices.join(', ') }}]</span>
        <w-icon v-if="advantage" xl>{{ advantage === 'a' ? 'mdi mdi-thumb-up' : 'mdi mdi-thumb-down' }}</w-icon>
      </w-flex>
    </template>
  </w-notification>
</template>

<script>
import { rollCustom } from '@/services/dice-roller'

const STANDARD_DICES = [4, 6, 8, 10, 12, 20]

export default {
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
      result: {},
      show: false,
    }
  },
  computed: {
    icon () {
      return STANDARD_DICES.includes(this.faces) ? `mdi mdi-dice-d${this.faces}` : 'mdi mdi-dice-multiple'
    }
  },
  methods: {
    roll () {
      let number = this.advantage ? 2 : this.number
      let type = !this.advantage ? '' : (this.advantage === 'a' ? 'w' : 'b')
      this.result = rollCustom(`${type}${number}d${this.faces}`)
      this.$store.commit('historyAdd', { type: `${type}${number}d${this.faces}`, message: this.result.total + ' ' + this.context})
      this.$emit('rolled', { roll: this.result, context: this.context, total: this.result.total })
    }
  }
}
</script>
