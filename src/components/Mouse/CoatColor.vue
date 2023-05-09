<template>
  <w-flex row align-center justify-center class="w-max">
    <w-select v-bind="$attrs" :items="items" :label="$t('Color')" static-label @input="updateValue">
      <template #item="{ item }">
        {{ $t(item.label) }}
      </template>
      <template #selection="{ item }">
        <span v-if="item">{{ $t(item.label) }}</span>
      </template>
    </w-select>
    <d6 v-if="allowRandom" :context="$t('Coat color')" @rolled="roll" />
  </w-flex>
</template>

<script>
import { d6 } from '@/services/dice-roller'
import { colors } from '@/services/coats'
import D6 from '@/components/D6'

export default {
  name: 'Color',
  components: { D6 },
  emits: ['input', 'roll'],
  props: {
    allowRandom: { type: Boolean, default: false }
    // value: { type: Number, required: true }
  },
  data () {
    return {
      currentValue: null,
      items: []
    }
  },
  // watch: {
  //   value: {
  //     immediate: true,
  //     handler (newValue) {
  //       if (newValue !== this.currentValue && newValue) {
  //         this.setValue(newValue)
  //       }
  //     }
  //   }
  // },
  methods: {
    roll ({ total }) {
      const dice = total || d6()
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
    colors.forEach((color, index) => {
      this.items.push({ value: index + 1, label: color })
    })
  }
}
</script>
