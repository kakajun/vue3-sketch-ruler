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

/**
 * GuideLineRenderer - 参考线 Canvas 批次渲染
 * M2 W9：将参考线从 DOM 迁移至 Canvas，横向/纵向各一次 drawCall
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

  // 横向参考线批次
  if (hLines.length > 0) {
    ctx.beginPath()
    ctx.strokeStyle = palette.guideLineColor
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    for (const line of hLines) {
      const pos = line.position * scale + offsetY + thick
      ctx.moveTo(0, pos)
      ctx.lineTo(width, pos)
    }

    ctx.stroke()
  }

  // 纵向参考线批次
  if (vLines.length > 0) {
    ctx.beginPath()
    ctx.strokeStyle = palette.guideLineColor
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    for (const line of vLines) {
      const pos = line.position * scale + offsetX + thick
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
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    for (const line of lockedH) {
      const pos = line.position * scale + offsetY + thick
      ctx.moveTo(0, pos)
      ctx.lineTo(width, pos)
    }

    ctx.stroke()
  }

  if (lockedV.length > 0) {
    ctx.beginPath()
    ctx.strokeStyle = palette.guideLineLockedColor
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    for (const line of lockedV) {
      const pos = line.position * scale + offsetX + thick
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, height)
    }

    ctx.stroke()
  }
}
