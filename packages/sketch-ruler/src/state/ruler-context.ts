/**
 * RulerContext - 标尺-画布-参考线跨层级状态共享体系
 * 基于 Vue 3 provide/inject 机制
 */

import type { Ref, InjectionKey } from 'vue'
import type { TransformEngine } from '../engine/transform-engine'
import type { ScaleMark } from '../composables/useRulerScale'

export interface GuideLine {
  id: string
  orientation: 'h' | 'v'
  position: number
  locked?: boolean
  visible?: boolean
  label?: string
}

export interface SnapConfig {
  enabled: boolean
  threshold: number
  strength: number
}

export interface RulerPalette {
  bgColor: string
  tickColor: string
  labelColor: string
  guideLineColor: string
  guideLineLockedColor: string
  hoverBg: string
  hoverColor: string
  borderColor: string
}

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
