<template>
  <div>
    <div>{{ $t('Application font') }}</div>
    <w-divider />
    <w-list :items="fontList" v-model="fontIndex">
      <template #item="{ item }">
        <w-flex row>
          <div class="w-25">
            <w-icon v-if="fontIndex === item.value" class="mr2">mdi mdi-check</w-icon>
          </div>
          <span :class="`font-${item.value}`">{{ item.label }}</span>
        </w-flex>
      </template>
    </w-list>
  </div>
</template>

<script>
const PREF_FONT_INDEX = 'fontIndex'

export default {
  name: 'Preferences',
  data () {
    return {
      fontList: [
        { label: 'Monospace', value: 0 },
        { label: 'Grenze Gotisch', value: 1 },
        { label: 'Grenze Gotisch Variable', value: 2 },
        { label: 'Trickster', value: 3 },
        { label: 'Broken Script', value: 4 },
      ]
    }
  },
  computed: {
    prefs () { return this.$store.getters['preferences'] || {} },
    fontIndex: {
      get () {
        return this.prefs[PREF_FONT_INDEX] || 0
      },
      set (value) {
        this.$store.dispatch('savePreferences', { key: PREF_FONT_INDEX, value })
      }
    }
  }
}
</script>