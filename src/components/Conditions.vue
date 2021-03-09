<template>
  <div v-if="currentCondition && currentCondition.id" class="condition condition-background shadow draggable" :class="`item-size-${size}`">
    <w-flex column justify-space-between class="text-left h-max primary">
      <w-flex row class="condition-title" justify-start>
        <w-icon v-if="canDelete" class="w-25 clickable" @click="onDelete">
          mdi mdi-close-circle
        </w-icon>
        <div v-if="currentCondition.family === CONDITION_FAMILY_CUSTOM" class="condition-label w-max text-center">
          <w-input v-model="currentCondition.label" :readonly="readonly" />
        </div>
        <div v-else class="condition-label w-max text-center">{{ $t(currentCondition.label) }}</div>
      </w-flex>

      <div v-if="currentCondition.family === CONDITION_FAMILY_CUSTOM" class="condition-desc w-max text-center">
        <w-textarea v-model="currentCondition.desc" :readonly="readonly" rows="2" />
      </div>
      <w-flex v-else-if="size !== 'xs' && currentCondition.desc" align-start class="condition-desc">{{ $t(currentCondition.desc) }}</w-flex>

      <div class="condition-clear">
        {{ $t('Clear:') }}
        <div v-if="currentCondition.family === CONDITION_FAMILY_CUSTOM" class="w-max text-center">
          <w-input v-model="currentCondition.clear" :readonly="readonly" />
        </div>
        <div v-else>{{ $t(currentCondition.clear) }}</div>
      </div>
    </w-flex>
  </div>
</template>

<script>
import { CONDITION_FAMILY_CUSTOM } from '@/services/items-conditions'

export default {
  name: 'Conditions',
  props: {
    canDelete: { type: Boolean, default: false },
    // clear: { type: String, required: true },
    // desc: { type: String, default: '' },
    // id: { type: String, required: true },
    condition: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    // label: { type: String, required: true },
    size: { type: String, default: 'md' }
  },
  emits: [ 'delete' ],
  data () {
    return {
      CONDITION_FAMILY_CUSTOM,
      currentCondition: {}
    }
  },
  watch: {
    condition: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal && !oldVal && newVal !== oldVal) {
          this.currentCondition = newVal
        }
      }
    }
  },
  methods: {
    onDelete () {
      this.$emit('delete', { id: this.id })
    }
  }
}
</script>
