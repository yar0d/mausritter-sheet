<template>
  <div class="item item-background" :class="geometry ? `item-${geometry}` : `item-size-${size}`">
    <w-flex column align-start justify-start class="h-max" :class="className(label)">
      <div class="item-title">
        <w-icon v-if="canDelete" class="clickable mr2" @click="onDelete">
          mdi mdi-close-circle
        </w-icon>
        <span class="item-label">{{ $t(label) }}</span>
      </div>
      <div v-if="family === 'SP'">
        <w-input class="item-input input-value" v-model="spell" />
      </div>
      <w-flex v-if="desc" align-center justify-center class="w-max">
        <span class="item-desc">{{ $t(desc) }}</span>
      </w-flex>
      <w-flex row align-end justify-space-between class="h-max">
        <span v-if="use !== undefined">
          <div v-if="use > 6" class="body">
            <span class="xs2">
              <w-input class="title3 item-input input-value" v-model.number="count"/>
            </span>
            /{{ use }}
          </div>
          <w-checkbox v-else v-for="u in use" :key="u" class="item-use" />
        </span>
        <span v-if="damage" class="text-right">
          <span class="item-damage">{{ damage }}</span>
        </span>
      </w-flex>
    </w-flex>
  </div>
</template>

<script>
export default {
  name: 'Conditions',
  props: {
    canDelete: { type: Boolean, default: false },
    damage: { type: String, default: '' },
    desc: { type: String, default: '' },
    family: { type: String, default: '' },
    geometry: { type: String, default: null },
    id: { type: String, required: true },
    img: { type: String, default: '' },
    label: { type: String, required: true },
    size: { type: String, default: 'md' },
    use: { type: Number, default: 0 }
  },
  emits: [ 'delete' ],
  data () {
    return {
      count: 0,
      spell: this.$t('Spell')
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
