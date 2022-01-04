<template>
  <w-dialog ref="mouse-creation-dialog" v-model="show" :title="title" persistent :fullscreen="isMobileDevice" :width="dialogWidth()">
    <slot name="content">
      <w-flex column align-start>
        <div>
          <w-icon>mdi mdi-circle-small</w-icon> {{ $t('Increase in attributes if d20 is higher than the maximum of the latter.') }}
        </div>

        <div v-if="nextLevel.grit" class="mt2">
          <w-icon>mdi mdi-circle-small</w-icon> {{ $t('Grit') }} <w-icon>mdi mdi-arrow-right</w-icon> {{ nextLevel.grit }}
        </div>

        <div v-if="nextLevel.hp" class="mt2">
          <w-icon>mdi mdi-circle-small</w-icon> {{ $t('HP') }} <w-icon>mdi mdi-arrow-right</w-icon> {{ $t('If {roll} is greater than your maximum HP, then your HP is the sum of the dice. Otherwise they increase by one.', { roll: nextLevel.hp } )  }}
        </div>
      </w-flex>
    </slot>

    <template #actions>
      <div class="spacer" />
      <w-button v-if="canLevelUp" bg-color="blue" color="white" class="mr2" @click="agree">
        {{ $t('Level up') }}
      </w-button>
      <w-button text @click="close">
        {{ $t('Close') }}
      </w-button>
    </template>
  </w-dialog>
</template>

<script>
import { dialogWidth, isMobileDevice } from '@/services/responsive'
import { ADVANCEMENT_TABLE, canLevelUp } from '@/services/advancement'

export default {
  name:"MouseAdvancementDialog",
  data () {
    return {
      ADVANCEMENT_TABLE,
      attributes: {},
      currentLevel: null,
      dialogWidth,
      name: '',
      newLevel: null,
      nextLevel: {},
      xp: 0,
      reject: null,
      resolve: null,
      show: false,
      title: ''
    }
  },
  computed: {
    canLevelUp () { return canLevelUp(this.xp, this.currentLevel) },
    isMobileDevice () { return isMobileDevice(this.$waveui.breakpoint.name) }
  },
  methods: {
    agree () {
      this.resolve(this.nextLevel)
      this.show = false
    },
    close () {
      this.resolve(false)
      this.show = false
    },
    computeNextLevel () {
      this.nextLevel = ADVANCEMENT_TABLE[this.currentLevel]
      this.newLevel = this.currentLevel + 1
      this.nextLevel.level = this.newLevel
    },
    open (name, currentLevel, xp, attributes) {
      this.reset()

      this.name = name
      this.currentLevel = currentLevel
      this.attributes = { ...attributes }
      this.xp = xp
      this.computeNextLevel()
      this.title = this.$t('{name} will move from the {current} level to the {next} level.', { name, current: currentLevel, next: this.newLevel })
      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    reset () {
      this.attributes = {}
      this.currentLevel = null
      this.newLevel = null
      this.xp = 0
    }
  }
}
</script>