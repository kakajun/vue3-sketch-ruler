// 纯类型定义
export type {
  GuideLine,
  RulerPalette,
  SnapConfig,
  ScaleMark,
  TickConfig,
  Point,
  SnapTarget,
  BeforeZoomContext,
  AfterPanContext,
  OnSnapContext,
  OnLineContext,
  OnLineMoveContext,
  TickInfo,
  LabelInfo,
  RenderConfig,
  RulerRenderer,
  SketchRulerPlugin
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

export { toWorldPoint, toScreenPoint, batchToWorld, batchToScreen, fitRect } from './engine/coordinate'
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
