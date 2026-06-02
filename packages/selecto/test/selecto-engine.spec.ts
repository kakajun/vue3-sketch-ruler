import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SelectoEngine } from '../src/engine/selecto-engine'

describe('SelectoEngine', () => {
  let engine: SelectoEngine
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    // 创建 5 个 target 和 1 个 other，布局如下（网格）：
    // a(0,0)   b(50,0)   c(100,0)
    // d(0,50)  e(50,50)  other(100,50)
    container.innerHTML = `
      <div class="target" id="a" style="width:40px;height:40px;"></div>
      <div class="target" id="b" style="width:40px;height:40px;"></div>
      <div class="target" id="c" style="width:40px;height:40px;"></div>
      <div class="target" id="d" style="width:40px;height:40px;"></div>
      <div class="target" id="e" style="width:40px;height:40px;"></div>
      <div class="other" id="f" style="width:40px;height:40px;"></div>
    `
    document.body.appendChild(container)
    // jsdom 不计算布局，mock container 的 rect 让位置检查通过
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 300, 300))
  })

  afterEach(() => {
    engine?.destroy()
    container.remove()
  })

  it('should initialize with default options', () => {
    engine = new SelectoEngine()
    expect(engine).toBeDefined()
    expect(engine.getSelectedTargets()).toEqual([])
  })

  it('should getSelectableElements respect selectableTargets', () => {
    engine = new SelectoEngine({
      dragContainer: container,
      selectableTargets: ['.target']
    })
    const targets = (engine as any).getSelectableElements()
    expect(targets.length).toBe(5)
  })

  it('should select target on click', () => {
    engine = new SelectoEngine({
      dragContainer: container,
      selectableTargets: ['.target'],
      selectByClick: true
    })

    const a = container.querySelector('#a')!
    vi.spyOn(a, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 40, 40))

    const selectEnd = vi.fn()
    engine.on('selectEnd', selectEnd)

    engine.clickTarget(new MouseEvent('click'), a)

    expect(selectEnd).toHaveBeenCalledTimes(1)
    expect(engine.getSelectedTargets()).toContain(a)
  })

  it('should toggle selection when click again with toggle key', () => {
    engine = new SelectoEngine({
      dragContainer: container,
      selectableTargets: ['.target'],
      toggleContinueSelect: ['ctrl']
    })

    const a = container.querySelector('#a')!
    vi.spyOn(a, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 40, 40))

    const keydown = new KeyboardEvent('keydown', { key: 'ctrl' })
    window.dispatchEvent(keydown)

    engine.clickTarget(new MouseEvent('click'), a)
    expect(engine.getSelectedTargets()).toContain(a)

    engine.clickTarget(new MouseEvent('click'), a)
    expect(engine.getSelectedTargets()).not.toContain(a)

    const keyup = new KeyboardEvent('keyup', { key: 'ctrl' })
    window.dispatchEvent(keyup)
  })

  it('should setSelectedTargets and getSelectedTargets', () => {
    engine = new SelectoEngine()
    const el = document.createElement('div')
    engine.setSelectedTargets([el])
    expect(engine.getSelectedTargets()).toEqual([el])
  })

  describe('drag selection scenarios', () => {
    const layout: Record<string, DOMRect> = {
      a: new DOMRect(0, 0, 40, 40),
      b: new DOMRect(50, 0, 40, 40),
      c: new DOMRect(100, 0, 40, 40),
      d: new DOMRect(0, 50, 40, 40),
      e: new DOMRect(50, 50, 40, 40),
      f: new DOMRect(100, 50, 40, 40)
    }

    function mockLayout() {
      ;['a', 'b', 'c', 'd', 'e', 'f'].forEach((id) => {
        const el = container.querySelector(`#${id}`)
        if (el) vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(layout[id])
      })
    }

    function dispatchMouseDown(x: number, y: number, target: HTMLElement = container) {
      target.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y, button: 0 })
      )
    }

    function dispatchMouseMove(x: number, y: number) {
      document.dispatchEvent(
        new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y, button: 0 })
      )
    }

    function dispatchMouseUp(x: number, y: number) {
      document.dispatchEvent(
        new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y, button: 0 })
      )
    }

    function mockOverlayRect(x: number, y: number, w: number, h: number) {
      const overlay = document.querySelector('.selecto-overlay') as HTMLElement | null
      if (overlay) {
        vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue(new DOMRect(x, y, w, h))
      }
    }

    /** 触发一次完整的拖拽框选 */
    function dragSelect(x1: number, y1: number, x2: number, y2: number, target?: HTMLElement) {
      dispatchMouseDown(x1, y1, target)
      dispatchMouseMove(x1 + 5, y1 + 5) // 触发创建 overlay
      mockOverlayRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1))
      dispatchMouseMove(x2, y2)
      dispatchMouseUp(x2, y2)
    }

    beforeEach(() => {
      mockLayout()
    })

    it('should select single element', () => {
      engine = new SelectoEngine({
        dragContainer: container,
        selectableTargets: ['.target'],
        selectByClick: false
      })
      const selectEnd = vi.fn()
      engine.on('selectEnd', selectEnd)

      // 框选只覆盖 a
      dragSelect(0, 0, 40, 40)

      expect(selectEnd).toHaveBeenCalledTimes(1)
      expect(engine.getSelectedTargets().length).toBe(1)
      expect(engine.getSelectedTargets()[0].id).toBe('a')
    })

    it('should select multiple elements', () => {
      engine = new SelectoEngine({
        dragContainer: container,
        selectableTargets: ['.target'],
        selectByClick: false
      })
      const selectEnd = vi.fn()
      engine.on('selectEnd', selectEnd)

      // 框选覆盖 a + b（第一行前两个）
      dragSelect(0, 0, 90, 40)

      expect(selectEnd).toHaveBeenCalledTimes(1)
      const selected = engine.getSelectedTargets()
      expect(selected.length).toBe(2)
      expect(selected.map((el) => el.id).sort()).toEqual(['a', 'b'])
    })

    it('should select many elements in large drag', () => {
      engine = new SelectoEngine({
        dragContainer: container,
        selectableTargets: ['.target'],
        selectByClick: false
      })
      const selectEnd = vi.fn()
      engine.on('selectEnd', selectEnd)

      // 框选覆盖 a + b + d + e（左上 2x2）
      dragSelect(0, 0, 90, 90)

      expect(selectEnd).toHaveBeenCalledTimes(1)
      const selected = engine.getSelectedTargets()
      expect(selected.length).toBe(4)
      expect(selected.map((el) => el.id).sort()).toEqual(['a', 'b', 'd', 'e'])
    })

    it('should empty select when drag misses all targets', () => {
      engine = new SelectoEngine({
        dragContainer: container,
        selectableTargets: ['.target'],
        selectByClick: false
      })
      const selectEnd = vi.fn()
      engine.on('selectEnd', selectEnd)

      // 框选在空白区域（右下空白）
      dragSelect(200, 200, 250, 250)

      expect(selectEnd).toHaveBeenCalledTimes(1)
      expect(engine.getSelectedTargets()).toEqual([])
    })

    it('should correctly select different counts in consecutive drags', () => {
      engine = new SelectoEngine({
        dragContainer: container,
        selectableTargets: ['.target'],
        selectByClick: false
      })
      const selectEnd = vi.fn()
      engine.on('selectEnd', selectEnd)

      // 第 1 次：框选 1 个（a）
      dragSelect(0, 0, 40, 40)
      expect(engine.getSelectedTargets().length).toBe(1)
      expect(engine.getSelectedTargets()[0].id).toBe('a')

      // 第 2 次：框选 2 个（b + c）
      dragSelect(50, 0, 140, 40)
      expect(engine.getSelectedTargets().length).toBe(2)
      expect(engine.getSelectedTargets().map((el) => el.id).sort()).toEqual(['b', 'c'])

      // 第 3 次：框选 2 个（d + e）
      dragSelect(0, 50, 90, 90)
      expect(engine.getSelectedTargets().length).toBe(2)
      expect(engine.getSelectedTargets().map((el) => el.id).sort()).toEqual(['d', 'e'])

      // 第 4 次：框选 0 个（空白）
      dragSelect(200, 200, 250, 250)
      expect(engine.getSelectedTargets()).toEqual([])

      // 第 5 次：框选全部 5 个 target
      dragSelect(0, 0, 140, 90)
      expect(engine.getSelectedTargets().length).toBe(5)

      expect(selectEnd).toHaveBeenCalledTimes(5)
    })

    it('should toggle add/remove multiple elements in consecutive drags with shift', () => {
      engine = new SelectoEngine({
        dragContainer: container,
        selectableTargets: ['.target'],
        selectByClick: false,
        toggleContinueSelect: ['shift']
      })
      const selectEnd = vi.fn()
      engine.on('selectEnd', selectEnd)

      // 按住 shift 开始
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'shift' }))

      // 第 1 次：框选 a + b
      dragSelect(0, 0, 90, 40)
      expect(engine.getSelectedTargets().map((el) => el.id).sort()).toEqual(['a', 'b'])

      // 第 2 次：框选 b + c → a 保留，b 反选（去掉），c 新增
      dragSelect(50, 0, 140, 40)
      const selected2 = engine.getSelectedTargets().map((el) => el.id).sort()
      expect(selected2).toEqual(['a', 'c'])

      // 第 3 次：框选 d + e → a、c 保留，d、e 新增
      dragSelect(0, 50, 90, 90)
      const selected3 = engine.getSelectedTargets().map((el) => el.id).sort()
      expect(selected3).toEqual(['a', 'c', 'd', 'e'])

      // 第 4 次：框选 a → a 反选（去掉），c、d、e 保留
      dragSelect(0, 0, 40, 40)
      const selected4 = engine.getSelectedTargets().map((el) => el.id).sort()
      expect(selected4).toEqual(['c', 'd', 'e'])

      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'shift' }))
      expect(selectEnd).toHaveBeenCalledTimes(4)
    })

    it('should respect selectFromInside on drag', () => {
      engine = new SelectoEngine({
        dragContainer: container,
        selectableTargets: ['.target'],
        selectByClick: false,
        selectFromInside: false
      })
      const selectEnd = vi.fn()
      engine.on('selectEnd', selectEnd)

      const a = container.querySelector('#a')!
      const b = container.querySelector('#b')!

      // 从 a 内部开始拖拽，框选覆盖 a + b
      // 因为 selectFromInside=false，a 应该被排除
      dragSelect(20, 20, 95, 45, a as HTMLElement)

      expect(selectEnd).toHaveBeenCalledTimes(1)
      const selected = engine.getSelectedTargets()
      expect(selected.map((el) => el.id).sort()).toEqual(['b'])
      expect(selected).not.toContain(a)
    })

    it('should respect hitRate partial overlap', () => {
      engine = new SelectoEngine({
        dragContainer: container,
        selectableTargets: ['.target'],
        selectByClick: false,
        hitRate: 0.5 // 需要重叠面积 >= 50%
      })
      const selectEnd = vi.fn()
      engine.on('selectEnd', selectEnd)

      // a 在 (0,0)-(40,40)。框选 (20,0)-(60,40) 与 a 重叠 20x40=800，a 面积 1600，重叠率 50%
      // 刚好命中
      dragSelect(20, 0, 60, 40)
      expect(engine.getSelectedTargets().map((el) => el.id)).toContain('a')

      // 框选 (30,0)-(60,40) 与 a 重叠 10x40=400，重叠率 25%
      // 不应命中
      dragSelect(30, 0, 60, 40)
      expect(engine.getSelectedTargets().map((el) => el.id)).not.toContain('a')
    })

    it('should correctly interleave drag-select and click-select', () => {
      engine = new SelectoEngine({
        dragContainer: container,
        selectableTargets: ['.target'],
        selectByClick: true
      })
      const selectEnd = vi.fn()
      engine.on('selectEnd', selectEnd)

      // 1. 拖拽框选 a + b
      dragSelect(0, 0, 90, 40)
      expect(engine.getSelectedTargets().map((el) => el.id).sort()).toEqual(['a', 'b'])

      // 2. 点击 c（c 中心 120,20，移动 < 5px）
      dispatchMouseDown(120, 20)
      dispatchMouseMove(121, 21)
      dispatchMouseUp(121, 21)
      expect(engine.getSelectedTargets().map((el) => el.id).sort()).toEqual(['c'])

      // 3. 再次拖拽框选 d + e
      dragSelect(0, 50, 90, 90)
      expect(engine.getSelectedTargets().map((el) => el.id).sort()).toEqual(['d', 'e'])

      // 4. 点击空白区域（清除选中）
      dispatchMouseDown(200, 200)
      dispatchMouseMove(201, 201)
      dispatchMouseUp(201, 201)
      expect(engine.getSelectedTargets()).toEqual([])

      expect(selectEnd).toHaveBeenCalledTimes(4)
    })

    it('should carry mousedown event through selectEnd on click', () => {
      engine = new SelectoEngine({
        dragContainer: container,
        selectableTargets: ['.target'],
        selectByClick: true
      })
      const a = container.querySelector('#a')!
      vi.spyOn(a, 'getBoundingClientRect').mockReturnValue(layout.a)

      const selectEnd = vi.fn()
      engine.on('selectEnd', selectEnd)

      // 点击 a（移动 < 5px，视为 click）
      dispatchMouseDown(20, 20)
      dispatchMouseMove(21, 21)
      dispatchMouseUp(21, 21)

      expect(selectEnd).toHaveBeenCalledTimes(1)
      const payload = selectEnd.mock.calls[0][0]
      // inputEvent 应该是 mousedown，而不是 mouseup
      expect(payload.inputEvent.type).toBe('mousedown')
      expect(payload.isDragStartEnd).toBe(true)
    })
  })
})
