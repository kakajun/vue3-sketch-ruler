import type { GuideLine, RulerPalette } from '../state/ruler-context'

export interface GuideLineRenderPayload {
  lines: GuideLine[]
  scale: number
  offsetX: number
  offsetY: number
  thick: number
  width: number
  height: number
  ratio: number
  palette: RulerPalette
}

function getLineDash(style?: 'solid' | 'dashed' | 'dotted'): number[] {
  switch (style) {
    case 'solid':
      return []
    case 'dotted':
      return [1, 3]
    case 'dashed':
    default:
      return [4, 4]
  }
}

function getLabelText(line: GuideLine, palette: RulerPalette): string {
  if (palette.labelFormat) {
    return palette.labelFormat(line.position)
  }
  return String(Math.round(line.position))
}

/**
 * GuideLineRenderer - 参考线 Canvas 批次渲染
 * M2 W9：将参考线从 DOM 迁移至 Canvas，横向/纵向各一次 drawCall
 * M3 W14：支持样式自定义（线型、宽度、标签）
 */
export function renderGuideLines(
  ctx: CanvasRenderingContext2D,
  payload: GuideLineRenderPayload
): void {
  const { lines, scale, offsetX, offsetY, thick, width, height, ratio, palette } = payload

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(ratio, ratio)
  ctx.clearRect(0, 0, width, height)

  // W8: 视口裁剪 —— 仅绘制视口内的参考线
  const viewportWorldX = -offsetX / scale
  const viewportWorldY = -offsetY / scale
  const viewportWorldW = width / scale
  const viewportWorldH = height / scale

  const hLines = lines.filter(
    (l) =>
      l.orientation === 'h' &&
      l.visible !== false &&
      l.position >= viewportWorldY &&
      l.position <= viewportWorldY + viewportWorldH
  )
  const vLines = lines.filter(
    (l) =>
      l.orientation === 'v' &&
      l.visible !== false &&
      l.position >= viewportWorldX &&
      l.position <= viewportWorldX + viewportWorldW
  )

  const lineWidth = palette.guideLineWidth ?? 1
  const lineDash = getLineDash(palette.guideLineStyle)
  const showLabel = palette.labelEnabled !== false
  const labelPos = palette.labelPosition ?? 'end'

  // 非锁定横向参考线批次
  const normalH = hLines.filter((l) => !l.locked)
  if (normalH.length > 0) {
    ctx.beginPath()
    ctx.strokeStyle = palette.guideLineColor
    ctx.lineWidth = lineWidth
    ctx.setLineDash(lineDash)

    for (const line of normalH) {
      const pos = line.position * scale + offsetY
      ctx.moveTo(0, pos)
      ctx.lineTo(width, pos)
    }

    ctx.stroke()
  }

  // 非锁定纵向参考线批次
  const normalV = vLines.filter((l) => !l.locked)
  if (normalV.length > 0) {
    ctx.beginPath()
    ctx.strokeStyle = palette.guideLineColor
    ctx.lineWidth = lineWidth
    ctx.setLineDash(lineDash)

    for (const line of normalV) {
      const pos = line.position * scale + offsetX
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, height)
    }

    ctx.stroke()
  }

  // 锁定参考线使用不同颜色（单独批次）
  const lockedH = hLines.filter((l) => l.locked)
  const lockedV = vLines.filter((l) => l.locked)

  if (lockedH.length > 0) {
    ctx.beginPath()
    ctx.strokeStyle = palette.guideLineLockedColor
    ctx.lineWidth = lineWidth
    ctx.setLineDash(lineDash)

    for (const line of lockedH) {
      const pos = line.position * scale + offsetY
      ctx.moveTo(0, pos)
      ctx.lineTo(width, pos)
    }

    ctx.stroke()
  }

  if (lockedV.length > 0) {
    ctx.beginPath()
    ctx.strokeStyle = palette.guideLineLockedColor
    ctx.lineWidth = lineWidth
    ctx.setLineDash(lineDash)

    for (const line of lockedV) {
      const pos = line.position * scale + offsetX
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, height)
    }

    ctx.stroke()
  }

  // 绘制标签
  if (showLabel) {
    ctx.setLineDash([])
    ctx.font = `10px ${getComputedFont()}`
    ctx.textBaseline = 'middle'

    for (const line of hLines) {
      const pos = line.position * scale + offsetY
      const text = getLabelText(line, palette)
      const textWidth = ctx.measureText(text).width
      let x: number
      switch (labelPos) {
        case 'start':
          x = 4
          break
        case 'center':
          x = (width - textWidth) / 2
          break
        case 'end':
        default:
          x = width - textWidth - 4
          break
      }
      ctx.fillStyle = line.locked ? palette.guideLineLockedColor : palette.guideLineColor
      ctx.fillText(text, x, pos - 6)
    }

    for (const line of vLines) {
      const pos = line.position * scale + offsetX
      const text = getLabelText(line, palette)
      let y: number
      switch (labelPos) {
        case 'start':
          y = 8
          break
        case 'center':
          y = height / 2
          break
        case 'end':
        default:
          y = height - 8
          break
      }
      ctx.fillStyle = line.locked ? palette.guideLineLockedColor : palette.guideLineColor
      ctx.save()
      ctx.translate(pos + 6, y)
      ctx.rotate(Math.PI / 2)
      ctx.textAlign = 'left'
      ctx.fillText(text, 0, 0)
      ctx.restore()
    }
  }
}

let _cachedFont: string | null = null
function getComputedFont(): string {
  if (_cachedFont) return _cachedFont
  // 默认回退字体栈，与系统一致
  _cachedFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  return _cachedFont
}
