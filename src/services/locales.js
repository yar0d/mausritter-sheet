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

export const DEFAULT_LOCALE_ENGLISH = 'en-US'
export const DEFAULT_LOCALE_FRENCH = 'fr-FR'
export const DEFAULT_LOCALE_SPANISH = 'es-ES'
export const DEFAULT_LOCALE = DEFAULT_LOCALE_ENGLISH
export const LOCALES = [DEFAULT_LOCALE_ENGLISH, DEFAULT_LOCALE_FRENCH, DEFAULT_LOCALE_SPANISH].sort()

const KEY_LOCALE = 'locale'

console.log('[locales] Available languages:', Object.keys(languages).join(', '))

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
  if (/^en\b/.test(navigator.language)) defaultLocale = DEFAULT_LOCALE_ENGLISH
  else if (/^fr\b/.test(navigator.language)) defaultLocale = DEFAULT_LOCALE_FRENCH

  const locale = get(KEY_LOCALE, defaultLocale)
  // Use only our locales
  return LOCALES.includes(locale) ? locale : defaultLocale
}

export function saveLocale (locale) {
  set(KEY_LOCALE, locale || DEFAULT_LOCALE)
}

export const MESSAGES = {
  'en-US': { ...languages, ...en_US, ...mouse_en_US, ...items_en_US, ...conditions_en_US, ...hirelings_en_US, ...spells_en_US },
  'fr-FR': { ...languages, ...fr_FR, ...mouse_fr_FR, ...items_fr_FR, ...conditions_fr_FR, ...hirelings_fr_FR, ...spells_fr_FR },
  'es-ES': { ...languages, ...es_ES, ...mouse_es_ES, ...items_es_ES, ...conditions_es_ES, ...hirelings_es_ES, ...spells_es_ES }
}

export default {
  DEFAULT_LOCALE,
  LOCALES,
  MESSAGES,
  datetimeFormats,
  loadLocale,
  saveLocale
}