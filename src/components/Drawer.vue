<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <w-drawer id="drawer" :value="value" top no-overlay>
    <w-tabs :items="2" fill-bar class="w-max drawer-background">
      <template #item-title.1>
        <span class="white title3">{{ $t('Items') }}</span>
      </template>
      <template #item-content.1>
        <div class="bank-drawer-items">
          <draggable v-model="currentItemsList" :group="{ name: 'items', pull: 'clone', put: false }" :sort="false" item-key="id" :move="move" :clone="clone">
            <template #item="{ element }">
              <items :item="element" size="sm" class="ma1 draggable drawer" :can-delete="element.isCustom" readonly show-damage @delete="deleteItem(element)" />
            </template>
          </draggable>
        </div>

        <w-button class="mx2" :bg-color="itemsPage === -1 ? 'info' : ''" @click="itemsPage = -1">
          {{ $t('Rules') }}
        </w-button>
        <w-button v-for="(page, index) in itemsListCustom" :key="`items-page-${index}`" class="mr2" :bg-color="itemsPage === index ? 'info' : ''" @click="itemsPage = index">
        {{ page.name }}
        </w-button>

        <w-button :disabled="itemsPage === -1" class="px6 ml4" @click="loadFiles">
          {{ $t('Add items...') }}
        </w-button>
      </template>

      <template #item-title.2>
        <span class="white title3">{{ $t('Conditions') }}</span>
      </template>
      <template #item-content.2>
        <div class="bank-drawer-items">
          <draggable v-model="currentConditionsList" :group="{ name: 'items', pull: 'clone', put: false }" :sort="false" item-key="id" :move="move" :clone="clone">
            <template #item="{ element }">
              <conditions :condition="element" class="ma1 draggable drawer" :can-delete="element.isCustom" readonly size="lg" @delete="deleteItem(element)" />
            </template>
          </draggable>
        </div>

        <w-button class="mx2" :bg-color="conditionsPage === -1 ? 'warning' : ''" @click="conditionsPage = -1">
          {{ $t('Rules') }}
        </w-button>
        <w-button v-for="(page, index) in itemsListCustom" :key="`conditions-page-${index}`" class="mr2" :bg-color="conditionsPage === index ? 'warning' : ''" @click="conditionsPage = index">
        {{ page.name }}
        </w-button>

        <w-button :disabled="conditionsPage === -1" class="px6 ml4" @click="loadFiles">
          {{ $t('Add conditions...') }}
        </w-button>
      </template>
    </w-tabs>
    <input type="file" ref="fileElem" multiple accept="application/json" style="display:none" @change="handleFiles" />
  </w-drawer>
</template>

<script>
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import draggable from 'vuedraggable'
import { TYPE_CONDITION, conditionsList, itemsList, normalizeCondition, normalizeItem } from '@/services/items-conditions'
import Conditions from '@/components/Conditions.vue'
import Items from '@/components/Items.vue'
import { ITEM_FAMILY_ARMOR_LIGHT, ITEM_FAMILY_MISCELLANEOUS, CONDITION_FAMILY_MISCELLANEOUS } from '@/services/items-conditions'

const MAX_CUSTOM_PAGES = 4

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
    currentConditionsList () {
      return this.conditionsPage === -1 ? this.conditionsList : (this.conditionsListCustom[this.conditionsPage].cards)
    },
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
    deleteItem (item) {
      let index = -1
      if (item.type === TYPE_CONDITION) {
        index = _.findIndex(this.conditionsListCustom[this.conditionsPage].cards, { label: item.label })
      } else {
        index = _.findIndex(this.itemsListCustom[this.itemsPage].cards, { label: item.label })
      }
      console.log('## delete:', item, index)
      if (index >= 0) {
        if (item.type === TYPE_CONDITION) {
          this.conditionsListCustom[this.conditionsPage].cards.splice(index, 1)
        } else {
          this.itemsListCustom[this.itemsPage].cards.splice(index, 1)
        }
      }
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
              if (content?.cardType === 'item') {
                let item = normalizeItem({
                  label: content.name,
                  armour: content.armour,
                  star: content.star,
                  def: content.armour ? content.damage.replace(/def/ig, '') : '',
                  geometry: `${content.width || 1}x${content.height || 1}`,
                  family: content.armour ? ITEM_FAMILY_ARMOR_LIGHT : ITEM_FAMILY_MISCELLANEOUS,
                  damage: content.armour ? '' : content.damage,
                  desc: content.mechanicDetail,
                  summary: content.detailSummary,
                  specifics: content.detailSpecifics,
                  use: parseInt(content.usage) || 0,
                  price: parseFloat(content.price) || 0,
                  isCustom: true
                })
                const found = _.findIndex(this.itemsListCustom[this.itemsPage].cards, { label: item.label })
                if (found >= 0) this.itemsListCustom[this.itemsPage].cards[found] = item
                else this.itemsListCustom[this.itemsPage].cards.push(item)
              } else if (content?.cardType === 'condition') {
                let condition = normalizeCondition({
                  label: content.name,
                  star: content.star,
                  geometry: `${content.width || 1}x${content.height || 1}`,
                  family: CONDITION_FAMILY_MISCELLANEOUS,
                  desc: content.mechanicDetail,
                  summary: content.detailSummary,
                  specifics: content.detailSpecifics,
                  isCustom: true
                })
                const found = _.findIndex(this.conditionsListCustom[this.conditionsPage].cards, { label: condition.label })
                if (found >= 0) this.conditionsListCustom[this.conditionsPage].cards[found] = condition
                else this.conditionsListCustom[this.conditionsPage].cards.push(condition)
              } else {
                console.warn('[drawer] import error, cardType unknown:', content)
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
    },
    serialize () {
      return {
        conditions: this.conditionsListCustom,
        items: this.itemsListCustom
      }
    },
    setData (data) {
      if (!data) {
        this.conditionsListCustom = [...this.createCustom()]
        this.itemsListCustom = [...this.createCustom()]
      } else {
        this.conditionsListCustom = [...data.conditions]
        this.itemsListCustom = [...data.items]
      }
    }
  }
}
</script>
