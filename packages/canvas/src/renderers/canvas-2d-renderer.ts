import type { Renderer, Rect, RulerRenderPayload } from './types'
import type { RulerPalette } from '@sketch-ruler/core'
import { OffscreenRulerCache } from './offscreen-ruler-cache'
import { LabelCache } from './label-cache'

/** 默认阴影颜色 */
const DEFAULT_SHADOW_COLOR = '#e9f7fe'

export class Canvas2DRenderer implements Renderer {
  private offscreenCache = new OffscreenRulerCache()
  private labelCache = new LabelCache()

  render(ctx: CanvasRenderingContext2D, items: RulerRenderPayload[], viewportRect: Rect): void {
    for (const item of items) {
      if (item.type === 'ruler') {
        this.renderRuler(ctx, item, viewportRect)
      }
    }
  }

  private renderRuler(
    ctx: CanvasRenderingContext2D,
    payload: RulerRenderPayload,
    _viewportRect: Rect
  ): void {
    const {
      marks,
      vertical,
      thick,
      width,
      height,
      ratio,
      palette,
      shadowStart,
      shadowLength,
      showShadowText
    } = payload

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(ratio, ratio)
    ctx.clearRect(0, 0, width, height)

    // 1. 离屏缓存绘制静态部分（背景 + 刻度线）
    this.offscreenCache.drawStatic(ctx, marks, payload)

    // 2. 阴影区域（动态，不缓存）
    const shadowTextPositions: number[] = []
    if (shadowLength && marks.length > 0) {
      const shadowX = shadowStart ?? 0
      // 从 marks 推断 scale 和 offset：position = value * scale + offset
      const firstMark = marks[0]
      const secondMark = marks.find((m) => m.value !== firstMark.value) ?? firstMark
      const scale =
        secondMark && secondMark.value !== firstMark.value
          ? (secondMark.position - firstMark.position) / (secondMark.value - firstMark.value)
          : 1
      const offset = firstMark.position - firstMark.value * scale

      const screenStart = shadowX * scale + offset
      const screenLength = shadowLength * scale

      if (screenLength > 0) {
        ctx.fillStyle = palette.shadowColor ?? DEFAULT_SHADOW_COLOR
        if (vertical) {
          ctx.fillRect(0, screenStart, width, screenLength)
        } else {
          ctx.fillRect(screenStart, 0, screenLength, height)
        }

        if (showShadowText) {
          this.renderShadowText(ctx, shadowX, screenStart, thick, vertical, palette, false)
          const shadowEnd = shadowX + shadowLength
          const screenEnd = shadowEnd * scale + offset
          this.renderShadowText(ctx, shadowEnd, screenEnd, thick, vertical, palette, true)
          shadowTextPositions.push(screenStart, screenEnd)
        }
      }
    }

    // 3. 标签（和 v2 坐标保持一致，直接 fillText）
    for (const mark of marks) {
      if (mark.isMajor && mark.label) {
        // 靠近阴影文字时跳过，避免重叠
        const isNearShadow = shadowTextPositions.some(
          (pos) => Math.abs(mark.position - pos) < thick * 1.5
        )
        if (isNearShadow) continue

        ctx.save()
        ctx.fillStyle = palette.labelColor
        ctx.font = `${Math.max(11, Math.floor(thick * 0.5) + 2)}px -apple-system, "Helvetica Neue", ".SFNSDisplay-Regular", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif`

        if (vertical) {
          if (mark.value === 0) {
            ctx.translate(width * 0.4, mark.position - 3)
          } else if (mark.value === payload.canvasSize) {
            ctx.translate(width * 0.2, mark.position + 32)
          } else {
            ctx.translate(width * 0.15, mark.position + 14)
          }
          ctx.rotate((-90 * Math.PI) / 180)
          ctx.fillText(mark.label, 4, 9)
        } else {
          if (mark.value === 0) {
            ctx.translate(mark.position - 15, height * 0.13)
          } else if (mark.value === payload.canvasSize) {
            ctx.translate(mark.position + 5, height * 0.3)
          } else {
            ctx.translate(mark.position - 12, height * 0.18)
          }
          ctx.fillText(mark.label, 4, 9)
        }

        ctx.restore()
      }
    }
  }

  private renderShadowText(
    ctx: CanvasRenderingContext2D,
    value: number,
    screenPos: number,
    thick: number,
    vertical: boolean,
    palette: RulerRenderPayload['palette'],
    isEnd: boolean
  ): void {
    ctx.save()
    ctx.fillStyle = palette.labelColor
    ctx.font = 'bold 12px sans-serif'
    if (vertical) {
      ctx.translate(thick * 0.6, screenPos + (isEnd ? -8 : 8))
      ctx.rotate(-Math.PI / 2)
    } else {
      ctx.translate(screenPos + (isEnd ? -8 : 8), thick * 0.6)
    }
    ctx.fillText(Math.round(value).toString(), 0, 0)
    ctx.restore()
  }

  destroy(): void {
    this.offscreenCache.clear()
    this.labelCache.clear()
  }
}
