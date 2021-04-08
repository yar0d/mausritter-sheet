
import uuencode from'uuencode'

const storage = window.localStorage

/**
* Store a key with its value in local storage.
* @method set
* @param {String} key   The key to set.
* @param {Mixed}  value The value that will be stored.
*/
export function set (key, value) {
  value = JSON.stringify(value)
  storage.setItem(key, value)
}

/**
* Retrieve the value of a key from local storage.
* @method get
* @param  {String} key          The key to get.
* @param  {Miked}  defaultValue The value that will be returned if no value is found in local storage.
* @return {Mixed}               Json value of the key, or the default.
*/
export function get (key, defaultValue) {
  let value
  value = storage.getItem(key, value)
  if (value === null || value === 'undefined' || value === '') {
    value = defaultValue
  } else {
    value = JSON.parse(value)
  }
  return value
}

/**
* Remove a key and its value from local storage
*/
export function del (key) {
  return storage.removeItem(key)
}

/**
* Allow a all in one getter/setter to local storage key.
* @method store
* @param  {String} key     The key to get or to set.
* @param  {Mixed}  [value] Without value, this method will retrieve key value. If you set this parameter, then the value of the key wil be set.
* @return {Mixed}          Return the value of the key or undefined if you set it.
* @example
* store('test', 42) // Set value of key "test" to 42
* store('test') // Return value of key "test": 42
*/
export function store (key, value) {
  if (value === undefined) {
    return get(key)
  } else {
    set(key, value)
  }
}

export function loadJson (key) {
  const data = uuencode.decode(get(key, ''))
  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('[storage] loadJson error:', error)
  }
}

export function saveJson (key, data) {
  set(key, uuencode.encode(JSON.stringify(data)))
}

export function encodeJson (data) {
  return uuencode.encode(JSON.stringify(data))
}

export function decodeJson (data) {
  return JSON.parse(uuencode.decode(data))
}

const SLOT_KEY_ID = 'mausritter_sheet_'
const SLOT_KEY_DATA = 'mausritter_sheet_data_'
const MAX_SLOTS = 12

export function deleteSlot (slot) {
  del(SLOT_KEY_ID + slot)
  del(SLOT_KEY_DATA + slot)
}

export function listSlots () {
  const result = []
  for (let i = 0; i < MAX_SLOTS; i++) {
    result.push(get(SLOT_KEY_ID + i, null))
  }
  return result
}

export function loadSlot (slot) {
  return loadJson(SLOT_KEY_DATA + slot)
}

export function saveSlot (slot, data, context) {
  saveJson(SLOT_KEY_DATA + slot, data)
  set(SLOT_KEY_ID + slot, context)
}

export default {
  del,
  get,
  set,
  decodeJson,
  encodeJson,
  loadJson,
  saveJson,
  deleteSlot,
  listSlots,
  loadSlot,
  saveSlot,
  store
}
