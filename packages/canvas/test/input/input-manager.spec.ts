import { describe, it, expect, vi } from 'vitest'
import { InputManager } from '../../src/input/input-manager'
import { TransformEngine } from '@sketch-ruler/core'
import { MouseAdapter } from '../../src/input/mouse-adapter'
import { getZoomDelta } from '../../src/input/wheel-normalizer'

describe('InputManager', () => {
  // 输入管理器测试
  it('constructs with default options', () => {
    // 以默认选项构造
    const engine = new TransformEngine()
    const im = new InputManager(engine)
    expect(im).toBeDefined()
    expect(im.getCursorClass()).toBe('default')
  })

  it('getCursorClass returns grab when space pressed', () => {
    // 按下空格时 getCursorClass 返回 grab
    const engine = new TransformEngine()
    const im = new InputManager(engine)

    // Simulate space press via internal state is not directly exposed,
    // so we test via keydown event
    const container = document.createElement('div')
    const parent = document.createElement('div')
    parent.appendChild(container)
    document.body.appendChild(parent)

    im.bind(container)

    // mouseenter to set hovered
    parent.dispatchEvent(new MouseEvent('mouseenter'))

    // space keydown
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    expect(im.getCursorClass()).toBe('grab')

    // space keyup
    document.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }))
    expect(im.getCursorClass()).toBe('default')

    im.destroy()
    document.body.removeChild(parent)
  })

  it('bind/unbind/destroy does not throw', () => {
    // bind/unbind/destroy 不抛出异常
    const engine = new TransformEngine()
    const im = new InputManager(engine)
    const container = document.createElement('div')
    const parent = document.createElement('div')
    parent.appendChild(container)

    expect(() => im.bind(container)).not.toThrow()
    expect(() => im.unbind()).not.toThrow()
    expect(() => im.destroy()).not.toThrow()
  })

  it('selfHandle prevents binding', () => {
    // selfHandle 阻止绑定
    const engine = new TransformEngine()
    const im = new InputManager(engine, { selfHandle: true })
    const container = document.createElement('div')

    im.bind(container)
    // Should not have attached listeners; just verify no throw
    expect(im.getCursorClass()).toBe('default')
    im.destroy()
  })
})

describe('MouseAdapter', () => {
  // 鼠标适配器测试
  it('binds and unbinds without throw', () => {
    // 绑定和解绑不抛出异常
    const container = document.createElement('div')
    const adapter = new MouseAdapter(container, {})
    expect(() => adapter.bind()).not.toThrow()
    expect(() => adapter.unbind()).not.toThrow()
  })

  it('invokes callbacks on events', () => {
    // 事件触发回调
    const container = document.createElement('div')
    const onWheel = vi.fn()
    const onMouseDown = vi.fn()

    const adapter = new MouseAdapter(container, { onWheel, onMouseDown })
    adapter.bind()

    container.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }))
    expect(onWheel).toHaveBeenCalledTimes(1)

    container.dispatchEvent(new MouseEvent('mousedown'))
    expect(onMouseDown).toHaveBeenCalledTimes(1)

    adapter.unbind()
  })
})

describe('getZoomDelta', () => {
  // getZoomDelta 测试
  it('scales by sensitivity', () => {
    // 按灵敏度缩放
    const event = new WheelEvent('wheel', { deltaY: 100 })
    const delta = getZoomDelta(event, 0.001)
    expect(delta).toBeCloseTo(-0.1, 5)
  })
})
