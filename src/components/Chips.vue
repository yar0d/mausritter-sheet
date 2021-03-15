<template>
  <span v-if="value" class="chip">{{ value }}</span>
</template>

<script>
export default {
  name: 'Chips',
  props: ['value']
}
</script>