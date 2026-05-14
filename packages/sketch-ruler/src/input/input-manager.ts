/**
 * InputManager - 统一输入抽象
 * M1 先实现鼠标滚轮缩放 + 空格拖拽平移
 * M3 再扩展为完整的 Pointer/Keyboard/Touch 适配器体系
 */

import type { TransformEngine } from '../engine/transform-engine'

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

  private boundWheel: (e: WheelEvent) => void
  private boundKeyDown: (e: KeyboardEvent) => void
  private boundKeyUp: (e: KeyboardEvent) => void
  private boundMouseDown: (e: MouseEvent) => void
  private boundMouseMove: (e: MouseEvent) => void
  private boundMouseUp: (e: MouseEvent) => void

  private container: HTMLElement | null = null
  private isSpacePressed = false
  private isDragging = false
  private dragStart = { x: 0, y: 0 }
  private lastMouse = { x: 0, y: 0 }
  private isHovered = false

  constructor(engine: TransformEngine, options: InputManagerOptions = {}) {
    this.engine = engine
    this.zoomStep = options.zoomStep ?? 0.25
    this.selfHandle = options.selfHandle ?? false

    this.boundWheel = this.handleWheel.bind(this)
    this.boundKeyDown = this.handleKeyDown.bind(this)
    this.boundKeyUp = this.handleKeyUp.bind(this)
    this.boundMouseDown = this.handleMouseDown.bind(this)
    this.boundMouseMove = this.handleMouseMove.bind(this)
    this.boundMouseUp = this.handleMouseUp.bind(this)
  }

  /** 绑定到容器元素 */
  bind(container: HTMLElement): void {
    if (this.selfHandle) return
    this.unbind()
    this.container = container

    const parent = container.parentElement
    if (!parent) return

    parent.addEventListener('wheel', this.boundWheel, { passive: false })
    document.addEventListener('keydown', this.boundKeyDown)
    document.addEventListener('keyup', this.boundKeyUp)
    parent.addEventListener('mousedown', this.boundMouseDown)
    document.addEventListener('mousemove', this.boundMouseMove)
    document.addEventListener('mouseup', this.boundMouseUp)

    // 监听鼠标进入/离开容器
    parent.addEventListener('mouseenter', () => { this.isHovered = true })
    parent.addEventListener('mouseleave', () => { this.isHovered = false })
  }

  /** 解绑所有事件 */
  unbind(): void {
    if (!this.container) return
    const parent = this.container.parentElement
    if (parent) {
      parent.removeEventListener('wheel', this.boundWheel)
      parent.removeEventListener('mousedown', this.boundMouseDown)
    }
    document.removeEventListener('keydown', this.boundKeyDown)
    document.removeEventListener('keyup', this.boundKeyUp)
    document.removeEventListener('mousemove', this.boundMouseMove)
    document.removeEventListener('mouseup', this.boundMouseUp)
    this.container = null
  }

  /** 销毁 */
  destroy(): void {
    this.unbind()
  }

  private handleWheel(e: WheelEvent): void {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      // 使用 parent（无 CSS transform）的 rect 计算稳定坐标
      // 避免 container（有 transform）的 getBoundingClientRect() 随缩放漂移
      const parent = this.container?.parentElement
      const rect = parent ? parent.getBoundingClientRect() : new DOMRect(0, 0, 0, 0)
      const originX = e.clientX - rect.left
      const originY = e.clientY - rect.top
      const delta = -e.deltaY * 0.001 * this.zoomStep
      this.engine.zoomBy(delta, originX, originY)
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.isHovered) return
    // 忽略输入框内的空格
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

  private getContainerRect(): DOMRect {
    if (this.container) {
      return this.container.getBoundingClientRect()
    }
    return new DOMRect(0, 0, 0, 0)
  }

  getCursorClass(): string {
    if (this.isSpacePressed) {
      return this.isDragging ? 'grabbing' : 'grab'
    }
    return 'default'
  }
}
