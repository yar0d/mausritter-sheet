<template>
  <w-card v-show="grit" bg-color="white" class="mr4" :class="getWidth">
    <w-flex column>
      <w-flex row>
        <div class="w-100 form-gray input-name body">
          {{ $t('Grit') }}
        </div>
        <div class="mx2">
          <span class="title2" readonly>{{ grit }}</span>
        </div>
      </w-flex>
      <w-flex row justify-center>
        <div class="w-max pt2">
          <draggable :list="grits" group="items" item-key="id" class="h-max" @change="log" :move="move">
            <template #item="{ element }">
              <conditions v-if="element.type === TYPE_CONDITION" size="md" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(grits, element.id)" class="inline-block mx2" />
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
      grits: []
    }
  },
  computed: {
    getWidth () {
      switch (this.grit) {
        case 1: return 'grit-1'
        case 2: return 'grit-2'
        case 3: return 'grit-3'
        default: return ''
      }
    },
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
      console.log('##[grit] canDrop:', element.type)
      console.log('##[grit] canDrop:', list.length, this.grit)
      let result = true
      if (element.type !== TYPE_CONDITION) result = false // item is refused
      if (list.length === this.grit) result = false // list is full
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === element.id) result = false // Already in list
      }
      console.log('##[grit] result:', result)
      return result
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
    reset () {
      this.grits = []
    },
    log(e) {
      console.log('##[grit]', e)
    }
  },
  created () {
    this.grits.canDrop = this.canDrop // Export drop testing method
  }
}
</script>
