<template>
  <Mouse ref="sheet-mouse" />
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
      if (this.$refs['sheet-mouse']) return this.$refs['sheet-mouse'].serialize()
    },
    setData (data) {
      if (this.$refs['sheet-mouse']) return this.$refs['sheet-mouse'].setData(data)
    }
  }
}
</script>