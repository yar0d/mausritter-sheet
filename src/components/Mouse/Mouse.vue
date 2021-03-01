<template>
  <w-card class="mouse-sheet">
    <w-flex column justify-start class="ma1">
      <w-flex row justify-space-between align-start>
        <w-card bg-color="white">
          <w-flex row align-center>
            <div class="title1 form-gray input-name pt2">
              {{ $t('Name') }}
            </div>
            <div class="grow ml2 py2">
              <w-input v-model="name" class="title1 input-value" />
            </div>
          </w-flex>
          <w-flex row>
            <div class="input-name body mr10">
              {{ $t('Background') }}
            </div>
            <div>
              <w-textarea v-model="background" class="body input-value" rows="1" no-autogrow />
            </div>
          </w-flex>
        </w-card>

        <w-card bg-color="white" class="xs4">
          <birthsign v-model="birthsign" ref="birthsign" @input="setBirthsign" class="pl1" />
          <w-flex row align-center justify-center class="wrapper4">
            <div class="body pr1 pl2">{{ $t('Coat') }}</div>
            <w-flex column align-center justify-center class="wrapper">
              <coat-color ref="coat-color" v-model="coatColor" @input="setCoatColor" />
              <coat-pattern ref="coat-pattern" v-model="coatPattern" @input="setCoatPattern" />
            </w-flex>
          </w-flex>
          <look v-model="look" ref="look" :label="$t('Look')" @input="setLook" class="pl1"/>
        </w-card>
      </w-flex>

      <w-flex row justify-end class="mt4 text-center">
        <div class="xs3">
          <w-flex row>
            <div class="w-100">
            </div>
            <div class="w-150">
              <span class="caption black">{{ $t('Max') }}</span>
            </div>
            <div class="w-150">
              <span class="caption black">{{ $t('Current') }}</span>
            </div>
          </w-flex>
        </div>
      </w-flex>

      <w-flex row justify-end>
        <w-card bg-color="white" class="xs3">
          <w-flex row align-center class="text-center">
            <div class="w-max form-gray input-name title2">
              {{ $t('STR') }}
            </div>
            <div class="w-150 ml2">
              <w-input v-model.number="maxStr" class="title1" color="minor" />
            </div>
            <div class="w-150 divider-v">
              <w-input v-model.number="currentStr" class="title1 primary" />
            </div>
            <div class="w-50">
              <checker :faces="20" :context="$t('STR save')" :score="currentStr" size="lg" @rolled="onCheck" />
            </div>
          </w-flex>
          <w-flex row>
            <div class="divider-h" />
          </w-flex>
          <w-flex row align-center class="text-center">
            <div class="w-max form-gray input-name title2">
              {{ $t('DEX') }}
            </div>
            <div class="w-150 ml2">
              <w-input v-model.number="maxDex" class="title1" color="minor" />
            </div>
            <div class="w-150 divider-v">
              <w-input v-model.number="currentDex" class="title1 primary" />
            </div>
            <div class="w-50">
              <checker :faces="20" :context="$t('DEX save')" :score="currentDex" size="lg" @rolled="onCheck" />
            </div>
          </w-flex>
          <w-flex row>
            <div class="divider-h" />
          </w-flex>
          <w-flex row align-center class="text-center">
            <div class="w-max form-gray input-name title2">
              {{ $t('WIL') }}
            </div>
            <div class="w-150 ml2">
              <w-input v-model.number="maxWil" class="title1" color="minor" />
            </div>
            <div class="w-150 divider-v">
              <w-input v-model.number="currentWil" class="title1 primary" />
            </div>
            <div class="w-50">
              <checker :faces="20" :context="$t('WIL save')" :score="currentWil" size="lg" @rolled="onCheck" />
            </div>
          </w-flex>
        </w-card>
      </w-flex>

      <w-flex row justify-end class="mt4">
        <w-card bg-color="white" class="xs3">
          <w-flex row align-center class="text-center">
            <div class="w-max form-gray input-name title2">
              {{ $t('HP') }}
            </div>
            <div class="w-150 ml2">
              <w-input v-model.number="maxHP" class="title1" color="minor" />
            </div>
            <div class="w-150 divider-v">
              <w-input v-model.number="currentHP" class="title1 primary" />
            </div>
            <div class="w-50" />
          </w-flex>
        </w-card>
      </w-flex>

      <w-flex row justify-end class="text-center">
        <div class="xs3">
          <w-flex row>
            <div class="w-100">
            </div>
            <div class="w-150 mx4">
              <span class="caption black">{{ $t('Max') }}</span>
            </div>
            <div class="w-150">
              <span class="caption black">{{ $t('Current') }}</span>
            </div>
          </w-flex>
        </div>
      </w-flex>

      <w-flex row justify-space-between class="mt4">
        <div class="title1">
          {{ $t('Inventory') }}
        </div>
        <div class="w-250 pips-img">
          <div class="ml6 opacity-50">
            <w-card bg-color="white" class="py0 pr2 pips opacity-100">
              <w-flex row justify-end align-center>
                <div class="input-name">
                  {{ $t('Pips') }}
                </div>
                <div class="ml4 mr1 text-right">
                  <w-input v-model.number="pips" class="title2" />
                </div>
                <div>
                  <span>/250</span>
                </div>
              </w-flex>
            </w-card>
          </div>
        </div>
      </w-flex>

      <inventory ref="inventory" />

      <w-flex row justify-center class="mx4 mt2">
        <w-card bg-color="white" class="xs2 mr4">
          <w-flex column justify-space-between class="h-max">
            <w-flex row>
              <div class="w-100 form-gray input-name body">
                {{ $t('Level') }}
              </div>
              <div class="ml2">
                <w-input v-model.number="level" class="title2" />
              </div>
            </w-flex>
            <w-flex class="h-max text-center">
              <w-input v-model.number="xp" class="title3" />
            </w-flex>
            <div>
              {{ $t('XP') }}
            </div>
          </w-flex>
        </w-card>

        <grit ref="grit" :level="level" />

        <w-card bg-color="white" class="w-auto">
          <w-flex column justify-center>
            {{ $t('Bank') }}
            <div class="inventory-cell" />
            <w-flex row auto>
              <div class="form-gray input-name body">
                {{ $t('Pips') }}
              </div>
              <div class="ml2">
                <w-input v-model="bankedPips" class="title3" />
              </div>
            </w-flex>
          </w-flex>
        </w-card>
      </w-flex>
    </w-flex>
    <confirm-dialog ref="confirm-dialog" />
    <prompt-dialog ref="prompt-dialog">
      <template #content>
        <ol class="py4 pl8">
          <li>{{ $t('You may then swap any two attributes.') }}</li>
          <li>{{ $t('You may choose a weapon from the items drawer') }} <w-icon>mdi mdi-dots-grid</w-icon></li>
        </ol>
      </template>
    </prompt-dialog>
  </w-card>
</template>

<script>
import { d6, d66, rollFromTable, rollExplode } from '@/services/dice-roller'
import { extract as getBackground } from '@/services/backgrounds'
import { TYPE_ITEM } from '@/services/items-conditions'
import Checker from '@/components/Checker.vue'
import Birthsign from './Birthsign.vue'
import CoatColor from './CoatColor.vue'
import CoatPattern from './CoatPattern.vue'
import Inventory from './Inventory.vue'
import Look from './Look.vue'
import Grit from './Grit.vue'
import ConfirmDialog from '../ConfirmDialog.vue'
import PromptDialog from '../PromptDialog.vue'

export default {
  components: { Birthsign, CoatColor, CoatPattern, Inventory, Checker, Look, Grit, ConfirmDialog, PromptDialog },
  data() {
    return {
      name: '',
      background: '',
      bankedPips: 0,
      birthsign: 0,
      coatColor: 0,
      coatPattern: 0,
      currentDex: 0,
      currentHP: 0,
      currentStr: 0,
      currentWil: 0,
      isNew: true,
      level: 1,
      look: 0,
      maxDex: 0,
      maxHP: 0,
      maxStr: 0,
      maxWil: 0,
      pips: 0,
      validators: {
        required: (value) => !!value || "This field is required",
      },
      xp: 0
    }
  },
  methods: {
    createRandomSheet () {
      if (this.isNew) this.rollRandomMouse()
      else this.$refs['confirm-dialog'].open(this.$t('Create a new character'), this.$t('This sheet will be erased. Do you confirm?'))
        .then(confirmed => {
          if (confirmed) this.rollRandomMouse()
        })
    },
    onCheck (e) {
      console.log('##onCheck:', e)
    },
    reset () {
      this.name = ''
      this.background = ''
      this.bankedPips = 0
      this.birthsign = 0
      this.coatColor = 0
      this.coatPattern = 0
      this.currentDex = 0
      this.currentHP = 0
      this.currentStr = 0
      this.currentWil = 0
      this.isNew = true
      this.level = 1
      this.look = 0
      this.maxDex = 0
      this.maxHP = 0
      this.maxStr = 0
      this.maxWil = 0
      this.pips = 0
    },
    rollRandomMouse () {
      this.reset()
      this.maxStr = rollExplode(3, 6, 2).total // Keep two highest D6 from the rollingof 3d6.
      this.currentStr = this.maxStr
      this.maxDex = rollExplode(3, 6, 2).total // Keep two highest D6 from the rollingof 3d6.
      this.currentDex = this.maxDex
      this.maxWil = rollExplode(3, 6, 2).total // Keep two highest D6 from the rollingof 3d6.
      this.currentWil = this.maxWil
      this.maxHP = d6()
      this.pips = d6()
      this.currentHP = this.maxHP
      this.name = rollFromTable(this.$store.getters.names) + ' ' + rollFromTable(this.$store.getters.matrinames)
      this.$refs['birthsign'].setValue(d6())
      this.$refs['coat-color'].setValue(d6())
      this.$refs['coat-pattern'].setValue(d6())
      this.$refs['look'].setValue(d66())
      const b = getBackground(this.maxHP, this.pips)
      console.log('## background:', b)
      this.background = b.label // + ' (' + b.items.join(' + ') + ')'
      this.isNew = false
      this.$refs['inventory'].reset()
      this.$refs['inventory'].putItem(TYPE_ITEM + '-torches', 'pack1')
      this.$refs['inventory'].putItem(TYPE_ITEM + '-rations', 'pack4')
      if (b.items && b.items.length > 0) {
        this.$refs['inventory'].putItem(b.items[0].id, 'pack2', b.items[0])
        if (b.items.length > 1) this.$refs['inventory'].putItem(b.items[1].id, 'pack5', b.items[1])
      }

      // Rule: If your mouse’s highest attribute is 9 or less, roll on the Background table again and take either Item A or B. If your highest is 9 or less, take both.
      if (this.maxStr <= 9 && this.maxDex <= 9 && this.currentWil <= 9) {
        const b1 = getBackground(d6(), d6())
        if (this.maxStr <= 7 && this.maxDex <= 7 && this.currentWil <= 7) {
          if (b1.items && b1.items.length > 0) {
            this.$refs['inventory'].putItem(b1.items[0].id, 'pack3', b1.items[0])
            if (b1.items.length > 1) this.$refs['inventory'].putItem(b1.items[1].id, 'pack6', b1.items[1])
          }
        } else {
          // Choose one
        }
      }

      this.$refs['prompt-dialog'].open(this.$t('{name} is ready for adventure!', { name: this.name }))
    },
    setBirthsign (value) {
      this.birthsign = value
    },
    setCoatColor (value) {
      this.coatColor = value
    },
    setCoatPattern (value) {
      this.coatPattern = value
    },
    setLook (value) {
      this.look = value
    }
  }
}
</script>
