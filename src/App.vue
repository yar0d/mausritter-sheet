<template>
  <w-app id="app">
    <main class="grow">
      <sheet ref="sheet"/>
    </main>
    <footer>
      <sheet-toolbar ref="sheet-toolbar">
        <template #actions-prepend>
          <w-menu v-model="showSlotMenu" top align-left>
            <template #activator="{ on: menuOn }">
              <w-tooltip transition="fade" bg-color="yellow-light2" color="black" top>
                <template #activator="{ on: tooltipOn }">
                  <w-icon v-on="{ ...menuOn, ...tooltipOn }" class="blue title1 clickable">mdi mdi-rodent</w-icon>
                </template>
                {{ $t('Manage your characters.') }}
              </w-tooltip>
            </template>
            <w-card content-class="px1">
              <w-flex column v-for="(slot, index) in slots" :key="index" justify-center>
                <w-flex row align-center justify-space-between class="py2">
                  {{ index }}
                  <div v-if="!slot">
                  {{ $t('Empty') }}
                  </div>
                  <w-button v-else outline @click="loadSheet(index)">
                    {{ slotName(slot)[0] }}
                    <div class="text-tiny">
                      — {{ slotName(slot)[1] }}
                    </div>
                  </w-button>
                  <div>
                    <w-tooltip transition="fade" bg-color="yellow-light2" color="black" left>
                      <template #activator="{ on }">
                        <w-button v-on="on" @click="saveSheet(index)" color="blue" class="ml2" icon="mdi mdi-content-save" />
                      </template>
                      {{ $t('Save') }}
                    </w-tooltip>
                    <w-tooltip v-if="slot" transition="fade" bg-color="yellow-light2" color="black" left>
                      <template #activator="{ on }">
                        <w-button v-on="on" @click="deleteSheet(index, slot)" color="red" class="ml2" icon="mdi mdi-delete" />
                      </template>
                      {{ $t('Delete') }}
                    </w-tooltip>
                  </div>
                </w-flex>
                <w-divider />
              </w-flex>
              <w-button text @click="createRandomSheet" class="w-max">
                <w-icon>mdi mdi-plus</w-icon>
                {{ $t('Create a new character') }}
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
      this.$refs['confirm-dialog'].open(this.$t('Delete'), this.$t('The sheet of {name} will be erased. Do you confirm?', { name: slotName } ))
        .then(confirmed => {
          if (confirmed) {
            deleteSlot(index)
            console.log('##[main] deleteSheet', index)
          }
        })
    },
    loadSheet (index) {
      const data = loadSlot(index)
      console.log('##[main] loadSheet', data)
      if (this.$refs['sheet']) this.$refs['sheet'].setData(data)
    },
    slotName (context) {
      return context.split('/')
    },
    saveSheet (index) {
      let data
      if (this.$refs['sheet']) data = this.$refs['sheet'].serialize()
      console.log('##[main] save slot', index, data.mouse.name + '/' + data.mouse.background, data)
      saveSlot(index, data, data.mouse.name + '/' + data.mouse.background)
      this.slots = listSlots()
    }
  },
  mounted () {
    this.slots = listSlots()
  }
}
</script>
