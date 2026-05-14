/**
 * useCanvasTransform - 画布变换组合式函数
 * 将 TransformEngine 封装为 Vue 响应式状态
 * 支持 v-model:scale / v-model:offset 双向绑定
 */

import { ref, shallowRef, readonly, watch, type Ref, type DeepReadonly } from 'vue'
import { TransformEngine, type TransformState, type TransformEngineOptions } from '../engine/transform-engine'
import { fitRect } from '../engine/coordinate'
import { markRaw } from 'vue'

export interface CanvasTransformOptions {
  initialScale?: number
  initialOffset?: { x: number; y: number }
  minZoom?: number
  maxZoom?: number
  enableAnimation?: boolean
  animationMode?: TransformEngineOptions['animationMode']
  dampingRatio?: number
  naturalFrequency?: number
  timeConstant?: number
  autoCenter?: boolean
  canvasSize?: { width: number; height: number }
  viewportSize?: { width: number; height: number }
  paddingRatio?: number
}

export interface UseCanvasTransformReturn {
  scale: Ref<number>
  offset: DeepReadonly<Ref<{ x: number; y: number }>>
  engine: TransformEngine
  setTransform: (t: Partial<TransformState>) => void
  panBy: (dx: number, dy: number) => void
  zoomBy: (dScale: number, originX: number, originY: number) => void
  zoomTo: (scale: number, originX: number, originY: number) => void
  toWorldPoint: (screenX: number, screenY: number) => { x: number; y: number }
  toScreenPoint: (worldX: number, worldY: number) => { x: number; y: number }
  reset: () => void
}

export function useCanvasTransform(options: CanvasTransformOptions = {}): UseCanvasTransformReturn {
  const {
    initialScale = 1,
    initialOffset = { x: 0, y: 0 },
    minZoom = 0.1,
    maxZoom = 10,
    enableAnimation = false,
    animationMode,
    dampingRatio,
    naturalFrequency,
    timeConstant,
    autoCenter = false,
    canvasSize,
    viewportSize,
    paddingRatio = 0.2
  } = options

  // 自动居中计算
  let startScale = initialScale
  let startOffset = { x: initialOffset.x, y: initialOffset.y }

  if (autoCenter && canvasSize && viewportSize) {
    const fit = fitRect(
      { x: 0, y: 0, width: canvasSize.width, height: canvasSize.height },
      { x: 0, y: 0, width: viewportSize.width, height: viewportSize.height },
      'contain',
      paddingRatio
    )
    startScale = fit.scale
    startOffset = { x: fit.x, y: fit.y }
  }

  const scale = ref(startScale)
  const offset = ref({ x: startOffset.x, y: startOffset.y })

  const engine = markRaw(
    new TransformEngine(
      { x: startOffset.x, y: startOffset.y, scale: startScale },
      {
        minZoom,
        maxZoom,
        enableAnimation,
        animationMode,
        dampingRatio,
        naturalFrequency,
        timeConstant
      }
    )
  )

  // 监听引擎状态变化，同步到 Vue 响应式
  engine.onUpdate((state) => {
    scale.value = state.scale
    offset.value = { x: state.x, y: state.y }
  })

  // 监听 Vue 响应式变化，同步到引擎（支持外部直接修改 scale/offset）
  watch(scale, (newScale) => {
    const current = engine.getState()
    if (Math.abs(current.scale - newScale) > 1e-10) {
      engine.setTransform({ scale: newScale })
    }
  })

  watch(
    () => offset.value,
    (newOffset) => {
      const current = engine.getState()
      if (
        Math.abs(current.x - newOffset.x) > 1e-10 ||
        Math.abs(current.y - newOffset.y) > 1e-10
      ) {
        engine.setTransform({ x: newOffset.x, y: newOffset.y })
      }
    },
    { deep: true }
  )

  const setTransform = (t: Partial<TransformState>): void => {
    engine.setTransform(t)
  }

  const panBy = (dx: number, dy: number): void => {
    engine.panBy(dx, dy)
  }

  const zoomBy = (dScale: number, originX: number, originY: number): void => {
    engine.zoomBy(dScale, originX, originY)
  }

  const zoomTo = (targetScale: number, originX: number, originY: number): void => {
    engine.zoomTo(targetScale, originX, originY)
  }

  const toWorldPoint = (screenX: number, screenY: number): { x: number; y: number } => {
    return engine.toWorldPoint(screenX, screenY)
  }

  const toScreenPoint = (worldX: number, worldY: number): { x: number; y: number } => {
    return engine.toScreenPoint(worldX, worldY)
  }

  const reset = (): void => {
    engine.setTransform({ scale: startScale, x: startOffset.x, y: startOffset.y })
  }

  return {
    scale,
    offset: readonly(offset) as DeepReadonly<Ref<{ x: number; y: number }>>,
    engine,
    setTransform,
    panBy,
    zoomBy,
    zoomTo,
    toWorldPoint,
    toScreenPoint,
    reset
  }
}
