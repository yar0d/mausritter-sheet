<template>
  <w-dialog v-model="showDialog" :width="500" transition="scale" :title="$t('About')" content-class="w-flex column align-start justify-center pa2">
    <div class="title2 orange-dark1 text-center w-max my4">
      Mausritter Sheet {{ version }}
      <span v-if="isStandaloneApp" color="brown">{{ $t('application') }}</span>
    </div>
    <div class="mt4">
      {{ $t('This application is an independent production by Daniel Coquette and is not affiliated with Losing Games. It is published under the Mausritter Third Party Licence.') }}
    </div>
    <div class="mt4">{{ $t('Mausritter is copyright Losing Games.') }}</div>
    <div class="mt4">{{ $t('This application is copyright Daniel Coquette.') }}
      <div class="ml4 mt1"><w-icon sm color="grey">mdi mdi-translate</w-icon> {{ $t('en-US') }} <w-icon>mdi mdi-arrow-right</w-icon> Yar0d</div>
      <div class="ml4"><w-icon sm color="grey">mdi mdi-translate</w-icon> {{ $t('es-ES') }} <w-icon>mdi mdi-arrow-right</w-icon> CoyoteBlur</div>
      <div class="ml4"><w-icon sm color="grey">mdi mdi-translate</w-icon> {{ $t('fr-FR') }} <w-icon>mdi mdi-arrow-right</w-icon> Yar0d</div>
    </div>

    <div class="mt4">{{ $t('3D dices from Anton Natarov') }} <a href="http://a.teall.info/mdice/">http://a.teall.info/mdice</a>.</div>
    <div class="mt4">{{ $t('Welcome, History and Hirelings background from') }} <a href="https://www.deviantart.com/irbeus">irbeus</a> {{ $t('under licence') }} <a href="https://creativecommons.org/licenses/by/3.0/">CC Attribution 3.0 License</a> and <a href="https://creativecommons.org/licenses/by-nc-nd/3.0/">CC Attribution-Noncommercial-No Derivative Works 3.0 License</a>.</div>
    <!-- <div class="mt4">{{ $t('Additional rules from ') }} <a href="https://sites.google.com/view/talesfrommoonshore/">Tales from Moonshore</a>.</div> -->
    <div class="w-max text-right">
      <w-button class="mt6" @click="showDialog = false" bg-color="error" dark>{{ $t('Close') }}</w-button>
    </div>
  </w-dialog>
</template>

<script>
import { version } from '../../package.json'

export default {
  name: 'About',
  data () {
    return {
      showDialog: false,
      version
    }
  },
  computed: {
    isStandaloneApp () { return this.$store.getters['standaloneApp'] }
  },
  methods: {
    show () {
      this.showDialog = true
    }
  }
}
</script>