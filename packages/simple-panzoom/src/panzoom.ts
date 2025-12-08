import type {
  PanzoomObject,
  PanzoomOptions,
  PanzoomEventDetail,
  PanOptions,
  ZoomOptions,
  Dimensions
} from './types'
import { addPointer, getMiddle, removePointer } from './pointers'
import { destroyPointer, onPointer } from './events'
import { getDimensionsLite, getDimensionsFull, setStyle, setTransform, setTransition } from './css'
import isAttached from './isAttached'
import shallowClone from './shallowClone'

const defaultOptions: PanzoomOptions = {
  animate: false,
  canvas: false,
  cursor: 'move',
  disablePan: false,
  disableZoom: false,
  duration: 200,
  easing: 'ease-in-out',
  handleStartEvent: (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  },
  maxScale: 4,
  minScale: 0.125,
  overflow: 'hidden',
  setTransform,
  startX: 0,
  startY: 0,
  startScale: 1,
  step: 0.3,
  touchAction: 'none',
  origin: '50% 50%'
}

function Panzoom(elem: HTMLElement, options?: Omit<PanzoomOptions, 'force'>): PanzoomObject {
  if (!elem || (elem as any).nodeType !== 1) throw new Error('Panzoom requires an element')
  if (!isAttached(elem)) throw new Error('Panzoom should be called on attached elements')

  options = { ...defaultOptions, ...options }

  const parent = elem.parentNode as HTMLElement
  parent.style.overflow = options.overflow
  parent.style.userSelect = 'none'
  parent.style.touchAction = options.touchAction
  ;(options!.canvas ? parent : elem).style.cursor = options!.cursor

  elem.style.userSelect = 'none'
  elem.style.touchAction = options.touchAction
  setStyle(
    elem,
    'transformOrigin',
    typeof options!.origin === 'string' ? (options as any).origin : '50% 50%'
  )

  function resetStyle() {
    parent.style.overflow = ''
    parent.style.userSelect = ''
    parent.style.touchAction = ''
    parent.style.cursor = ''
    elem.style.cursor = ''
    elem.style.userSelect = ''
    elem.style.touchAction = ''
    setStyle(elem, 'transformOrigin', '')
  }

  function setOptions(opts: Omit<PanzoomOptions, 'force'> = {}) {
    for (const key in opts)
      if (Object.prototype.hasOwnProperty.call(opts, key))
        (options as any)[key] = (opts as any)[key]
    if (opts.hasOwnProperty('cursor') || opts.hasOwnProperty('canvas')) {
      parent.style.cursor = elem.style.cursor = ''
      ;(options!.canvas ? parent : elem).style.cursor = options!.cursor
    }
    if (opts.hasOwnProperty('overflow')) parent.style.overflow = (opts as any).overflow
    if (opts.hasOwnProperty('touchAction')) {
      parent.style.touchAction = (opts as any).touchAction
      elem.style.touchAction = (opts as any).touchAction
    }
  }

  let x = 0
  let y = 0
  let scale = 1
  let isPanning = false
  zoom(options.startScale, { animate: false, force: true } as any)
  setTimeout(() => {
    pan(options.startX as number, options.startY as number, { animate: false, force: true } as any)
  })

  function trigger(detail: PanzoomEventDetail, opts: PanzoomOptions) {
    if (opts.silent) return
    const event = new CustomEvent('panzoomchange', { detail })
    elem.dispatchEvent(event)
  }

  function setTransformWithEvent(
    opts: PanzoomOptions,
    originalEvent?: PanzoomEventDetail['originalEvent']
  ) {
    const value = { x, y, scale }
    if (typeof opts.animate === 'boolean') {
      if (opts.animate) setTransition(elem, opts)
      else setStyle(elem, 'transition', 'none')
    }
    opts.setTransform!(elem, value, opts)
    const emit = () => {
      const dims: Dimensions =
        opts.contain && opts.contain !== 'none'
          ? (getDimensionsFull(elem) as any)
          : (getDimensionsLite(elem) as any)
      trigger({ x, y, scale, dimsOut: dims, originalEvent }, opts)
    }
    if (opts.animate) setTimeout(emit, (opts.duration as number) + 50)
    else requestAnimationFrame(emit)
    return value
  }

  function constrainXY(
    toX: number | string,
    toY: number | string,
    toScale: number,
    panOptions?: PanOptions
  ) {
    const opts = { ...options, ...panOptions }
    const result = { x, y, opts }
    if (!(opts as any).force && opts.disablePan === true) return result
    toX = parseFloat(toX as string)
    toY = parseFloat(toY as string)
    result.x = toX
    result.y = toY
    if (opts.contain && opts.contain !== 'none') {
      const dims = getDimensionsFull(elem)
      const realWidth = dims.elem.width / scale
      const realHeight = dims.elem.height / scale
      const scaledWidth = realWidth * toScale
      const scaledHeight = realHeight * toScale
      const diffHorizontal = (scaledWidth - realWidth) / 2
      const diffVertical = (scaledHeight - realHeight) / 2
      if (opts.contain === 'inside') {
        const minX = (-dims.elem.margin.left - dims.parent.padding.left + diffHorizontal) / toScale
        const maxX =
          (dims.parent.width -
            scaledWidth -
            dims.parent.padding.left -
            dims.elem.margin.left -
            dims.parent.border.left -
            dims.parent.border.right +
            diffHorizontal) /
          toScale
        result.x = Math.max(Math.min(result.x, maxX), minX)
        const minY = (-dims.elem.margin.top - dims.parent.padding.top + diffVertical) / toScale
        const maxY =
          (dims.parent.height -
            scaledHeight -
            dims.parent.padding.top -
            dims.elem.margin.top -
            dims.parent.border.top -
            dims.parent.border.bottom +
            diffVertical) /
          toScale
        result.y = Math.max(Math.min(result.y, maxY), minY)
      } else if (opts.contain === 'outside') {
        const minX =
          (-(scaledWidth - dims.parent.width) -
            dims.parent.padding.left -
            dims.parent.border.left -
            dims.parent.border.right +
            diffHorizontal) /
          toScale
        const maxX = (diffHorizontal - dims.parent.padding.left) / toScale
        result.x = Math.max(Math.min(result.x, maxX), minX)
        const minY =
          (-(scaledHeight - dims.parent.height) -
            dims.parent.padding.top -
            dims.parent.border.top -
            dims.parent.border.bottom +
            diffVertical) /
          toScale
        const maxY = (diffVertical - dims.parent.padding.top) / toScale
        result.y = Math.max(Math.min(result.y, maxY), minY)
      }
    }
    return result
  }

  function constrainScale(toScale: number, zoomOptions?: ZoomOptions) {
    const opts = { ...options, ...zoomOptions }
    const result = { scale, opts }
    if (!(opts as any).force && opts.disableZoom) return result
    let minScale = options!.minScale as number
    let maxScale = options!.maxScale as number
    if (opts.contain && opts.contain !== 'none') {
      const dims = getDimensionsFull(elem)
      const elemWidth = dims.elem.width / scale
      const elemHeight = dims.elem.height / scale
      if (elemWidth > 1 && elemHeight > 1) {
        const parentWidth = dims.parent.width - dims.parent.border.left - dims.parent.border.right
        const parentHeight = dims.parent.height - dims.parent.border.top - dims.parent.border.bottom
        const elemScaledWidth = parentWidth / elemWidth
        const elemScaledHeight = parentHeight / elemHeight
        if ((options as any).contain === 'inside')
          maxScale = Math.min(maxScale, elemScaledWidth, elemScaledHeight)
        else if ((options as any).contain === 'outside')
          minScale = Math.max(minScale, elemScaledWidth, elemScaledHeight)
      }
    }
    result.scale = Math.min(Math.max(toScale, minScale), maxScale)
    return result
  }

  function pan(
    toX: number | string,
    toY: number | string,
    panOptions?: PanOptions,
    originalEvent?: PanzoomEventDetail['originalEvent']
  ) {
    const result = constrainXY(toX, toY, scale, panOptions)
    if (x !== result.x || y !== result.y) {
      x = result.x
      y = result.y
      return setTransformWithEvent(result.opts, originalEvent)
    }
    return { x, y, scale }
  }

  function zoom(
    toScale: number,
    zoomOptions?: ZoomOptions,
    originalEvent?: PanzoomEventDetail['originalEvent']
  ) {
    const result = constrainScale(toScale, zoomOptions)
    const opts = result.opts
    if (!(opts as any).force && opts.disableZoom) return { x, y, scale }
    toScale = result.scale
    let toX = x
    let toY = y
    if ((opts as any).focal) {
      const focal = (opts as any).focal
      toX = (focal.x / toScale - focal.x / scale + x * toScale) / toScale
      toY = (focal.y / toScale - focal.y / scale + y * toScale) / toScale
    }
    const panResult = constrainXY(toX, toY, toScale, { relative: false, force: true } as any)
    x = panResult.x
    y = panResult.y
    scale = toScale
    return setTransformWithEvent(opts, originalEvent)
  }

  function zoomInOut(isIn: boolean, zoomOptions?: ZoomOptions) {
    const opts = { ...options, animate: true, ...zoomOptions }
    return zoom(scale * Math.exp((isIn ? 1 : -1) * (opts.step as number)), opts)
  }

  function zoomIn(zoomOptions?: ZoomOptions) {
    // 如果没有指定 focal，则默认以中心点缩放
    const opts = { ...options, animate: true, ...zoomOptions }
    if (!(opts as any).focal) {
      const dims = getDimensionsFull(elem)
      const parentWidth = dims.parent.width - dims.parent.border.left - dims.parent.border.right
      const parentHeight = dims.parent.height - dims.parent.border.top - dims.parent.border.bottom
      const clientX =
        dims.parent.left + dims.parent.border.left + dims.parent.padding.left + parentWidth / 2
      const clientY =
        dims.parent.top + dims.parent.border.top + dims.parent.padding.top + parentHeight / 2
      return zoomToPoint(scale * Math.exp(opts.step as number), { clientX, clientY }, opts)
    }
    return zoomInOut(true, zoomOptions)
  }

  function zoomOut(zoomOptions?: ZoomOptions) {
    // 如果没有指定 focal，则默认以中心点缩放
    const opts = { ...options, animate: true, ...zoomOptions }
    if (!(opts as any).focal) {
      const dims = getDimensionsFull(elem)
      const parentWidth = dims.parent.width - dims.parent.border.left - dims.parent.border.right
      const parentHeight = dims.parent.height - dims.parent.border.top - dims.parent.border.bottom
      const clientX =
        dims.parent.left + dims.parent.border.left + dims.parent.padding.left + parentWidth / 2
      const clientY =
        dims.parent.top + dims.parent.border.top + dims.parent.padding.top + parentHeight / 2
      return zoomToPoint(scale * Math.exp(-(opts.step as number)), { clientX, clientY }, opts)
    }
    return zoomInOut(false, zoomOptions)
  }

  function zoomToPoint(
    toScale: number,
    point: { clientX: number; clientY: number },
    zoomOptions?: ZoomOptions,
    originalEvent?: PanzoomEventDetail['originalEvent']
  ) {
    const dims = getDimensionsFull(elem)
    const effectiveArea = {
      width:
        dims.parent.width -
        dims.parent.padding.left -
        dims.parent.padding.right -
        dims.parent.border.left -
        dims.parent.border.right,
      height:
        dims.parent.height -
        dims.parent.padding.top -
        dims.parent.padding.bottom -
        dims.parent.border.top -
        dims.parent.border.bottom
    }
    let clientX =
      point.clientX -
      dims.parent.left -
      dims.parent.padding.left -
      dims.parent.border.left -
      dims.elem.margin.left
    let clientY =
      point.clientY -
      dims.parent.top -
      dims.parent.padding.top -
      dims.parent.border.top -
      dims.elem.margin.top
    if (((options as any).origin as string) !== '0 0') {
      clientX -= dims.elem.width / scale / 2
      clientY -= dims.elem.height / scale / 2
    }
    const focal = {
      x: (clientX / effectiveArea.width) * (effectiveArea.width * toScale),
      y: (clientY / effectiveArea.height) * (effectiveArea.height * toScale)
    }
    return zoom(toScale, { ...(zoomOptions as any), animate: false, focal } as any, originalEvent)
  }

  function zoomWithWheel(event: WheelEvent, zoomOptions?: ZoomOptions) {
    event.preventDefault()
    const opts = { ...options, ...(zoomOptions as any), animate: false }
    const delta = event.deltaY === 0 && (event as any).deltaX ? (event as any).deltaX : event.deltaY
    const wheel = delta < 0 ? 1 : -1
    const toScale = constrainScale(
      scale * Math.exp((wheel * (opts.step as number)) / 3),
      opts
    ).scale
    return zoomToPoint(toScale, event as any, opts, event)
  }

  function reset(resetOptions?: PanzoomOptions) {
    const opts = { ...options, animate: true, force: true, ...(resetOptions as any) }
    scale = constrainScale(opts.startScale as number, opts).scale
    const panResult = constrainXY(opts.startX as number, opts.startY as number, scale, opts)
    x = panResult.x
    y = panResult.y
    return setTransformWithEvent(opts)
  }

  let origX: number
  let origY: number
  let startClientX: number
  let startClientY: number
  const pointers: PointerEvent[] = []

  function handleDown(event: PointerEvent) {
    addPointer(pointers, event)
    isPanning = true
    options!.handleStartEvent!(event)
    origX = x
    origY = y
    const point = getMiddle(pointers)
    startClientX = point.clientX
    startClientY = point.clientY
  }

  function handleMove(event: PointerEvent) {
    if (
      !isPanning ||
      origX === undefined ||
      origY === undefined ||
      startClientX === undefined ||
      startClientY === undefined
    )
      return
    addPointer(pointers, event)
    const current = getMiddle(pointers)
    const toScale = scale
    pan(
      origX + (current.clientX - startClientX) / toScale,
      origY + (current.clientY - startClientY) / toScale,
      { animate: false } as any,
      event
    )
  }

  function handleUp(event: PointerEvent) {
    removePointer(pointers, event)
    if (!isPanning) return
    isPanning = false
    origX = origY = startClientX = startClientY = undefined as any
  }

  let bound = false
  function bind() {
    if (bound) return
    bound = true
    onPointer('down', options!.canvas ? parent : elem, handleDown)
    onPointer('move', document, handleMove, { passive: true })
    onPointer('up', document, handleUp, { passive: true })
  }

  function destroy() {
    bound = false
    destroyPointer('down', options!.canvas ? parent : elem, handleDown)
    destroyPointer('move', document, handleMove)
    destroyPointer('up', document, handleUp)
  }

  if (!options.noBind) bind()

  return {
    bind,
    destroy,
    getPan: () => ({ x, y }),
    getScale: () => scale,
    getOptions: () => shallowClone(options),
    handleDown,
    handleMove,
    handleUp,
    pan,
    reset,
    resetStyle,
    setOptions,
    setStyle: (name: string, value: string) => setStyle(elem, name, value),
    zoom,
    zoomIn,
    zoomOut,
    zoomToPoint,
    zoomWithWheel
  }
}

;(Panzoom as any).defaultOptions = defaultOptions
export * from './types'
export default Panzoom
