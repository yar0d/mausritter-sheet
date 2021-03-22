export function isMobileDevice () {
  return screenWidth() < 1600
}

export function screenWidth () {
  return window.innerWidth
}

export default {
  isMobileDevice,
  screenWidth
}