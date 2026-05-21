/**
 * useRulerScale - 标尺刻度计算组合式函数
 * 根据 scale、offset、视口尺寸计算可见刻度数组
 * 核心计算逻辑已迁移至 @sketch-ruler/core，此处仅保留 Vue 响应式包装
 */

import { computed, ref, watch, type Ref } from 'vue'
import {
  computeScaleMarks,
  getTickConfig,
  applyHysteresis,
  type ScaleMark,
  type TickConfig
} from '@sketch-ruler/core'

export type { ScaleMark, TickConfig }

export interface RulerScaleOptions {
  /** 标尺厚度（像素） */
  thick: number
  /** 视口尺寸 */
  viewportSize: Ref<{ width: number; height: number }>
  /** 当前缩放比例 */
  scale: Ref<number>
  /** 平移偏移 */
  offset: Ref<{ x: number; y: number }>
  /** 是否垂直方向 */
  vertical?: boolean
  /** 画布尺寸（世界坐标），用于过滤超出范围的标注 */
  canvasSize?: Ref<number>
  /** 是否显示次刻度线，默认 false */
  showMinorTicks?: Ref<boolean>
}

export function useRulerScale(options: RulerScaleOptions) {
  const {
    thick,
    viewportSize,
    scale,
    offset,
    vertical = false,
    canvasSize,
    showMinorTicks
  } = options

  // 滞后带状态：维护当前刻度配置索引，避免临界振荡
  const currentIdx = ref(0)

  watch(
    scale,
    (s) => {
      currentIdx.value = applyHysteresis(currentIdx.value, s)
    },
    { immediate: true }
  )

  const ticks = computed<ScaleMark[]>(() => {
    return computeScaleMarks({
      scale: scale.value,
      offset: vertical ? offset.value.y : offset.value.x,
      viewportSize: vertical ? viewportSize.value.height : viewportSize.value.width,
      thick,
      canvasSize: canvasSize?.value,
      showMinorTicks: showMinorTicks?.value
    })
  })

  return {
    ticks,
    currentConfig: computed<TickConfig>(() => getTickConfig(scale.value))
  }
}

// 从 core 重新导出纯函数（保持向后兼容）
export { getTickConfig, applyHysteresis }
