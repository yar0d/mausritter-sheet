<template>
  <w-dialog ref="mouse-creation-dialog" v-model="show" :title="title" persistent :width="700">
    <slot name="content">
      <div class="pa4 mouse-creation-dialog-background">
        <div v-if="maxStr !== maxDex || maxStr !== maxWil">
          <w-divider color="white" class="title3 w-max">
            {{ $t('You may then swap any two attributes.') }}
          </w-divider>
          <div class="w-max text-center title1 my1">
            {{ $t("STR") }} {{ maxStr }} | {{ $t("DEX") }} {{ maxDex }} | {{ $t("WIL") }} {{ maxWil }}
          </div>
          <w-radio v-model="swapAttributes" :return-value="SWAP_NONE" class="mr2">
            {{ $t("No swap.") }}
          </w-radio>
          <w-radio v-model="swapAttributes" :return-value="SWAP_STR_DEX" class="mr2">
            {{ $t("STR ⇄ DEX") }}
          </w-radio>
          <w-radio v-model="swapAttributes" :return-value="SWAP_STR_WIL" class="mr2">
            {{ $t("STR ⇄ WIL") }}
          </w-radio>
          <w-radio v-model="swapAttributes" :return-value="SWAP_DEX_WIL">
            {{ $t("DEX ⇄ WIL") }}
          </w-radio>
        </div>

        <div v-if="backgroundItems" class="mt8 w-max">
          <w-divider color="white" class="title3">
            {{ $t('Item from inherited your background of “{background}”', { background }) }}
          </w-divider>
          <items v-for="(item, index) in backgroundItems" :key="index" :item="item" readonly class="mx4" size="md" />
        </div>

        <div v-if="weaponsItems" class="mt8 w-max">
          <w-divider color="white" class="title3">{{ $t('You may choose a weapon below:') }}</w-divider>
          <w-radios v-model="choosenWeapon" :items="weaponsItems" inline>
            <template #item="{ item }">
              <items :item="item.item" readonly class="mr4 mb4" size="sm" />
            </template>
          </w-radios>
        </div>

        <div v-if="chooseItems.length" class="mt8 w-max">
          <w-divider color="white" class="title3">{{ $t('You can take one item below:') }}</w-divider>
          <w-radios v-model="choosenItem" :items="chooseItems" inline>
            <template #item="{ item }">
              <items :item="item.item" readonly class="mr8" size="md" />
            </template>
          </w-radios>
        </div>

        <div v-if="hirelings && hirelings.length" class="mt8 w-max">
          <w-divider color="white" class="title3">{{ $t('Hirelings') }}</w-divider>
          TODO: {{ hirelings }}
        </div>
      </div>
    </slot>

    <template #actions>
      <div class="spacer" />
      <w-button @click="agree" bg-color="success">
        {{ $t('OK') }}
      </w-button>
    </template>
  </w-dialog>
</template>

<script>
import { SWAP_NONE, SWAP_STR_DEX, SWAP_STR_WIL, SWAP_DEX_WIL } from '@/services/mouse.js'
import { getItemsForFamilies, ITEM_FAMILY_WEAPONS } from '@/services/items-conditions'
import Items from '../Items.vue'

export default {
  name: 'MouseCreationDialog',
  components: { Items },
  props: {
    background: { type: String, required: true },
    backgroundItems: { type: Array, required: true },
    chooseItems: { type: Array, required: true },
    hirelings: { type: Array, required: false },
    maxDex: { type: Number, required: true },
    maxStr: { type: Number, required: true },
    maxWil: { type: Number, required: true }
  },
  data() {
    return {
      SWAP_NONE,
      SWAP_STR_DEX,
      SWAP_STR_WIL,
      SWAP_DEX_WIL,
      choosenItem: 0,
      choosenWeapon: 0,
      reject: null,
      resolve: null,
      show: false,
      swapAttributes: 0,
      title: ''
    }
  },
  computed: {
    weaponsItems () {
      const list = getItemsForFamilies(ITEM_FAMILY_WEAPONS)
      for (let i = 0; i < list.length; i++) {
        list[i] = { id: i, item: list[i] } // use un internal id for choice
      }
      return list
    }
  },
  methods: {
    agree () {
      this.resolve({
        swapAttributes: this.swapAttributes,
        choosenItem: this.chooseItems.length > 0 ? this.chooseItems[this.choosenItem].item : null,
        choosenWeapon: this.weaponsItems[this.choosenWeapon].item
      })
      this.show = false
    },
    open (name) {
      this.title = this.$t('“{name}” prepares for adventure...', { name })
      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    }
  }
}
</script>
