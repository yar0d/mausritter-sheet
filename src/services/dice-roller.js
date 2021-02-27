const DEFAULT_DICE = { number: 1, faces: 6, modifier: 0, post: undefined }

function sum(dices) {
  let result = 0
  for (let i = 0; i < dices.length; i++) result += dices[i]
  return result
}

/*
* Accepts the following syntax:
*
* ```[b|w]<number><face>[modifier]```
*
* - b: *optional* keep the best dice.
* - w: *optional* keep the worst dice.
* - <number>: Number of dice to roll. If not choosing best or worst dice, the sum of dices will be the result.
* - <face>: Number of faces of the dice.
* - modifier: *optional* A number to add (+) or subtract (-) to the total. This modifier is applied only on total, not on each dice roll.
*
* **Example with w2d6-1**: Worst of two six-sided dices minus one. We roll «6» and «3», we keep «3» and subtract 1, so total is «2».
*
* ```js
* {
*   total: 2,
*   dices: [ 6, 3 ],
*   dice: 'w2d6-1',
*   number: 2,
*   faces: 6,
*   modifier: -1,
*   post: [Function: min]
* }
* ```
*
* **Attributes**:
* - total: The result of dices that were rolled.
* - dices: Array that contains each dice rolled.
* - dice: The dice that was asked for.
* - number: The number of dices that was rolled.
* - faces: The number of faces of the dices rolled.
* - modifier: The modifier that number of faces of the dices rolled.
* - post: This is the function that modify the total. It's called with destructured dices attributes. In our example, we called ```Math.min(6, 3)```.
*/
export function rollCustom (formula) {
  let opt = { ...DEFAULT_DICE }

  // Accept String: d4, 2D6+4, 2d6-1, d12, b3d10, w2d8
  if (typeof formula === 'string') {
    let _dice = formula
    _dice = formula.toLowerCase()
    if (formula[0] === 'b') {
      opt.post = Math.max
      _dice = formula.slice(1)
    } else if (formula[0] === 'w') {
      opt.post = Math.min
      _dice = formula.slice(1)
    }
    const param = _dice.split('d') // 2d6+4 --> ['2', '6+4']
    opt.number = Number(param[0]) || 1 // d10 -> 1

    let faces = param[1].split('-') // 6+4 --> ['6+4']
    if (faces.length === 1) faces = param[1].split('+') // 6+4 --> ['6', '4']
    else opt.modifier = -Number(faces[1]) // -1
    if (faces.length === 1) {
      opt.faces = Number(param[1]) // 3d8 --> 8
      opt.modifier = 0
    } else {
      opt.faces = Number(faces[0]) // 6
      opt.modifier = opt.modifier || Number(faces[1]) // +4
    }
  } else {
    // Accept { Number number, Number face, Number modifier, Function post }
    opt = Object.assign(DEFAULT_DICE, formula)
  }

  const result = {
    total: 0,
    dices: [],
    formula,
    ...opt
  }
  let d
  for (let i = 0; i < opt.number; i++) {
    d = Math.trunc(Math.random() * opt.faces + 1)
    result.total += d
    result.dices.push(d)
  }
  // Call post roll processing
  if (typeof opt.post === 'function') {
    result.total = opt.post(...result.dices)
  }
  // Add modifier if any
  result.total += opt.modifier

  return result
}

/*
* Single dice roll. Return the Result as Number.
*/
export function d2 () { return Math.trunc(Math.random() * 2 + 1) }
export function d3 () { return Math.trunc(Math.random() * 3 + 1) }
export function d4 () { return Math.trunc(Math.random() * 4 + 1) }
export function d6 () { return Math.trunc(Math.random() * 6 + 1) }
export function d8 () { return Math.trunc(Math.random() * 8 + 1) }
export function d10 () { return Math.trunc(Math.random() * 10 + 1) }
export function d12 () { return Math.trunc(Math.random() * 12 + 1) }
export function d20 () { return Math.trunc(Math.random() * 20 + 1) }
export function d30 () { return Math.trunc(Math.random() * 30 + 1) }
export function d66 () { return d6() * 10 + d6() }
export function d100 () { return Math.trunc(Math.random() * 100 + 1) }

/**
 * This method return one random item from the given array.
 * @param {Array} table The table to get one item from.
 * @returns {Mixed}  The item randomly choosen.
 */
export function rollFromTable (table) {
  const roll = Math.trunc(Math.random() * table.length)
  return table[roll]
}

/**
 * Return the highest results for multiples dice rolls.
 * @param {Number} number The number of dices to roll.
 * @param {Number} faces The number of caes for the dices.
 * @param {Number} keep The number of highest result to keep.
 * @returns {Object} The total and the array of dices.
 */export function rollExplode (number = 2, faces = 6, keep = 1) {
  let roll = rollCustom(`${number}d${faces}`).dices
  roll.sort((a, b) => { return b - a })
  return { total: sum(roll.slice(0, keep)), dices: roll }
}

/**
 * Return the lowest results for multiples dice rolls.
 * @param {Number} number The number of dices to roll.
 * @param {Number} faces The number of caes for the dices.
 * @param {Number} keep The number of lowest result to keep.
 * @returns {Object} The total and the array of dices.
 */
export function rollImplode (number = 2, faces = 6, keep = 1) {
  let roll = rollCustom(`${number}d${faces}`).dices
  roll = roll.sort((a, b) => { return a - b })
  return { total: sum(roll.slice(0, keep)), dices: roll }
}

/*
* By default roll() is for «2d6» dices.
*/
export function roll ({ number = 2, faces = 6, modifier = 0 } = {}) {
  let result = 0
  for (let i = 0; i < number; i++) {
    result += Math.trunc(Math.random() * faces + 1)
  }
  return result + modifier
}

export default {
  d2,
  d3,
  d4,
  d6,
  d8,
  d10,
  d12,
  d20,
  d30,
  d66,
  d100,
  rollCustom,
  rollExplode,
  rollFromTable,
  rollImplode,
  sum
}