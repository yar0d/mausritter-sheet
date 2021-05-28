<template>
  <w-dialog v-model="show" :title="context || ''" persistent :bg-color="backgroundColor" color="white" width="300">
    <slot name="content">
      <w-flex class="mt2" column justify-center>
        <div class="title1 white">{{ explainedResult }}</div>
        <div v-if="success !== undefined || failed !== undefined" class="mt2 black">
          <span v-if="score">
            {{ $t('Need {score} or lower, roll {roll}.', { score, roll: total }) }}
          </span>
          <span v-if="upper">
            {{ $t('Need upper than {upper}, roll {roll}.', { upper, roll: total }) }}
          </span>
        </div>
        <div v-else class="title1"><w-icon xl>{{ icon }}</w-icon> {{ total }}</div>
        <div v-if="message" class="mt2">{{ message }}</div>
        <div v-if="faces && dices && dices.length > 1">D{{ faces }} -> {{ dices.join(', ') }}</div>
        <div v-if="formula">{{ formula }}</div>
        <div v-if="secondary" class="mt2 text-small">{{ secondary }}</div>
      </w-flex>
    </slot>

    <template #actions>
      <div class="spacer" />
      <w-button :bg-color="backgroundColorButton" @click="agree">
        {{ $t('OK') }}
      </w-button>
    </template>
  </w-dialog>
</template>

<script>
const STANDARD_DICES = [4, 6, 8, 10, 12, 20]

export default {
  name: 'DiceResult',
  data () {
    return {
      context: null,
      failed: undefined,
      dices: {},
      faces: 0,
      formula: null,
      message: null,
      total: 0,
      show: false,
      score: null,
      secondary: null,
      success: undefined,
      upper: null
    }
  },
  computed: {
    backgroundColor () { return this.success ? 'green' : (this.failed ? 'red-light1' : 'deep-purple-dark1') },
    backgroundColorButton () { return this.success ? 'green-dark2' : (this.failed ? 'red-dar1' : 'deep-purple-dark3') },
    explainedResult () { return this.success ? this.$t('SUCCESS') : (this.failed ? this.$t('FAILED') : '') },
    icon () { return STANDARD_DICES.includes(this.faces) ? `mdi mdi-dice-d${this.faces}` : 'mdi mdi-dice-multiple' }
  },
  methods: {
    agree () {
      this.resolve(true)
      this.show = false
    },
    open ({ context, faces, formula, message, dices, upper, score, total, secondary, success, failed }) {
      this.context = context
      this.faces = faces
      this.dices = dices
      this.failed = failed
      this.formula = formula
      this.message = message
      this.score = score
      this.secondary = secondary
      this.success = success
      this.total = total
      this.upper = upper
      // Send result if a table is giver
      if (this.$store.getters['tableId'] && this.$store.getters['sheetSignature']) {
        this.$store.dispatch('sendDiceResult', {
          tableId: this.$store.getters['table'],
          sheetSignature: this.$store.getters['sheetSignature'],
          diceResult: { context, faces, formula, message, dices, upper, score, total, secondary, success, failed }
        })
      }
      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    }
  }
}
</script>
