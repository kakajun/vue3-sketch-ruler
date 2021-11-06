export function getAbsouteOffset(el: HTMLElement) {
  let offsetTop = el.offsetTop
  let offsetLeft = el.offsetLeft

  while (el.offsetParent) {
    const parent = el.offsetParent as HTMLElement
    el = parent
    offsetTop += parent.offsetTop
    offsetLeft += parent.offsetLeft
  }

  return {
    offsetTop,
    offsetLeft
  }
}
