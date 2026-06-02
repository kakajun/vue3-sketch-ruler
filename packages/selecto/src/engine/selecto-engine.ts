/**
 * SelectoEngine - 框架无关的框选引擎
 * 适配 sketch-ruler 的 CSS transform 场景：
 * - 所有坐标使用屏幕坐标系（clientX/Y + getBoundingClientRect）
 * - 选择框以 fixed 定位绘制在 body 上，不受父级 transform 影响
 */

export interface SelectoEngineOptions {
  /** 监听鼠标事件的容器（选择范围） */
  dragContainer?: string | HTMLElement
  /** 可被选择的元素 CSS 选择器列表 */
  selectableTargets?: string[]
  /** 是否允许点击选择，默认 true */
  selectByClick?: boolean
  /** 是否允许从元素内部开始拖拽时选中该元素，默认 false */
  selectFromInside?: boolean
  /** 切换多选的按键，如 ['shift', 'ctrl'] */
  toggleContinueSelect?: string[]
  /** 命中阈值 0-1，0 表示相交即选中 */
  hitRate?: number
  /** 键盘监听容器，默认 window */
  keyContainer?: Window | HTMLElement
}

export interface SelectoEvent {
  inputEvent: MouseEvent | TouchEvent
}

export interface SelectoDragStartEvent extends SelectoEvent {
  /** 鼠标按下时的目标元素 */
  inputTarget: Element
  /** 阻止本次选择，转交其他组件（如 moveable）处理 */
  stop: () => void
}

export interface SelectoSelectStartEvent extends SelectoEvent {
  inputTarget: Element
}

export interface SelectoSelectEvent extends SelectoEvent {
  selected: Element[]
  added: Element[]
  removed: Element[]
}

export interface SelectoSelectEndEvent extends SelectoEvent {
  selected: Element[]
  added: Element[]
  removed: Element[]
  /** 是否是快速点击（而非拖拽） */
  isDragStart: boolean
  /** 是否也是拖拽结束（兼容原 selecto 命名） */
  isDragStartEnd: boolean
  /** 点击次数 */
  clickCount: number
}

type EventName = 'dragStart' | 'selectStart' | 'select' | 'selectEnd'
type HandlerMap = {
  dragStart: (e: SelectoDragStartEvent) => void
  selectStart: (e: SelectoSelectStartEvent) => void
  select: (e: SelectoSelectEvent) => void
  selectEnd: (e: SelectoSelectEndEvent) => void
}

const CLICK_THRESHOLD = 5 // px，小于此距离视为点击
const CLICK_TIME_THRESHOLD = 300 // ms

export class SelectoEngine {
  private options: Required<SelectoEngineOptions>
  private container: HTMLElement | null = null
  private handlers: Partial<Record<EventName, Set<any>>> = {}
  private selectedTargets: Set<Element> = new Set()
  private startSelectedTargets: Set<Element> = new Set()

  private overlay: HTMLElement | null = null
  private isDragging = false
  private isStopped = false
  private startX = 0
  private startY = 0
  private lastX = 0
  private lastY = 0
  private startTime = 0
  private clickCount = 0
  private startTarget: Element | null = null
  private startInputEvent: MouseEvent | null = null
  private keyState: Set<string> = new Set()
  private destroyed = false

  private boundMouseDown: (e: MouseEvent) => void
  private boundMouseMove: (e: MouseEvent) => void
  private boundMouseUp: (e: MouseEvent) => void
  private boundKeyDown: (e: KeyboardEvent) => void
  private boundKeyUp: (e: KeyboardEvent) => void

  constructor(options: SelectoEngineOptions = {}) {
    this.options = {
      dragContainer: options.dragContainer ?? document.body,
      selectableTargets: options.selectableTargets ?? [],
      selectByClick: options.selectByClick ?? true,
      selectFromInside: options.selectFromInside ?? false,
      toggleContinueSelect: options.toggleContinueSelect ?? [],
      hitRate: options.hitRate ?? 0,
      keyContainer: options.keyContainer ?? window
    }

    this.boundMouseDown = this.onMouseDown.bind(this)
    this.boundMouseMove = this.onMouseMove.bind(this)
    this.boundMouseUp = this.onMouseUp.bind(this)
    this.boundKeyDown = this.onKeyDown.bind(this)
    this.boundKeyUp = this.onKeyUp.bind(this)

    this.init()
  }

  private init(): void {
    const dc = this.options.dragContainer
    this.container = typeof dc === 'string' ? document.querySelector(dc) : dc
    if (!this.container && typeof dc === 'string') {
      setTimeout(() => {
        if (this.destroyed) return
        this.container = document.querySelector(dc)
      }, 0)
    }

    // 使用 document 捕获阶段监听，避免被参考线等 pointer-events:auto 元素阻止冒泡
    document.addEventListener('mousedown', this.boundMouseDown, true)

    const keyContainer = this.options.keyContainer
    keyContainer.addEventListener('keydown', this.boundKeyDown as EventListener)
    keyContainer.addEventListener('keyup', this.boundKeyUp as EventListener)
  }

  on<K extends EventName>(event: K, handler: HandlerMap[K]): () => void {
    if (!this.handlers[event]) {
      this.handlers[event] = new Set<any>()
    }
    this.handlers[event]!.add(handler)
    return () => {
      this.handlers[event]!.delete(handler)
    }
  }

  private emit<K extends EventName>(event: K, payload: Parameters<HandlerMap[K]>[0]): void {
    const set = this.handlers[event]
    if (set) {
      set.forEach((h) => (h as any)(payload))
    }
  }

  private isToggleKeyActive(): boolean {
    const keys = this.options.toggleContinueSelect.map((k) => k.toLowerCase())
    return keys.some((k) => this.keyState.has(k))
  }

  private getSelectableElements(): Element[] {
    const selectors = this.options.selectableTargets
    if (selectors.length === 0) return []
    const container = this.container ?? document.body
    const result: Element[] = []
    selectors.forEach((sel) => {
      result.push(...Array.from(container.querySelectorAll(sel)))
    })
    // 去重并保持顺序
    return Array.from(new Set(result))
  }

  private createOverlay(): HTMLElement {
    const div = document.createElement('div')
    div.classList.add('selecto-overlay')
    div.style.position = 'fixed'
    div.style.pointerEvents = 'none'
    div.style.zIndex = '999999'
    div.style.border = '1px solid rgba(66, 153, 225, 0.8)'
    div.style.background = 'rgba(66, 153, 225, 0.15)'
    div.style.boxSizing = 'border-box'
    div.style.left = '0px'
    div.style.top = '0px'
    div.style.width = '0px'
    div.style.height = '0px'
    document.body.appendChild(div)
    return div
  }

  private removeOverlay(): void {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay)
      this.overlay = null
    }
  }

  private updateOverlay(x: number, y: number, w: number, h: number): void {
    if (!this.overlay) return
    this.overlay.style.left = `${x}px`
    this.overlay.style.top = `${y}px`
    this.overlay.style.width = `${w}px`
    this.overlay.style.height = `${h}px`
  }

  private getRectFromPoints(x1: number, y1: number, x2: number, y2: number) {
    const left = Math.min(x1, x2)
    const top = Math.min(y1, y2)
    const right = Math.max(x1, x2)
    const bottom = Math.max(y1, y2)
    return { left, top, right, bottom, width: right - left, height: bottom - top }
  }

  private intersectArea(a: DOMRect, b: DOMRect): number {
    const left = Math.max(a.left, b.left)
    const top = Math.max(a.top, b.top)
    const right = Math.min(a.right, b.right)
    const bottom = Math.min(a.bottom, b.bottom)
    if (right <= left || bottom <= top) return 0
    return (right - left) * (bottom - top)
  }

  private hitTest(selectRect: DOMRectReadOnly, target: Element): boolean {
    const targetRect = target.getBoundingClientRect()
    const inter = this.intersectArea(selectRect as DOMRect, targetRect as DOMRect)
    if (inter <= 0) return false
    if (this.options.hitRate <= 0) return true
    const targetArea = targetRect.width * targetRect.height
    if (targetArea <= 0) return false
    return inter / targetArea >= this.options.hitRate
  }

  private computeSelection(excludeFromInsideTarget?: Element | null): Element[] {
    if (!this.overlay) return []
    const selectRect = this.overlay.getBoundingClientRect()
    const targets = this.getSelectableElements()
    return targets.filter((t) => {
      if (!this.options.selectFromInside && t === excludeFromInsideTarget) {
        return false
      }
      return this.hitTest(selectRect, t)
    })
  }

  private onMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return // 仅左键

    // 如果容器已就绪但鼠标不在容器范围内，跳过
    if (this.container) {
      const rect = this.container.getBoundingClientRect()
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return
      }
    }

    const target = e.target as Element
    this.startX = e.clientX
    this.startY = e.clientY
    this.lastX = e.clientX
    this.lastY = e.clientY
    this.startTime = Date.now()
    this.isDragging = false
    this.isStopped = false
    this.clickCount = e.detail
    this.startTarget = target
    this.startInputEvent = e

    // 记录开始选择前的选中状态（用于 toggle 多选）
    const toggle = this.isToggleKeyActive()
    if (toggle) {
      this.startSelectedTargets = new Set(this.selectedTargets)
    } else {
      this.startSelectedTargets = new Set()
    }

    // 提前触发 dragStart 事件，让 moveable 有机会 stop
    const dragStartEvent: SelectoDragStartEvent = {
      inputEvent: e,
      inputTarget: target,
      stop: () => {
        this.isStopped = true
      }
    }
    this.emit('dragStart', dragStartEvent)

    if (this.isStopped) return

    document.addEventListener('mousemove', this.boundMouseMove)
    document.addEventListener('mouseup', this.boundMouseUp)
  }

  private onMouseMove(e: MouseEvent): void {
    if (this.isStopped) return

    const dx = e.clientX - this.startX
    const dy = e.clientY - this.startY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (!this.isDragging && dist > CLICK_THRESHOLD) {
      this.isDragging = true
      if (!this.overlay) {
        this.overlay = this.createOverlay()
      }
      const inputTarget = e.target as Element
      this.emit('selectStart', {
        inputEvent: e,
        inputTarget
      })
    }

    if (this.isDragging) {
      this.lastX = e.clientX
      this.lastY = e.clientY
      const rect = this.getRectFromPoints(this.startX, this.startY, this.lastX, this.lastY)
      this.updateOverlay(rect.left, rect.top, rect.width, rect.height)

      const selected = this.computeSelection(this.startTarget)
      const added = selected.filter((s) => !this.selectedTargets.has(s))
      const removed = Array.from(this.selectedTargets).filter((s) => !selected.includes(s))

      this.emit('select', {
        inputEvent: e,
        selected,
        added,
        removed
      })

      this.selectedTargets = new Set(selected)
    }
  }

  private onMouseUp(e: MouseEvent): void {
    document.removeEventListener('mousemove', this.boundMouseMove)
    document.removeEventListener('mouseup', this.boundMouseUp)

    if (this.isStopped) {
      this.cleanup()
      return
    }

    const dx = e.clientX - this.startX
    const dy = e.clientY - this.startY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const elapsed = Date.now() - this.startTime
    const isClick = !this.isDragging && dist <= CLICK_THRESHOLD && elapsed <= CLICK_TIME_THRESHOLD

    if (isClick && this.options.selectByClick) {
      this.handleClickSelect(e)
    } else if (this.isDragging) {
      this.handleDragEnd(e)
    } else {
      // 非点击也非拖拽（可能是被 stop 或者超时），清理状态
      this.emit('selectEnd', {
        inputEvent: e,
        selected: Array.from(this.selectedTargets),
        added: [],
        removed: [],
        isDragStart: false,
        isDragStartEnd: false,
        clickCount: this.clickCount
      })
    }

    this.cleanup()
  }

  private handleClickSelect(e: MouseEvent): void {
    const pointRect = new DOMRect(e.clientX - 1, e.clientY - 1, 2, 2)
    const targets = this.getSelectableElements()
    const clicked = targets.find((t) => this.hitTest(pointRect, t))

    const toggle = this.isToggleKeyActive()
    let nextSelected: Set<Element>

    if (clicked) {
      if (toggle) {
        nextSelected = new Set(this.selectedTargets)
        if (nextSelected.has(clicked)) {
          nextSelected.delete(clicked)
        } else {
          nextSelected.add(clicked)
        }
      } else {
        nextSelected = new Set([clicked])
      }
    } else {
      if (!toggle) {
        nextSelected = new Set()
      } else {
        nextSelected = new Set(this.selectedTargets)
      }
    }

    const added = Array.from(nextSelected).filter((s) => !this.selectedTargets.has(s))
    const removed = Array.from(this.selectedTargets).filter((s) => !nextSelected.has(s))
    this.selectedTargets = nextSelected

    this.emit('selectEnd', {
      inputEvent: this.startInputEvent ?? e,
      selected: Array.from(this.selectedTargets),
      added,
      removed,
      isDragStart: true,
      isDragStartEnd: true,
      clickCount: this.clickCount
    })
    this.startInputEvent = null
  }

  private handleDragEnd(e: MouseEvent): void {
    const selected = this.computeSelection(this.startTarget)

    const toggle = this.isToggleKeyActive()
    let finalSelected: Set<Element>
    if (toggle) {
      // toggle 模式：与开始状态做差集/并集
      finalSelected = new Set(this.startSelectedTargets)
      selected.forEach((s) => {
        if (finalSelected.has(s)) {
          finalSelected.delete(s)
        } else {
          finalSelected.add(s)
        }
      })
    } else {
      finalSelected = new Set(selected)
    }

    const added = Array.from(finalSelected).filter((s) => !this.selectedTargets.has(s))
    const removed = Array.from(this.selectedTargets).filter((s) => !finalSelected.has(s))
    this.selectedTargets = finalSelected

    this.emit('selectEnd', {
      inputEvent: e,
      selected: Array.from(this.selectedTargets),
      added,
      removed,
      isDragStart: false,
      isDragStartEnd: false,
      clickCount: this.clickCount
    })
  }

  private cleanup(): void {
    this.removeOverlay()
    this.isDragging = false
    this.isStopped = false
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.keyState.add(e.key.toLowerCase())
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keyState.delete(e.key.toLowerCase())
  }

  /** 获取当前选中的元素 */
  getSelectedTargets(): Element[] {
    return Array.from(this.selectedTargets)
  }

  /** 设置选中的元素 */
  setSelectedTargets(targets: Element[]): void {
    this.selectedTargets = new Set(targets)
  }

  /** 程序化点击选中某个目标 */
  clickTarget(inputEvent: MouseEvent, target: Element): void {
    const toggle = this.isToggleKeyActive()
    let nextSelected: Set<Element>

    if (toggle) {
      nextSelected = new Set(this.selectedTargets)
      if (nextSelected.has(target)) {
        nextSelected.delete(target)
      } else {
        nextSelected.add(target)
      }
    } else {
      nextSelected = new Set([target])
    }

    const added = Array.from(nextSelected).filter((s) => !this.selectedTargets.has(s))
    const removed = Array.from(this.selectedTargets).filter((s) => !nextSelected.has(s))
    this.selectedTargets = nextSelected

    this.emit('selectEnd', {
      inputEvent,
      selected: Array.from(this.selectedTargets),
      added,
      removed,
      isDragStart: true,
      isDragStartEnd: true,
      clickCount: 1
    })
  }

  /** 销毁引擎 */
  destroy(): void {
    this.destroyed = true
    document.removeEventListener('mousedown', this.boundMouseDown, true)
    const keyContainer = this.options.keyContainer
    keyContainer.removeEventListener('keydown', this.boundKeyDown as EventListener)
    keyContainer.removeEventListener('keyup', this.boundKeyUp as EventListener)
    document.removeEventListener('mousemove', this.boundMouseMove)
    document.removeEventListener('mouseup', this.boundMouseUp)
    this.removeOverlay()
    this.handlers = {}
    this.selectedTargets.clear()
  }
}
