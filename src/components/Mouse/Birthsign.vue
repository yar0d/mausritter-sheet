<template>
  <w-flex row align-center justify-center class="wrapper">
    <span v-if="showLabel" class="input-label body pl1">{{ $t('Birthsign') }}</span>
    <w-select v-bind="$attrs" :items="items" :label="showLabel ? '' :$t('Birthsign')" static-label @input="updateValue">
      <template #item="{ item }">
        <w-flex justify-space-between align-center>
          <span>{{ $t(item.label) }}</span>
          <span class="caption">{{ $t(item.disposition1) }} / {{ $t(item.disposition2) }}</span>
        </w-flex>
      </template>
      <template #selection="{ item }">
        <w-flex v-if="item" justify-space-between align-center>
          <span class="pr2">{{ $t(item.label) }}</span>
          <span class="caption">{{ $t(item.disposition1) }} / {{ $t(item.disposition2) }}</span>
        </w-flex>
      </template>
    </w-select>
    <d6 v-if="allowRandom" :context="$t('Birthsign')" @rolled="roll" />
  </w-flex>
</template>

<script>
import { d6 } from '@/services/dice-roller'
import { birthsigns } from '@/services/birthsigns'
import D6 from '@/components/D6'

export default {
  name: 'Birthsign',
  components: { D6 },
  emits: ['input', 'roll'],
  props: {
    allowRandom: { type: Boolean, default: false },
    showLabel: { type: Boolean, default: false }
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
    birthsigns.forEach((birthsign, index) => {
      this.items.push({ value: index + 1, label: birthsign.label, disposition1: birthsign.disposition1, disposition2: birthsign.disposition2 })
    })
  }
}
</script>