<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <w-drawer :value="value" top no-overlay>
    <w-tabs :items="2" fill-bar class="w-max">
      <template #item-title.1>
        {{ $t('Items') }}
      </template>
      <template #item-content.1>
        <draggable v-model="itemsList" :group="{ name: 'items', pull: 'clone', put: false }" :sort="false" item-key="id" @change="log" :move="move" :clone="clone">
          <template #item="{ element }">
            <items :id="element.id" :clear="element.clear" :desc="element.desc" :damage="element.damage" :label="element.label" class="ma1 draggable drawer" :img="element.img" hide-use />
          </template>
        </draggable>
      </template>
      <template #item-title.2>
        {{ $t('Conditions') }}
      </template>
      <template #item-content.2>
        <draggable v-model="conditionsList" :group="{ name: 'items', pull: 'clone', put: false }" :sort="false" item-key="id" @change="log" :move="move" :clone="clone">
          <template #item="{ element }">
            <conditions :id="element.id" :clear="element.clear" :desc="element.desc" :label="element.label" class="ma1 draggable drawer" />
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
import Items from '@/components//Items.vue'

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
