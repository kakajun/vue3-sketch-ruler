/**
 * useRulerSnap - 智能吸附引擎（M3 W13）
 * 扩展自 M1 的 useSnapDetection，增加网格吸附、等距分布、自定义规则
 */

import { type Ref, computed } from 'vue'
import type { GuideLine } from '../state/ruler-context'

export interface SnapTarget {
  type: 'tick' | 'guide-line' | 'custom' | 'grid' | 'equidistant'
  position: number
  priority: number
}

export interface SnapResult {
  position: number
  target: SnapTarget
  original: number
}

export interface SnapRule {
  id: string
  priority: number
  getTargets: (context: SnapContext) => SnapTarget[]
}

export interface SnapContext {
  direction: 'h' | 'v'
  position: number
  scale: number
  lines: GuideLine[]
  viewportSize: { width: number; height: number }
}

export interface SnapOptions {
  threshold: Ref<number>
  scale: Ref<number>
  tickTargets?: Ref<number[]>
  guideLineTargets?: Ref<number[]>
  customTargets?: Ref<number[]>
  strength?: Ref<number>
  gridSize?: Ref<number>
  enableEquidistant?: Ref<boolean>
  customRules?: Ref<SnapRule[]>
  lines?: Ref<GuideLine[]>
  viewportSize?: Ref<{ width: number; height: number }>
}

export function useRulerSnap(options: SnapOptions) {
  const {
    threshold,
    scale,
    tickTargets,
    guideLineTargets,
    customTargets,
    strength,
    gridSize,
    enableEquidistant,
    customRules,
    lines,
    viewportSize
  } = options

  const snapStrength = computed(() => strength?.value ?? 0.5)

  /** 检测单个数值的吸附 */
  function snap(position: number, direction: 'h' | 'v'): SnapResult | null {
    const s = scale.value
    if (s <= 0) return null

    const candidates: SnapTarget[] = []

    // 1. 刻度吸附（优先级 1）
    if (tickTargets?.value) {
      for (const pos of tickTargets.value) {
        candidates.push({ type: 'tick', position: pos, priority: 1 })
      }
    }

    // 2. 参考线吸附（优先级 2）
    if (guideLineTargets?.value) {
      for (const pos of guideLineTargets.value) {
        candidates.push({ type: 'guide-line', position: pos, priority: 2 })
      }
    }

    // 3. 自定义吸附（优先级 3）
    if (customTargets?.value) {
      for (const pos of customTargets.value) {
        candidates.push({ type: 'custom', position: pos, priority: 3 })
      }
    }

    // 4. 网格吸附（优先级 4）
    if (gridSize?.value && gridSize.value > 0) {
      const gridPos = Math.round(position / gridSize.value) * gridSize.value
      candidates.push({ type: 'grid', position: gridPos, priority: 4 })
    }

    // 5. 等距分布吸附（优先级 5）
    if (enableEquidistant?.value && lines?.value) {
      const dirLines = lines.value
        .filter((l) => l.orientation === direction && l.visible !== false)
        .map((l) => l.position)
        .sort((a, b) => a - b)

      const equiTargets = computeEquidistantTargets(dirLines)
      for (const pos of equiTargets) {
        candidates.push({ type: 'equidistant', position: pos, priority: 5 })
      }
    }

    // 6. 自定义规则（优先级由规则定义）
    if (customRules?.value && lines?.value && viewportSize?.value) {
      const context: SnapContext = {
        direction,
        position,
        scale: s,
        lines: lines.value,
        viewportSize: viewportSize.value
      }
      for (const rule of customRules.value) {
        const targets = rule.getTargets(context)
        for (const t of targets) {
          candidates.push({ ...t, priority: rule.priority })
        }
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

    // 软吸附
    const str = snapStrength.value
    const snappedPosition = position * (1 - str) + bestTarget.position * str

    return {
      position: snappedPosition,
      target: bestTarget,
      original: position
    }
  }

  return { snap }
}

/** 计算等距分布吸附目标 */
function computeEquidistantTargets(positions: number[]): number[] {
  if (positions.length < 2) return []
  const targets: number[] = []

  for (let i = 1; i < positions.length; i++) {
    const gap = positions[i] - positions[i - 1]
    // 向前延伸
    const forward = positions[i] + gap
    if (!positions.includes(forward)) {
      targets.push(forward)
    }
    // 向后延伸
    const backward = positions[i - 1] - gap
    if (!positions.includes(backward)) {
      targets.push(backward)
    }
  }

  return targets
}

/** 向后兼容导出 */
export { useRulerSnap as useSnapDetection }
