/**
 * OffscreenRulerCache - 标尺离屏缓存
 * 预渲染静态外观（背景 + 刻度线），仅在配色/厚度/密度变更时重建
 * M2 性能优化：避免每帧重复绘制不变的刻度几何
 */

import type { ScaleMark } from '../composables/useRulerScale'
import type { RulerRenderPayload } from './types'

export class OffscreenRulerCache {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private lastFingerprint = ''

  /**
   * 尝试使用离屏缓存绘制静态部分
   * @returns true 表示使用了缓存，false 表示缓存未命中/未初始化
   */
  drawStatic(
    targetCtx: CanvasRenderingContext2D,
    marks: ScaleMark[],
    payload: RulerRenderPayload
  ): boolean {
    const fingerprint = this.buildFingerprint(marks, payload)

    if (fingerprint !== this.lastFingerprint || !this.canvas) {
      this.rebuild(marks, payload)
      this.lastFingerprint = fingerprint
    }

    if (this.canvas) {
      targetCtx.drawImage(this.canvas, 0, 0)
      return true
    }
    return false
  }

  private rebuild(marks: ScaleMark[], payload: RulerRenderPayload): void {
    const { width, height, ratio, palette, thick, vertical } = payload

    if (!this.canvas) {
      this.canvas = document.createElement('canvas')
    }

    this.canvas.width = Math.round(width * ratio)
    this.canvas.height = Math.round(height * ratio)

    const ctx = this.canvas.getContext('2d')!
    this.ctx = ctx

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(ratio, ratio)
    ctx.clearRect(0, 0, width, height)

    // 背景
    ctx.fillStyle = palette.bgColor
    ctx.fillRect(0, 0, width, height)

    // 刻度线
    ctx.strokeStyle = palette.tickColor
    ctx.lineWidth = 1
    ctx.beginPath()

    for (const mark of marks) {
      const pos = mark.position
      const len = mark.length

      if (mark.isMajor) {
        if (vertical) {
          ctx.moveTo(width * 0.7, pos)
          ctx.lineTo(0, pos)
        } else {
          ctx.moveTo(pos, height * 0.7)
          ctx.lineTo(pos, 0)
        }
      } else {
        if (vertical) {
          ctx.moveTo(width * 0.85, pos)
          ctx.lineTo(width * 0.55, pos)
        } else {
          ctx.moveTo(pos, height * 0.85)
          ctx.lineTo(pos, height * 0.55)
        }
      }
    }

    ctx.stroke()
    ctx.closePath()

    // 注意：标签不在离屏缓存中绘制，因为阴影可能覆盖标签区域
    // 标签由主线程使用 LabelCache 动态绘制
  }

  private buildFingerprint(marks: ScaleMark[], payload: RulerRenderPayload): string {
    const { thick, palette, vertical, width, height } = payload
    // 刻度密度由 marks 中首尾 value 差推断
    const density = marks.length > 1 ? marks[1].value - marks[0].value : 0
    return `${thick}:${palette.bgColor}:${palette.tickColor}:${palette.labelColor}:${vertical}:${width}:${height}:${density}`
  }

  /** 清空缓存 */
  clear(): void {
    this.canvas = null
    this.ctx = null
    this.lastFingerprint = ''
  }
}
