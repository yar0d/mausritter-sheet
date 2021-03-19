<template>
  <w-card bg-color="white" class="card-sheet w-auto">
    <w-flex column justify-center>
      <w-flex row justify-space-between>
        <w-badge v-model="items.length" class="mt1">
          {{ $t('Bank') }}
        </w-badge>
        <w-button v-show="items.length" @click="showBank = true">
          <w-icon>
            mdi mdi-archive
          </w-icon>
        </w-button>
      </w-flex>
      <w-flex row justify-center>
        <div class="inventory-cell">
          <draggable :list="items" group="items" item-key="id" class="h-max" :move="move" @add="add">
            <template #item="{ element, index }">
              <items v-if="index === items.length - 1" size="lg" readonly :item="element" />
              <div v-else-if="index < 4" class="stack-slice" />
            </template>
          </draggable>
        </div>
      </w-flex>
      <w-flex row>
        <div class="form-gray input-name">
          {{ $t('Pips') }}
        </div>
        <div class="mx1 text-right">
          <w-input v-model="pips" class="title3" />
        </div>
      </w-flex>
    </w-flex>
  </w-card>

  <w-drawer id="bank" v-model="showBank" bottom no-overlay>
    <div class="w-max pa4 bank-dialog-background">
      <w-flex row align-center justify-space-between>
        <span class="title1">
          <w-badge v-model="items.length" class="mt1">
            {{ $t('Bank') }}
          </w-badge>
        </span>

        <div class="w-250 pips-img">
          <div class="ml6 opacity-75">
            <w-card bg-color="white" class="card-sheet py0 pr2 pips opacity-100">
              <w-flex row justify-end align-center>
                <div class="input-name">
                  {{ $t('Pips') }}
                </div>
                <div class="ml4 mr1 text-right">
                  <w-input v-model.number="pips" class="title2" />
                </div>
              </w-flex>
            </w-card>
          </div>
        </div>

        <w-button icon="mdi mdi-close" @click="showBank = false" />
      </w-flex>
      {{ $t('Your mouse must pay a fee of 1% of the value when retrieving the stored pips or items.') }}
      <div v-if="items" class="mt2 h-max w-max bank-drawer-items">
        <template v-for="(item, index) in items" :key="index">
          <items v-if="item.type === TYPE_ITEM" :item="item" can-delete show-price class="mx2 mb1" @delete="retrieveItem(index, item)" />
        </template>
      </div>
    </div>

    <confirm-dialog ref="confirm-retrieval" />
    <prompt-dialog ref="prompt-retrieval" />
  </w-drawer>
</template>

<script>
import draggable from "vuedraggable"
import { TYPE_ITEM } from "@/services/items-conditions"
import Items from "../Items.vue"
import ConfirmDialog from '../ConfirmDialog.vue'
import PromptDialog from '../PromptDialog.vue'

export default {
  name: 'Bank',
  components: { draggable, Items, ConfirmDialog, PromptDialog },
  props: {
    inventory: { required: true }
  },
  data () {
    return {
      TYPE_ITEM,
      items: [],
      pips: 0,
      showBank: false
    }
  },
  methods: {
    canDrop (element) {
      // Rules:
      // - Only items are accepted
      let result = true
      if (element.type !== TYPE_ITEM) result = false // Condition is refused
      return result
    },
    retrieveItem(index, item) {
      const fee = Math.max(Math.round((item.price || 0) / 100), 1)
      if (this.pips < fee) {
        this.$refs['prompt-retrieval'].open(this.$t('Bank'), this.$t('You do need to have {fee} pips to retrieve “{name}”!', { fee, name: this.$t(item.label) } ))
        return
      }
      this.$refs['confirm-retrieval'].open(this.$t('Bank'), this.$t('Retrieving “{name}” from your bank will cost you {fee} pips. Confirm?', { name: this.$t(item.label), fee } ))
      .then(confirmed => {
        if (confirmed) {
          this.pips -= fee
          if (index >= 0) {
            this.inventory.putItem(item.id, '?', item) // Push item in inventory
            this.items.splice(index, 1) // Remove item from bank
          }
        }
      })
    },
    getIndex(list, id) {
      let i = 0
      let found = -1
      while (found === -1 && i < list.length) {
        if (list[i].id === id) found = i
        i++
      }
      return found
    },
    add (e) {
      if (this.items.length > 0) {
        e.newIndex = 0 // Force top of stack
      }
    },
    move(e) {
      return this.canDrop(e.draggedContext.element, e.relatedContext.list)
    },
    reset (data = {}) {
      this.pips = data.pips || 0
      this.items = this.sanitize(data.items) || []
      this.items.canDrop = this.canDrop // Export drop testing method
    },
    sanitize () {
      const result = []
      this.items.forEach(item => {
        if (item.type === TYPE_ITEM) result.push(item)
      })
      return result
    },
    serialize () {
      return {
        items: this.items,
        pips: this.pips,
      }
    },
    setData (data) {
      this.reset(data)
    }
  },
  created () {
    this.reset()
  }
}
</script>
