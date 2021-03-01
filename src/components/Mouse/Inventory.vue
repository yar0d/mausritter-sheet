<template>
  <w-flex row justify-center class="mx4 mt2">
    <div class="inventory-cell">
      <draggable :list="mainPaw" group="items" item-key="id" class="h-max" @change="log" :move="move">
        <template #header><span class="inventory-cell-label">{{ $t('Main paw') }}</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(mainPaw, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM" can-delete :item="element" @delete="deleteItem(mainPaw, element.id)" />
        </template>
      </draggable>
    </div>

    <div class="inventory-cell ml4">
      <draggable :list="body1" group="items" item-key="id" class="h-max" @change="log" :move="move">
        <template #header><span class="inventory-cell-label">{{ $t('Body') }}</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(body1, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM" can-delete :item="element" @delete="deleteItem(body1, element.id)" />
        </template>
      </draggable>
    </div>

    <div class="inventory-cell ml4">
      <draggable :list="pack1" group="items" item-key="id" class="h-max" @change="log" :move="move">
        <template #header><span class="inventory-cell-label">1</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(pack1, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(pack1)" can-delete :item="element" @delete="deleteItem(pack1, element.id)" />
        </template>
      </draggable>
    </div>
    <div class="inventory-cell">
      <draggable :list="pack2" group="items" item-key="id" class="h-max" @change="log" :move="move">
        <template #header><span class="inventory-cell-label">2</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(pack2, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM" can-delete :item="element" @delete="deleteItem(pack2, element.id)" />
        </template>
      </draggable>
    </div>
    <div class="inventory-cell">
      <draggable :list="pack3" group="items" item-key="id" class="h-max" @change="log" :move="move">
        <template #header><span class="inventory-cell-label">3</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(pack3, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM" can-delete :item="element" @delete="deleteItem(pack3, element.id)" />
        </template>
      </draggable>
    </div>
  </w-flex>

  <w-flex row justify-center class="mx4">
    <div class="inventory-cell">
      <draggable :list="offPaw" group="items" item-key="id" class="h-max" @change="log" :move="move">
        <template #header><span class="inventory-cell-label">{{ $t('Off paw') }}</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(offPaw, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM" can-delete :item="element" @delete="deleteItem(offPaw, element.id)" />
        </template>
      </draggable>
    </div>

    <div class="inventory-cell ml4">
      <draggable :list="body2" group="items" item-key="id" class="h-max" @change="log" :move="move">
        <template #header><span class="inventory-cell-label">{{ $t('Body') }}</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(body2, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM" can-delete :item="element" @delete="deleteItem(body2, element.id)" />
        </template>
      </draggable>
    </div>

    <div class="inventory-cell ml4">
      <draggable :list="pack4" group="items" item-key="id" class="h-max" @change="log" :move="move">
        <template #header><span class="inventory-cell-label">4</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(pack4, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM" can-delete :item="element" @delete="deleteItem(pack4, element.id)" />
        </template>
      </draggable>
    </div>
    <div class="inventory-cell">
      <draggable :list="pack5" group="items" item-key="id" class="h-max" @change="log" :move="move">
        <template #header><span class="inventory-cell-label">5</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(pack5, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM" can-delete :item="element" @delete="deleteItem(pack5, element.id)" />
        </template>
      </draggable>
    </div>
    <div class="inventory-cell">
      <draggable :list="pack6" group="items" item-key="id" class="h-max" @change="log" :move="move">
        <template #header><span class="inventory-cell-label">6</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" can-delete @delete="deleteItem(pack6, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM" can-delete :item="element" @delete="deleteItem(pack6, element.id)" />
        </template>
      </draggable>
    </div>
  </w-flex>
  <w-flex row justify-center class="caption text-center mx4">
    <div>{{ $t('Carried: Ready to use.') }}</div>
    <div class="mx4">{{ $t('Worn: Quick to ready.') }}</div>
    <div>{{ $t('Pack: Takes time to ready. During combat, requires an action to retrieve.') }}</div>
  </w-flex>
</template>

<script>
import draggable from "vuedraggable"
import { TYPE_CONDITION, TYPE_ITEM, getItem } from "@/services/items-conditions"
import Conditions from "../Conditions.vue"
import Items from "../Items.vue"

const INVENTORY_ID = [ 'body1', 'body2', 'mainPaw', 'offPaw', 'pack1', 'pack2', 'pack3', 'pack4', 'pack5', 'pack6' ]

export default {
  name: "Inventory",
  components: { Conditions, draggable, Items },
  data() {
    return {
      TYPE_CONDITION,
      TYPE_ITEM,
      body1: [],
      body2: [],
      mainPaw: [],
      offPaw: [],
      pack1: [],
      pack2: [],
      pack3: [],
      pack4: [],
      pack5: [],
      pack6: [],
    }
  },
  methods: {
    canDrop (element, list) {
      // Rules to disallow to drop from drawer:
      // - Forbiden to drop anything if a condition already exists in target
      // - Forbiden to drop a condition if target already contains one
      // - Forbiden to drop an item if target already contains one
      if (!list || !list.length) return true // empty list, we can drop
      let i = 0
      let abort = false
      while (!abort && i < list.length) {
        // if (list[i].type === element.type) console.log('##canDrop REFUSED (type already in target):', element)
        // if (list[i].type === TYPE_CONDITION) console.log('##canDrop REFUSED (condition already in target):', element)
        // if (list[i].type === element.type || list.type === TYPE_CONDITION) abort = true
        if (list[i].type === element.type) abort = true
        i++
      }

      console.log('##[inventory] canDrop element:', element)
      console.log('##[inventory] canDrop list:', list.canDrop, list)
      console.log('##[inventory] canDrop result:', abort ? 'REFUSED!' : 'accepted')
      if (abort) return false // same type of item is in target or a condition is already in target
      return true
    },
    deleteItem(list, id) {
      const i = this.getIndex(list, id)
      if (i >= 0) {
        list.splice(i, 1) // Remove item from list
      }
    },
    existCondition (list) {
      let i = 0
      let found = false
      while (!found && i < list.length) {
        console.log('##[inventory] existCondition', list[i], list[i].type === TYPE_CONDITION)
        if (list[i].type === TYPE_CONDITION) found = true
        i++
      }
      console.log('##[inventory] existCondition', found, list)
      return found
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
      // Rules for internal moves:
      // Forbiden to drop anything if a condition already exists in target
      // Forbiden to drop a condition if target already contains one
      // Forbiden to drop an item if target is not empty
      if (!e.relatedContext.list || !e.relatedContext.list.length) return true // empty list, we can drop
      if (e.draggedContext.element.type === TYPE_ITEM) return false // item can drop on empty location only

      let i = 0
      let abort = false
      while (!abort && i < e.relatedContext.list.length) {
        if (e.relatedContext.list[i].type === e.draggedContext.element.type || e.relatedContext.list.type === TYPE_CONDITION) abort = true
        i++
      }

      return !abort
    },
    log(e) {
      console.log("##[inventory]", e)
    },
    reset () {
      this.body1 = []
      this.body2 = []
      this.mainPaw = []
      this.offPaw = []
      this.pack1 = []
      this.pack2 = []
      this.pack3 = []
      this.pack4 = []
      this.pack5 = []
      this.pack6 = []
    },
    putItem (itemId, inventoryId, { label, desc } = {}) {
      if (!itemId || !inventoryId) return false
      console.log('##[inventory] putItem:', itemId, inventoryId, label, desc)

      const item = getItem(itemId)
      console.log('##[inventory] putItem:', item)
      if (INVENTORY_ID.includes(inventoryId) && item && this.canDrop(item, this.$data[inventoryId])) {
        this.$data[inventoryId].push({ ...item, customLabel: (label ? this.$t(label) : ''), desc: (desc ? this.$t(desc) : '') }) // Clone item in inventory
        console.log('##[inventory] putItem: added!')
        return true
      }
      return false
    }
  }
}
</script>