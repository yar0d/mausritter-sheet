<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <w-drawer :value="value" top no-overlay>
    <w-tabs :items="2" fill-bar class="w-max drawer-background">
      <template #item-title.1>
        {{ $t('Items') }}
      </template>
      <template #item-content.1>
        <draggable v-model="itemsList" :group="{ name: 'items', pull: 'clone', put: false }" :sort="false" item-key="id" @change="log" :move="move" :clone="clone">
          <template #item="{ element }">
            <items :item="element" size="sm" class="ma1 draggable drawer" readonly></items>
          </template>
        </draggable>
      </template>
      <template #item-title.2>
        {{ $t('Conditions') }}
      </template>
      <template #item-content.2>
        <draggable v-model="conditionsList" :group="{ name: 'items', pull: 'clone', put: false }" :sort="false" item-key="id" @change="log" :move="move" :clone="clone">
          <template #item="{ element }">
            <conditions :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" class="ma1 draggable drawer" size="lgkl" />
          </template>
        </draggable>
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
      if (list.canDrop) {
        return list.canDrop(element, list)
      }

      return true
    },
    clone (o) {
      return { ...o }
    },
    log (e) {
      console.log('##[drawer]', e)
    },
    move (e) {
      return this.canDrop(e.draggedContext.element, e.relatedContext.list)
    }
  }
}
</script>
