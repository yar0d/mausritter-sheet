<template>
  <w-flex row align-center justify-center class="w-max">
    <w-select v-bind="$attrs" :items="items" @input="updateValue">
      <template #item="{ item }">
        {{ item.label }}
      </template>
      <template #selection="{ item }">
        <span v-if="item" class="input-value">{{ item.label }}</span>
        <span v-else class="caption">{{ $t('Choose...') }}</span>
      </template>
    </w-select>
  </w-flex>
</template>

<script>
import { d66 } from '@/services/dice-roller'
import { looks } from '@/services/looks'

export default {
  name: 'Look',
  emits: ['input', 'roll'],
  data () {
    return {
      currentValue: null,
      items: []
    }
  },
  methods: {
    roll ({ total }) {
      const dice = total || d66()
      this.$emit('roll', { dice, value: this.items[dice - 1].value })
    },
    setByIndex (index) {
      if (index >= 0 && index < this.items.length) this.setValue(this.items[index - 1])
    },
    sanitize (value) {
      return value < 1 ? 1 : (value > this.items.length ? this.items.length : value)
    },
    setValue (value) {
      const oldValue = this.currentValue
      this.currentValue = this.sanitize(value)
      this.$emit('input', value, oldValue)
    },
    updateValue (value) {
      this.$emit('input', value)
    }
  },
  mounted () {
    this.items = []
    looks.forEach((look) => {
      this.items.push({ value: look.dice, label: this.$t(look.label) })
    })
  }
}
</script>
