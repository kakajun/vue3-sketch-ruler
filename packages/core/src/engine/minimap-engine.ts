export interface MinimapOptions {
  contentWidth: number
  contentHeight: number
  viewportX: number
  viewportY: number
  viewportWidth: number
  viewportHeight: number
  scale: number
  width: number
  height: number
}

export interface MinimapState {
  miniScale: number
  contentOffset: { x: number; y: number }
  viewportRect: { left: number; top: number; width: number; height: number }
}

export interface DragSessionState {
  targetX: number
  targetY: number
  dragRect: { left: number; top: number; width: number; height: number }
}

export class MinimapEngine {
  constructor(private options: MinimapOptions) {}

  getState(): MinimapState {
    const miniScale = Math.min(
      this.options.width / this.options.contentWidth,
      this.options.height / this.options.contentHeight
    )
    const cw = this.options.contentWidth * miniScale
    const ch = this.options.contentHeight * miniScale
    const ox = (this.options.width - cw) / 2
    const oy = (this.options.height - ch) / 2

    const left = ox + (-this.options.viewportX / this.options.scale) * miniScale
    const top = oy + (-this.options.viewportY / this.options.scale) * miniScale
    const width = (this.options.viewportWidth / this.options.scale) * miniScale
    const height = (this.options.viewportHeight / this.options.scale) * miniScale

    return {
      miniScale,
      contentOffset: { x: ox, y: oy },
      viewportRect: { left, top, width, height }
    }
  }

  clampTransform(x: number, y: number): { x: number; y: number } {
    const contentW = this.options.contentWidth * this.options.scale
    const contentH = this.options.contentHeight * this.options.scale

    let cx = x
    let cy = y

    if (contentW <= this.options.viewportWidth) {
      cx = (this.options.viewportWidth - contentW) / 2
    } else {
      cx = Math.min(0, Math.max(this.options.viewportWidth - contentW, x))
    }

    if (contentH <= this.options.viewportHeight) {
      cy = (this.options.viewportHeight - contentH) / 2
    } else {
      cy = Math.min(0, Math.max(this.options.viewportHeight - contentH, y))
    }

    return { x: cx, y: cy }
  }

  canPan(): boolean {
    return (
      this.options.contentWidth * this.options.scale > this.options.viewportWidth ||
      this.options.contentHeight * this.options.scale > this.options.viewportHeight
    )
  }

  clickAt(clientX: number, clientY: number, rectLeft: number, rectTop: number): { x: number; y: number } {
    const state = this.getState()
    const worldX = (clientX - rectLeft - state.contentOffset.x) / state.miniScale
    const worldY = (clientY - rectTop - state.contentOffset.y) / state.miniScale
    const transformX = this.options.viewportWidth / 2 - worldX * this.options.scale
    const transformY = this.options.viewportHeight / 2 - worldY * this.options.scale
    return this.clampTransform(transformX, transformY)
  }

  startDrag(
    startViewportX: number,
    startViewportY: number,
    startMinimapLeft: number,
    startMinimapTop: number
  ): MinimapDragSession {
    return new MinimapDragSession(this, startViewportX, startViewportY, startMinimapLeft, startMinimapTop)
  }
}

export class MinimapDragSession {
  private ratio: number

  constructor(
    private engine: MinimapEngine,
    private startViewportX: number,
    private startViewportY: number,
    private startMinimapLeft: number,
    private startMinimapTop: number
  ) {
    this.ratio = engine['options'].scale / engine.getState().miniScale
  }

  move(accDx: number, accDy: number): DragSessionState {
    const rawX = this.startViewportX - accDx * this.ratio
    const rawY = this.startViewportY - accDy * this.ratio
    const clamped = this.engine.clampTransform(rawX, rawY)

    const actualDx = (this.startViewportX - clamped.x) / this.ratio
    const actualDy = (this.startViewportY - clamped.y) / this.ratio

    const state = this.engine.getState()

    return {
      targetX: clamped.x,
      targetY: clamped.y,
      dragRect: {
        left: this.startMinimapLeft + actualDx,
        top: this.startMinimapTop + actualDy,
        width: state.viewportRect.width,
        height: state.viewportRect.height
      }
    }
  }

  end(accDx: number, accDy: number): { x: number; y: number } {
    const rawX = this.startViewportX - accDx * this.ratio
    const rawY = this.startViewportY - accDy * this.ratio
    const clamped = this.engine.clampTransform(rawX, rawY)
    return { x: clamped.x, y: clamped.y }
  }
}
