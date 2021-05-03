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
import { PREF_FONT_DEFAULT, PREF_FONT_INDEX } from '@/services/defines'

export default {
  name: 'Preferences',
  data () {
    return {
      fontList: [
        // { label: 'Broken Script', value: 0 }, // Does not work with Safari
        { label: 'Grenze Gotisch', value: 1 },
        { label: 'Grenze Gotisch Variable', value: 2 },
        { label: 'Trickster', value: 3 },
        { label: 'Broken Script', value: 4 },
        { label: 'Monospace', value: 5 }
      ]
    }
  },
  computed: {
    prefs () { return this.$store.getters['preferences'] || {} },
    fontIndex: {
      get () {
        return this.prefs[PREF_FONT_INDEX] || PREF_FONT_DEFAULT
      },
      set (value) {
        this.$store.dispatch('savePreferences', { key: PREF_FONT_INDEX, value })
      }
    }
  }
}
</script>