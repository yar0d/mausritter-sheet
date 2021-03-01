import conditions from './conditions.json'
import items from './items.json'

export const TYPE_CONDITION = 'C'
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

export const conditionsList = []
for (let i = 0; i < conditions.length; i++) {
  conditions[i].id = TYPE_CONDITION + (i + 1)
  conditions[i].type = TYPE_CONDITION
  conditionsList.push(conditions[i])
}

console.log(`[init] ${conditionsList.length} conditions loaded.`)

export const itemsList = []
for (let i = 0; i < items.length; i++) {
  items[i].id = TYPE_ITEM + '-' + items[i].label.toLowerCase().replace(' ', '-')
  items[i].type = TYPE_ITEM
  itemsList.push(items[i])
}

export function getItem (id) {
  let found
  let i = 0
  while (!found && i < itemsList.length) {
    if (itemsList[i].id === id) found = itemsList[i]
    i++
  }
  return found
}

console.log(`[init] ${itemsList.length} items loaded.`)

export default {
  conditions,
  conditionsList,
  getItem,
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
  items,
  itemsList,
  TYPE_CONDITION,
  TYPE_ITEM
}