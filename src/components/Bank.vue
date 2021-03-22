<template>
  <div class="w-max h-auto">
    <w-toolbar class="background-white-50">
      <div>
        {{ $t('Your mouse must pay a fee of 1% of the value when retrieving the stored pips or items.') }}
      </div>
      <div class="spacer" />
      <w-input v-model.number="pips" :label="$t('Pips')" class="w-200 title3" />
    </w-toolbar>

    <w-flex column align-center>
      <w-card class="xs10 background-white-50 w-max h-auto my4" :title="$t('Items')">
        <div>
          <span v-if="items.length === 0">
            {{ $t('Drop item here, in your bank.') }}
          </span>
          <draggable :list="items" group="items" item-key="id" class="bank-items" :move="move" @add="add">
            <template #item="{ element, index }">
              <span>
                <items :item="element" can-delete show-price si-ze="lg" class="mx2 mb1" @delete="retrieveItem(index, element) "/>
              </span>
            </template>
          </draggable>
        </div>
      </w-card>
    </w-flex>

    <confirm-dialog ref="confirm-retrieval" />
    <prompt-dialog ref="prompt-retrieval" />
  </div>
</template>

<script>
import draggable from "vuedraggable"
import { TYPE_ITEM } from "@/services/items-conditions"
import Items from "@/components/Items.vue"
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PromptDialog from '@/components/PromptDialog.vue'

export default {
  name: 'Bank',
  components: { draggable, Items, ConfirmDialog, PromptDialog },
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
      return (element.type === TYPE_ITEM)
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
            this.mausritter.inventory.putItem(item.id, '?', item) // Push item in inventory
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
      if (e.relatedContext.list.view === 'inventory') {
        const fee = Math.max(Math.round((e.draggedContext.element.price || 0) / 100), 1)
        if (this.pips < fee) {
          this.$refs['prompt-retrieval'].open(this.$t('Bank'), this.$t('You do need to have {fee} pips to retrieve “{name}”!', { fee, name: this.$t(e.draggedContext.element.label) } ))
          return false
        } else {
          this.pips -= fee
        }
      }
      return this.canDrop(e.draggedContext.element, e.relatedContext.list)
    },
    reset (data = {}) {
      this.pips = data.pips || []
      this.items = data.items || []
      this.items.canDrop = this.canDrop // Export drop testing method
      this.items.view = 'bank'
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
  }
}
</script>
