<template>
  <div class="scrollable h-max">
    <w-flex column>
      <w-flex row v-for="(h, index) in history" :key="index" class="w-max" justify-start>
        <w-divider class="white md1">{{ h.date.toLocaleTimeString(locale) }}</w-divider>
        <div class="background-white-25 w-max pa2">
          <span v-if="h.type" class="white--bg">{{ h.type }} : </span>
          <span :class="(h.color || 'white') + '--bg white pa1'">{{ h.message }}</span>
          <span v-if="h.secondary" class="pl4 white text-small">{{ h.secondary }}</span>
        </div>
      </w-flex>
    </w-flex>
  </div>
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
