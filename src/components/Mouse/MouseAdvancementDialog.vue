<template>
  <w-dialog ref="mouse-creation-dialog" v-model="show" :title="title" persistent :fullscreen="isMobileDevice">
    <slot name="content">
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

export default {
  name:"MouseAdvancementDialog",
  data () {
    return {
      reject: null,
      resolve: null,
      show: false,
      title: ''
    }
  },
  computed: {
    isMobileDevice () { return isMobileDevice(this.$waveui.breakpoint.name) },
  },
  methods: {
    agree () {
      this.resolve(true)
      this.show = false
    },
    open (name) {
      this.reset()
      this.title = this.$t('“{name}” prepares advancement...', { name })
      this.show = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    reset () {
    }
  }
}
</script>