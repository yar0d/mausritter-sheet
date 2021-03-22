/* global $diceCore */
let _canvas = null
let _diceBox = null

const DICE_TIMEOUT = 3000

export function setDiceColor (color) {
  $diceCore.dice.dice_color = color
  $diceCore.dice.label_color = '#ffffff'
}

export function initialize (canvasId) {
  if (_canvas !== null) return // Already initialized

  _canvas = $diceCore.id(canvasId)
  _canvas.style.width = window.innerWidth - 8 + 'px'
  _canvas.style.height = window.innerHeight - 16 + 'px'

  $diceCore.dice.use_true_random = false
  $diceCore.dice.use_shadows = false
  setDiceColor('#000070')

  _diceBox = new $diceCore.dice.dice_box(_canvas, { w: 500, h: 300 })
  _diceBox.animate_selector = false
  _canvas.style.display = 'none'
}

export function roll({ formula = '2d6', timeout, callbackFn }) {

  function before_roll(vectors, notation, callback) {
    callback()
  }

  function notation_getter() {
    return $diceCore.dice.parse_notation(formula)
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
  roll,
  setDiceColor
}