import type { ScaleMark } from '../composables/useRulerScale'
import type { RulerPalette } from '../state/ruler-context'

/** 视口矩形 */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** 标尺渲染载荷 */
export interface RulerRenderPayload {
  type: 'ruler'
  marks: ScaleMark[]
  vertical: boolean
  thick: number
  width: number
  height: number
  ratio: number
  palette: RulerPalette
  /** 阴影起始位置（世界坐标） */
  shadowStart?: number
  /** 阴影长度（世界坐标） */
  shadowLength?: number
  /** 是否显示阴影文字 */
  showShadowText?: boolean
  /** 画布尺寸（用于阴影文字） */
  canvasSize?: number
}

export type RenderItem = RulerRenderPayload

/** 渲染器抽象接口 */
export interface Renderer {
  render(ctx: CanvasRenderingContext2D, items: RenderItem[], viewportRect: Rect): void
  destroy(): void
}
