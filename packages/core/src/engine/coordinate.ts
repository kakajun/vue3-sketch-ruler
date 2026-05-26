/**
 * 坐标转换工具
 * 屏幕坐标 ↔ 世界坐标转换
 * 零 DOM 依赖，纯数学运算
 */

import type { Matrix6 } from './matrix'
import type { ZoomMode } from '../types'

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

/**
 * 屏幕坐标 → 世界坐标
 */
export function toWorldPoint(matrix: Matrix6, screenX: number, screenY: number): Point {
  const det = matrix[0] * matrix[3] - matrix[1] * matrix[2]
  if (Math.abs(det) < 1e-10) {
    return { x: 0, y: 0 }
  }

  const invDet = 1 / det
  const x = screenX - matrix[4]
  const y = screenY - matrix[5]

  return {
    x: (matrix[3] * x - matrix[2] * y) * invDet,
    y: (-matrix[1] * x + matrix[0] * y) * invDet
  }
}

/**
 * 世界坐标 → 屏幕坐标
 */
export function toScreenPoint(matrix: Matrix6, worldX: number, worldY: number): Point {
  return {
    x: matrix[0] * worldX + matrix[2] * worldY + matrix[4],
    y: matrix[1] * worldX + matrix[3] * worldY + matrix[5]
  }
}

/**
 * 批量屏幕坐标 → 世界坐标
 */
export function batchToWorld(matrix: Matrix6, points: Point[]): Point[] {
  return points.map((p) => toWorldPoint(matrix, p.x, p.y))
}

/**
 * 批量世界坐标 → 屏幕坐标
 */
export function batchToScreen(matrix: Matrix6, points: Point[]): Point[] {
  return points.map((p) => toScreenPoint(matrix, p.x, p.y))
}

/**
 * 根据 zoomMode 计算缩放原点
 * @param options.mode 缩放模式
 * @param options.viewportSize 视口尺寸
 * @param options.contentSize 内容尺寸
 * @param options.offset 当前画布偏移
 * @param options.scale 当前缩放值
 * @param options.pointerPosition 指针位置（pointer 模式使用）
 */
export function getZoomOrigin(options: {
  mode: ZoomMode
  viewportSize: { width: number; height: number }
  contentSize: { width: number; height: number }
  offset: { x: number; y: number }
  scale: number
  pointerPosition?: { x: number; y: number }
}): Point {
  const { mode, viewportSize, contentSize, offset, scale, pointerPosition } = options

  switch (mode) {
    case 'viewport-center': {
      return { x: viewportSize.width / 2, y: viewportSize.height / 2 }
    }
    case 'content-center': {
      return {
        x: offset.x + (contentSize.width * scale) / 2,
        y: offset.y + (contentSize.height * scale) / 2
      }
    }
    case 'pointer':
    default: {
      if (pointerPosition) {
        return { x: pointerPosition.x, y: pointerPosition.y }
      }
      return { x: viewportSize.width / 2, y: viewportSize.height / 2 }
    }
  }
}

/**
 * Fit 矩形到目标矩形
 * @param mode 'contain' | 'cover' | 'center'
 * @param paddingRatio 边距比例（默认 0，即不留边距）
 */
export function fitRect(
  source: Rect,
  target: Rect,
  mode: 'contain' | 'cover' | 'center' = 'contain',
  paddingRatio = 0
): { scale: number; x: number; y: number } {
  if (source.width <= 0 || source.height <= 0) {
    return { scale: 1, x: target.x, y: target.y }
  }

  const paddedTarget = {
    x: target.x + (target.width * paddingRatio) / 2,
    y: target.y + (target.height * paddingRatio) / 2,
    width: target.width * (1 - paddingRatio),
    height: target.height * (1 - paddingRatio)
  }

  const scaleX = paddedTarget.width / source.width
  const scaleY = paddedTarget.height / source.height

  let scale: number
  if (mode === 'contain') {
    scale = Math.min(scaleX, scaleY)
  } else if (mode === 'cover') {
    scale = Math.max(scaleX, scaleY)
  } else {
    scale = 1
  }

  const x = paddedTarget.x + (paddedTarget.width - source.width * scale) / 2
  const y = paddedTarget.y + (paddedTarget.height - source.height * scale) / 2

  return { scale, x, y }
}
