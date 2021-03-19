<template>
  <w-dialog v-model="show" :title="context || $t('Roll')" persistent :bg-color="backgroundColor" color="white" width="300">
    <slot name="content">
      <w-flex class="mt2" column justify-center>
        <div class="title1 white">{{ explainedResult }}</div>
        <div class="mt2 black">{{ $t('Need {score} or lower, roll {roll}.', { score, roll: roll.total }) }}</div>
        <div v-if="roll && roll.dices && roll.dices.length > 1">D{{ roll.faces }} -> {{ roll.dices.join(', ') }}</div>
      </w-flex>
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
const STANDARD_DICES = [4, 6, 8, 10, 12, 20]

export default {
  name: 'DiceResult',
  data () {
    return {
      context: null,
      failed: false,
      roll: {},
      show: false,
      score: null,
      success: false
    }
  },
  computed: {
    backgroundColor () { return this.success ? 'green' : (this.failed ? 'red-light2' : '') },
    explainedResult () { return this.success ? this.$t('SUCCESS') : (this.failed ? this.$t('FAILED') : '') },
    icon () { return this.roll && STANDARD_DICES.includes(this.roll.faces) ? `mdi mdi-dice-d${this.faces}` : 'mdi mdi-dice-multiple' }
  },
  methods: {
    agree () {
      this.resolve(true)
      this.show = false
    },
    open ({ context, roll, score, success, failed }) {
      this.context = context
      this.roll = roll
      this.failed = failed
      this.score = score
      this.success = success
      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    }
  }
}
</script>
