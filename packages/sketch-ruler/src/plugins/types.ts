import type { GuideLine } from '../state/ruler-context'

export interface Point {
  x: number
  y: number
}

export interface SnapTarget {
  id: string
  position: number
  orientation: 'h' | 'v'
  priority: number
}

export interface BeforeZoomContext {
  from: number
  to: number
  center: Point
  cancel: () => void
}

export interface AfterPanContext {
  offset: Point
  delta: Point
}

export interface OnSnapContext {
  line: GuideLine
  targets: SnapTarget[]
  applied: SnapTarget | null
}

export interface OnLineContext {
  line: GuideLine
}

export interface OnLineMoveContext extends OnLineContext {
  from: number
  to: number
}

export interface TickInfo {
  position: number
  isMajor: boolean
  value: number
}

export interface LabelInfo {
  text: string
  x: number
  y: number
  align: 'left' | 'center' | 'right'
}

export interface RenderConfig {
  scale: number
  offset: number
  thick: number
  width: number
  height: number
  palette: Record<string, string>
}

export interface RulerRenderer {
  renderTicks(
    ctx: CanvasRenderingContext2D,
    ticks: TickInfo[],
    config: RenderConfig
  ): void
  renderLabels(
    ctx: CanvasRenderingContext2D,
    labels: LabelInfo[],
    config: RenderConfig
  ): void
}

export interface SketchRulerPlugin {
  name: string
  version?: string
  beforeZoom?: (ctx: BeforeZoomContext) => void | Promise<void>
  afterPan?: (ctx: AfterPanContext) => void
  onSnap?: (ctx: OnSnapContext) => void
  onLineCreate?: (ctx: OnLineContext) => void
  onLineDelete?: (ctx: OnLineContext) => void
  onLineMove?: (ctx: OnLineMoveContext) => void
  registerRenderer?: () => { name: string; renderer: RulerRenderer }
}
