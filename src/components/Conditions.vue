<template>
  <div class="condition condition-background shadow draggable" :class="`item-size-${size}`">
    <w-flex column justify-space-between class="text-left h-max primary">
      <w-flex row class="condition-title" justify-start>
        <w-icon v-if="canDelete" class="w-25 clickable" @click="onDelete">
          mdi mdi-close-circle
        </w-icon>
        <div class="condition-label w-max text-center">{{ $t(label) }}</div>
      </w-flex>
      <w-flex v-if="size !== 'xs'" align-start class="condition-desc">{{ $t(desc) }}</w-flex>
      <div class="condition-clear text-left">
        {{ $t('Clear:') }}
        <div>{{ $t(clear) }}</div>
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
