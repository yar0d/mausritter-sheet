<template>
  <div class="scrollable h-max">
    <w-card v-for="(h, index) in hirelings" :key="index" class="w-max pa2 mb1" column justify-space-between>
      <w-flex row align-end class="mt1">
        <div class="title3">{{ $t(h.desc) }}</div>
        <w-input v-model="h.name" :label="$t('Name')" class="mx2 title3 input-value" />
        <w-input v-model="h.look" :label="$t('Look')" />
      </w-flex>

      <w-flex row class="w-max mt1">
        <div>
          <w-flex row justify-center class="text-center">
            <div class="xs10">
              <w-flex row>
                <div class="w-max" />
                <div class="w-50" />
                <div class="w-150">
                  <span class="caption black">{{ $t('Max') }}</span>
                </div>
                <div class="w-150">
                  <span class="caption black">{{ $t('Current') }}</span>
                </div>
              </w-flex>
            </div>
          </w-flex>

          <w-flex row justify-center>
            <w-card bg-color="white" class="xs10 card-sheet">
              <w-flex row align-center class="text-center">
                <div class="w-max form-gray input-name title2 attribute-cell">
                  {{ $t('STR') }}
                </div>
                <div class="w-50">
                  <checker :faces="20" :context="$t('STR save')" :score="h.currentStr" size="lg" />
                </div>
                <div class="w-150 ml2">
                  <w-input v-model.number="h.maxStr" class="title1" color="minor" />
                </div>
                <div class="w-150 divider-v">
                  <w-input v-model.number="h.currentStr" class="title1 primary" />
                </div>
              </w-flex>

              <w-flex row>
                <div class="divider-h" />
              </w-flex>

              <w-flex row align-center class="text-center">
                <div class="w-max form-gray input-name title2 attribute-cell">
                  {{ $t('DEX') }}
                </div>
                <div class="w-50">
                  <checker :faces="20" :context="$t('DEX save')" :score="h.currentDex" size="lg" />
                </div>
                <div class="w-150 ml2">
                  <w-input v-model.number="h.maxDex" class="title1" color="minor" />
                </div>
                <div class="w-150 divider-v">
                  <w-input v-model.number="h.currentDex" class="title1 primary" />
                </div>
              </w-flex>

              <w-flex row>
                <div class="divider-h" />
              </w-flex>

              <w-flex row align-center class="text-center">
                <div class="w-max form-gray input-name title2 attribute-cell">
                  {{ $t('WIL') }}
                </div>
                <div class="w-50">
                  <checker :faces="20" :context="$t('WIL save')" :score="h.currentWil" size="lg" />
                </div>
                <div class="w-150 ml2">
                  <w-input v-model.number="h.maxWil" class="title1" color="minor" />
                </div>
                <div class="w-150 divider-v">
                  <w-input v-model.number="h.currentWil" class="title1 primary" />
                </div>
              </w-flex>
            </w-card>
          </w-flex>

          <w-flex row justify-center class="mt4">
            <w-card bg-color="white" class="xs10 card-sheet">
              <w-flex row align-center class="text-center">
                <div class="w-max form-gray input-name title2">
                  {{ $t('HP') }}
                </div>
                <div class="w-150 ml2">
                  <w-input v-model.number="h.maxHP" class="title1" color="minor" />
                </div>
                <div class="w-150 divider-v">
                  <w-input v-model.number="h.currentHP" class="title1 primary" />
                </div>
                <div class="w-50" />
              </w-flex>
            </w-card>
          </w-flex>

          <w-flex row justify-start class="text-center">
            <div class="xs10">
              <w-flex row>
                <div class="w-max" />
                <div class="w-50" />
                <div class="w-150">
                  <span class="caption black">{{ $t('Max') }}</span>
                </div>
                <div class="w-150">
                  <span class="caption black">{{ $t('Current') }}</span>
                </div>
              </w-flex>
            </div>
          </w-flex>
        </div>

        <div>
          <hirelings-inventory ref="hirelings-indentory" />
        </div>
      </w-flex>
    </w-card>
  </div>
</template>

<script>
import { hirelingsList } from '@/services/hirelings'

console.log('##hirelingsList', hirelingsList)

import Checker from './Checker.vue'
import HirelingsInventory from './HirelingsInventory.vue'

export default {
  components: { Checker, HirelingsInventory },
  name: 'Hirelings',
  props: {
    value: { type: Boolean, default: false }
  },
  data () { return {} },
  computed: {
      hirelings () { return this.$store.getters['hirelings'] }
  },
  methods: {}
}
</script>
