export type { RulerContext } from './ruler-context'
export { RulerContextKey } from './ruler-context'

// 从 @sketch-ruler/core 重新导出（保持向后兼容）
export { createDefaultState, produceState } from '@sketch-ruler/core'
export type { RulerState, RulerAction } from '@sketch-ruler/core'
export type { GuideLine, SnapConfig, RulerPalette } from '@sketch-ruler/core'
