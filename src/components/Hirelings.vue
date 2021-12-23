<template>
  <div class="scrollable h-max pb4">
    <w-toolbar class="background-white-50">
      <w-menu v-model="showMenu">
        <template #activator="{ on }">
          <w-button v-on="on" xl @click="showMenu = !showMenu">
            <w-icon>mdi mdi-plus</w-icon>
            {{ $t('Recruit hireling...') }}
          </w-button>
        </template>

        <div class="text-center">
          <w-list v-model="hirelingId" :items="hireables" item-value-key="id" @item-select="showMenu = false">
            <template #item="{ item }">
              <w-flex align-center justify-space-between @click="recruitHireling(item)">
                {{ $t(item.label) }}
                <span class="ml2">{{ $t('{price}p', { price: item.wages }) }}</span>
              </w-flex>
            </template>
          </w-list>
        </div>
      </w-menu>

      <div class="spacer" />

      <div>
        <span v-if="wages" class="text-small">{{ $t('Wages/day') }}</span> <chips size="lg" :value="$t('{price}p', { price: wages })" />
      </div>
    </w-toolbar>

    <div class="pt4 px4">
      <hireling v-for="(h, index) in hirelings" :key="index" :ref="'hireling-' + index" :hireling="h" :id="index" can-delete @delete="deleteHireling" />
    </div>

    <confirm-dialog ref="confirm-dialog" />
  </div>
</template>

<script>
import { isMobileDevice } from '@/services/responsive'
import { hirelingsList } from '@/services/hirelings'

import Hireling from './Hireling.vue'
import Chips from './Chips.vue'
import ConfirmDialog from './ConfirmDialog.vue'

export default {
  components: { Hireling, Chips, ConfirmDialog },
  name: 'Hirelings',
  data () {
    return {
      hirelingId: null,
      showMenu: false
    }
  },
  computed: {
    hirelings () { return this.$store.getters['hirelings'] },
    hireables () {
      let result = []
      for (let i=0; i < hirelingsList.length; i++) if (hirelingsList[i].wages > 0) result.push(hirelingsList[i])
      return result },
    isMobileDevice () { return isMobileDevice(this.$waveui.breakpoint.name) },
    wages () {
      let result = 0
      for (let index = 0; index < this.hirelings.length; index++) {
        result += this.hirelings[index].sheet.wages || 0
      }
      return result
    }
  },
  methods: {
    deleteHireling (id, hireling) {
      this.$refs['confirm-dialog'].open(this.$t('Delete'), this.$t('The hireling of “{desc} {name}” will be dismissed. Do you confirm?', { desc: this.$t(hireling.desc), name: hireling.name} ))
        .then(confirmed => {
          if (confirmed) {
            this.$store.commit('hirelingDismiss', id)
          }
        })
    },
    recruitHireling (hireling) {
      if (hireling && hireling.id) this.$store.commit('hirelingCreate', { id: hireling.id, label: hireling.label, wages: hireling.wages })
    },
    refresh () {
      for (let index = 0; index < this.hirelings.length; index++) {
        if (this.$refs['hireling-' + index][0]) this.$refs['hireling-' + index][0].setData(this.hirelings[index])
      }
    },
    serialize () {
      let result = [] // We will return an array of hirelings
      for (let index = 0; index < this.hirelings.length; index++) {
        if (this.$refs['hireling-' + index][0]) result.push(this.$refs['hireling-' + index][0].serialize())
      }
      return result
    }
  }
}
</script>
