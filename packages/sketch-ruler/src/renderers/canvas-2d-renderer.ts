import type { Renderer, Rect, RulerRenderPayload } from './types'
import { OffscreenRulerCache } from './offscreen-ruler-cache'
import { LabelCache } from './label-cache'

/** 默认阴影颜色 */
const DEFAULT_SHADOW_COLOR = 'rgba(0, 0, 0, 0.08)'

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
        ctx.fillStyle = DEFAULT_SHADOW_COLOR
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
        }
      }
    }

    // 3. 标签（使用 LabelCache 缓存）
    for (const mark of marks) {
      if (mark.isMajor && mark.label) {
        ctx.save()
        if (vertical) {
          ctx.translate(width * 0.2, mark.position + thick * 0.15)
          ctx.rotate(-Math.PI / 2)
        } else {
          ctx.translate(mark.position + thick * 0.05, height * 0.4)
        }

        const font = `${thick * 0.5}px sans-serif`
        const entry = this.labelCache.get(ctx, {
          text: mark.label,
          font,
          color: palette.labelColor
        })

        if (entry.width > 0) {
          ctx.drawImage(entry.canvas, 0, -entry.height / 2)
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
      ctx.translate(thick * 0.4, screenPos + (isEnd ? -8 : 8))
      ctx.rotate(-Math.PI / 2)
    } else {
      ctx.translate(screenPos + (isEnd ? -8 : 8), thick * 0.4)
    }
    ctx.fillText(Math.round(value).toString(), 0, 0)
    ctx.restore()
  }

  destroy(): void {
    this.offscreenCache.clear()
    this.labelCache.clear()
  }
}
