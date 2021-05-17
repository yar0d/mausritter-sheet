<template>
  <w-card v-show="grit" bg-color="white" class="card-sheet mr4">
    <w-flex column>
      <w-flex row>
        <div class="w-100 form-gray input-name">
          {{ $t('Grit') }}
        </div>
        <div class="mx2">
          <span class="title2" readonly>{{ grit }}</span>
        </div>
      </w-flex>
      <w-flex row justify-center>
        <div class="w-max pt2">
          <draggable :list="items" group="items" item-key="id" class="h-max" :move="move">
            <template #item="{ element }">
              <conditions v-if="element.type === TYPE_CONDITION" size="md" :condition="element" can-delete @delete="deleteItem(items, element.id)" class="inline-block mx2" />
            </template>
            <template #footer><div class="px4 caption">{{ $t('Ignore a number of conditions equal to your Grit.') }}</div></template>
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
  props: {
    level: { type: Number, required: true }
  },
  data () {
    return {
      TYPE_CONDITION,
      items: []
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
      // - No duplicated condition
      let canDrop = true
      if (element.type !== TYPE_CONDITION) canDrop = false // item is refused
      if (list.length === this.grit) canDrop = false // list is full
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === element.id) canDrop = false // Already in list
      }
      return canDrop
    },
    deleteItem(list, id) {
      const i = this.getIndex(list, id)
      if (i >= 0) {
        list.splice(i, 1) // Remove item from list
      }
    },
    getGrit (level) {
      if (level || this.level <= 1) return 0
      if (level || this.level <= 2) return 1
      if (level || this.level <= 4) return 2
      return 3
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
    reset (data = {}) {
      this.items = data.items || []
      this.items.canDrop = this.canDrop // Export drop testing method
    },
    serialize () {
      const tmp = []
      for (let i = 0; i < this.items.length; i++) {
        if (this.canDrop(this.items[i], tmp)) {
          tmp.push({...this.items[i]})
        }
      }
      this.items = tmp
      return {
        items: this.items
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
