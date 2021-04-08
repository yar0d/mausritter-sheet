<template>
  <w-card class="card-bordered character-sheet">
    <mouse ref="sheet-mouse" />
  </w-card>
</template>

<script>
import Mouse from '@/components/Mouse/Mouse.vue'

export default {
  name: 'Sheet',
  components: { Mouse },
  data () { return {} },
  methods: {
    advancement () {
      if (this.$refs['sheet-mouse']) this.$refs['sheet-mouse'].advancement()
    },
    canLevelUp () { return this.$refs['sheet-mouse'] ? this.$refs['sheet-mouse'].canLevelUp() : false },
    createRandomSheet () {
      if (this.$refs['sheet-mouse']) this.$refs['sheet-mouse'].createRandomSheet()
    },
    restFull () {
      if (this.$refs['sheet-mouse']) this.$refs['sheet-mouse'].restFull()
    },
    restLong () {
      if (this.$refs['sheet-mouse']) this.$refs['sheet-mouse'].restLong()
    },
    restShort () {
      if (this.$refs['sheet-mouse']) this.$refs['sheet-mouse'].restShort()
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
