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

    // 刻度线（简约风格：只画主刻度，与 master 分支保持一致）
    ctx.strokeStyle = palette.tickColor
    ctx.lineWidth = 1
    ctx.beginPath()

    for (const mark of marks) {
      const pos = mark.position

      if (mark.isMajor) {
        if (mark.value === 0 || mark.value === payload.canvasSize) {
          // 0 和 canvas 最大宽度/高度刻度画满整个标尺（同 master 分支）
          if (vertical) {
            ctx.moveTo(0, pos)
            ctx.lineTo(width, pos)
          } else {
            ctx.moveTo(pos, 0)
            ctx.lineTo(pos, height)
          }
        } else {
          // 主刻度从底部画到中间偏下，整体下移给标签留空间
          if (vertical) {
            ctx.moveTo(width, pos)
            ctx.lineTo(width * 0.65, pos)
          } else {
            ctx.moveTo(pos, height)
            ctx.lineTo(pos, height * 0.65)
          }
        }
      } else {
        // 次刻度线（较短），与主刻度底部对齐
        if (vertical) {
          ctx.moveTo(width, pos)
          ctx.lineTo(width * 0.8, pos)
        } else {
          ctx.moveTo(pos, height)
          ctx.lineTo(pos, height * 0.8)
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

    // 从 marks 推断 scale 和 offset，确保缩放/平移变化时缓存失效
    let scale = 1
    let offset = 0
    if (marks.length >= 2) {
      const first = marks[0]
      const second = marks.find((m) => m.value !== first.value) ?? marks[1]
      if (second && second.value !== first.value) {
        scale = (second.position - first.position) / (second.value - first.value)
        offset = first.position - first.value * scale
      }
    }

    return `${thick}:${palette.bgColor}:${palette.tickColor}:${palette.labelColor}:${vertical}:${width}:${height}:${density}:${scale.toFixed(4)}:${offset.toFixed(2)}`
  }

  /** 清空缓存 */
  clear(): void {
    this.canvas = null
    this.ctx = null
    this.lastFingerprint = ''
  }
}
