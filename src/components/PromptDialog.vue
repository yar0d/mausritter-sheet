<template>
  <w-dialog v-model="show" :title="title" persistent :width="700">
    <slot name="content">
      <p class="pa2">{{ message }}</p>
      <pre v-if="data" class="text-small">
{{ data }}
      </pre>
    </slot>

    <template #actions>
      <div class="spacer" />
      <w-button @click="agree" bg-color="success">
        {{ $t('OK') }}
      </w-button>
    </template>
  </w-dialog>
</template>

<script>
export default {
  name: 'PromptDialog',
  data () {
    return {
      resolve: null,
      reject: null,
      message: null,
      title: null,
      data: null,
      options: {
        color: 'primary',
        width: 500
      },
      show: false
    }
  },
  methods: {
    agree () {
      this.resolve(true)
      this.show = false
    },
    open (title, message, options = {}) {
      this.title = title || this.$t('Confirm')
      this.message = message
      this.data = options.data || null
      this.options = Object.assign(this.options, options)
      this.show = true

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    }
  }
}
</script>