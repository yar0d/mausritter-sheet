import hirelings from './hirelings.json'

export const TYPE_HIRELINGS = 'H'

export const hirelingsList = []
for (let i = 0; i < hirelings.length; i++) {
  hirelings[i].id = TYPE_HIRELINGS + '-' + hirelings[i].label.toLowerCase().replace(' ', '-')
  hirelings[i].type = TYPE_HIRELINGS
  hirelingsList.push(hirelings[i])
}

console.log(`[init] ${hirelingsList.length} hirelings loaded.`)

export default {
  hirelings,
  hirelingsList,
  TYPE_HIRELINGS
}
