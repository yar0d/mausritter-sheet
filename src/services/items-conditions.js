import conditions from './conditions.json'
import items from './items.json'

export const TYPE_CONDITION = 'C'
export const TYPE_ITEM = 'I'
export const CLASS_ITEM_ARMOR_HEAVY = 'AH'
export const CLASS_ITEM_ARMOR_LIGHT = 'AL'
export const CLASS_ITEM_AMMUNITION = 'AM'
export const CLASS_ITEM_CONTAINER = 'CO'
export const CLASS_ITEM_FOOD = 'FO'
export const CLASS_ITEM_LIGHT = 'LI'
export const CLASS_ITEM_RANGED_LIGHT = 'RL'
export const CLASS_ITEM_RANGED_HEAVY = 'RH'
export const CLASS_ITEM_SPELL = 'SP'
export const CLASS_ITEM_WEAPON_HEAVY = 'WH'
export const CLASS_ITEM_WEAPON_IMPROVISED = 'WI'
export const CLASS_ITEM_WEAPON_LIGHT = 'WL'
export const CLASS_ITEM_WEAPON_MEDIUM = 'WM'

export const conditionsList = []
for (let i = 0; i < conditions.length; i++) {
  conditions[i].id = TYPE_CONDITION + (i + 1)
  conditions[i].type = TYPE_CONDITION
  conditionsList.push(conditions[i])
}
console.log(`[init] ${conditionsList.length} conditions loaded.`)

export const itemsList = []
for (let i = 0; i < items.length; i++) {
  items[i].id = TYPE_ITEM + (i + 1)
  items[i].type = TYPE_ITEM
  itemsList.push(items[i])
}
console.log(`[init] ${itemsList.length} items loaded.`)

export default {
  conditions,
  conditionsList,
  items,
  itemsList,
  TYPE_CONDITION,
  TYPE_ITEM
}