<template>
  <w-card class="mouse-sheet">
    <w-flex column justify-start class="mx1 my0">
      <w-flex row justify-space-between align-start>
        <w-card bg-color="white" class="card-sheet">
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
            <div class="w-max">
              <w-input v-model="background" class="body input-value" />
            </div>
          </w-flex>
        </w-card>

        <w-card bg-color="white" class="card-sheet xs4">
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
        <w-card bg-color="white" class="card-sheet xs3">
          <w-flex row align-center class="text-center">
            <div class="w-max form-gray input-name title2 attribute-cell">
              {{ $t('STR') }}
            </div>
            <div class="w-50">
              <checker :faces="20" :context="$t('STR save')" :score="currentStr" size="lg" />
            </div>
            <div class="w-150 ml2">
              <w-input v-model.number="maxStr" class="title1" color="minor" />
            </div>
            <div class="w-150 divider-v">
              <w-input v-model.number="currentStr" class="title1 primary" />
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
              <checker :faces="20" :context="$t('DEX save')" :score="currentDex" size="lg" />
            </div>
            <div class="w-150 ml2">
              <w-input v-model.number="maxDex" class="title1" color="minor" />
            </div>
            <div class="w-150 divider-v">
              <w-input v-model.number="currentDex" class="title1 primary" />
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
              <checker :faces="20" :context="$t('WIL save')" :score="currentWil" size="lg" />
            </div>
            <div class="w-150 ml2">
              <w-input v-model.number="maxWil" class="title1" color="minor" />
            </div>
            <div class="w-150 divider-v">
              <w-input v-model.number="currentWil" class="title1 primary" />
            </div>
          </w-flex>
        </w-card>
      </w-flex>

      <w-flex row justify-end class="mt4">
        <w-card bg-color="white" class="card-sheet xs3">
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

        <w-card bg-color="white" class="card-sheet xs4 opacity-75">
          <w-flex row align-center>
            <div class="input-name">
              {{ $t('Level') }}
            </div>
            <div class="ml2 xs6">
              <w-input v-model.number="level" class="title2" />
            </div>
            <div class="ml4">{{ $t('XP') }}</div>
            <div class="mx1 w-max text-right">
              <w-input v-model.number="xp" class="title2" />
            </div>
          </w-flex>
        </w-card>

        <div class="w-250 pips-img">
          <div class="ml6 opacity-75">
            <w-card bg-color="white" class="card-sheet py0 pr2 pips opacity-100">
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
        <grit ref="grit" :level="level" />
        <bank ref="bank" :inventory="inventoryComponent" />
      </w-flex>
    </w-flex>

    <confirm-dialog ref="confirm-dialog" />

    <mouse-creation-dialog ref="mouse-creation-dialog" :background="background" :background-items="backgroundItems" :hirelings="backgroundHirelings" :choose-items="chooseItems" :max-dex="maxDex" :max-str="maxStr" :max-wil="maxWil" />
  </w-card>
</template>

<script>
import { SWAP_NONE, SWAP_STR_DEX, SWAP_STR_WIL, SWAP_DEX_WIL } from '@/services/mouse.js'
import { d6, d66, rollFromTable, rollExplode } from '@/services/dice-roller'
import { extract as getBackground } from '@/services/backgrounds'
import { TYPE_ITEM, getItem } from '@/services/items-conditions'
import Checker from '@/components/Checker.vue'
import Birthsign from './Birthsign.vue'
import CoatColor from './CoatColor.vue'
import CoatPattern from './CoatPattern.vue'
import Inventory from './Inventory.vue'
import Look from './Look.vue'
import Grit from './Grit.vue'
import ConfirmDialog from '../ConfirmDialog.vue'
import Bank from './Bank.vue'
import MouseCreationDialog from './MouseCreationDialog.vue'

export default {
  components: { Birthsign, CoatColor, CoatPattern, Inventory, Checker, Look, Grit, ConfirmDialog, Bank, MouseCreationDialog },
  data() {
    return {
      SWAP_NONE,
      SWAP_STR_DEX,
      SWAP_STR_WIL,
      SWAP_DEX_WIL,
      background: '',
      bankedPips: 0,
      birthsign: 0,
      backgroundHirelings: [],
      backgroundItems: [],
      chooseItems: [],
      choosenItem: null,
      choosenWeapon: 0,
      coatColor: 0,
      coatPattern: 0,
      currentDex: 0,
      currentHP: 0,
      currentStr: 0,
      currentWil: 0,
      inventoryComponent: null,
      isNew: true,
      level: 1,
      look: 0,
      maxDex: 0,
      maxHP: 0,
      maxStr: 0,
      maxWil: 0,
      name: '',
      pips: 0,
      swapAttributes: 0,
      xp: 0
    }
  },
  methods: {
    createRandomSheet () {
      if (this.isNew) this.rollRandomMouse()
      else this.$refs['confirm-dialog'].open(this.$t('Create a new character...'), this.$t('The sheet of “{name}” will be erased. Do you confirm?', { name: this.name } ))
        .then(confirmed => {
          if (confirmed) this.rollRandomMouse()
        })
    },
    reset (data = {}) {
      this.name = data.name || ''
      this.background = data.background || ''
      this.bankedPips = data.bankedPips || 0
      this.birthsign = data.birthsign || 0
      this.chooseItems = []
      this.choosenItem = -1
      this.choosenWeapon = 0
      this.coatColor = data.coatColor || 0
      this.coatPattern = data.coatPattern || 0
      this.currentDex = data.currentDex || 0
      this.currentHP = data.currentHP || 0
      this.currentStr = data.currentStr || 0
      this.currentWil = data.currentWil || 0
      this.isNew = true
      this.level = data.level || 1
      this.look = data.look || 0
      this.maxDex = data.maxDex || 0
      this.maxHP = data.maxHP || 0
      this.maxStr = data.maxStr || 0
      this.maxWil = data.maxWil || 0
      this.pips = data.pips || 0
      this.swapAttributes = 0
      this.xp = data.xp || 0
    },
    rollRandomMouse () {
      this.reset()
      this.maxStr = rollExplode(3, 6, 2, (context, result, total) => this.$store.commit('historyAdd', { type: this.$t('STR') + '/' + context, message: result + ' -> ' + total} )).total // Keep two highest D6 from the rollingof 3d6.
      this.maxDex = rollExplode(3, 6, 2, (context, result, total) => this.$store.commit('historyAdd', { type: this.$t('DEX') + '/' + context, message: result + ' -> ' + total} )).total // Keep two highest D6 from the rollingof 3d6.
      this.maxWil = rollExplode(3, 6, 2, (context, result, total) => this.$store.commit('historyAdd', { type: this.$t('WIL') + '/' + context, message: result + ' -> ' + total} )).total // Keep two highest D6 from the rollingof 3d6.
      this.currentStr = this.maxStr
      this.currentDex = this.maxDex
      this.currentWil = this.maxWil
      this.maxHP = d6((context, total) => this.$store.commit('historyAdd', { type: this.$t('HP') + '/' + context, message: total} ))
      this.pips = d6((context, total) => this.$store.commit('historyAdd', { type: this.$t('Pips') + '/' + context, message: total} ))
      this.currentHP = this.maxHP
      this.name = rollFromTable(this.$store.getters.names) + ' ' + rollFromTable(this.$store.getters.matrinames)

      this.$refs['birthsign'].setValue(d6((context, total) => this.$store.commit('historyAdd', { type: this.$t('Birthsign') + '/' + context, message: total} )))
      this.$refs['coat-color'].setValue(d6((context, total) => this.$store.commit('historyAdd', { type: this.$t('Coat') + '/' + context, message: total} )))
      this.$refs['coat-pattern'].setValue(d6((context, total) => this.$store.commit('historyAdd', { type: this.$t('Coat') + '/' + context, message: total} )))
      this.$refs['look'].setValue(d66((context, total) => this.$store.commit('historyAdd', { type: this.$t('Look') + '/' + context, message: total} )))

      // const b = getBackground(this.maxHP, this.pips)
      const b = getBackground(2, 2)
      this.background = this.$t(b.label)
      this.backgroundItems = []

      this.$refs['bank'].reset()
      this.$refs['grit'].reset()
      this.$refs['inventory'].reset()
      this.$refs['inventory'].putItem(TYPE_ITEM + '-torches', 'pack1')
      this.$refs['inventory'].putItem(TYPE_ITEM + '-rations', 'pack4')

      this.isNew = false

      if (b.items && b.items.length > 0) {
        this.$refs['inventory'].putItem(b.items[0].id, 'pack2', b.items[0])
        if (b.items.length > 1) this.$refs['inventory'].putItem(b.items[1].id, 'pack5', b.items[1])

        // Display what background give us
        this.backgroundItems.push(getItem(TYPE_ITEM + '-torches'))
        this.backgroundItems.push(getItem(TYPE_ITEM + '-rations'))
        for (let i = 0; i < b.items.length; i++) {
          this.backgroundItems.push(getItem(b.items[i].id, { customLabel: this.$t(b.items[i].customLabel || ''), desc: b.items[i].desc }))
        }
      }

      this.$store.commit('hirelingClear')
      this.backgroundHirelings = b.hirelings
      if (b.hirelings && b.hirelings.length > 0) {
        b.hirelings.forEach(hireling => {
          this.$store.commit('hirelingCreate', hireling)
        })
      }

      /*
      * Rule: If your mouse’s highest attribute is 9 or less,
      * roll on the Background table again and take either Item A or B.
      * If your highest is 7 or less, take both.
      */
      if (this.maxStr <= 9 && this.maxDex <= 9 && this.currentWil <= 9) {
        const b1 = getBackground(d6(), d6())
        if (this.maxStr <= 7 && this.maxDex <= 7 && this.currentWil <= 7) {
          if (b1.items && b1.items.length > 0) {
            this.$refs['inventory'].putItem(b1.items[0].id, 'pack3', b1.items[0])
            if (b1.items.length > 1) this.$refs['inventory'].putItem(b1.items[1].id, 'pack6', b1.items[1])
          }
        } else {
          // Choose one from
          for (let i = 0; i < b1.items.length; i++) {
            this.chooseItems.push({ id: i, item: getItem(b1.items[i].id, { customLabel: this.$t(b1.items[i].customLabel || ''), desc: b1.items[i].desc }) })
          }
          this.choosenItem = 0
        }
      }

      this.$refs['mouse-creation-dialog'].open(this.name)
        .then (options => {
          switch (options.swapAttributes) {
            case SWAP_STR_DEX:
              [this.maxStr, this.maxDex] = [this.maxDex, this.maxStr]
              break;
            case SWAP_STR_WIL:
              [this.maxStr, this.maxWil] = [this.maxWil, this.maxStr]
              break;
            case SWAP_DEX_WIL:
              [this.maxDex, this.maxWil] = [this.maxWil, this.maxDex]
              break;
          }
          this.currentStr = this.maxStr
          this.currentDex = this.maxDex
          this.currentWil = this.maxWil

          if (options.choosenWeapon) this.$refs['inventory'].putItem(options.choosenWeapon.id, 'body1', options.choosenWeapon)

          if (options.choosenItem) {
            let location = options.choosenItem.geometry === '1x2' ? 'mainPaw' : 'offPaw'
            this.$refs['inventory'].putItem(options.choosenItem.id, location, options.choosenItem)
          }
        })
    },
    serialize () {
      return {
        type: 'mouse',
        sheet: {
          background: this.background,
          birthsign: this.birthsign,
          coatColor: this.coatColor,
          coatPattern: this.coatPattern,
          currentDex: this.currentDex,
          currentHP: this.currentHP,
          currentStr: this.currentStr,
          currentWil: this.currentWil,
          level: this.level,
          look: this.look,
          maxDex: this.maxDex,
          maxHP: this.maxHP,
          maxStr: this.maxStr,
          maxWil: this.maxWil,
          name: this.name,
          pips: this.pips,
          xp: this.xp
        },
        bank: this.$refs['bank'].serialize(),
        grit: this.$refs['grit'].serialize(),
        inventory: this.$refs['inventory'].serialize()
      }
    },
    setData (data) {
      this.reset(data.sheet)
      this.$refs['bank'].setData(data.bank)
      this.$refs['grit'].setData(data.grit)
      this.$refs['inventory'].setData(data.inventory)
      this.isNew = false
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
  },
  mounted () {
    this.inventoryComponent = this.$refs['inventory']
    this.$store.commit('historyAdd', { message: this.$t('Welcome to Mausrittes Sheet!') })
  }
}
</script>
