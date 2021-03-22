<template>
  <w-dialog ref="mouse-creation-dialog" v-model="show" :title="title" persistent :fullscreen="isMobileDevice">
    <slot name="content">
      <div class="w-max h-max pa4 mouse-creation-dialog-background">
        <w-flex row align-start justify-space-between class="background-white-25 pa2">
          <div v-if="maxStr !== maxDex || maxStr !== maxWil" class="text-center mb2">
            <div class="yellow title3 w-max">
              {{ $t('You may swap any two attributes.') }}
            </div>
            <div class="w-max text-center title1 my1">
              {{ $t("STR") }} {{ maxStr }} | {{ $t("DEX") }} {{ maxDex }} | {{ $t("WIL") }} {{ maxWil }}
            </div>
            <div class="mt2"><w-radio v-model="swapAttributes" :return-value="SWAP_NONE" class="mr2">
              {{ $t("No swap.") }}
            </w-radio></div>
            <div class="mt2"><w-radio v-show="maxStr !== maxDex" v-model="swapAttributes" :return-value="SWAP_STR_DEX" class="mr2">
              {{ $t("STR ⇄ DEX") }}
            </w-radio></div>
            <div class="mt2"><w-radio v-show="maxStr !== maxWil" v-model="swapAttributes" :return-value="SWAP_STR_WIL" class="mr2">
              {{ $t("STR ⇄ WIL") }}
            </w-radio></div>
            <div class="mt2"><w-radio v-show="maxDex !== maxWil" v-model="swapAttributes" :return-value="SWAP_DEX_WIL">
              {{ $t("DEX ⇄ WIL") }}
            </w-radio></div>
          </div>

          <div v-if="backgroundItems">
            <div class="yellow title3 mb2">
              {{ $t('Item from inherited your background of “{background}”', { background }) }}
            </div>
            <items v-for="(item, index) in backgroundItems" :key="index" :item="item" readonly not-draggable class="mx4" size="md" />
          </div>

          <div v-if="hirelings && hirelings.length">
            <div class="yellow title3 mb2">
              <w-icon xl color="white">mdi mdi-donkey</w-icon> {{ $t('Hirelings') }}
            </div>
            <div v-for="(hireling, index) in hirelings" :key="index" class="title3">
              — {{ $t(hireling.desc) }}
            </div>
          </div>
        </w-flex>

        <w-flex row align-start justify-space-between class="mt4 back-ground-white-25 pa2">
          <div v-if="weaponsItems">
            <w-divider color="white" class="title3">{{ $t('You may choose a weapon below:') }}</w-divider>
            <w-radios v-model="choosenWeapon" :items="weaponsItems" inline class="mt2">
              <template #item="{ item }">
                <items :item="item.item" readonly not-draggable class="mr4 mb4" size="sm" />
              </template>
            </w-radios>
          </div>

          <div v-if="chooseItems.length" class="ml4">
            <w-divider color="white" class="title3">{{ $t('You can take one item below:') }}</w-divider>
            <w-radios v-model="choosenItem" :items="chooseItems" inline class="mt2">
              <template #item="{ item }">
                <items :item="item.item" readonly not-draggable class="mr4 mb4" size="md" />
              </template>
            </w-radios>
          </div>
        </w-flex>
      </div>
    </slot>

    <template #actions>
      <div class="spacer" />
      <w-button @click="agree">
        {{ $t('OK') }}
      </w-button>
    </template>
  </w-dialog>
</template>

<script>
import { isMobileDevice } from '@/services/responsive'
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
      swapAttributes: SWAP_NONE,
      title: ''
    }
  },
  computed: {
    isMobileDevice () { return isMobileDevice(this.$waveui.breakpoint.name) },
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
      this.reset()
      this.title = this.$t('“{name}” prepares for adventure...', { name })
      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    reset () {
      this.choosenItem = 0
      this.choosenWeapon = 0
      this.swapAttributes = SWAP_NONE
    }
  }
}
</script>
