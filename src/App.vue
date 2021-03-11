<template>
  <w-app id="app">
    <main class="grow">
      <sheet ref="sheet"/>
    </main>
    <footer>
      <sheet-toolbar ref="sheet-toolbar">
        <template #actions-prepend>
          <w-menu v-model="showSlotMenu" top align-left persistent>
            <template #activator="{ on: menuOn }">
              <w-tooltip transition="fade" bg-color="yellow-light2" color="black" top>
                <template #activator="{ on: tooltipOn }">
                  <w-icon v-on="{ ...menuOn, ...tooltipOn }" class="title1 clickable" :bg-color="showSlotMenu ? 'blue' : ''" :color="showSlotMenu ? 'white' : 'blue'">mdi mdi-rodent</w-icon>
                </template>
                {{ $t('Manage your characters.') }}
              </w-tooltip>
            </template>
            <w-card content-class="px1">
               <template #title>
                <w-toolbar>
                  <div class="title3">{{ $t('Manage your characters.') }}</div>
                  <div class="spacer" />
                  <w-button icon="mdi mdi-close" @click="showSlotMenu = false" />
                </w-toolbar>
              </template>
              <w-flex column v-for="(slot, index) in slots" :key="index" justify-center>
                <w-flex row align-center justify-space-between class="py2">
                  {{ index + 1 }}
                  <div v-if="!slot" class="caption">
                  {{ $t('Empty') }}
                  </div>
                  <w-button v-else :text="index !== currentSlot" @click="loadSheet(index)">
                    {{ slotName(slot)[0] }}
                    <div class="text-small">
                      — {{ slotName(slot)[1] }}
                    </div>
                  </w-button>
                  <div>
                    <w-tooltip v-if="slot" transition="fade" bg-color="yellow-light2" color="black" left>
                      <template #activator="{ on }">
                        <w-button v-on="on" @click="deleteSheet(index, slot)" color="red" class="ml2" icon="mdi mdi-delete" />
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
              <w-button text @click="createRandomSheet" class="w-max">
                <w-icon>mdi mdi-plus</w-icon>
                {{ $t('Create a new character...') }}
              </w-button>
            </w-card>
          </w-menu>
        </template>
      </sheet-toolbar>
    </footer>

    <confirm-dialog ref="confirm-dialog" />
  </w-app>
</template>

<script>
import { deleteSlot, listSlots, loadSlot, saveSlot } from '@/services/storage'
import Sheet from '@/components/Sheet.vue'
import SheetToolbar from '@/components/SheetToolbar.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'

export default {
  name: 'App',
  components: { Sheet, SheetToolbar, ConfirmDialog },
  data () {
    return {
      currentSlot: null,
      showSlotMenu: false,
      slots: []
    }
  },
  methods: {
    createRandomSheet () {
      if (this.$refs['sheet-toolbar']) this.$refs['sheet-toolbar'].displayDrawer(false)
      if (this.$refs['sheet']) this.$refs['sheet'].createRandomSheet()
    },
    deleteSheet (index, slotName) {
      this.$refs['confirm-dialog'].open(this.$t('Delete'), this.$t('The sheet of “{name}” will be erased. Do you confirm?', { name: slotName } ))
        .then(confirmed => {
          if (confirmed) {
            deleteSlot(index)
            console.log('##[main] deleteSheet', index)
            this.slots = listSlots() // Refresh slot list
          }
        })
    },
    loadSheet (index) {
      const data = loadSlot(index)
      if (this.$refs['sheet']) this.$refs['sheet'].setData(data)
      this.currentSlot = index
      this.$store.commit('historyAdd', {
        type: this.$t('Load'),
        message: this.slots[index]
      })
    },
    slotName (context) {
      return context.split('/')
    },
    save (index, data) {
      console.log('##[main] save slot', index, data.mouse.name + '/' + data.mouse.background, data)
      saveSlot(index, data, data.mouse.name + '/' + data.mouse.background)
      this.slots = listSlots() // Refresh slot list
      this.$store.commit('historyAdd', {
        type: this.$t('Save'),
        message: this.slots[index]
      })
    },
    saveSheet (index) {
      const data = this.serialize()
      if (this.slots[index] === null || this.slots[index] === data.mouse.name + '/' + data.mouse.background) {
        this.save(index, data)
        return
      }

      this.$refs['confirm-dialog'].open(this.$t('Save'), this.$t('The sheet of “{dest}” will be overwritten by “{name}”. Do you confirm?', { dest: this.slots[index], name: data.mouse.name + '/' + data.mouse.background } ))
        .then(confirmed => {
          if (confirmed) {
            this.save(index, data)
          }
        })
    },
    serialize () {
      let data
      if (this.$refs['sheet']) data = this.$refs['sheet'].serialize()
      data.version = 1
      return data
    }
  },
  mounted () {
    this.slots = listSlots()
  }
}
</script>
