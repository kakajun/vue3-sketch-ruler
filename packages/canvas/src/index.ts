// 渲染器
export type { Renderer, Rect, RulerRenderPayload, RenderItem } from './renderers/types'
export { Canvas2DRenderer } from './renderers/canvas-2d-renderer'
export { OffscreenRulerCache } from './renderers/offscreen-ruler-cache'
export { LabelCache } from './renderers/label-cache'

// 输入管理
export { InputManager } from './input/input-manager'
export { MouseAdapter } from './input/mouse-adapter'
export { KeyboardAdapter } from './input/keyboard-adapter'
export { normalizeWheel, getZoomDelta } from './input/wheel-normalizer'
export type { NormalizedWheel } from './input/wheel-normalizer'
export type { InputManagerOptions } from './input/input-manager'
export type { ZoomMode } from '@sketch-ruler/core'
export type { MouseAdapterCallbacks } from './input/mouse-adapter'
export type { KeyCombo } from './input/keyboard-adapter'
