/**
 * useSnapDetection - 参考线吸附检测组合式函数（基础版本）
 * M1 先实现基础吸附：刻度吸附、参考线吸附、数值数组吸附
 * M3 再扩展为智能吸附引擎
 */

import { type Ref, computed } from 'vue'

export interface SnapTarget {
  /** 目标类型 */
  type: 'tick' | 'guide-line' | 'custom'
  /** 目标位置（世界坐标） */
  position: number
  /** 优先级 */
  priority: number
}

export interface SnapResult {
  /** 吸附后的位置 */
  position: number
  /** 吸附目标 */
  target: SnapTarget
  /** 原始位置 */
  original: number
}

export interface SnapOptions {
  /** 吸附阈值（像素） */
  threshold: Ref<number>
  /** 当前缩放比例 */
  scale: Ref<number>
  /** 刻度吸附目标 */
  tickTargets?: Ref<number[]>
  /** 参考线吸附目标 */
  guideLineTargets?: Ref<number[]>
  /** 自定义吸附目标 */
  customTargets?: Ref<number[]>
  /** 吸附强度（0-1，0.5 为软吸附） */
  strength?: Ref<number>
}

export function useSnapDetection(options: SnapOptions) {
  const { threshold, scale, tickTargets, guideLineTargets, customTargets, strength } = options

  const snapStrength = computed(() => strength?.value ?? 0.5)

  /** 检测单个数值的吸附 */
  function snap(position: number, direction: 'h' | 'v'): SnapResult | null {
    const s = scale.value
    if (s <= 0) return null

    // 收集所有候选目标
    const candidates: SnapTarget[] = []

    if (tickTargets?.value) {
      for (const pos of tickTargets.value) {
        candidates.push({ type: 'tick', position: pos, priority: 1 })
      }
    }

    if (guideLineTargets?.value) {
      for (const pos of guideLineTargets.value) {
        candidates.push({ type: 'guide-line', position: pos, priority: 2 })
      }
    }

    if (customTargets?.value) {
      for (const pos of customTargets.value) {
        candidates.push({ type: 'custom', position: pos, priority: 3 })
      }
    }

    if (candidates.length === 0) return null

    // 转换为屏幕像素距离进行比对
    const screenPos = position * s
    const pixelThreshold = threshold.value

    let bestTarget: SnapTarget | null = null
    let bestDistance = Infinity

    for (const target of candidates) {
      const targetScreenPos = target.position * s
      const distance = Math.abs(screenPos - targetScreenPos)
      if (distance <= pixelThreshold && distance < bestDistance) {
        bestDistance = distance
        bestTarget = target
      }
    }

    if (!bestTarget) return null

    // 软吸附：吸附后位置 = 原始位置 * (1 - strength) + 目标位置 * strength
    const str = snapStrength.value
    const snappedPosition = position * (1 - str) + bestTarget.position * str

    return {
      position: snappedPosition,
      target: bestTarget,
      original: position
    }
  }

  return {
    snap
  }
}
