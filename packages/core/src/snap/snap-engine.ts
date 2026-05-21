import type { GuideLine } from '../types'

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

export interface SnapEngineOptions {
  threshold: number
  scale: number
  tickTargets?: number[]
  guideLineTargets?: number[]
  customTargets?: number[]
  strength?: number
  gridSize?: number
  enableEquidistant?: boolean
  customRules?: SnapRule[]
  lines?: GuideLine[]
  viewportSize?: { width: number; height: number }
}

export class SnapEngine {
  constructor(private options: SnapEngineOptions) {}

  snap(position: number, direction: 'h' | 'v'): SnapResult | null {
    const s = this.options.scale
    if (s <= 0) return null

    const candidates = this.collectCandidates(position, direction)
    if (candidates.length === 0) return null

    const screenPos = position * s
    const pixelThreshold = this.options.threshold

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

    const str = this.options.strength ?? 0.5
    const snappedPosition = position * (1 - str) + bestTarget.position * str

    return {
      position: snappedPosition,
      target: bestTarget,
      original: position
    }
  }

  private collectCandidates(position: number, direction: 'h' | 'v'): SnapTarget[] {
    const candidates: SnapTarget[] = []

    if (this.options.tickTargets) {
      for (const pos of this.options.tickTargets) {
        candidates.push({ type: 'tick', position: pos, priority: 1 })
      }
    }

    if (this.options.guideLineTargets) {
      for (const pos of this.options.guideLineTargets) {
        candidates.push({ type: 'guide-line', position: pos, priority: 2 })
      }
    }

    if (this.options.customTargets) {
      for (const pos of this.options.customTargets) {
        candidates.push({ type: 'custom', position: pos, priority: 3 })
      }
    }

    if (this.options.gridSize && this.options.gridSize > 0) {
      const gridPos = Math.round(position / this.options.gridSize) * this.options.gridSize
      candidates.push({ type: 'grid', position: gridPos, priority: 4 })
    }

    if (this.options.enableEquidistant && this.options.lines) {
      const dirLines = this.options.lines
        .filter((l) => l.orientation === direction && l.visible !== false)
        .map((l) => l.position)
        .sort((a, b) => a - b)

      const equiTargets = computeEquidistantTargets(dirLines)
      for (const pos of equiTargets) {
        candidates.push({ type: 'equidistant', position: pos, priority: 5 })
      }
    }

    if (this.options.customRules && this.options.lines && this.options.viewportSize) {
      const context: SnapContext = {
        direction,
        position,
        scale: this.options.scale,
        lines: this.options.lines,
        viewportSize: this.options.viewportSize
      }
      for (const rule of this.options.customRules) {
        const targets = rule.getTargets(context)
        for (const t of targets) {
          candidates.push({ ...t, priority: rule.priority })
        }
      }
    }

    return candidates
  }
}

export function computeEquidistantTargets(positions: number[]): number[] {
  if (positions.length < 2) return []
  const targets: number[] = []

  for (let i = 1; i < positions.length; i++) {
    const gap = positions[i] - positions[i - 1]
    const forward = positions[i] + gap
    if (!positions.includes(forward)) {
      targets.push(forward)
    }
    const backward = positions[i - 1] - gap
    if (!positions.includes(backward)) {
      targets.push(backward)
    }
  }

  return targets
}
