import { get, set } from '@/services/storage'

export const DEFAULT_LOCALE_ENGLISH = 'en-US'
export const DEFAULT_LOCALE_FRENCH = 'fr-FR'
export const DEFAULT_LOCALE = DEFAULT_LOCALE_ENGLISH
export const LOCALES = [DEFAULT_LOCALE_ENGLISH, DEFAULT_LOCALE_FRENCH]

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

export default {
  DEFAULT_LOCALE,
  LOCALES,
  datetimeFormats,
  loadLocale,
  saveLocale
}