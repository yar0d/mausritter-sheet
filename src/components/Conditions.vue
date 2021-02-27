<template>
  <div class="condition condition-background" :class="`item-size-${size}`">
    <w-flex column justify-space-between class="text-left h-max primary">
      <w-flex row class="condition-title">
        <w-icon v-if="canDelete" class="clickable mr2" @click="onDelete">
          mdi mdi-close-circle
        </w-icon>
        <div class="condition-label">{{ label }}</div>
      </w-flex>
      <w-flex align-start class="condition-desc">{{ desc }}</w-flex>
      <div class="condition-clear text-left">
        {{ $t('Clear:') }}
        <div>{{ clear }}</div>
      </div>
    </w-flex>
  </div>
</template>

<script>

export default {
  name: 'Conditions',
  props: {
    canDelete: { type: Boolean, default: false },
    clear: { type: String, required: true },
    desc: { type: String, default: '' },
    id: { type: String, required: true },
    label: { type: String, required: true },
    size: { type: String, default: 'md' }
  },
  emits: [ 'delete' ],
  data () { return {} },
  methods: {
    onDelete () {
      this.$emit('delete', { id: this.id })
    }
  }
}
</script>
