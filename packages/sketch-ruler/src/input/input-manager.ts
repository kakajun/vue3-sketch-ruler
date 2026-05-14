/**
 * InputManager - 统一输入抽象
 * M1 基础版：鼠标滚轮缩放 + 空格拖拽平移
 * 底层事件由 MouseAdapter 封装，滚轮标准化由 WheelNormalizer 处理
 */

import type { TransformEngine } from '../engine/transform-engine'
import { MouseAdapter, type MouseAdapterCallbacks } from './mouse-adapter'
import { getZoomDelta } from './wheel-normalizer'

export interface InputManagerOptions {
  /** 缩放步长 */
  zoomStep?: number
  /** 是否由外部自行处理事件 */
  selfHandle?: boolean
}

export class InputManager {
  private engine: TransformEngine
  private zoomStep: number
  private selfHandle: boolean

  private container: HTMLElement | null = null
  private mouseAdapter: MouseAdapter | null = null

  private isSpacePressed = false
  private isDragging = false
  private dragStart = { x: 0, y: 0 }
  private lastMouse = { x: 0, y: 0 }
  private isHovered = false

  private boundKeyDown: (e: KeyboardEvent) => void
  private boundKeyUp: (e: KeyboardEvent) => void

  constructor(engine: TransformEngine, options: InputManagerOptions = {}) {
    this.engine = engine
    this.zoomStep = options.zoomStep ?? 0.25
    this.selfHandle = options.selfHandle ?? false

    this.boundKeyDown = this.handleKeyDown.bind(this)
    this.boundKeyUp = this.handleKeyUp.bind(this)
  }

  /** 绑定到容器元素 */
  bind(container: HTMLElement): void {
    if (this.selfHandle) return
    this.unbind()
    this.container = container

    const parent = container.parentElement
    if (!parent) return

    // 键盘事件仍直接监听 document
    document.addEventListener('keydown', this.boundKeyDown)
    document.addEventListener('keyup', this.boundKeyUp)

    // 鼠标事件通过 MouseAdapter 封装
    const callbacks: MouseAdapterCallbacks = {
      onWheel: this.handleWheel.bind(this),
      onMouseDown: this.handleMouseDown.bind(this),
      onMouseMove: this.handleMouseMove.bind(this),
      onMouseUp: this.handleMouseUp.bind(this),
      onMouseEnter: () => { this.isHovered = true },
      onMouseLeave: () => { this.isHovered = false }
    }

    this.mouseAdapter = new MouseAdapter(parent, callbacks)
    this.mouseAdapter.bind()
  }

  /** 解绑所有事件 */
  unbind(): void {
    this.mouseAdapter?.unbind()
    this.mouseAdapter = null

    document.removeEventListener('keydown', this.boundKeyDown)
    document.removeEventListener('keyup', this.boundKeyUp)

    this.container = null
  }

  /** 销毁 */
  destroy(): void {
    this.unbind()
  }

  private handleWheel(e: WheelEvent): void {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const parent = this.container?.parentElement
      const rect = parent ? parent.getBoundingClientRect() : new DOMRect(0, 0, 0, 0)
      const originX = e.clientX - rect.left
      const originY = e.clientY - rect.top
      const delta = getZoomDelta(e, this.zoomStep)
      this.engine.zoomBy(delta, originX, originY)
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.isHovered) return

    const activeElement = document.activeElement
    if (
      activeElement?.closest('.monaco-editor') ||
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA' ||
      activeElement?.getAttribute('contenteditable') === 'true'
    ) {
      return
    }

    if (e.key === ' ' && !this.isSpacePressed) {
      this.isSpacePressed = true
      e.preventDefault()
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.key === ' ') {
      this.isSpacePressed = false
      this.isDragging = false
    }
  }

  private handleMouseDown(e: MouseEvent): void {
    if (this.isSpacePressed && e.button === 0) {
      this.isDragging = true
      this.dragStart = { x: e.clientX, y: e.clientY }
      this.lastMouse = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.isDragging && this.isSpacePressed) {
      const dx = e.clientX - this.lastMouse.x
      const dy = e.clientY - this.lastMouse.y
      this.engine.panBy(dx, dy)
      this.lastMouse = { x: e.clientX, y: e.clientY }
    }
  }

  private handleMouseUp(): void {
    this.isDragging = false
  }

  getCursorClass(): string {
    if (this.isSpacePressed) {
      return this.isDragging ? 'grabbing' : 'grab'
    }
    return 'default'
  }
}
