<template>
  <w-app id="app">
    <main class="grow">
      <w-flex basis-zero wrap class="h-max">
        <w-flex row align-start justify-space-between>
          <w-flex column justify-space-between>
            <sheet id="sheet" ref="sheet"/>

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
                        <w-button v-else :text="index !== currentSlot" :disabled="index === currentSlot" @click="loadSheet(index)">
                          {{ slotName(slot)[0] }}
                          <div class="text-small">
                            — {{ slotName(slot)[1] }} — {{ $t('Level') }} {{ slotName(slot)[2] }}
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
          </w-flex>

          <w-flex column justify-space-between class="w-max">
            <!-- eslint-disable vue/valid-v-slot -->
            <w-tabs :items="3" fill-bar bg-color="grey-light5">
              <template #item-title.1> <!-- HISTORY -->
                <w-icon class="mr1" xl>
                  mdi mdi-history
                </w-icon>
                {{ $t('History') }}
              </template>

              <template #item-content.1>
                <history v-model="showHistory" />
              </template>

              <template #item-title.2> <!-- HIRELINGS -->
                <w-icon class="mr1" xl>
                  mdi mdi-donkey
                </w-icon>
                {{ $t('Hirelings') }}
              </template>

              <template #item-content.2>
                <hirelings />
              </template>

              <template #item-title.3> <!-- RULES -->
                <w-icon class="mr1">
                  mdi mdi-book-open-page-variant
                </w-icon>
                {{ $t('Summary of rules') }}
              </template>

              <template #item-content.3>
                <rules />
              </template>
            </w-tabs>
          </w-flex>
        </w-flex>
      </w-flex>
    </main>
    <confirm-dialog ref="confirm-dialog" />
  </w-app>
</template>

<script>
import { deleteSlot, listSlots, loadSlot, saveSlot } from '@/services/storage'
import Sheet from '@/components/Sheet.vue'
import SheetToolbar from '@/components/SheetToolbar.vue'
import History from '@/components/History.vue'
import Hirelings from '@/components/Hirelings.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import Rules from './components/Rules.vue'

export default {
  name: 'App',
  components: { Sheet, SheetToolbar, ConfirmDialog, History, Hirelings, Rules },
  data () {
    return {
      currentSlot: null,
      showSlotMenu: false,
      slots: [],
      tab: 1
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
    dataSignature (data) {
      return data.sheet.name + '/' + data.sheet.background + '/' + data.sheet.level
    },
    load (index) {
      const data = loadSlot(index)
      if (this.$refs['sheet']) this.$refs['sheet'].setData(data)
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
    slotName (context) {
      return context.split('/')
    },
    save (index, data) {
      console.log('##[main] save slot', index, this.dataSignature(data), data)
      saveSlot(index, data, this.dataSignature(data))
      this.slots = listSlots() // Refresh slot list
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
