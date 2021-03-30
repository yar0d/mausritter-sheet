/* global $diceCore */
let _canvas = null
let _diceBox = null

const DICE_TIMEOUT = 300

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

  _diceBox = new $diceCore.dice.dice_box(_canvas)
  _diceBox.animate_selector = false
  _canvas.style.display = 'none'

  // does not work for mobile devices
  // $diceCore.bind(window, 'resize', function() {
  //   if (!_canvas) return
  //   console.log('#resize')
  //   _canvas.style.width = window.innerWidth - 8 + 'px'
  //   _canvas.style.height = window.innerHeight - 8 + 'px'
  //   _diceBox.reinit(_canvas)
  // })

  // $diceCore.bind(window, 'orientationChange', function() {
  //   if (!_canvas) return
  //   console.log('#orientationChange')
  //   _canvas.style.width = window.innerWidth - 8 + 'px'
  //   _canvas.style.height = window.innerHeight - 8 + 'px'
  //   _diceBox.reinit(_canvas)
  // })
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
      _canvas.style.display = 'none'
      callbackFn({ dices: result, total })
    }, 500)
    else setTimeout(() => { _canvas.style.display = 'none'}, timeout || DICE_TIMEOUT)
  }

  _canvas.style.display = ''
  _diceBox.start_throw(notation_getter, before_roll, after_roll)
}

export default {
  initialize,
  roll,
  setDiceColor
}