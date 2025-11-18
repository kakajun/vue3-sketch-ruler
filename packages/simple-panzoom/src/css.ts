import type { CurrentValues, PanzoomOptions, DimensionsLite, DimensionsFull } from './types'

const prefixes = ['webkit', 'moz', 'ms']
const prefixCache: { [key: string]: string } = {}
function createStyle() {
  return document.createElement('div').style
}
function getPrefixedName(name: string) {
  if (prefixCache[name]) return prefixCache[name]
  const divStyle = createStyle()
  if (name in divStyle) return (prefixCache[name] = name)
  const capName = name[0].toUpperCase() + name.slice(1)
  for (let i = prefixes.length - 1; i >= 0; i--) {
    const prefixedName = `${prefixes[i]}${capName}`
    if (prefixedName in divStyle) return (prefixCache[name] = prefixedName)
  }
  return name
}

export function setStyle(elem: HTMLElement, name: string, value: string) {
  ;(elem.style as any)[getPrefixedName(name)] = value
}

export function setTransition(elem: HTMLElement, options: PanzoomOptions) {
  const transform = getPrefixedName('transform')
  setStyle(elem, 'transition', `${transform} ${options.duration}ms ${options.easing}`)
}

export function setTransform(elem: HTMLElement, { x, y, scale }: CurrentValues, _options?: PanzoomOptions) {
  setStyle(elem, 'transform', `scale(${scale}) translate(${x}px, ${y}px)`)
}

function getBoxStyle(elem: HTMLElement, name: string, style: CSSStyleDeclaration = window.getComputedStyle(elem)) {
  const suffix = name === 'border' ? 'Width' : ''
  return {
    left: parseFloat(style[`${name}Left${suffix}` as any]) || 0,
    right: parseFloat(style[`${name}Right${suffix}` as any]) || 0,
    top: parseFloat(style[`${name}Top${suffix}` as any]) || 0,
    bottom: parseFloat(style[`${name}Bottom${suffix}` as any]) || 0
  }
}

export function getDimensionsLite(elem: HTMLElement): DimensionsLite {
  const parent = elem.parentNode as HTMLElement
  const rectElem = elem.getBoundingClientRect()
  const rectParent = parent.getBoundingClientRect()
  return {
    elem: {
      width: rectElem.width,
      height: rectElem.height,
      left: rectElem.left,
      top: rectElem.top
    },
    parent: {
      width: rectParent.width,
      height: rectParent.height,
      left: rectParent.left,
      top: rectParent.top
    }
  }
}

export function getDimensionsFull(elem: HTMLElement): DimensionsFull {
  const parent = elem.parentNode as HTMLElement
  const style = window.getComputedStyle(elem)
  const parentStyle = window.getComputedStyle(parent)
  const rectElem = elem.getBoundingClientRect()
  const rectParent = parent.getBoundingClientRect()
  return {
    elem: {
      width: rectElem.width,
      height: rectElem.height,
      left: rectElem.left,
      top: rectElem.top,
      margin: getBoxStyle(elem, 'margin', style),
      border: getBoxStyle(elem, 'border', style)
    },
    parent: {
      width: rectParent.width,
      height: rectParent.height,
      left: rectParent.left,
      top: rectParent.top,
      padding: getBoxStyle(parent, 'padding', parentStyle),
      border: getBoxStyle(parent, 'border', parentStyle)
    }
  }
}