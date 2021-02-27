<template>
  <w-icon class="clickable" color="dice" :xs="size==='xs'" :sm="size==='sm'" :md="size==='md'" :lg="size==='lg'" :xl="size==='xl'" @click="roll">
    mdi mdi-dice-d12
  </w-icon>
  <w-notification v-show="result" bg-color="yellow" color="black" success plain shadow transition="bounce" bottom left dismiss>
    <template #default>
      <div v-if="context" class="caption">{{ context }}</div>
      <w-icon xl>mdi mdi-dice-d12</w-icon> <span class="title1">{{ result }}</span>
    </template>
  </w-notification>
</template>

<script>
import { d12 } from '@/services/dice-roller'

export default {
  name: 'D12',
  props: {
    context: { type: String, default: '' },
    size: { type: String, default: 'md' }
  },
  emits: ['rolled'],
  data () {
    return {
      result: null,
      show: false,
    }
  },
  methods: {
    roll () {
      this.result = d12()
      this.$emit('rolled', { dice: 'd12', context: this.context, total: this.result })
    }
  }
}
</script>
