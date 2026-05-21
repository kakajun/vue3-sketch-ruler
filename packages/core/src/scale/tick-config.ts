import type { TickConfig } from '../types'

/** 刻度配置表，按 maxScale 升序排列 */
export const TICK_CONFIGS: Array<TickConfig & { maxScale: number }> = [
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
