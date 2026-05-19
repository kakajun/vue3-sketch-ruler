// 新架构组件
import SketchRuler from './components/SketchRuler.vue'
import Minimap from './components/Minimap.vue'

// 类型导出
export type { SketchRulerProps } from './components/SketchRuler.vue'
export type {
  CanvasTransformOptions,
  UseCanvasTransformReturn
} from './composables/useCanvasTransform'
export type { RulerScaleOptions } from './composables/useRulerScale'
export type { SnapTarget, SnapResult, SnapOptions } from './composables/useSnapDetection'
export type { RulerContext } from './state/ruler-context'
export type { CanvasConfig, CanvasState, CanvasTemplate } from '@sketch-ruler/core'

// 从 @sketch-ruler/core 重新导出核心类型（保持向后兼容）
export type {
  TransformState,
  TransformEngineOptions,
  ScaleMark,
  TickConfig,
  GuideLine,
  RulerPalette,
  SnapConfig,
  SketchRulerPlugin,
  RulerRenderer,
  RulerState,
  RulerAction
} from '@sketch-ruler/core'

// 核心 API 导出（从 @sketch-ruler/core 透传）
export { TransformEngine } from '@sketch-ruler/core'
export { produceState, createDefaultState, PluginManager } from '@sketch-ruler/core'

// Vue 层 API 导出
export { useCanvasTransform } from './composables/useCanvasTransform'
export { useRulerScale, getTickConfig } from './composables/useRulerScale'
export { useSnapDetection } from './composables/useSnapDetection'
export { RulerContextKey } from './state/ruler-context'
export { InputManager } from '@sketch-ruler/canvas'
export { CanvasManager, BUILTIN_TEMPLATES } from '@sketch-ruler/core'

// 组件导出
export { SketchRuler, Minimap }
export default SketchRuler
