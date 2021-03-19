<template>
  <w-dialog v-model="show" :title="context || ''" persistent :bg-color="backgroundColor" color="white" width="300">
    <slot name="content">
      <w-flex class="mt2" column justify-center>
        <div class="title1 white">{{ explainedResult }}</div>
        <div v-if="success !== undefined || failed !== undefined" class="mt2 black">{{ $t('Need {score} or lower, roll {roll}.', { score, roll: total }) }}</div>
        <div v-else class="title1"><w-icon xl>{{ icon }}</w-icon> {{ total }}</div>
        <div v-if="dices && dices.length > 1">D{{ faces }} -> {{ dices.join(', ') }}</div>
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
      failed: undefined,
      dices: {},
      faces: 0,
      total: 0,
      show: false,
      score: null,
      success: undefined
    }
  },
  computed: {
    backgroundColor () { return this.success ? 'green' : (this.failed ? 'red-light1' : 'deep-purple-dark1') },
    explainedResult () { return this.success ? this.$t('SUCCESS') : (this.failed ? this.$t('FAILED') : '') },
    icon () { return STANDARD_DICES.includes(this.faces) ? `mdi mdi-dice-d${this.faces}` : 'mdi mdi-dice-multiple' }
  },
  methods: {
    agree () {
      this.resolve(true)
      this.show = false
    },
    open ({ context, faces, dices, score, total, success, failed }) {
      this.context = context
      this.faces = faces
      this.dices = dices
      this.failed = failed
      this.score = score
      this.total = total
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
