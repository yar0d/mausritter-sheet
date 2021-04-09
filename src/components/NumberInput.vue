<template>
  <w-input :value="innerValue" v-bind="$attrs" @input="$emit('update:modelValue', $event.target.value)" @wheel.stop="handleWheel" @keyup.up.stop="inc" @keyup.down.stop="dec" @keyup.home.stop="setMin" @keyup.end.stop="setMax" />
</template>

<script>
export default {
  props: {
    max: { type: Number, default: Infinity },
    min: { type: Number, default: 0 },
    modelValue: { type: Number, default: 0 }
  },
  emits: ['update:modelValue', 'input'],
  data () {
    return {
      innerValue: 0
    }
  },
  watch: {
    modelValue (newValue) {
      if (!isNaN(newValue)) this.innerValue = newValue
    }
  },
  methods: {
    dec () {
      if (this.innerValue <= this.min) return
      this.innerValue--
      this.$emit('input', this.innerValue)
    },
    handleWheel (event) {
      if (event.deltaY < 0) this.inc()
      else if (event.deltaY > 0) this.dec()
    },
    inc () {
      if (this.innerValue >= this.max) return
      this.innerValue++
      this.$emit('input', this.innerValue)
    },
    setMax () {
      if (this.max === Infinity) return
      this.innerValue = this.max
      this.$emit('input', this.innerValue)
    },
    setMin () {
      if (this.min === -Infinity) return
      this.innerValue = this.min
      this.$emit('input', this.innerValue)
    }
  }
}
</script>
