/* global $t */
let _canvas = null
let _diceBox = null

const DICE_TIMEOUT = 3000

export function initialize (canvasId) {
  console.log('## [dice3d] initialize')
  if (_canvas !== null) return // Already initialized

  _canvas = $t.id(canvasId)
  console.log('## [dice3d] canvas', _canvas)
  _canvas.style.width = window.innerWidth - 1 + 'px'
  _canvas.style.height = window.innerHeight - 1 + 'px'

  $t.dice.use_true_random = false
  $t.dice.use_shadows = false
  $t.dice.dice_color = '#000080'
  $t.dice.label_color = '#ffffff'

  _diceBox = new $t.dice.dice_box(_canvas, { w: 500, h: 300 })
  console.log('## $t.dice:', $t.dice)
  _diceBox.animate_selector = false
  _canvas.style.display = 'none'
}

export function roll({ formula = '2d6', timeout, callbackFn }) {

  function before_roll(vectors, notation, callback) {
    callback()
  }

  function notation_getter() {
    return $t.dice.parse_notation(formula)
  }

  function after_roll(notation, result) {
    let total = 0
    for (let i = 0; i < result.length; i++) total += result[i]
    if (callbackFn) setTimeout(() => {
      callbackFn({ dices: result, total })
    }, 750)
  }

  _canvas.style.display = ''
  _diceBox.start_throw(notation_getter, before_roll, after_roll)
  setTimeout(() => {
    _canvas.style.display = 'none'
  }, timeout || DICE_TIMEOUT)
}

export default {
  initialize,
  roll
}