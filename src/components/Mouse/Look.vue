<template>
  <w-flex row align-center justify-center class="w-max">
    <span v-if="showLabel" class="body pl1">{{ $t('Look') }}</span>
    <w-select v-bind="$attrs" :label="showLabel ? '' : $t('Look')" static-label :items="items" @input="updateValue">
      <template #item="{ item }">
        {{ $t(item.label) }}
      </template>
      <template #selection="{ item }">
        <span v-if="item" class="input-value">{{ $t(item.label) }}</span>
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
  props: {
    showLabel: { type: Boolean, default: false }
  },
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
    sanitize (value) {
      return value < 1 ? 1 : (value > this.items.length ? this.items.length : value)
    },
    setByIndex (index) {
      if (index >= 0 && index < this.items.length) this.setValue(this.items[index - 1])
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
    looks.forEach((look) => {
      this.items.push({ value: look.dice, label: look.label })
    })
  }
}
</script>
