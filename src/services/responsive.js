export function dialogWidth (width) {
  return isMobileDevice() ? '100%' : width || '50%'
}

export function isMobileDevice () {
  return screenWidth() < 1600
}

export function screenWidth () {
  return window.innerWidth
}

export default {
  dialogWidth,
  isMobileDevice,
  screenWidth
}