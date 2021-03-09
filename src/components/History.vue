<template>
  <w-drawer :value="value" right class="no-flex">
    <div class="scrollable h-max">
      <w-flex v-for="(h, index) in history" :key="index" class="history-line w-max pa2" row justify-space-between>
        <span v-if="h.type">{{ h.type }} : </span>
        <span>{{ h.message }}</span>
        <div class="caption">{{ h.date.toLocaleTimeString(locale) }}</div>
      </w-flex>
    </div>
  </w-drawer>
</template>

<script>
export default {
  name: 'History',
  props: {
    value: { type: Boolean, default: false }
  },
  data () {
    return {}
  },
  computed: {
    history () { return this.$store.getters['history'] },
    locale () { return this.$store.getters['locale'] }
  },
  methods: {
    clear () {
      this.$store.dispatch('historyClear')
    }
  }
}
</script>
