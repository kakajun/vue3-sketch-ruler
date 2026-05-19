/**
 * RulerContext - 标尺-画布-参考线跨层级状态共享体系
 * 基于 Vue 3 provide/inject 机制
 * 纯类型已从 @sketch-ruler/core 导入
 */

import type { Ref, InjectionKey } from 'vue'
import type { TransformEngine } from '@sketch-ruler/core'
import type { ScaleMark } from '@sketch-ruler/core'
import type { GuideLine, RulerPalette, SnapConfig } from '@sketch-ruler/core'

// 重新导出纯类型，保持现有文件的引用兼容性
export type { GuideLine, RulerPalette, SnapConfig } from '@sketch-ruler/core'

export interface RulerContext {
  scale: Ref<number>
  offset: Ref<{ x: number; y: number }>
  viewportSize: Ref<{ width: number; height: number }>
  contentSize: Ref<{ width: number; height: number }>
  lines: Ref<GuideLine[]>
  snapConfig: SnapConfig
  palette: RulerPalette
  engine: TransformEngine
  showRuler: Ref<boolean>
  showReferLine: Ref<boolean>
}

export const RulerContextKey: InjectionKey<RulerContext> = Symbol('RulerContext')
