<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script>
export default {
  name:'TestCompo',
  props: {
    modelValue: { type: String, default: 'test', required: true }
  }
}
</script>