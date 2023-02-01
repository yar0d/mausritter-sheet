<template>
  <div v-if="currentItem && currentItem.id" class="item item-background item-background-image shadow" :class="cls" :style="currentItem.imageBlob ? `background:url(${currentItem.imageBlob});` : ''">
    <w-flex column align-start justify-start class="h-max" :class="className(currentItem.label)">
      <w-flex row class="h-max w-max">
        <w-flex v-if="!readonly" column justify-end class="w-25 text-center">
          <w-icon v-if="currentItem.star" color="primary-dark1">mdi mdi-star</w-icon>
          <div class="spacer" />
          <div v-if="showUse && currentItem.use !== undefined && currentItem.use <= 6">
            <w-checkbox v-for="u in currentItem.use" v-model="currentUsed[u - 1]" :key="u" class="item-use" @input="toggleUsed" />
          </div>
        </w-flex>
        <w-flex column>
          <div class="item-title">
            <w-flex align-start>
            <div class="condition-label">{{ $t(currentItem.label) }}</div>
            <div class="spacer" />
            <w-icon v-if="canDelete" md bg-color="white" color="red" class="clickable" @click="onDelete">mdi mdi-close-circle</w-icon>
            </w-flex>
          </div>
          <div class="h-max" v-if="(currentItem.family === ITEM_FAMILY_SPELL || currentItem.family === ITEM_FAMILY_CUSTOM)">
            <w-textarea v-if="canInputCustomLabel" class="background-white-75 item-custom-label" v-model="currentItem.customLabel" rows="3" />
            <span v-else-if="currentItem.customLabel" class="item-desc">{{ currentItem.customLabel }}</span>
            <p v-if="readonly && !hideDesc" if="currentItem.desc" class="w-max item-desc mt2">
              {{ $t(currentItem.desc) }}
            </p>
          </div>
          <w-flex v-if="currentItem.desc" align-start class="w-max">
            <span class="item-desc mt2">{{ $t(currentItem.desc) }}</span>
          </w-flex>
          <div class="h-max" />
          <w-flex v-if="currentItem.summary" align-end class="w-max">
            <span class="item-summary mb1">{{ $t(currentItem.summary) }}</span>
          </w-flex>
          <w-flex v-if="currentItem.specifics" align-end class="w-max">
            <span class="item-specifics mb2">{{ $t(currentItem.specifics) }}</span>
          </w-flex>

          <div v-if="showUse && currentItem.use !== undefined && currentItem.use > 6">
            <span class="xs2">
              <w-input class="title1 background-white-75 input-value" v-model.number="currentItem.count" />
            </span>
            <span class="title1 primary">
              {{ currentItem.use }}
            </span>
          </div>
          <div row v-if="showDamage && currentItem.damage" justify-end>
            <span v-if="readonly || !isDamageDices" class="item-damage">{{ currentItem.damage }}</span>
            <template v-else>
              <dice v-for="(faces, index) in damageDices" :key="index" :faces="faces" :context="$t('Damages')" :caption="captionDices(index)" color="black" cls="mx0 dice-huge item-damage-dice" />
            </template>
          </div>
          <w-flex v-if="showDamage && currentItem.def" justify-end>
            <span class="item-def mr1">{{ $t('Def')}} {{ currentItem.def }}</span>
          </w-flex>
          <div v-if="showPrice && currentItem.price !== null" class="text-right">
            <span class="item-price"> {{ $t('{price}p', { price: currentItem.price }) }}</span>
          </div>
        </w-flex>
      </w-flex>
    </w-flex>
  </div>
</template>

<script>
import { ITEM_FAMILY_CUSTOM, ITEM_FAMILY_SPELL } from '@/services/items-conditions'
import { isDiceNotation } from '../services/dice-roller'
import Dice from './Dice.vue'

export default {
  components: { Dice },
  name: 'Items',
  props: {
    canDelete: { type: Boolean, default: false },
    notDraggable: { type: Boolean, default: false },
    hideDesc: { type: Boolean, default: false },
    item: { type: Object, required: true },
    readonly: { type: Boolean, default: false },
    showDamage: { type: Boolean, default: false },
    showPrice: { type: Boolean, default: false },
    showUse: { type: Boolean, default: false },
    size: { type: String, default: null }
  },
  emits: [ 'delete', 'toggle-used' ],
  data () {
    return {
      ITEM_FAMILY_CUSTOM,
      ITEM_FAMILY_SPELL,
      currentItem: {},
      currentUsed: [],
      isDiceNotation
    }
  },
  watch: {
    item: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal && !oldVal && newVal !== oldVal) {
          // Create values for used checkboxes
          this.currentUsed = []
          for (let i = 0; i < newVal.use; i++) {
            this.currentUsed.push(i < newVal.used)
          }
          this.currentItem = newVal
        }
      }
    }
  },
  computed: {
    cls () {
      return (this.size ? `item-size-${this.size}` : `item-${this.currentItem.geometry}`) + (this.notDraggable ? '' : ' draggable')
    },
    canInputCustomLabel () {
      return !this.readonly
    },
    damageDices () {
      let result = this.currentItem.damage.split(',')
      let count = 0
      result.forEach((dice, index) => {
        if (this.isDiceNotation(dice)) {
          count++
          result[index] = Number(dice.slice(1))
        }
      });
      return count === result.length ? result : []
    },
    isDamageDices () {
      let result = this.currentItem.damage.split(',')
      let count = 0
      result.forEach((dice) => {
        if (this.isDiceNotation(dice)) {
          count++
        }
      });
      return count === result.length
    }
  },
  methods: {
    captionDices (index) {
      return this.damageDices.length > 1 ? (index === 0 ? this.$t('One paw') : this.$t('Both paws')) : ''
    },
    className (label) {
      return 'item-' + label.replace(' ', '-').toLowerCase()
    },
    onDelete () {
      this.$emit('delete', this.item)
    },
    toggleUsed (checked) {
      this.$emit('toggle-used', { uuid: this.item.uuid, checked })
    }
  }
}
</script>
