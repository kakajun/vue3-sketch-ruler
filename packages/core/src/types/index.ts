/**
 * 框架无关的公共类型定义
 */

// 基础几何
export interface Point {
  x: number
  y: number
}

// 缩放原点模式
export type ZoomMode = 'pointer' | 'viewport-center' | 'content-center'

// 参考线
export interface GuideLine {
  id: string
  orientation: 'h' | 'v'
  position: number
  visible?: boolean
  locked?: boolean
}

// 标尺配色与样式
export interface RulerPalette {
  bgColor: string
  tickColor: string
  labelColor: string
  guideLineColor: string
  guideLineLockedColor: string
  hoverBg: string
  hoverColor: string
  borderColor: string
  shadowColor: string
  guideLineStyle: string
  guideLineWidth: number
  labelEnabled: boolean
  labelPosition: string
}

// 吸附配置
export interface SnapConfig {
  enabled?: boolean
  threshold?: number
  strength?: number
}

// 吸附目标
export interface SnapTarget {
  type: 'tick' | 'guide-line' | 'custom' | 'grid' | 'equidistant'
  position: number
  priority: number
}

// 刻度配置
export interface TickConfig {
  interval: number
  subdivisions: number
  showLabel: boolean
  formatLabel?: (value: number) => string
}

// 刻度标记
export interface ScaleMark {
  position: number
  length: number
  isMajor: boolean
  label?: string
  value: number
}

// 刻度信息
export interface TickInfo {
  position: number
  isMajor: boolean
  value: number
}

// 标签信息
export interface LabelInfo {
  text: string
  x: number
  y: number
  align: 'left' | 'center' | 'right'
}

// 渲染配置
export interface RenderConfig {
  scale: number
  offset: number
  thick: number
  width: number
  height: number
  palette: Record<string, string>
}

// 标尺渲染器
export interface RulerRenderer {
  renderTicks(ctx: CanvasRenderingContext2D, ticks: TickInfo[], config: RenderConfig): void
  renderLabels(ctx: CanvasRenderingContext2D, labels: LabelInfo[], config: RenderConfig): void
}

// 插件生命周期上下文
export interface BeforeZoomContext {
  from: number
  to: number
  center: Point
  cancel: () => void
}

export interface AfterZoomContext {
  from: number
  to: number
  center: Point
}

export interface BeforePanContext {
  offset: Point
  delta: Point
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

// 插件 API
export interface PluginApi {
  getState: () => {
    scale: number
    offset: { x: number; y: number }
    lines: GuideLine[]
  }
  zoomBy: (dScale: number, originX: number, originY: number) => void
  zoomTo: (targetScale: number, originX: number, originY: number) => void
  panBy: (dx: number, dy: number) => void
  setTransform: (t: { scale?: number; x?: number; y?: number }) => void
}

// 插件上下文
export interface PluginContext<T extends object = object> {
  api: PluginApi
}

// 插件定义
export interface SketchRulerPlugin {
  name: string
  version?: string
  priority?: number
  beforeZoom?: (ctx: BeforeZoomContext & PluginContext) => void | Promise<void>
  afterZoom?: (ctx: AfterZoomContext & PluginContext) => void
  beforePan?: (ctx: BeforePanContext & PluginContext) => void | Promise<void>
  afterPan?: (ctx: AfterPanContext & PluginContext) => void
  onSnap?: (ctx: OnSnapContext & PluginContext) => void
  onLineCreate?: (ctx: OnLineContext & PluginContext) => void
  onLineDelete?: (ctx: OnLineContext & PluginContext) => void
  onLineMove?: (ctx: OnLineMoveContext & PluginContext) => void
  registerRenderer?: () => { name: string; renderer: RulerRenderer }
}
