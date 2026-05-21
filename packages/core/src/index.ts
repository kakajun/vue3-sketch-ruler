// 纯类型定义
export type {
  GuideLine,
  RulerPalette,
  SnapConfig,
  ScaleMark,
  TickConfig,
  Point,
  BeforeZoomContext,
  AfterZoomContext,
  BeforePanContext,
  AfterPanContext,
  OnSnapContext,
  OnLineContext,
  OnLineMoveContext,
  TickInfo,
  LabelInfo,
  RenderConfig,
  RulerRenderer,
  SketchRulerPlugin,
  PluginApi,
  PluginContext
} from './types'

// 引擎层
export {
  createMatrix,
  fromTransform,
  multiply,
  invert,
  decompose,
  toCSSString,
  equals
} from './engine/matrix'
export type { Matrix6 } from './engine/matrix'

export {
  toWorldPoint,
  toScreenPoint,
  batchToWorld,
  batchToScreen,
  fitRect
} from './engine/coordinate'
export type { Point as CoordinatePoint, Rect } from './engine/coordinate'

export { TransformEngine } from './engine/transform-engine'
export type {
  TransformState,
  TransformEngineOptions,
  TransformUpdateCallback
} from './engine/transform-engine'

// 状态层
export { createDefaultState, produceState } from './state/ruler-state'
export type { RulerState, RulerAction } from './state/ruler-state'

// 插件层
export { PluginManager } from './plugins/plugin-manager'

// 刻度计算
export { computeScaleMarks, TICK_CONFIGS, getTickConfig, applyHysteresis } from './scale'
export type { ComputeScaleOptions } from './scale'

// 工具函数
export { generateLineId, generateCanvasId } from './utils/id-utils'
export {
  importLines,
  exportLines,
  formatLineLabel,
  computeLineStyle,
  screenToWorld,
  worldToScreen,
  snapToNearestTick,
  computeDraggedLinePosition
} from './utils/line-utils'
export type { LineType, LineStyle, LineDragInput, SnapToTickOptions } from './utils/line-utils'

// 状态管理
export { LineManager } from './state/line-manager'

// 多画布管理
export { CanvasManager, BUILTIN_TEMPLATES } from './managers/canvas-manager'
export type {
  CanvasConfig,
  CanvasState,
  CanvasTemplate,
  CanvasManagerState
} from './managers/canvas-manager'

// 吸附引擎
export { SnapEngine, computeEquidistantTargets } from './snap/snap-engine'
export type {
  SnapTarget,
  SnapResult,
  SnapRule,
  SnapContext,
  SnapEngineOptions
} from './snap/snap-engine'

// Minimap 引擎
export { MinimapEngine, MinimapDragSession } from './engine/minimap-engine'
export type { MinimapOptions, MinimapState, DragSessionState } from './engine/minimap-engine'
