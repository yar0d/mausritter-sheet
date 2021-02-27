export const backgrounds = [
  { hp: 1, pips: 1, label: 'Test subject', items: ['Spell: Magic missile', 'Lead coat (Heavy armour)'] },
  { hp: 1, pips: 2, label: 'Kitchen forager', items: ['Shield & jerkin (Light armour)', 'Cookpots'] },
  { hp: 1, pips: 3, label: 'Cage', items: ['dweller Spell: Be understood', 'Bottle of milk'] },
  { hp: 1, pips: 4, label: 'Hedge witch', items: ['Spell: Heal', 'Incense stick'] },
  { hp: 1, pips: 5, label: 'Leatherworker', items: ['Shield & jerkin (Light armour)', 'Shears'] },
  { hp: 1, pips: 6, label: 'Street tough', items: ['Dagger (Light, d6)', 'Flask of coffee'] },
  { hp: 2, pips: 1, label: 'Mendicant priest', items: ['Spell: Restore', 'Holy symbol'] },
  { hp: 2, pips: 2, label: 'Beetleherd', items: ['Hireling: Loyal beetle', 'Pole, 6"'] },
  { hp: 2, pips: 3, label: 'Ale brewer', items: ['Hireling: Drunken torchbearer', 'Small barrel of ale'] },
  { hp: 2, pips: 4, label: 'Fishermouse', items: ['Net', 'Needle (Light, d6)'] },
  { hp: 2, pips: 5, label: 'Blacksmith', items: ['Hammer (Medium, d6/d8)', 'Metal file'] },
  { hp: 2, pips: 6, label: 'Wireworker', items: ['Wire, spool', 'Electric lantern'] },
  { hp: 3, pips: 1, label: 'Woodcutter', items: ['Axe (Medium, d6/d8)', 'Twine, roll'] },
  { hp: 3, pips: 2, label: 'Bat cultist', items: ['Spell: Darkness', 'Bag of bat teeth'] },
  { hp: 3, pips: 3, label: 'Tin miner', items: ['Pickaxe (Medium, d6/d8)', 'Lantern'] },
  { hp: 3, pips: 4, label: 'Trash collector', items: ['Trashhook (Heavy, d10)', 'Mirror'] },
  { hp: 3, pips: 5, label: 'Wall rover', items: ['Fishhook', 'Thread, spool'] },
  { hp: 3, pips: 6, label: 'Merchant', items: ['Hireling: Pack rat', '20p IOU from a noblemouse'] },
  { hp: 4, pips: 1, label: 'Raft crew', items: ['Hammer (Medium, d6/d8)', 'Wooden spikes'] },
  { hp: 4, pips: 2, label: 'Worm wrangler', items: ['Pole, 6"', 'Soap'] },
  { hp: 4, pips: 3, label: 'Sparrow rider', items: ['Fishhook', 'Goggles'] },
  { hp: 4, pips: 4, label: 'Sewer guide', items: ['Metal file', 'Thread, spool'] },
  { hp: 4, pips: 5, label: 'Prison guard', items: ['Chain, 6"', 'Spear (Heavy, d10)'] },
  { hp: 4, pips: 6, label: 'Fungus farmer', items: ['Dried mushroom (as rations)', 'Spore mask'] },
  { hp: 5, pips: 1, label: 'Dam builder', items: ['Shovel', 'Wooden spikes'] },
  { hp: 5, pips: 2, label: 'Cartographer', items: ['Quill & ink', 'Compass'] },
  { hp: 5, pips: 3, label: 'Trap thief', items: ['Block of cheese', 'Glue'] },
  { hp: 5, pips: 4, label: 'Vagabond', items: ['Tent', 'Treasure map, dubious'] },
  { hp: 5, pips: 5, label: 'Grain farmer', items: ['Spear (Heavy, d10)', 'Whistle'] },
  { hp: 5, pips: 6, label: 'Message runner', items: ['Bedroll', 'Documents, sealed'] },
  { hp: 6, pips: 1, label: 'Troubadour', items: ['Musical instrument', 'Disguise kit'] },
  { hp: 6, pips: 2, label: 'Gambler', items: ['Set of loaded dice', 'Mirror'] },
  { hp: 6, pips: 3, label: 'Sap tapper', items: ['Bucket', 'Wooden spikes'] },
  { hp: 6, pips: 4, label: 'Bee keeper', items: ['Jar of honey', 'Net'] },
  { hp: 6, pips: 5, label: 'Librarian', items: ['Scrap of obscure book', 'Quill & ink'] },
  { hp: 6, pips: 6, label: 'Pauper noblemouse', items: ['Felt hat', 'Perfume'] }
]

export function extract (hp, pips) {
  let found
  let i = 0
  while (!found && i < backgrounds.length) {
    if (backgrounds[i].hp === hp && backgrounds[i].pips === pips) found = backgrounds[i]
    i++
  }
  return found
}

export default {
  backgrounds,
  extract
}
