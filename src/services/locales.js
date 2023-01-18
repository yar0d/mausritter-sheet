import { get, set } from '@/services/storage'

import languages from '@/locales/languages.json'

import en_US from '@/locales/en-US.json'
import mouse_en_US from '@/locales/mouse.en-US.json'
import items_en_US from '@/locales/items.en-US.json'
import conditions_en_US from '@/locales/conditions.en-US.json'
import spells_en_US from '@/locales/spells.en-US.json'
import hirelings_en_US from '@/locales/hirelings.en-US.json'

import fr_FR from '@/locales/fr-FR.json'
import mouse_fr_FR from '@/locales/mouse.fr-FR.json'
import items_fr_FR from '@/locales/items.fr-FR.json'
import conditions_fr_FR from '@/locales/conditions.fr-FR.json'
import spells_fr_FR from '@/locales/spells.fr-FR.json'
import hirelings_fr_FR from '@/locales/hirelings.fr-FR.json'

import es_ES from '@/locales/es-ES.json'
import mouse_es_ES from '@/locales/mouse.es-ES.json'
import items_es_ES from '@/locales/items.es-ES.json'
import conditions_es_ES from '@/locales/conditions.es-ES.json'
import spells_es_ES from '@/locales/spells.es-ES.json'
import hirelings_es_ES from '@/locales/hirelings.es-ES.json'

import de_DE from '@/locales/de-DE.json'
import mouse_de_DE from '@/locales/mouse.de-DE.json'
import items_de_DE from '@/locales/items.de-DE.json'
import conditions_de_DE from '@/locales/conditions.de-DE.json'
import spells_de_DE from '@/locales/spells.de-DE.json'
import hirelings_de_DE from '@/locales/hirelings.de-DE.json'

export const DEFAULT_LOCALE_ENGLISH = 'en-US'
export const DEFAULT_LOCALE_FRENCH = 'fr-FR'
export const DEFAULT_LOCALE_GERMAN = 'de-DE'
export const DEFAULT_LOCALE_SPANISH = 'es-ES'
export const DEFAULT_LOCALE = DEFAULT_LOCALE_ENGLISH
export const LOCALES = [DEFAULT_LOCALE_ENGLISH, DEFAULT_LOCALE_FRENCH, DEFAULT_LOCALE_GERMAN, DEFAULT_LOCALE_SPANISH].sort()

const KEY_LOCALE = 'locale'

export const datetimeFormats = {
  [DEFAULT_LOCALE_ENGLISH]: {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  },
  [DEFAULT_LOCALE_FRENCH]: {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  },
  [DEFAULT_LOCALE_GERMAN]: {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  },
  [DEFAULT_LOCALE_SPANISH]: {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  }
}

export function loadLocale () {
  let defaultLocale = DEFAULT_LOCALE

  // Detect the language of the browser
  if (/^en\b/.test(navigator.language)) defaultLocale = DEFAULT_LOCALE_ENGLISH
  else if (/^fr\b/.test(navigator.language)) defaultLocale = DEFAULT_LOCALE_FRENCH
  else if (/^de\b/.test(navigator.language)) defaultLocale = DEFAULT_LOCALE_GERMAN
  else if (/^es\b/.test(navigator.language)) defaultLocale = DEFAULT_LOCALE_SPANISH

  const locale = get(KEY_LOCALE, defaultLocale)
  // Use only our locales
  return LOCALES.includes(locale) ? locale : defaultLocale
}

export function saveLocale (locale) {
  set(KEY_LOCALE, locale || DEFAULT_LOCALE)
}

export const MESSAGES = {
  'en-US': { ...languages, ...en_US, ...mouse_en_US, ...items_en_US, ...conditions_en_US, ...hirelings_en_US, ...spells_en_US },
  'es-ES': { ...languages, ...es_ES, ...mouse_es_ES, ...items_es_ES, ...conditions_es_ES, ...hirelings_es_ES, ...spells_es_ES },
  'fr-FR': { ...languages, ...fr_FR, ...mouse_fr_FR, ...items_fr_FR, ...conditions_fr_FR, ...hirelings_fr_FR, ...spells_fr_FR },
  'de-DE': { ...languages, ...de_DE, ...mouse_de_DE, ...items_de_DE, ...conditions_de_DE, ...hirelings_de_DE, ...spells_de_DE }
}

export default {
  DEFAULT_LOCALE,
  LOCALES,
  MESSAGES,
  datetimeFormats,
  loadLocale,
  saveLocale
}