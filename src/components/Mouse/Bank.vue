<template>
  <w-card v-show="grit" bg-color="white" class="w-auto mr4">
    <w-flex column>
      <w-flex row>
        <!-- <div class="w-100 form-gray input-name body">
          {{ $t('Bank') }}
        </div> -->
        <div class="mx2">
          <span class="title2" readonly>{{ grit }}</span>
        </div>
      </w-flex>
      <w-flex row justify-center>
        <div class="inventory-cell">
          <draggable :list="bank" group="items" item-key="id" class="h-max" @change="log" :move="move">
            <template #item="{ element }">
              <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(grits, element.id)" class="inline-block" />
            </template>
            <template #footer><span class="caption">{{ $t('Ignore a number of conditions equal to your Grit.') }}</span></template>
          </draggable>
        </div>
      </w-flex>
    </w-flex>
  </w-card>
</template>

<script>
import draggable from "vuedraggable"
import { TYPE_CONDITION } from "@/services/items-conditions"
import Conditions from "../Conditions.vue"

export default {
  name: 'Grit',
  components: { Conditions, draggable },
  emits: [ 'input' ],
  props: {
    level: { type: Number, required: true }
  },
  data () {
    return {
      TYPE_CONDITION,
      bank: []
    }
  },
  computed: {
    grit () {
      if (this.level <= 1) return 0
      if (this.level <= 2) return 1
      if (this.level <= 4) return 2
      return 3
    }
  },
  methods: {
    canDrop (element, list) {
      // Rules:
      // - Only conditions are accepted
      // - maximum is this.grit number of conditions
      console.log('##[bank] canDrop:', element.type)
      console.log('##[bank] canDrop:', list.length, this.bank)
      let result = true
      if (element.type === TYPE_CONDITION) result = false // condition is refused
      console.log('##[bank] result:', result)
      return result
    },
    deleteItem(list, id) {
      const i = this.getIndex(list, id)
      if (i >= 0) {
        list.splice(i, 1) // Remove item from list
      }
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
    move(e) {
      return this.canDrop(e.draggedContext.element, e.relatedContext.list)
    },
    log(e) {
      console.log("##[bank]", e)
    }
  },
  created () {
    this.grits.canDrop = this.canDrop
  }
}
</script>
