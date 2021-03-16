<template>
  <w-dialog v-model="showDialog" :width="400" transition="scale" :title="$t('About')" content-class="w-flex column align-start justify-center pa2">
    <w-card outlined :title="$t('Languages')" class="w-max">
      <w-flex justice-space-between class="pa4">
        <w-button v-for="lang in LOCALES" :key="lang" :color="locale === lang ? '' : 'primary'" class="mx2" @click="changeLocale(lang)">
          {{ $t(lang) }}
        </w-button>
      </w-flex>
    </w-card>
    <div class="mt4">
      {{ $t('This application is an independent production by Daniel Coquette and is not affiliated with Losing Games. It is published under the Mausritter Third Party Licence.') }}
    </div>
    <div class="mt4">{{ $t('Mausritter is copyright Losing Games.') }}</div>
    <div class="mt4">{{ $t('This application is copyright Daniel Coquette.') }}</div>
    <div class="mt4">{{ $t('Sheet, bank and drawer backgrounds from DevianArt under license') }} <a href="https://creativecommons.org/licenses/by/3.0/">CC Attribution 3.0 License</a> and <a href="https://creativecommons.org/licenses/by-nc-nd/3.0/">CC Attribution-Noncommercial-No Derivative Works 3.0 License</a></div>
    <div class="mt4">{{ $t('Welcome, History and Hirelings background from') }} <a href="https://www.deviantart.com/irbeus">irbeus</a> {{ $t('under licence') }} <a href="https://creativecommons.org/licenses/by/3.0/">CC Attribution 3.0 License</a> and <a href="https://creativecommons.org/licenses/by-nc-nd/3.0/">CC Attribution-Noncommercial-No Derivative Works 3.0 License</a></div>
    <!-- <div class="mt4">{{ $t('Hirelings background from') }} <a href="https://www.deviantart.com/clintcearley">clintcearley</a> {{ $t('under licence') }}</div> -->
    <!-- <div class="mt4">{{ $t('Additionnals rules from ') }} <a href="https://sites.google.com/view/talesfrommoonshore/">Tales from Moonshore</a>.</div> -->
    <div class="w-max text-right">
      <w-button class="mt6" @click="showDialog = false" bg-color="error" dark>{{ $t('Close') }}</w-button>
    </div>
  </w-dialog>
</template>

<script>
import { LOCALES, DEFAULT_LOCALE, loadLocale, saveLocale } from '@/services/locales'

export default {
  name: 'About',
  data () {
    return {
      DEFAULT_LOCALE,
      LOCALES,
      locale: null,
      showDialog: false
    }
  },
  methods: {
    changeLocale (newLocale) {
      this.locale = newLocale || DEFAULT_LOCALE
      this.$i18n.locale = this.locale
      this.$store.dispatch('changeLocale', this.locale)
      saveLocale(this.locale)
    },
    show () {
      this.showDialog = true
    }
  },
  created () {
    this.changeLocale(loadLocale())
  }
}
</script>