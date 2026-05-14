/**
 * 坐标映射工具
 * 屏幕坐标 ↔ 世界坐标双向转换
 * 零 DOM 依赖，纯数学运算
 */

import type { Matrix6 } from './matrix'

export interface Point {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** 屏幕坐标 → 世界坐标 */
export function toWorldPoint(matrix: Matrix6, screenX: number, screenY: number): Point {
  // 对于纯缩放+平移矩阵 [s, 0, 0, s, tx, ty]
  // 逆变换：worldX = (screenX - tx) / s
  //        worldY = (screenY - ty) / s
  const scale = matrix[0]
  if (Math.abs(scale) < 1e-10) {
    return { x: 0, y: 0 }
  }
  return {
    x: (screenX - matrix[4]) / scale,
    y: (screenY - matrix[5]) / scale
  }
}

/** 世界坐标 → 屏幕坐标 */
export function toScreenPoint(matrix: Matrix6, worldX: number, worldY: number): Point {
  const scale = matrix[0]
  return {
    x: worldX * scale + matrix[4],
    y: worldY * scale + matrix[5]
  }
}

/** 批量屏幕坐标 → 世界坐标 */
export function batchToWorld(matrix: Matrix6, points: Point[]): Point[] {
  const scale = matrix[0]
  if (Math.abs(scale) < 1e-10) {
    return points.map(() => ({ x: 0, y: 0 }))
  }
  const tx = matrix[4]
  const ty = matrix[5]
  const invScale = 1 / scale

  return points.map((p) => ({
    x: (p.x - tx) * invScale,
    y: (p.y - ty) * invScale
  }))
}

/** 批量世界坐标 → 屏幕坐标 */
export function batchToScreen(matrix: Matrix6, points: Point[]): Point[] {
  const scale = matrix[0]
  const tx = matrix[4]
  const ty = matrix[5]

  return points.map((p) => ({
    x: p.x * scale + tx,
    y: p.y * scale + ty
  }))
}

/** 计算"适配至视口"的最优变换矩阵 */
export function fitRect(
  contentRect: Rect,
  viewportRect: Rect,
  mode: 'contain' | 'cover' | 'center' = 'contain',
  paddingRatio = 0
): { scale: number; x: number; y: number } {
  const contentW = contentRect.width
  const contentH = contentRect.height
  const viewportW = viewportRect.width * (1 - paddingRatio)
  const viewportH = viewportRect.height * (1 - paddingRatio)

  if (contentW <= 0 || contentH <= 0 || viewportW <= 0 || viewportH <= 0) {
    return { scale: 1, x: 0, y: 0 }
  }

  const scaleX = viewportW / contentW
  const scaleY = viewportH / contentH

  let scale: number
  if (mode === 'contain') {
    scale = Math.min(scaleX, scaleY)
  } else if (mode === 'cover') {
    scale = Math.max(scaleX, scaleY)
  } else {
    scale = 1
  }

  const centeredX = (viewportRect.width - contentW * scale) / 2
  const centeredY = (viewportRect.height - contentH * scale) / 2

  return {
    scale,
    x: centeredX - contentRect.x * scale,
    y: centeredY - contentRect.y * scale
  }
}
