/**
 * WheelNormalizer - 统一不同浏览器滚轮事件 delta 值
 * Chrome/Firefox/Safari 的 WheelEvent.deltaY 差异很大，
 * 统一转换为像素级增量，便于上层消费。
 */

export interface NormalizedWheel {
  /** 水平方向增量（像素） */
  deltaX: number
  /** 垂直方向增量（像素） */
  deltaY: number
  /** Z 轴增量（像素） */
  deltaZ: number
  /** 原始 deltaMode */
  deltaMode: number
}

/**
 * 将浏览器原生 WheelEvent 标准化为像素单位
 *
 * 各浏览器典型值：
 * - Chrome (line mode): deltaY ≈ 100
 * - Firefox (line mode): deltaY ≈ 3
 * - Safari (pixel mode): deltaY ≈ 1
 */
export function normalizeWheel(event: WheelEvent): NormalizedWheel {
  let deltaX = event.deltaX
  let deltaY = event.deltaY
  let deltaZ = event.deltaZ || 0
  const deltaMode = event.deltaMode

  // DOM_DELTA_LINE (1): 按行滚动，统一乘以 40px/行
  if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
    deltaX *= 40
    deltaY *= 40
    deltaZ *= 40
  }
  // DOM_DELTA_PAGE (2): 按页滚动，统一乘以 800px/页
  else if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    deltaX *= 800
    deltaY *= 800
    deltaZ *= 800
  }

  return { deltaX, deltaY, deltaZ, deltaMode }
}

/**
 * 获取滚轮事件的标准化缩放增量
 * 用于 Ctrl+滚轮缩放场景，返回值已做方向归一化
 */
export function getZoomDelta(event: WheelEvent, sensitivity = 0.001): number {
  const normalized = normalizeWheel(event)
  // 优先使用 deltaY，若 deltaY 为 0 则使用 deltaX（触控板水平滚动手势）
  const rawDelta = normalized.deltaY !== 0 ? normalized.deltaY : normalized.deltaX
  return -rawDelta * sensitivity
}
