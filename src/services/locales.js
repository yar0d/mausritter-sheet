import { get, set } from '@/services/storage'

export const DEFAULT_LOCALE = 'en_US'
export const LOCALES = ['en_US', 'fr_FR']

const KEY_LOCALE = 'locale'

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
  loadLocale,
  saveLocale
}