/**
 * useSketchRuler - Master Composable
 * 整合变换引擎、参考线状态、标尺样式计算，提供统一的 SketchRuler 状态管理入口
 */

import { computed, ref, watch, markRaw } from 'vue'
import type { ComputedRef, Ref, CSSProperties } from 'vue'
import { useCanvasTransform } from './useCanvasTransform'
import { StateManager } from '../state/state-manager'
import { produceState, createDefaultState, type RulerState, type RulerAction } from '../state/ruler-state'
import type { GuideLine, RulerPalette, RulerContext, SnapConfig } from '../state/ruler-context'
import { RulerContextKey } from '../state/ruler-context'
import type { TransformEngine } from '../engine/transform-engine'

export interface SketchRulerOptions {
  width: number
  height: number
  canvasWidth: number
  canvasHeight: number
  thick?: number
  scale?: number
  palette?: Partial<RulerPalette>
  lines?: { h: number[]; v: number[] }
  snapThreshold?: number
  lockLine?: boolean
  minZoom?: number
  maxZoom?: number
  zoomStep?: number
  autoCenter?: boolean
}

export interface UseSketchRulerReturn {
  engine: TransformEngine
  scale: Ref<number>
  offset: Ref<{ x: number; y: number }>
  rectWidth: ComputedRef<number>
  rectHeight: ComputedRef<number>
  rectStyle: ComputedRef<CSSProperties>
  canvasStyle: ComputedRef<CSSProperties>
  cornerStyle: ComputedRef<CSSProperties>
  paletteCpu: ComputedRef<RulerPalette>
  horizontalLines: ComputedRef<GuideLine[]>
  verticalLines: ComputedRef<GuideLine[]>
  state: Ref<RulerState>
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
  panBy: (dx: number, dy: number) => void
  setTransform: (t: { scale?: number; x?: number; y?: number }) => void
  addLine: (line: Omit<GuideLine, 'id'>) => void
  moveLine: (id: string, position: number) => void
  removeLine: (id: string) => void
  toggleLineLock: (id: string) => void
  exportToLegacy: () => { h: number[]; v: number[] }
  importFromLegacy: (lines: { h: number[]; v: number[] }) => void
  context: RulerContext
}

export function useSketchRuler(options: SketchRulerOptions): UseSketchRulerReturn {
  const thick = options.thick ?? 16
  const width = options.width
  const height = options.height
  const canvasWidth = options.canvasWidth
  const canvasHeight = options.canvasHeight

  const rectWidth = computed(() => width - thick)
  const rectHeight = computed(() => height - thick)

  const { scale, offset, engine, setTransform, zoomBy, zoomTo, panBy, reset } = useCanvasTransform({
    initialScale: options.scale ?? 1,
    initialOffset: { x: 0, y: 0 },
    minZoom: options.minZoom ?? 0.1,
    maxZoom: options.maxZoom ?? 10,
    autoCenter: options.autoCenter ?? true,
    canvasSize: { width: canvasWidth, height: canvasHeight },
    viewportSize: { width: rectWidth.value, height: rectHeight.value },
    paddingRatio: 0.2
  })

  // 状态管理：produceState + ref
  const state = ref<RulerState>(createDefaultState())

  // 合并外部 palette
  if (options.palette) {
    state.value = produceState(state.value, { type: 'setPalette', palette: options.palette })
  }

  // 合并外部 snapThreshold
  if (options.snapThreshold !== undefined) {
    state.value = produceState(state.value, {
      type: 'setSnapConfig',
      config: { threshold: options.snapThreshold }
    })
  }

  // 导入初始参考线
  if (options.lines) {
    state.value = produceState(state.value, { type: 'importLegacy', legacy: options.lines })
  }

  // 兼容：同步 lockLine prop 到全局参考线状态
  if (options.lockLine !== undefined && options.lockLine) {
    state.value = produceState(state.value, {
      type: 'setLines',
      lines: state.value.lines.map((l) => ({ ...l, locked: true }))
    })
  }

  const paletteCpu = computed<RulerPalette>(() => state.value.palette)

  const rectStyle = computed<CSSProperties>(() => ({
    background: paletteCpu.value.bgColor,
    width: rectWidth.value + 'px',
    height: rectHeight.value + 'px',
    left: thick + 'px',
    top: thick + 'px'
  }))

  const canvasStyle = computed<CSSProperties>(() => ({
    width: canvasWidth + 'px',
    height: canvasHeight + 'px'
  }))

  const cornerStyle = computed<CSSProperties>(() => ({
    width: thick + 'px',
    height: thick + 'px',
    borderRight: `1px solid ${paletteCpu.value.borderColor}`,
    borderBottom: `1px solid ${paletteCpu.value.borderColor}`
  }))

  const horizontalLines = computed(() =>
    state.value.lines.filter((l) => l.orientation === 'h' && l.visible !== false)
  )
  const verticalLines = computed(() =>
    state.value.lines.filter((l) => l.orientation === 'v' && l.visible !== false)
  )

  // 方法封装
  const dispatch = (action: RulerAction): void => {
    state.value = produceState(state.value, action)
  }

  const addLine = (line: Omit<GuideLine, 'id'>): void => {
    const id = `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    dispatch({ type: 'addLine', line: { ...line, id } })
  }

  const moveLine = (id: string, position: number): void => {
    dispatch({ type: 'moveLine', id, position })
  }

  const removeLine = (id: string): void => {
    dispatch({ type: 'removeLine', id })
  }

  const toggleLineLock = (id: string): void => {
    const line = state.value.lines.find((l) => l.id === id)
    if (line) {
      dispatch({ type: 'updateLine', id, updates: { locked: !line.locked } })
    }
  }

  const exportToLegacy = (): { h: number[]; v: number[] } => {
    const h: number[] = []
    const v: number[] = []
    for (const line of state.value.lines) {
      if (line.visible !== false) {
        if (line.orientation === 'h') h.push(line.position)
        else v.push(line.position)
      }
    }
    return { h, v }
  }

  const importFromLegacy = (lines: { h: number[]; v: number[] }): void => {
    dispatch({ type: 'importLegacy', legacy: lines })
  }

  const zoomIn = (): void => {
    const step = options.zoomStep ?? 0.25
    zoomBy(step, canvasWidth / 2, canvasHeight / 2)
  }

  const zoomOut = (): void => {
    const step = options.zoomStep ?? 0.25
    zoomBy(-step, canvasWidth / 2, canvasHeight / 2)
  }

  // provide/inject 上下文
  const viewportSize = ref({ width: rectWidth.value, height: rectHeight.value })
  const contentSize = ref({ width: canvasWidth, height: canvasHeight })

  watch(
    [() => width, () => height, () => canvasWidth, () => canvasHeight],
    () => {
      viewportSize.value = { width: width - thick, height: height - thick }
      contentSize.value = { width: canvasWidth, height: canvasHeight }
    }
  )

  const context: RulerContext = {
    scale,
    offset,
    viewportSize,
    contentSize,
    lines: computed(() => state.value.lines) as Ref<GuideLine[]>,
    snapConfig: state.value.snapConfig,
    palette: paletteCpu.value,
    engine: markRaw(engine),
    showRuler: ref(true),
    showReferLine: computed(() => state.value.showReferLine) as Ref<boolean>
  }

  return {
    engine,
    scale,
    offset,
    rectWidth,
    rectHeight,
    rectStyle,
    canvasStyle,
    cornerStyle,
    paletteCpu,
    horizontalLines,
    verticalLines,
    state,
    zoomIn,
    zoomOut,
    reset,
    panBy,
    setTransform,
    addLine,
    moveLine,
    removeLine,
    toggleLineLock,
    exportToLegacy,
    importFromLegacy,
    context
  }
}
