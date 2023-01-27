<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <w-drawer id="drawer" :value="value" top no-overlay>
    <w-tabs :items="2" fill-bar class="w-max drawer-background">
      <template #item-title.1>
        <span class="white">{{ $t('Items') }}</span>
      </template>
      <template #item-content.1>
        <div class="bank-drawer-items">
          <draggable v-model="currentItemsList" :group="{ name: 'items', pull: 'clone', put: false }" :sort="false" item-key="id" :move="move" :clone="clone">
            <template #item="{ element }">
              <items :item="element" size="sm" class="ma1 draggable drawer" readonly show-damage></items>
            </template>
          </draggable>
        </div>

        <w-button @click="decItemPage" :disabled="!itemsPage" class="mr2">«</w-button>
        <w-button class="mr2" :bg-color="itemsPage === -1 ? 'info' : ''" @click="itemsPage = -1">
          {{ $t('Rules') }}
        </w-button>
        <w-button v-for="(page, index) in itemsListCustom" :key="`items-page-${index}`" class="mr2" :bg-color="itemsPage === index ? 'info' : ''" @click="itemsPage = index">
        {{ page.name }}
        </w-button>
        <w-button @click="incItemPage">»</w-button>

        <input type="file" ref="fileElem" multiple accept="application/json" style="display:none" @change="handleFiles" />
        <w-button :disabled="itemsPage === -1" class="px6 ml4" @click="loadFiles">
          Add items...
        </w-button>
      </template>

      <template #item-title.2>
        <span class="white">{{ $t('Conditions') }}</span>
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
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import draggable from 'vuedraggable'
import { conditionsList, itemsList, normalizeItem } from '@/services/items-conditions'
import Conditions from '@/components/Conditions.vue'
import Items from '@/components/Items.vue'
import { ITEM_FAMILY_ARMOR_LIGHT, ITEM_FAMILY_MISCELLANEOUS } from '@/services/items-conditions'

const MAX_CUSTOM_PAGES = 9

export default {
  name: 'Drawer',
  components: { Conditions, draggable, Items },
  emits: [ 'close' ],
  props: {
    value: { type: Boolean, default: false }
  },
  data() {
    return {
      MAX_CUSTOM_PAGES,
      conditionsPage: -1,
      conditionsList,
      conditionsListCustom: [],
      itemsPage: -1,
      itemsList,
      itemsListCustom: []
    }
  },
  computed: {
    currentItemsList () {
      return this.itemsPage === -1 ? this.itemsList : (this.itemsListCustom[this.itemsPage].cards)
    }
  },
  mounted () {
    this.conditionsListCustom = [...this.createCustom()]
    this.itemsListCustom = [...this.createCustom()]
  },
  methods: {
    canDrop (element, list) {
      if (list && list.canDrop) {
        return list.canDrop(element, list)
      }

      return true
    },
    clone (o) {
      return { ...o, uuid: uuidv4() }
    },
    close () {
      this.$emit('close')
    },
    createCustom () {
      const result = []
      for (let i = 0; i < MAX_CUSTOM_PAGES; i++) {
        result.push({
          name: `${i + 1}`,
          cards: []
        })
      }
      return result
    },
    decItemPage () {
      if (this.itemsPage) this.itemsPage--
    },
    incItemPage () {
      if (this.itemsListCustom[this.itemsPage + 1]) this.itemsPage++
    },
    isValidJsonItem (json) {
    return json && json.name
    },
    handleFiles () {
      if (!this.$refs['fileElem'].files.length) {
        this.$waveui.notify(this.$t('Please select a JSON cards file!'), 'warning')
      } else {
        for (let i = 0; i < this.$refs['fileElem'].files.length; i++) {
          const file = this.$refs['fileElem'].files[i]
          if (!file.type === ('application/json')) { continue }

          const reader = new FileReader()
          reader.onload = (res) => {
            try {
              const content = JSON.parse(res.target.result)
              console.log('[TEST] read', content)
              if (this.isValidJsonItem(content)) {
                let item = normalizeItem({
                  "label": content.name,
                  "armour": content.armour,
                  "star": content.star,
                  "def": content.armour ? content.damage.replace(/def/ig, '') : '',
                  "geometry": `${content.width || 1}x${content.height || 1}`,
                  "family": content.armour ? ITEM_FAMILY_ARMOR_LIGHT : ITEM_FAMILY_MISCELLANEOUS,
                  "damage": content.armour ? '' : content.damage,
                  "desc": content.mechanicDetail,
                  "summary": content.detailSummary,
                  "specifics": content.detailSpecifics,
                  "use": parseInt(content.usage) || 0,
                  "price": parseFloat(content.price) || 0
                })
                console.log(item)
                const found = _.findIndex(this.itemsListCustom[this.itemsPage].cards, { label: item.label })
                if (found >= 0) this.itemsListCustom[this.itemsPage].cards[found] = item
                else this.itemsListCustom[this.itemsPage].cards.push(item)
              }
            } catch (error) {
              console.error(error)
              this.$waveui.notify(`[${file.name}] ${error.name} - ${error.message}`, 'error', 0)
            }
          }
          reader.onerror = (error) => {
            console.error(error)
            this.$waveui.notify(`${error.name} - ${error.message}`, 'error', 0)
          }
          reader.readAsText(file)
        }
      }
    },
    loadFiles () {
      if (this.$refs['fileElem']) {
        this.$refs['fileElem'].click();
      }
    },
    move (e) {
      return this.canDrop(e.draggedContext.element, e.relatedContext.list)
    }
  }
}
</script>
