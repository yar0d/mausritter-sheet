<template>
  <span v-if="value" class="chip" :class="`chip-size-${size}`">{{ value }}</span>
</template>

<script>
export default {
  name: 'Chips',
  props: {
    size: { type: String, default: 'md' },
    value: { type: [Number, String], default: '' }
  }
}
</script>