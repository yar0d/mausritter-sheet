import { get, set } from '@/services/storage'

export const DEFAULT_LOCALE = 'en-US'
export const LOCALES = ['en-US', 'fr-FR']

const KEY_LOCALE = 'locale'

export const datetimeFormats = {
  'en-US': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  },
  'fr-FR': {
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
  const locale = get(KEY_LOCALE, DEFAULT_LOCALE)
  // Use only our locales
  return LOCALES.includes(locale) ? locale : DEFAULT_LOCALE
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