// 新架构组件
import SketchRuler from './components/SketchRuler.vue'
import Minimap from './components/Minimap.vue'

// 类型导出
export type { SketchRulerProps } from './components/SketchRuler.vue'
export type { TransformState, TransformEngineOptions } from './engine/transform-engine'
export type { CanvasTransformOptions, UseCanvasTransformReturn } from './composables/useCanvasTransform'
export type { ScaleMark, RulerScaleOptions } from './composables/useRulerScale'
export type { SnapTarget, SnapResult, SnapOptions } from './composables/useSnapDetection'
export type { GuideLine, RulerPalette, RulerContext, SnapConfig } from './state/ruler-context'
export type { SketchRulerPlugin, RulerRenderer } from './plugins/types'
export type { CanvasConfig, CanvasState, CanvasTemplate } from './managers/canvas-manager'

// 核心 API 导出
export { TransformEngine } from './engine/transform-engine'
export { useCanvasTransform } from './composables/useCanvasTransform'
export { useRulerScale, getTickConfig } from './composables/useRulerScale'
export { useSnapDetection } from './composables/useSnapDetection'
export { StateManager } from './state/state-manager'
export { RulerContextKey } from './state/ruler-context'
export { InputManager } from './input/input-manager'
export { PluginManager } from './plugins/plugin-manager'
export { CanvasManager, BUILTIN_TEMPLATES } from './managers/canvas-manager'

// 组件导出
export { SketchRuler, Minimap }
export default SketchRuler
