<template>
  <w-drawer id="history" :value="value" right class="no-flex" no-overlay persistent>
    <div class="scrollable h-max">
      <w-flex v-for="(h, index) in history" :key="index" class="w-max pa2" column justify-space-between>
        <w-divider class="text-small text-secondary">{{ h.date.toLocaleTimeString(locale) }}</w-divider>
        <div>
          <span v-if="h.type">{{ h.type }} : </span>
          <span :class="h.color">{{ h.message }}</span>
          <div v-if="h.secondary" class="text-secondary text-small">{{ h.secondary }}</div>
        </div>
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
