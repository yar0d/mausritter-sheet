<template>
  <div class="item item-background shadow draggable" :class="size ? `item-size-${size}` : `item-${currentItem.geometry}`">
    <w-flex column align-start justify-start class="h-max" :class="className(currentItem.label)">
      <w-flex row class="h-max w-max">
        <w-flex column justify-end class="w-25 text-center">
          <w-icon v-if="canDelete" class="clickable" color="red" md @click="onDelete">
            mdi mdi-close-circle
          </w-icon>
          <div class="spacer" />
          <div v-if="showUse && currentItem.use !== undefined && currentItem.use <= 6">
            <w-checkbox v-for="u in currentItem.use" :key="u" class="item-use" />
          </div>
        </w-flex>
        <w-flex column justify-space-between>
          <div class="item-label">{{ $t(currentItem.label) }}</div>
          <div class="h-max" v-if="(currentItem.family === ITEM_FAMILY_SPELL || currentItem.family === ITEM_FAMILY_CUSTOM)">
            <w-textarea v-if="canInputCustomLabel" class="item-input item-custom-label input-value" v-model="currentItem.customLabel" rows="3" />
            <span v-else-if="currentItem.customLabel" class="item-desc">{{ currentItem.customLabel }}</span>
          </div>
          <w-flex v-else-if="currentItem.desc" align-center justify-center class="w-max">
            <span class="item-desc mt4">{{ $t(currentItem.desc) }}</span>
          </w-flex>
          <div v-if="showUse && currentItem.use !== undefined && currentItem.use > 6">
            <span class="xs2">
              <w-input class="title1 item-input input-value" v-model.number="count" />
            </span>
            <span class="title1 primary">
              /{{ currentItem.use }}
            </span>
          </div>
          <div row v-if="showDamage && currentItem.damage">
            <span class="item-damage">{{ currentItem.damage }}</span>
          </div>
          <div v-if="showDamage && currentItem.def">
            <span class="item-def">{{ $t('Def')}} {{ currentItem.def }}</span>
          </div>
          <div v-if="showPrice && currentItem.price !== null" class="text-right">
            <span class="item-price"> {{ currentItem.price }} p</span>
          </div>
        </w-flex>
      </w-flex>
    </w-flex>
  </div>
</template>

<script>
  import { ITEM_FAMILY_CUSTOM, ITEM_FAMILY_SPELL } from '@/services/items-conditions'

export default {
  name: 'Items',
  props: {
    canDelete: { type: Boolean, default: false },
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    showDamage: { type: Boolean, default: false },
    showPrice: { type: Boolean, default: false },
    showUse: { type: Boolean, default: false },
    size: { type: String, default: null }
  },
  emits: [ 'delete' ],
  data () {
    return {
      ITEM_FAMILY_CUSTOM,
      ITEM_FAMILY_SPELL,
      count: 0,
      currentItem: {}
    }
  },
  watch: {
    item: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal && !oldVal && newVal !== oldVal) this.currentItem = newVal // Just init label
      }
    }
  },
  computed: {
    canInputCustomLabel () {
      return !this.readonly
    }
  },
  methods: {
    className (label) {
      return 'item-' + label.replace(' ', '-').toLowerCase()
    },
    onDelete () {
      this.$emit('delete', { id: this.id })
    }
  }
}
</script>
