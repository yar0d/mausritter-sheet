<template>
  <w-dialog ref="mouse-creation-dialog" v-model="show" :title="title" persistent :fullscreen="isMobileDevice" width="70%">
    <slot name="content">
      <div class="w-max h-max pa4 mouse-creation-dialog-background">
        <w-flex column align-start justify-space-between class="pa2">
          <w-divider color="white" class="w-max title3">{{ $t('You may swap any two attributes.') }}</w-divider>
          <div v-if="maxStr !== maxDex || maxStr !== maxWil" class="w-max text-center my2">
            <w-flex row class="text-left title1 my1" align-center justify-center>
              <div class="pa2 w-100 text-center" :class="swapAttributes === SWAP_STR_DEX || swapAttributes === SWAP_STR_WIL ? 'background-white-50' : ''">{{ $t("STR") }}
                <div class="pt4">{{ maxStr }}</div>
              </div>
              <div class="pa2 w-100 text-center mx4" :class="swapAttributes === SWAP_STR_DEX || swapAttributes === SWAP_DEX_WIL ? 'background-white-50' : ''">{{ $t("DEX") }}
                <div class="pt4">{{ maxDex }}</div>
              </div>
              <div class="pa2 w-100 text-center" :class="swapAttributes === SWAP_STR_WIL || swapAttributes === SWAP_DEX_WIL ? 'background-white-50' : ''">{{ $t("WIL") }}
                <div class="pt4">{{ maxWil }}</div>
              </div>
            </w-flex>

            <w-flex row align-center :justify-space-between="isMobileDevice">
              <div><w-button @click="swapAttributes = SWAP_NONE" :outline="swapAttributes !== SWAP_NONE" xl>{{ $t("No swap.") }}</w-button></div>
              <div><w-button v-show="maxStr !== maxDex" @click="swapAttributes = SWAP_STR_DEX" :outline="swapAttributes !== SWAP_STR_DEX" xl>{{ $t("STR ⇄ DEX") }}</w-button></div>
              <div><w-button v-show="maxStr !== maxWil" @click="swapAttributes = SWAP_STR_WIL" :outline="swapAttributes !== SWAP_STR_WIL" xl>{{ $t("STR ⇄ WIL") }}</w-button></div>
              <div><w-button v-show="maxDex !== maxWil" @click="swapAttributes = SWAP_DEX_WIL" :outline="swapAttributes !== SWAP_DEX_WIL" xl>{{ $t("DEX ⇄ WIL") }}</w-button></div>
            </w-flex>
          </div>

          <div v-if="backgroundItems" class="w-max">
            <w-flex row justify-space-between>
              <div>
                <w-divider color="white" class="title3 mt4">{{ $t('Item from inherited your background of “{background}”', { background }) }}</w-divider>
                <div class="mt2">
                  <items v-for="(item, index) in backgroundItems" :key="index" :item="item" readonly hide-desc show-damage not-draggable class="mx4" size="lg" />
                </div>
              </div>

              <div v-if="hirelings && hirelings.length">
                <w-divider color="white" class="title3 mt4">{{ $t('Hirelings') }}</w-divider>
                <div v-for="(hireling, index) in hirelings" :key="index" class="background-white-25 title3">
                  — {{ $t(hireling.desc) }}
                </div>
              </div>
            </w-flex>
          </div>
        </w-flex>

        <w-flex row align-start justify-space-between class="mt4 back-ground-white-25 pa2">
          <div v-if="weaponsItems">
            <w-divider color="white" class="title3 mt4">{{ $t('You may choose a weapon below:') }}</w-divider>
            <w-radios v-model="choosenWeapon" :items="weaponsItems" inline class="mt2" >
              <template #item="{ item }">
                <items :item="item.item" readonly not-draggable show-damage class="mr4 mb4" size="lg" />
              </template>
            </w-radios>
          </div>

          <div v-if="chooseItems.length" class="ml4">
            <w-divider color="white" class="title3">{{ $t('You can take one item below:') }}</w-divider>
            <w-radios v-model="choosenItem" :items="chooseItems" inline class="mt2">
              <template #item="{ item }">
                <items :item="item.item" readonly hide-desc not-draggable show-damage class="mr4 mb4" size="lg" />
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
