<template>
  <w-flex row justify-center class="mx4 mt2">
    <div class="inventory-cell">
      <draggable :list="mainPaw" group="items" item-key="id" class="h-max" :move="move">
        <template #header><span class="inventory-cell-label">{{ $t('Main paw') }}</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :condition="element" can-delete @delete="deleteItem(mainPaw, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(mainPaw)" can-delete show-use show-damage :item="element" @delete="deleteItem(mainPaw, element.id)" />
        </template>
      </draggable>
    </div>

    <div class="inventory-cell ml4">
      <draggable :list="body1" group="items" item-key="id" class="h-max" :move="move">
        <template #header><span class="inventory-cell-label">{{ $t('Body') }}</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :condition="element" can-delete @delete="deleteItem(body1, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(body1)" can-delete show-use show-damage :item="element" @delete="deleteItem(body1, element.id)" />
        </template>
      </draggable>
    </div>

    <div class="inventory-cell ml4">
      <draggable :list="pack1" group="items" item-key="id" class="h-max" :move="move">
        <template #header><span class="inventory-cell-label">1</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :condition="element" can-delete @delete="deleteItem(pack1, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(pack1)" can-delete show-use show-damage :item="element" @delete="deleteItem(pack1, element.id)" />
        </template>
      </draggable>
    </div>
    <div class="inventory-cell">
      <draggable :list="pack2" group="items" item-key="id" class="h-max" :move="move">
        <template #header><span class="inventory-cell-label">2</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :condition="element" can-delete @delete="deleteItem(pack2, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(pack2)" can-delete show-use show-damage :item="element" @delete="deleteItem(pack2, element.id)" />
        </template>
      </draggable>
    </div>
    <div class="inventory-cell">
      <draggable :list="pack3" group="items" item-key="id" class="h-max" :move="move">
        <template #header><span class="inventory-cell-label">3</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :condition="element" can-delete @delete="deleteItem(pack3, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(pack3)" can-delete show-use show-damage :item="element" @delete="deleteItem(pack3, element.id)" />
        </template>
      </draggable>
    </div>
  </w-flex>

  <w-flex row justify-center class="mx4">
    <div class="inventory-cell">
      <draggable :list="offPaw" group="items" item-key="id" class="h-max" :move="move">
        <template #header><span class="inventory-cell-label">{{ $t('Off paw') }}</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :condition="element" can-delete @delete="deleteItem(offPaw, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(offPaw)" can-delete show-use show-damage :item="element" @delete="deleteItem(offPaw, element.id)" />
        </template>
      </draggable>
    </div>

    <div class="inventory-cell ml4">
      <draggable :list="body2" group="items" item-key="id" class="h-max" :move="move">
        <template #header><span class="inventory-cell-label">{{ $t('Body') }}</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :condition="element" can-delete @delete="deleteItem(body2, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(body2)" can-delete show-use show-damage :item="element" @delete="deleteItem(body2, element.id)" />
        </template>
      </draggable>
    </div>

    <div class="inventory-cell ml4">
      <draggable :list="pack4" group="items" item-key="id" class="h-max" :move="move">
        <template #header><span class="inventory-cell-label">4</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :condition="element" can-delete @delete="deleteItem(pack4, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(pack4)" can-delete show-use show-damage :item="element" @delete="deleteItem(pack4, element.id)" />
        </template>
      </draggable>
    </div>
    <div class="inventory-cell">
      <draggable :list="pack5" group="items" item-key="id" class="h-max" :move="move">
        <template #header><span class="inventory-cell-label">5</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :condition="element" can-delete @delete="deleteItem(pack5, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(pack5)" can-delete show-use show-damage :item="element" @delete="deleteItem(pack5, element.id)" />
        </template>
      </draggable>
    </div>
    <div class="inventory-cell">
      <draggable :list="pack6" group="items" item-key="id" class="h-max" :move="move">
        <template #header><span class="inventory-cell-label">6</span></template>
        <template #item="{ element }">
          <conditions v-if="element.type === TYPE_CONDITION" size="xl" :condition="element" can-delete @delete="deleteItem(pack6, element.id)" />
          <items v-else-if="element.type === TYPE_ITEM && !existCondition(pack6)" can-delete show-use show-damage :item="element" @delete="deleteItem(pack6, element.id)" />
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
      pack6: []
    }
  },
  methods: {
    selfList (list) {
      return list === this.body1 || list === this.body2 || list === this.mainPaw || list === this.offPaw || list === this.pack1 || list === this.pack2 || list === this.pack3 || list === this.pack4 || list === this.pack5 || list === this.pack6
    },
    canDrop (element, list) {
      if (list && list.canDrop && !this.selfList(list)) {
        return list.canDrop(element, list)
      }

      // Rules to disallow to drop from drawer:
      // - Forbiden to drop anything if a condition already exists in target
      // - Forbiden to drop a condition if target already contains one
      // - Forbiden to drop an item if target already contains one
      if (!list || !list.length) return true // empty list, we can drop
      let i = 0
      let abort = false
      while (!abort && i < list.length) {
        if (list[i].type === element.type) abort = true
        i++
      }
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
        if (list[i].type === TYPE_CONDITION) found = true
        i++
      }
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
      if (e.relatedContext.list && e.relatedContext.list.canDrop) return this.canDrop(e.draggedContext.element, e.relatedContext.list)

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
      }  return !abort
    },
    reset (data = {}) {
      this.body1 = data.body1 || []
      this.body2 = data.body2 || []
      this.mainPaw = data.mainPaw || []
      this.offPaw = data.offPaw || []
      this.pack1 = data.pack1 || []
      this.pack2 = data.pack2 || []
      this.pack3 = data.pack3 || []
      this.pack4 = data.pack4 || []
      this.pack5 = data.pack5 || []
      this.pack6 = data.pack6 || []
      // Export drop testing method
      this.mainPaw.canDrop = this.canDrop
      this.offPaw.canDrop = this.canDrop
      this.body1.canDrop = this.canDrop
      this.body2.canDrop = this.canDrop
      this.pack1.canDrop = this.canDrop
      this.pack2.canDrop = this.canDrop
      this.pack3.canDrop = this.canDrop
      this.pack4.canDrop = this.canDrop
      this.pack5.canDrop = this.canDrop
      this.pack6.canDrop = this.canDrop
    },
    serialize () {
      return {
        body1: this.body1,
        body2: this.body2,
        mainPaw: this.mainPaw,
        offPaw: this.offPaw,
        pack1: this.pack1,
        pack2: this.pack2,
        pack3: this.pack3,
        pack4: this.pack4,
        pack5: this.pack5,
        pack6: this.pack6
      }
    },
    setData (data) {
      this.reset(data)
    },
    putItem (itemId, inventoryId, { customLabel, desc } = {}) {
      if (inventoryId === '?') {
        // Search for am empty slot
        if (this.pack1.length === 0) inventoryId = 'pack1'
        else if (this.pack2.length === 0) inventoryId = 'pack2'
        else if (this.pack3.length === 0) inventoryId = 'pack3'
        else if (this.mainPaw.length === 0) inventoryId = 'mainPaw'
        else if (this.body1.length === 0) inventoryId = 'body1'
        else if (this.pack4.length === 0) inventoryId = 'pack4'
        else if (this.pack5.length === 0) inventoryId = 'pack5'
        else if (this.pack6.length === 0) inventoryId = 'pack6'
        else if (this.offPaw.length === 0) inventoryId = 'offPaw'
        else if (this.body2.length === 0) inventoryId = 'body2'
      }

      if (!itemId || !inventoryId) return false

      const item = getItem(itemId)
      if (!INVENTORY_ID.includes(inventoryId)) {
        console.error('[error] inventory putItem, unknown slot:', inventoryId)
        return false
      }
      if (!item && this.canDrop(item, this.$data[inventoryId])) {
        console.error('[error] inventory putItem, item not found:', itemId)
        return false
      }
      if (!this.canDrop(item, this.$data[inventoryId])) {
        console.error('[error] inventory putItem, cannot drop in:', inventoryId, item, this.$data[inventoryId])
        return false
      }

      if (customLabel) item.customLabel = this.$t(customLabel)
      if (desc) item.desc = desc
      this.$data[inventoryId].push({ ...item }) // Clone item in inventory
      return true
    }
  },
  created () {
    this.reset()
  }
}
</script>