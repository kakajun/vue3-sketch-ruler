import type { GuideLine } from '../types'

export interface LineType {
  h: number[]
  v: number[]
}

export function importLines(lines?: LineType): GuideLine[] {
  if (!lines) return []
  const result: GuideLine[] = []
  let id = 0
  for (const h of lines.h) {
    result.push({
      id: `h-${id++}-${Date.now()}`,
      orientation: 'h',
      position: h,
      visible: true,
      locked: false
    })
  }
  for (const v of lines.v) {
    result.push({
      id: `v-${id++}-${Date.now()}`,
      orientation: 'v',
      position: v,
      visible: true,
      locked: false
    })
  }
  return result
}

export function exportLines(lines: GuideLine[]): LineType {
  return {
    h: lines.filter((l) => l.orientation === 'h').map((l) => l.position),
    v: lines.filter((l) => l.orientation === 'v').map((l) => l.position)
  }
}

export function formatLineLabel(vertical: boolean, position: number): string {
  return `${vertical ? 'X' : 'Y'}: ${Math.round(position)}`
}

export interface LineStyle {
  left?: string
  top?: string
  width?: string
  height?: string
  borderLeft?: string
  borderBottom?: string
  cursor?: string
}

export function computeLineStyle(
  line: GuideLine,
  scale: number,
  offset: number,
  vertical: boolean,
  guideLineColor: string
): LineStyle {
  const pos = line.position * scale + offset
  const cursor = line.locked ? 'default' : vertical ? 'ns-resize' : 'ew-resize'
  if (vertical) {
    return {
      left: `${pos}px`,
      top: '0',
      height: '100vh',
      width: '1px',
      borderLeft: `1px dashed ${guideLineColor}`,
      cursor
    }
  }
  return {
    top: `${pos}px`,
    left: '0',
    width: '100vw',
    height: '1px',
    borderBottom: `1px dashed ${guideLineColor}`,
    cursor
  }
}

export function screenToWorld(screenPos: number, offset: number, scale: number): number {
  return (screenPos - offset) / scale
}

export function worldToScreen(worldPos: number, offset: number, scale: number): number {
  return worldPos * scale + offset
}

export interface SnapToTickOptions {
  worldPos: number
  majorTicks: Array<{ value: number }>
  thresholdWorld: number
}

export function snapToNearestTick(options: SnapToTickOptions): number | null {
  const { worldPos, majorTicks, thresholdWorld } = options
  if (majorTicks.length === 0) return null

  let bestTick: number | null = null
  let bestDist = Infinity

  for (const mark of majorTicks) {
    const dist = Math.abs(worldPos - mark.value)
    if (dist < thresholdWorld && dist < bestDist) {
      bestDist = dist
      bestTick = mark.value
    }
  }

  return bestTick
}

export interface LineDragInput {
  startMouse: number
  startPos: number
  currentMouse: number
  scale: number
  majorTicks: Array<{ value: number }>
  snapThresholdWorld: number
}

export function computeDraggedLinePosition(input: LineDragInput): number {
  const { startMouse, startPos, currentMouse, scale, majorTicks, snapThresholdWorld } = input
  const delta = (currentMouse - startMouse) / scale
  let newPos = startPos + delta

  const snapped = snapToNearestTick({
    worldPos: newPos,
    majorTicks,
    thresholdWorld: snapThresholdWorld
  })

  if (snapped !== null) {
    newPos = snapped
  }

  return Math.round(newPos)
}
