import { get, set } from '@/services/storage'

const KEY_PREFS = 'preferences'

const DEFAULT_PREFS = {}

export function loadPrefs () {
  return get(KEY_PREFS, DEFAULT_PREFS)
}

export function savePrefs (prefs) {
  set(KEY_PREFS, prefs || DEFAULT_PREFS)
  return prefs
}

export function savePrefsKey (key, value) {
  const p = loadPrefs
  p[key] = value
  return set(KEY_PREFS, p)
}

export default {
  DEFAULT_PREFS,
  loadPrefs,
  savePrefs,
  savePrefsKey
}