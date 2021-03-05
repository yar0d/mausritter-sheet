
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
  return JSON.parse(data)
}

export function saveJson (key, object) {
  set(key, uuencode.encode(JSON.stringify(object)))
}

export default {
  del,
  get,
  store
}
