<template>
  <w-dialog v-model="show" :title="title" persistent :width="550">
    <slot name="content">
      <p class="pa2">{{ message }}</p>
    </slot>

    <template #actions>
      <div class="spacer" />
      <w-button @click="agree" bg-color="success">
        {{ $t('Yes') }}
      </w-button>
      <w-button class="ml2" @click="cancel" bg-color="error">
        {{ $t('No') }}
      </w-button>
    </template>
  </w-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  data () {
    return {
      resolve: null,
      reject: null,
      message: null,
      title: null,
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
    cancel () {
      this.resolve(false)
      this.show = false
    },
    open (title, message, options) {
      this.show = true
      this.title = title || this.$t('Confirm')
      this.message = message
      this.options = Object.assign(this.options, options)

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    }
  }
}
</script>