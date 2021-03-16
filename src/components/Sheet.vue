<template>
  <mouse ref="sheet-mouse" />
</template>

<script>
import Mouse from '@/components/Mouse/Mouse.vue'

export default {
  name: 'Sheet',
  components: { Mouse },
  data () { return {} },
  methods: {
    createRandomSheet () {
      if (this.$refs['sheet-mouse']) this.$refs['sheet-mouse'].createRandomSheet()
    },
    serialize () {
      let result
      if (this.$refs['sheet-mouse']) result = this.$refs['sheet-mouse'].serialize()
      return result
    },
    setData (data) {
      if (data.type === 'mouse' && this.$refs['sheet-mouse']) this.$refs['sheet-mouse'].setData(data)
    }
  }
}
</script>
