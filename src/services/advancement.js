export const ADVANCEMENT_TABLE = [
  { hp: 'd6', grit: 0, xp: 0 }, // Level 1
  { hp: '2d6', grit: 1, xp: 1000 }, // Level 2
  { hp: '3d6', grit: 2, xp: 3000 }, // Level 3
  { hp: '4d6', grit: 2, xp: 6000 }, // Level 4
  { hp: '4d6', grit: 3, xp: 11000 }, // Level 5
  { hp: '4d6', grit: 3, xp: 16000 }, // Level 6
  { hp: '4d6', grit: 3, xp: 21000 }, // Level 7
  { hp: '4d6', grit: 3, xp: 26000 }, // Level 8
  { hp: '4d6', grit: 3, xp: 31000 }, // Level 9
  { hp: '4d6', grit: 3, xp: 36000 }, // Level 10
  { hp: '4d6', grit: 3, xp: 41000 }, // Level 11
  { hp: '4d6', grit: 3, xp: 46000 }, // Level 12
  { hp: '4d6', grit: 3, xp: 51000 }, // Level 13
  { hp: '4d6', grit: 3, xp: 56000 }, // Level 14
  { hp: '4d6', grit: 3, xp: 61000 }, // Level 15
  { hp: '4d6', grit: 3, xp: 66000 }, // Level 16
  { hp: '4d6', grit: 3, xp: 71000 }, // Level 17
  { hp: '4d6', grit: 3, xp: 76000 }, // Level 18
  { hp: '4d6', grit: 3, xp: 81000 }, // Level 19
  { hp: '4d6', grit: 3, xp: 86000 } // Level 20
]

export function canLevelUp (xp, currentLevel) {
  let canLevelUp
  if (currentLevel < ADVANCEMENT_TABLE.length) {
    canLevelUp = xp >= ADVANCEMENT_TABLE[currentLevel].xp
  } else {
    // Compute next level
  }
  return canLevelUp
}

export default {
  ADVANCEMENT_TABLE,
  canLevelUp
}