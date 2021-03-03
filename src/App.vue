<template>
  <w-app id="app">
    <main class="grow">
      <sheet ref="sheet"/>
    </main>
    <footer>
      <sheet-toolbar ref="sheet-toolbar">
        <template #actions-append>
          <w-tooltip transition="fade" bg-color="yellow-light2" color="black" top>
            <template #activator="{ on }">
              <w-icon v-on="on" @click="createRandomSheet" class="blue title1 clickable">mdi mdi-dice-multiple</w-icon>
            </template>{{ $t('Create a new character') }}
          </w-tooltip>
        </template>
      </sheet-toolbar>
    </footer>
  </w-app>
</template>

<script>
import Sheet from '@/components/Sheet.vue'
import SheetToolbar from '@/components/SheetToolbar.vue'

export default {
  name: 'App',
  components: { Sheet, SheetToolbar },
  methods: {
    createRandomSheet () {
      if (this.$refs['sheet-toolbar']) this.$refs['sheet-toolbar'].displayDrawer(false)
      if (this.$refs['sheet']) this.$refs['sheet'].createRandomSheet()
    }
  }
}
</script>
