<template>
  <w-flex row align-center justify-center class="wrapper w-max">
    <w-select v-bind="$attrs" :items="items" @input="updateValue">
      <template #item="{ item }">
        <span>{{ $t(item.label) }}</span>
      </template>
      <template #selection="{ item }">
        <span v-if="item" class="input-value">{{ $t(item.label) }}</span>
      </template>
    </w-select>
    <d6 v-if="allowRandom" :context="$t('Coat pattern')" @rolled="roll" />
  </w-flex>
</template>

<script>
import { d6 } from '@/services/dice-roller'
import { patterns } from '@/services/coats'
import D6 from '@/components/D6'

export default {
  name: 'Pattern',
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
    patterns.forEach((pattern, index) => {
      this.items.push({ value: index + 1, label: pattern })
    })
  }
}
</script>
