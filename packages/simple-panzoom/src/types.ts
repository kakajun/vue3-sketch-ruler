export type DimensionsLite = {
  elem: { width: number; height: number; left: number; top: number }
  parent: { width: number; height: number; left: number; top: number }
}

export type Box = { left: number; right: number; top: number; bottom: number }
export type DimensionsFull = DimensionsLite & {
  elem: DimensionsLite['elem'] & { margin: Box; border: Box }
  parent: DimensionsLite['parent'] & { padding: Box; border: Box }
}

export type Dimensions = DimensionsFull

export type PanzoomEvent = 'panzoomchange'

export interface PanzoomEventDetail {
  x: number
  y: number
  scale: number
  dimsOut: Dimensions
  originalEvent?: PointerEvent | WheelEvent | MouseEvent | TouchEvent
}

export interface MiscOptions {
  animate?: boolean
  canvas?: boolean
  cursor?: string
  duration?: number
  easing?: string
  handleStartEvent?: (event: Event) => void
  noBind?: boolean
  origin?: string
  overflow?: string
  setTransform?: (elem: HTMLElement, values: CurrentValues, options: PanzoomOptions) => void
  silent?: boolean
  startX?: number
  startY?: number
  startScale?: number
  step?: number
  touchAction?: string
  [key: string]: any
}

export interface PanOnlyOptions {
  contain?: 'inside' | 'outside' | 'none'
  disablePan?: boolean
}

export interface ZoomOnlyOptions {
  disableZoom?: boolean
  minScale?: number
  maxScale?: number
}

export type PanOptions = MiscOptions & PanOnlyOptions
export type ZoomOptions = MiscOptions & ZoomOnlyOptions
export type PanzoomOptions = PanOptions & ZoomOptions & MiscOptions

export interface CurrentValues {
  x: number
  y: number
  scale: number
}

export interface PanzoomObject {
  bind: () => void
  destroy: () => void
  getPan: () => { x: number; y: number }
  getScale: () => number
  getOptions: () => PanzoomOptions
  handleDown: (event: PointerEvent) => void
  handleMove: (event: PointerEvent) => void
  handleUp: (event: PointerEvent) => void
  pan: (x: number | string, y: number | string, panOptions?: PanOptions, originalEvent?: PointerEvent) => CurrentValues
  reset: (resetOptions?: PanzoomOptions) => CurrentValues
  resetStyle: () => void
  setOptions: (options?: PanzoomOptions) => void
  setStyle: (name: string, value: string) => void
  zoom: (scale: number, zoomOptions?: ZoomOptions, originalEvent?: PointerEvent) => CurrentValues
  zoomIn: (zoomOptions?: ZoomOptions) => CurrentValues
  zoomOut: (zoomOptions?: ZoomOptions) => CurrentValues
  zoomToPoint: (scale: number, point: { clientX: number; clientY: number }, zoomOptions?: ZoomOptions, originalEvent?: PointerEvent) => CurrentValues
  zoomWithWheel: (event: WheelEvent, zoomOptions?: ZoomOptions) => CurrentValues
}