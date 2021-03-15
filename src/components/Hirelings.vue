<template>
  <div class="scrollable h-max">
    store: {{ hirelings }}
    <w-toolbar></w-toolbar>
    <div v-for="(h, index) in hirelings" :key="index">
      <hireling :ref="'hireling-' + index" :hireling="h" />
    </div>
  </div>
</template>

<script>
import { hirelingsList } from '@/services/hirelings'

console.log('##hirelingsList', hirelingsList)

import Hireling from './Hireling.vue'

export default {
  components: { Hireling },
  name: 'Hirelings',
  computed: {
    hirelings () { return this.$store.getters['hirelings'] }
  },
  methods: {
    refresh () {
      for (let index = 0; index < this.hirelings.length; index++) {
        this.$refs['hireling-' + index].setData(this.hirelings[index])
      }
    },
    serialize () {
      let result = [] // We will return an array of hirelings
      for (let index = 0; index < this.hirelings.length; index++) {
        result.push(this.$refs['hireling-' + index].serialize())
      }
      return result
    }
  }
}
</script>
