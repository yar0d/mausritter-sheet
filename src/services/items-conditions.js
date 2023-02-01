import { v4 as uuidv4 } from 'uuid'
import conditions from './conditions.json'
import items from './items.json'

export const TYPE_CONDITION = 'C'
export const CONDITION_CLEAR_SHORT_REST = 'SR'
export const CONDITION_CLEAR_LONG_REST = 'LR'
export const CONDITION_CLEAR_FULL_REST = 'FR'
export const CONDITION_CLEAR_MEAL = 'ME'
export const CONDITION_FAMILY_BASE = 'BA'
export const CONDITION_FAMILY_CUSTOM = 'CU'
export const CONDITION_FAMILY_MISCELLANEOUS = 'MI'

export const TYPE_ITEM = 'I'
export const ITEM_FAMILY_ARMOR_HEAVY = 'AH'
export const ITEM_FAMILY_ARMOR_LIGHT = 'AL'
export const ITEM_FAMILY_AMMUNITION = 'AM'
export const ITEM_FAMILY_CONTAINER = 'CO'
export const ITEM_FAMILY_CUSTOM = 'CU'
export const ITEM_FAMILY_FOOD = 'FO'
export const ITEM_FAMILY_LIGHT = 'LI'
export const ITEM_FAMILY_MISCELLANEOUS = 'MI'
export const ITEM_FAMILY_RANGED_LIGHT = 'RL'
export const ITEM_FAMILY_RANGED_HEAVY = 'RH'
export const ITEM_FAMILY_SPELL = 'SP'
export const ITEM_FAMILY_WEAPON_HEAVY = 'WH'
export const ITEM_FAMILY_WEAPON_IMPROVISED = 'WI'
export const ITEM_FAMILY_WEAPON_LIGHT = 'WL'
export const ITEM_FAMILY_WEAPON_MEDIUM = 'WM'

export const ITEM_FAMILY_WEAPONS = [ITEM_FAMILY_WEAPON_HEAVY, ITEM_FAMILY_WEAPON_IMPROVISED, ITEM_FAMILY_WEAPON_LIGHT, ITEM_FAMILY_WEAPON_MEDIUM, ITEM_FAMILY_RANGED_LIGHT, ITEM_FAMILY_RANGED_HEAVY]

export function normalizeCondition (condition) {
  return {
    ...condition,
    id: TYPE_CONDITION + '-' + condition.label.toLowerCase().replace(' ', '-'),
    type: TYPE_CONDITION,
    family: conditions.family || CONDITION_FAMILY_BASE,
  }
}
export function normalizeConditions(conditions) {
  const conditionsList = []
  for (let i = 0; i < conditions.length; i++) {
    conditionsList.push(normalizeCondition(conditions[i]))
  }
  return conditionsList
}

export const conditionsList = normalizeConditions(conditions)
console.log(`[init] ${conditionsList.length} conditions loaded.`)

export function normalizeItem(item) {
  return {
    ...item,
    id: TYPE_ITEM + '-' + item.label.toLowerCase().replace(' ', '-'),
    type: TYPE_ITEM
  }
}
export function normalizeItems(items) {
  const itemsList = []
  for (let i = 0; i < items.length; i++) {
    itemsList.push(normalizeItem(items[i]))
  }
  return itemsList
}

export const itemsList = normalizeItems(items)
console.log(`[init] ${itemsList.length} items loaded.`)


/**
 * Return items if they are from given families.
 * @param {String|Array} families A single family or an array of family to filter items.
 * @return {Array} a list a copy of items.
 */
export function getItemsForFamilies (families) {
  let f
  if (!Array.isArray(families)) f = [families]
  else f = families

  const result = []
  for (let i = 0; i < items.length; i++) {
    if (f.includes(items[i].family)) result.push(normalizeItem({ ...items[i], used: 0, uuid: uuidv4() }))
  }

  return result
}

export function getItemEncumbrance (item) {
  switch (item.geometry) {
    case '1x1': return 1
    case '2x1':
    case '1x2': return 2
    case '2x2': return 4
    default: return 1
  }
}

/**
 * Return an item according to its id.
 * @param {String} Identifier of the item. See items.json for the list of items.
 * @param {Object} { customLabel, desc }  This is use for a custom item (id: "I-item").
 * @return {Object} a copy of an item.
 */
export function getItem (id, { customLabel, desc } = {}) {
  let found
  let i = 0
  while (!found && i < itemsList.length) {
    if (itemsList[i].id === id) found = normalizeItem({ ...itemsList[i], used: 0, uuid: uuidv4() })
    i++
  }
  if (found) {
    if (customLabel) found.customLabel = customLabel
    if (desc) found.desc = desc
  }

  return found
}

export default {
  CONDITION_CLEAR_SHORT_REST,
  CONDITION_CLEAR_LONG_REST,
  CONDITION_CLEAR_FULL_REST,
  CONDITION_CLEAR_MEAL,
  conditions,
  conditionsList,
  getItem,
  getItemEncumbrance,
  getItemsForFamilies,
  ITEM_FAMILY_ARMOR_HEAVY,
  ITEM_FAMILY_ARMOR_LIGHT,
  ITEM_FAMILY_AMMUNITION,
  ITEM_FAMILY_CONTAINER,
  ITEM_FAMILY_CUSTOM,
  ITEM_FAMILY_FOOD,
  ITEM_FAMILY_LIGHT,
  ITEM_FAMILY_MISCELLANEOUS,
  ITEM_FAMILY_RANGED_LIGHT,
  ITEM_FAMILY_RANGED_HEAVY,
  ITEM_FAMILY_SPELL,
  ITEM_FAMILY_WEAPON_HEAVY,
  ITEM_FAMILY_WEAPON_IMPROVISED,
  ITEM_FAMILY_WEAPON_LIGHT,
  ITEM_FAMILY_WEAPON_MEDIUM,
  ITEM_FAMILY_WEAPONS,
  items,
  itemsList,
  normalizeCondition,
  normalizeConditions,
  normalizeItem,
  normalizeItems,
  TYPE_CONDITION,
  TYPE_ITEM
}