<template>
  <div class="scrollable h-max">
    current: {{ current }}
    <w-card class="w-max pa2 mb1" column justify-space-between>
      <w-flex row align-end class="mt1">
        <div class="title3">{{ $t(current.desc) }}</div>
        <w-input v-model="current.name" :label="$t('Name')" class="mx2 title3 input-value" />
        <w-input v-model="current.look" :label="$t('Look')" />
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
                  <checker :faces="20" :context="$t('STR save')" :score="current.currentStr" size="lg" />
                </div>
                <div class="w-150 ml2">
                  <w-input v-model.number="current.maxStr" class="title1" color="minor" />
                </div>
                <div class="w-150 divider-v">
                  <w-input v-model.number="current.currentStr" class="title1 primary" />
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
                  <checker :faces="20" :context="$t('DEX save')" :score="current.currentDex" size="lg" />
                </div>
                <div class="w-150 ml2">
                  <w-input v-model.number="current.maxDex" class="title1" color="minor" />
                </div>
                <div class="w-150 divider-v">
                  <w-input v-model.number="current.currentDex" class="title1 primary" />
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
                  <checker :faces="20" :context="$t('WIL save')" :score="current.currentWil" size="lg" />
                </div>
                <div class="w-150 ml2">
                  <w-input v-model.number="current.maxWil" class="title1" color="minor" />
                </div>
                <div class="w-150 divider-v">
                  <w-input v-model.number="current.currentWil" class="title1 primary" />
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
                  <w-input v-model.number="current.maxHP" class="title1" color="minor" />
                </div>
                <div class="w-150 divider-v">
                  <w-input v-model.number="current.currentHP" class="title1 primary" />
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
          <hirelings-inventory ref="hireling-inventory" />
        </div>
      </w-flex>
    </w-card>
  </div>
</template>

<script>
import Checker from './Checker.vue'
import HirelingsInventory from './HirelingsInventory.vue'

const DEFAULT = {
  currentDex: 0,
  currentHP: 0,
  currentStr: 0,
  currentWil: 0,
  desc: '',
  level: 1,
  look: '',
  maxDex: 0,
  maxHP: 0,
  maxStr: 0,
  maxWil: 0,
  name: '',
  xp: 0
}

export default {
  components: { Checker, HirelingsInventory },
  name: 'Hirelings',
  props: {
    hireling: { type: Object, required: true }
  },
  data () {
    return {
      current: { ...DEFAULT }
    }
  },
  watch: {
    hireling: {
      immediate: true,
      deep: true,
      handler (newVal, oldVal) {
        console.log('##[watch] hireling', newVal, oldVal)
        if (newVal) {
          console.log('##[watch] hireling -> setData', newVal)
          this.setData(newVal)
        }
      }
    }
  },
  methods: {
    reset (data = {}) {
      this.current = { ...DEFAULT, ...data }
    },
    setData (data) {
      this.reset(data.sheet)
      console.log('##[hireling] setData inventory:', data.inventory)
      if (this.$refs['hireling-inventory']) this.$refs['hireling-inventory'].setData(data.inventory)
    },
    serialize () {
      return {
        sheet: {
          currentDex: this.current.currentDex,
          currentHP: this.current.currentHP,
          currentStr: this.current.currentStr,
          currentWil: this.current.currentWil,
          desc: this.current.desc,
          level: this.current.level,
          look: this.current.look,
          maxDex: this.current.maxDex,
          maxHP: this.current.maxHP,
          maxStr: this.current.maxStr,
          maxWil: this.current.maxWil,
          name: this.current.name,
          xp: this.current.xp
        },
        inventory: this.$refs['hireling-inventory'].serialize()
      }
    }
  }
}
</script>
