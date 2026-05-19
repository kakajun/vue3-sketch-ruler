import { normalizeWheel, type NormalizedWheel } from './wheel-normalizer'

export interface MouseAdapterCallbacks {
  onWheel?: (e: WheelEvent, normalized: NormalizedWheel) => void
  onMouseDown?: (e: MouseEvent) => void
  onMouseMove?: (e: MouseEvent) => void
  onMouseUp?: (e: MouseEvent) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

/**
 * MouseAdapter - 鼠标事件封装适配器
 * 统一绑定/解绑生命周期，自动标准化滚轮事件
 */
export class MouseAdapter {
  private container: HTMLElement
  private callbacks: MouseAdapterCallbacks

  private boundWheel: (e: WheelEvent) => void
  private boundMouseDown: (e: MouseEvent) => void
  private boundMouseMove: (e: MouseEvent) => void
  private boundMouseUp: (e: MouseEvent) => void
  private boundMouseEnter: () => void
  private boundMouseLeave: () => void

  private isBound = false

  constructor(container: HTMLElement, callbacks: MouseAdapterCallbacks) {
    this.container = container
    this.callbacks = callbacks

    this.boundWheel = this.handleWheel.bind(this)
    this.boundMouseDown = this.handleMouseDown.bind(this)
    this.boundMouseMove = this.handleMouseMove.bind(this)
    this.boundMouseUp = this.handleMouseUp.bind(this)
    this.boundMouseEnter = () => this.callbacks.onMouseEnter?.()
    this.boundMouseLeave = () => this.callbacks.onMouseLeave?.()
  }

  bind(): void {
    if (this.isBound) return
    this.isBound = true

    this.container.addEventListener('wheel', this.boundWheel, { passive: false })
    this.container.addEventListener('mousedown', this.boundMouseDown)
    document.addEventListener('mousemove', this.boundMouseMove)
    document.addEventListener('mouseup', this.boundMouseUp)
    this.container.addEventListener('mouseenter', this.boundMouseEnter)
    this.container.addEventListener('mouseleave', this.boundMouseLeave)
  }

  unbind(): void {
    if (!this.isBound) return
    this.isBound = false

    this.container.removeEventListener('wheel', this.boundWheel)
    this.container.removeEventListener('mousedown', this.boundMouseDown)
    document.removeEventListener('mousemove', this.boundMouseMove)
    document.removeEventListener('mouseup', this.boundMouseUp)
    this.container.removeEventListener('mouseenter', this.boundMouseEnter)
    this.container.removeEventListener('mouseleave', this.boundMouseLeave)
  }

  private handleWheel(e: WheelEvent): void {
    const normalized = normalizeWheel(e)
    this.callbacks.onWheel?.(e, normalized)
  }

  private handleMouseDown(e: MouseEvent): void {
    this.callbacks.onMouseDown?.(e)
  }

  private handleMouseMove(e: MouseEvent): void {
    this.callbacks.onMouseMove?.(e)
  }

  private handleMouseUp(e: MouseEvent): void {
    this.callbacks.onMouseUp?.(e)
  }
}
