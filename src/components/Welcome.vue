<template>
  <div class="scrollable h-auto">
    <w-flex column align-center justify-center class="mt4">
      <w-card content-class="px1 background-white-50">
        <template #title>
          <w-toolbar>
            <div class="title3">{{ $t('Manage your characters.') }}</div>
          </w-toolbar>
        </template>
        <w-flex column v-for="(slot, index) in slots" :key="index" justify-center>
          <w-flex row align-center justify-space-between class="py2">
            {{ index + 1 }}
            <div v-if="!slot" class="caption">
            {{ $t('Empty') }}
            </div>
            <w-button v-else :text="index !== currentSlot" :disabled="index === currentSlot" @click="loadSheet(index)">
              {{ slotName(index) }}
            </w-button>
            <div>
              <w-tooltip v-if="slot" transition="fade" bg-color="yellow-light2" color="black" left>
                <template #activator="{ on }">
                  <w-button v-on="on" @click="deleteSheet(index)" color="red" class="ml2" icon="mdi mdi-delete" />
                </template>
                {{ $t('Delete') }}
              </w-tooltip>
              <w-tooltip transition="fade" bg-color="yellow-light2" color="black" left>
                <template #activator="{ on }">
                  <w-button v-on="on" @click="saveSheet(index)" color="blue" class="ml2" icon="mdi mdi-content-save" />
                </template>
                {{ $t('Save') }}
              </w-tooltip>
            </div>
          </w-flex>
          <w-divider />
        </w-flex>

        <w-button xl @click="createRandomSheet" class="w-max mt4">
          <w-icon>mdi mdi-plus</w-icon>
          {{ $t('Create a new character...') }}
        </w-button>
      </w-card>
    </w-flex>
    <confirm-dialog ref="confirm-dialog" />
  </div>
</template>

<script>
import { deleteSlot, listSlots, loadSlot, saveSlot } from '@/services/storage'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

export default {
  name: 'Welcome',
  components: { ConfirmDialog },
  propos: [ 'sheet' ],
  data () {
    return {
      currentSlot: null,
      slots: []
    }
  },
  computed: {
    locale () { return this.$store.getters['locale'] }
  },
  methods: {
    createRandomSheet () {
      if (this.mausritter.sheetToolbar) this.mausritter.sheetToolbar.displayDrawer(false)
      if (this.mausritter.sheet) this.mausritter.sheet.createRandomSheet()
    },
    deleteSheet (index) {
      this.$refs['confirm-dialog'].open(this.$t('Delete'), this.$t('The sheet of “{name}” will be erased. Do you confirm?', { name: this.slotName(index) } ))
        .then(confirmed => {
          if (confirmed) {
            deleteSlot(index)
            console.log('##[main] deleteSheet', index)
            this.slots = listSlots() // Refresh slot list
          }
        })
    },
    dataSignature (data) {
      return data.sheet.name + '|' + data.sheet.background + '|' + data.sheet.level + '|' + new Date(data.date).toLocaleString(this.locale)
    },
    async load (index) {
      const data = loadSlot(index)
      console.log('## load:', data)
      if (this.mausritter.sheet) this.mausritter.sheet.setData(data)
      if (data.hirelings && this.mausritter.hirelings) {
        console.log('##[app] load/hirelings', data.hirelings)
        this.$store.dispatch('hirelingsSet', data.hirelings)
        .then(() => {
          this.mausritter.hirelings.refresh(data.hirelings)
        })
      }
      this.currentSlot = index
      this.$store.commit('historyAdd', {
        type: this.$t('Load'),
        message: this.slots[index]
      })
    },
    loadSheet (index) {
      if (!this.currentSlot) {
        this.load(index)
        return
      }

      this.$refs['confirm-dialog'].open(this.$t('Load'), this.$t('The current sheet will be overwritten by “{name}”. Do you confirm?', { name: this.slots[index] } ))
        .then(confirmed => {
          if (confirmed) {
            this.load(index)
          }
        })
    },
    slotName (index) {
      const parts = this.slots[index].split('|')
      let result = parts[0]
      if (parts.length > 1) result += ' — ' + parts[1]
      if (parts.length > 2) result += ' — ' + this.$t('Level') + ' ' + parts[2]
      if (parts.length > 3) result += ' (' + parts[3] + ')'
      return result
    },
    save (index, data) {
      console.log('##[main] save slot', index, this.dataSignature(data), data)
      saveSlot(index, data, this.dataSignature(data))
      this.slots = listSlots() // Refresh slot list
      this.currentSlot = index
      this.$store.commit('historyAdd', {
        type: this.$t('Save'),
        message: this.slots[index]
      })
    },
    saveSheet (index) {
      const data = this.serialize()
      if (this.slots[index] === null || this.slots[index] === this.dataSignature(data)) {
        this.save(index, data)
        return
      }

      this.$refs['confirm-dialog'].open(this.$t('Save'), this.$t('The sheet of “{dest}” will be overwritten by “{name}”. Do you confirm?', { dest: this.slots[index], name: this.dataSignature(data) } ))
        .then(confirmed => {
          if (confirmed) {
            this.save(index, data)
          }
        })
    },
    serialize () {
      let data
      if (this.mausritter.sheet) data = this.mausritter.sheet.serialize()
      if (this.mausritter.hirelings) data.hirelings = this.mausritter.hirelings.serialize()
      data.version = 1
      data.date = new Date().toISOString()
      return data
    }
  },
  mounted () {
    this.slots = listSlots()
  },
}
</script>