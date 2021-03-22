export function isMobileDevice () {
  return screenWidth() < 1600
}

export function screenWidth () {
  return window.screen.availWidth
}

export default {
  isMobileDevice,
  screenWidth
}