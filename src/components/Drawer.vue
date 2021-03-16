<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <w-drawer id="drawer" :value="value" top no-overlay>
    <w-tabs :items="2" fill-bar class="w-max drawer-background">
      <template #item-title.1>
        {{ $t('Items') }}
      </template>
      <template #item-content.1>
        <div class="bank-drawer-items">
          <draggable v-model="itemsList" :group="{ name: 'items', pull: 'clone', put: false }" :sort="false" item-key="id" :move="move" :clone="clone">
            <template #item="{ element }">
              <items :item="element" size="sm" class="ma1 draggable drawer" readonly show-damage></items>
            </template>
          </draggable>
        </div>
      </template>
      <template #item-title.2>
        {{ $t('Conditions') }}
      </template>
      <template #item-content.2>
        <div class="bank-drawer-items">
          <draggable v-model="conditionsList" :group="{ name: 'items', pull: 'clone', put: false }" :sort="false" item-key="id" :move="move" :clone="clone">
            <template #item="{ element }">
              <conditions :condition="element" class="ma1 draggable drawer" readonly size="lg" />
            </template>
          </draggable>
        </div>
      </template>
    </w-tabs>
  </w-drawer>
</template>

<script>
import draggable from 'vuedraggable'
import { conditionsList, itemsList } from '@/services/items-conditions'
import Conditions from '@/components/Conditions.vue'
import Items from '@/components/Items.vue'

export default {
  name: 'Drawer',
  components: { Conditions, draggable, Items },
  props: {
    value: { type: Boolean, default: false }
  },
  data() {
    return {
      conditionsList,
      itemsList
    }
  },
  methods: {
    canDrop (element, list) {
      if (list && list.canDrop) {
        return list.canDrop(element, list)
      }

      return true
    },
    clone (o) {
      return { ...o }
    },
    move (e) {
      return this.canDrop(e.draggedContext.element, e.relatedContext.list)
    }
  }
}
</script>
