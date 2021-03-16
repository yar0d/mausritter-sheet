<template>
  <w-card class="mb1 card-sheet-white" column justify-space-between>
    <w-flex column>
      <w-divider class="title3 orange">{{ $t(current.desc) }}</w-divider>
      <w-flex row class="background-white-75 px2 pt4 pb1">
        <w-input v-model="current.name" :label="$t('Name')" class="title2 input-value" />
        <w-divider vertical class="mx2" />
        <w-input v-model="current.look" :label="$t('Look')" class="title3"/>
        <w-divider vertical class="mx2" />
        <w-input v-model.number="current.wages" :label="$t('Wages/day')" class="title3 xs2" />
        <div v-if="canDelete">
          <w-tooltip transition="fade" bg-color="yellow-light2" color="black" left>
            <template #activator="{ on }">
              <w-button v-on="on" @click="deleteHireling()" bg-color="red" color="white" class="ml2" icon="mdi mdi-delete" />
            </template>
            {{ $t('Dismiss') }}
          </w-tooltip>
        </div>
      </w-flex>
    </w-flex>

    <w-flex row class=" mt1">
      <w-flex column class="text-left" justify-start align-self-end>
        <div class="xs10">
          <w-flex row>
            <div class="w-max" />
            <div class="w-50" />
            <div class="w-150">
              <span class="caption white">{{ $t('Max') }}</span>
            </div>
            <div class="w-150">
              <span class="caption white">{{ $t('Current') }}</span>
            </div>
          </w-flex>
        </div>

        <div>
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
        </div>

        <div class="mt4">
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
        </div>

        <div class="xs10">
          <w-flex row>
            <div class="w-max" />
            <div class="w-50" />
            <div class="w-150">
              <span class="caption white">{{ $t('Max') }}</span>
            </div>
            <div class="w-150">
              <span class="caption white">{{ $t('Current') }}</span>
            </div>
          </w-flex>
        </div>

        <div class="xs5 mt4">
          <w-card bg-color="white" class="card-sheet">
            <w-flex row align-center class="text-center">
              <div class="w-100 form-gray input-name title2">
                {{ $t('Level') }}
              </div>
              <div class="w-100 divider-v">
                <w-input v-model.number="current.level" class="title1 primary" />
              </div>
            </w-flex>
          </w-card>
        </div>

        <div class="xs5 mt4">
          <w-card bg-color="white" class="card-sheet">
            <w-flex row align-center class="text-center">
              <div class="w-100 form-gray input-name title2">
                {{ $t('XP') }}
              </div>
              <div class="w-150 divider-v">
                <w-input v-model.number="current.xp" class="title3 primary" />
              </div>
            </w-flex>
          </w-card>
        </div>
      </w-flex>

      <div>
        <hirelings-inventory ref="hireling-inventory" />
      </div>
    </w-flex>
  </w-card>
</template>

<script>
import Checker from './Checker.vue'
import HirelingsInventory from './HirelingsInventory.vue'

const DEFAULT = {
  id: null,
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
  wages: 0,
  xp: 0
}

export default {
  components: { Checker, HirelingsInventory },
  name: 'Hirelings',
  emits: [ 'delete' ],
  props: {
    canDelete: { type: Boolean, default: false },
    id: { type: Number, required: true },
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
    deleteHireling () {
      this.$emit('delete', this.id, this.current)
    },
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
          wages: this.current.wages,
          xp: this.current.xp
        },
        inventory: this.$refs['hireling-inventory'].serialize()
      }
    }
  }
}
</script>
