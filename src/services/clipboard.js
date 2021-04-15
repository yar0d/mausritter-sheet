/**
 * Copy text to the clipboard, even with HTTP
 * @param {String} textToCopy   Text to copy to the clipboard
 * @returns nothing
 * @example
 * copyToClipboard("I'm going to the clipboard !")
 *   .then(() => console.log('text copied !'))
 *   .catch(() => console.log('error'));
 */
export function copyToClipboard (textToCopy) {
  // Navigator clipboard api needs a secure context (HTTPS)
  if (navigator.clipboard && window.isSecureContext) {
    // Navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // Text area method
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // Make the textarea out of viewport
    textArea.style.position = "absolute";
    textArea.style.opacity = 0;
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      // Here the magic happens
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }
}

export default {
  copyToClipboard
}