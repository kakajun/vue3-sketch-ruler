/**
 * InputManager - 统一输入抽象
 * M1 基础版：鼠标滚轮缩放 + 空格拖拽平移
 * 底层事件由 MouseAdapter 封装，滚轮标准化由 WheelNormalizer 处理
 */

import { getZoomOrigin, type TransformEngine, type ZoomMode } from '@sketch-ruler/core'
import { MouseAdapter, type MouseAdapterCallbacks } from './mouse-adapter'
import { KeyboardAdapter } from './keyboard-adapter'
import type { KeyCombo } from './keyboard-adapter'


export interface ZoomInterceptor {
  beforeZoom?: (
    from: number,
    to: number,
    originX: number,
    originY: number
  ) => boolean | Promise<boolean>
  afterZoom?: (from: number, to: number, originX: number, originY: number) => void
}

export interface PanInterceptor {
  beforePan?: (dx: number, dy: number) => boolean | Promise<boolean>
  afterPan?: (dx: number, dy: number) => void
}

export interface InputManagerOptions {
  /** 缩放步长 */
  zoomStep?: number
  /** 是否由外部自行处理事件 */
  selfHandle?: boolean
  /** 缩放原点模式 */
  zoomMode?: ZoomMode
  /** 视口尺寸（viewport-center / content-center 模式需要） */
  viewportSize?: { width: number; height: number }
  /** 内容尺寸（content-center 模式需要） */
  contentSize?: { width: number; height: number }
  /** 光标状态变化回调 */
  onCursorChange?: (cursorClass: string) => void
  /** 缩放拦截器（用于插件 beforeZoom / afterZoom） */
  zoomInterceptor?: ZoomInterceptor
  /** 平移拦截器（用于插件 beforePan / afterPan） */
  panInterceptor?: PanInterceptor
}

export class InputManager {
  private engine: TransformEngine
  private zoomStep: number
  private selfHandle: boolean
  private zoomMode: ZoomMode
  private viewportSize: { width: number; height: number }
  private contentSize: { width: number; height: number }

  private container: HTMLElement | null = null
  private mouseAdapter: MouseAdapter | null = null

  private isSpacePressed = false
  private isDragging = false
  private dragStart = { x: 0, y: 0 }
  private lastMouse = { x: 0, y: 0 }
  private isHovered = false

  private boundKeyUp: (e: KeyboardEvent) => void
  private keyboardAdapter: KeyboardAdapter | null = null
  private pendingWheelDelta = 0
  private wheelRafId: number | null = null
  private onCursorChange: ((cursorClass: string) => void) | null = null
  private zoomInterceptor: ZoomInterceptor | null = null
  private panInterceptor: PanInterceptor | null = null

  constructor(engine: TransformEngine, options: InputManagerOptions = {}) {
    this.engine = engine
    this.zoomStep = options.zoomStep ?? 0.25
    this.selfHandle = options.selfHandle ?? false
    this.zoomMode = options.zoomMode ?? 'pointer'
    this.viewportSize = options.viewportSize ?? { width: 0, height: 0 }
    this.contentSize = options.contentSize ?? { width: 0, height: 0 }
    this.onCursorChange = options.onCursorChange ?? null
    this.zoomInterceptor = options.zoomInterceptor ?? null
    this.panInterceptor = options.panInterceptor ?? null

    this.boundKeyUp = this.handleKeyUp.bind(this)
  }

  /** 绑定到容器元素 */
  bind(container: HTMLElement): void {
    if (this.selfHandle) return
    this.unbind()
    this.container = container

    const parent = container.parentElement
    if (!parent) return

    // 空格释放仍直接监听（用于拖拽状态清理）
    document.addEventListener('keyup', this.boundKeyUp)

    // 鼠标事件通过 MouseAdapter 封装
    const mouseCallbacks: MouseAdapterCallbacks = {
      onWheel: this.handleWheel.bind(this),
      onMouseDown: this.handleMouseDown.bind(this),
      onMouseMove: this.handleMouseMove.bind(this),
      onMouseUp: this.handleMouseUp.bind(this),
      onMouseEnter: () => {
        this.isHovered = true
      },
      onMouseLeave: () => {
        this.isHovered = false
      }
    }

    this.mouseAdapter = new MouseAdapter(parent, mouseCallbacks)
    this.mouseAdapter.bind()

    // 键盘快捷键通过 KeyboardAdapter 封装
    this.keyboardAdapter = new KeyboardAdapter({
      onShortcut: this.handleShortcut.bind(this)
    })
    this.keyboardAdapter.bind()
  }

  /** 解绑所有事件 */
  unbind(): void {
    this.mouseAdapter?.unbind()
    this.mouseAdapter = null

    this.keyboardAdapter?.unbind()
    this.keyboardAdapter = null

    document.removeEventListener('keyup', this.boundKeyUp)

    this.container = null
  }

  /** 销毁 */
  destroy(): void {
    if (this.wheelRafId !== null) {
      cancelAnimationFrame(this.wheelRafId)
      this.wheelRafId = null
    }
    this.unbind()
  }

  setZoomMode(mode: ZoomMode): void {
    this.zoomMode = mode
  }

  private handleWheel(e: WheelEvent): void {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const parent = this.container?.parentElement
      const rect = parent ? parent.getBoundingClientRect() : new DOMRect(0, 0, 0, 0)

      const s = this.engine.getState()
      const origin = getZoomOrigin({
        mode: this.zoomMode,
        viewportSize: this.viewportSize,
        contentSize: this.contentSize,
        offset: { x: s.x, y: s.y },
        scale: s.scale,
        pointerPosition: { x: e.clientX - rect.left, y: e.clientY - rect.top }
      })
      const originX = origin.x
      const originY = origin.y

      // 滚轮缩放采用 rAF 累积器模式：一帧内所有滚轮事件只处理一次
      // 这样既不会丢弃事件，又能避免高频事件导致缩放过快，同时保证丝滑
      const rawDelta = e.deltaY !== 0 ? e.deltaY : e.deltaX
      this.pendingWheelDelta += rawDelta < 0 ? 1 : -1

      if (this.wheelRafId === null) {
        this.wheelRafId = requestAnimationFrame(() => {
          this.wheelRafId = null
          if (this.pendingWheelDelta === 0) return

          const currentScale = this.engine.getState().scale
          const toScale = currentScale * Math.exp((this.pendingWheelDelta * this.zoomStep) / 3)
          this.pendingWheelDelta = 0

          this.executeZoom(
            () => this.engine.zoomTo(toScale, originX, originY),
            currentScale,
            toScale,
            originX,
            originY
          )
        })
      }
    }
  }

  private handleShortcut(combo: KeyCombo, e: KeyboardEvent): void {
    if (!this.isHovered) return

    const centerX = this.viewportSize.width / 2
    const centerY = this.viewportSize.height / 2

    const execute = (fn: () => void | Promise<void>): void => {
      void fn()
    }

    switch (combo) {
      case 'ctrl+0': {
        e.preventDefault()
        execute(() =>
          this.executeZoom(
            () => this.engine.zoomTo(1, centerX, centerY),
            this.engine.getState().scale,
            1,
            centerX,
            centerY
          )
        )
        break
      }
      case 'ctrl+minus': {
        e.preventDefault()
        const from = this.engine.getState().scale
        const to = from - this.zoomStep
        execute(() =>
          this.executeZoom(
            () => this.engine.zoomBy(-this.zoomStep, centerX, centerY),
            from,
            to,
            centerX,
            centerY
          )
        )
        break
      }
      case 'ctrl+equal':
      case 'ctrl+plus': {
        e.preventDefault()
        const from = this.engine.getState().scale
        const to = from + this.zoomStep
        execute(() =>
          this.executeZoom(
            () => this.engine.zoomBy(this.zoomStep, centerX, centerY),
            from,
            to,
            centerX,
            centerY
          )
        )
        break
      }
      case 'ctrl+1': {
        e.preventDefault()
        // Fit to viewport：缩放至内容适配视口，留 5% 边距
        // 简化实现：重置到初始居中状态
        const vw = this.viewportSize.width
        const vh = this.viewportSize.height
        const cw = this.contentSize.width
        const ch = this.contentSize.height
        if (vw > 0 && vh > 0 && cw > 0 && ch > 0) {
          const scaleX = (vw * 0.9) / cw
          const scaleY = (vh * 0.9) / ch
          const newScale = Math.min(scaleX, scaleY)
          const newX = (vw - cw * newScale) / 2
          const newY = (vh - ch * newScale) / 2
          const from = this.engine.getState().scale
          execute(() =>
            this.executeZoom(
              () => this.engine.setTransform({ scale: newScale, x: newX, y: newY }),
              from,
              newScale,
              centerX,
              centerY
            )
          )
        }
        break
      }
      case 'space': {
        if (!this.isSpacePressed) {
          this.isSpacePressed = true
          e.preventDefault()
          this.notifyCursorChange()
        }
        break
      }
      default:
        break
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.key === ' ') {
      this.isSpacePressed = false
      this.isDragging = false
      this.notifyCursorChange()
    }
  }

  private handleMouseDown(e: MouseEvent): void {
    if (this.isSpacePressed && e.button === 0) {
      this.isDragging = true
      this.dragStart = { x: e.clientX, y: e.clientY }
      this.lastMouse = { x: e.clientX, y: e.clientY }
      e.preventDefault()
      this.notifyCursorChange()
    }
  }

  private async handleMouseMove(e: MouseEvent): Promise<void> {
    if (this.isDragging && this.isSpacePressed) {
      const dx = e.clientX - this.lastMouse.x
      const dy = e.clientY - this.lastMouse.y

      const allowed = this.panInterceptor?.beforePan
        ? await this.panInterceptor.beforePan(dx, dy)
        : true

      if (allowed) {
        this.engine.panBy(dx, dy)
        this.panInterceptor?.afterPan?.(dx, dy)
      }

      this.lastMouse = { x: e.clientX, y: e.clientY }
    }
  }

  private handleMouseUp(): void {
    this.isDragging = false
    this.notifyCursorChange()
  }

  private async executeZoom(
    action: () => void,
    from: number,
    to: number,
    originX: number,
    originY: number
  ): Promise<void> {
    const allowed = this.zoomInterceptor?.beforeZoom
      ? await this.zoomInterceptor.beforeZoom(from, to, originX, originY)
      : true

    if (allowed) {
      action()
      this.zoomInterceptor?.afterZoom?.(from, this.engine.getState().scale, originX, originY)
    }
  }

  getCursorClass(): string {
    if (this.isSpacePressed) {
      return this.isDragging ? 'grabbing' : 'grab'
    }
    return 'default'
  }

  private notifyCursorChange(): void {
    this.onCursorChange?.(this.getCursorClass())
  }
}
