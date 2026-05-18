/**
 * useRulerScale - 标尺刻度计算组合式函数
 * 根据 scale、offset、视口尺寸计算可见刻度数组
 * 纯计算逻辑，零 DOM 依赖
 */

import { computed, ref, watch, type Ref } from 'vue'

export interface TickConfig {
  /** 主刻度间隔（世界坐标） */
  interval: number
  /** 次刻度分割数 */
  subdivisions: number
  /** 是否显示标签 */
  showLabel: boolean
  /** 标签格式化函数 */
  formatLabel?: (value: number) => string
}

export interface ScaleMark {
  /** 屏幕坐标位置 */
  position: number
  /** 刻度长度（像素） */
  length: number
  /** 是否主刻度 */
  isMajor: boolean
  /** 标签文本（仅主刻度） */
  label?: string
  /** 对应的世界坐标值 */
  value: number
}

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
}

/** 刻度配置表，按 maxScale 升序排列 */
const TICK_CONFIGS: Array<TickConfig & { maxScale: number }> = [
  {
    maxScale: 0.2,
    interval: 500,
    subdivisions: 5,
    showLabel: true,
    formatLabel: (v) => `${Math.round(v / 1000)}k`
  },
  { maxScale: 0.5, interval: 200, subdivisions: 4, showLabel: true },
  { maxScale: 1.0, interval: 100, subdivisions: 5, showLabel: true },
  { maxScale: 2.0, interval: 50, subdivisions: 5, showLabel: true },
  { maxScale: 5.0, interval: 20, subdivisions: 4, showLabel: true },
  { maxScale: 10.0, interval: 10, subdivisions: 5, showLabel: true },
  { maxScale: Infinity, interval: 5, subdivisions: 5, showLabel: true }
]

const HYSTERESIS_UP = 1.1 // 升级滞后：阈值 * 1.1
const HYSTERESIS_DOWN = 0.9 // 降级滞后：阈值 * 0.9

/** 根据缩放级别获取刻度配置 */
export function getTickConfig(scale: number): TickConfig {
  const idx = TICK_CONFIGS.findIndex((c) => scale < c.maxScale)
  return TICK_CONFIGS[idx === -1 ? TICK_CONFIGS.length - 1 : idx]
}

/**
 * 应用滞后带（Hysteresis）机制，避免临界振荡
 * @param currentIdx 当前配置索引
 * @param scale 当前缩放值
 * @returns 新的配置索引
 */
export function applyHysteresis(currentIdx: number, scale: number): number {
  let idx = currentIdx

  // 尝试升级
  while (idx < TICK_CONFIGS.length - 1 && scale >= TICK_CONFIGS[idx].maxScale * HYSTERESIS_UP) {
    idx++
  }

  // 尝试降级
  while (idx > 0 && scale < TICK_CONFIGS[idx - 1].maxScale * HYSTERESIS_DOWN) {
    idx--
  }

  return idx
}

export function useRulerScale(options: RulerScaleOptions) {
  const { thick, viewportSize, scale, offset, vertical = false } = options

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
    const s = scale.value
    const o = vertical ? offset.value.y : offset.value.x
    const vp = vertical ? viewportSize.value.height : viewportSize.value.width

    if (vp <= 0 || s <= 0) {
      return []
    }

    const config = TICK_CONFIGS[currentIdx.value]
    const interval = config.interval
    const subdivisions = config.subdivisions
    const subInterval = interval / subdivisions

    // 计算视口在世界坐标中的范围
    const worldStart = -o / s
    const worldEnd = (vp - o) / s

    // 扩展缓冲区（左右各 0.5 倍视口宽度）
    const bufferSize = vp / s
    const renderStart = worldStart - bufferSize * 0.5
    const renderEnd = worldEnd + bufferSize * 0.5

    // 对齐到刻度间隔
    const firstMajor = Math.floor(renderStart / interval) * interval
    const marks: ScaleMark[] = []

    for (let major = firstMajor; major <= renderEnd; major += interval) {
      // 主刻度
      const screenPos = major * s + o
      if (screenPos >= -thick && screenPos <= vp + thick) {
        marks.push({
          position: screenPos,
          length: thick * 0.6,
          isMajor: true,
          label: config.formatLabel ? config.formatLabel(major) : `${Math.round(major)}`,
          value: major
        })
      }

      // 次刻度
      for (let i = 1; i < subdivisions; i++) {
        const subValue = major + i * subInterval
        const subScreenPos = subValue * s + o
        if (subScreenPos >= -thick && subScreenPos <= vp + thick) {
          marks.push({
            position: subScreenPos,
            length: thick * 0.3,
            isMajor: false,
            value: subValue
          })
        }
      }
    }

    return marks
  })

  return {
    ticks,
    currentConfig: computed(() => TICK_CONFIGS[currentIdx.value])
  }
}
