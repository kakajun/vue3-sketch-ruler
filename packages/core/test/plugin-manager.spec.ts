import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PluginManager } from '../src/plugins/plugin-manager'
import type { SketchRulerPlugin, BeforeZoomContext, PluginApi } from '../src/types'

const mockApi: PluginApi = {
  getState: () => ({ scale: 1, offset: { x: 0, y: 0 }, lines: [] }),
  zoomBy: vi.fn(),
  zoomTo: vi.fn(),
  panBy: vi.fn(),
  setTransform: vi.fn()
}

describe('PluginManager', () => {
  // 插件管理器测试
  let manager: PluginManager

  beforeEach(() => {
    manager = new PluginManager()
    manager.setApi(mockApi)
  })

  it('should register and unregister plugin', () => {
    // 注册和注销插件
    const plugin: SketchRulerPlugin = { name: 'test' }
    const unregister = manager.register(plugin)
    expect(unregister).toBeTypeOf('function')
    unregister()
  })

  it('should trigger beforeZoom hooks and allow cancellation', async () => {
    // 触发 beforeZoom 钩子并允许取消
    const plugin1: SketchRulerPlugin = {
      name: 'p1',
      beforeZoom: vi.fn(async (ctx: BeforeZoomContext & { api: PluginApi }) => {
        if (ctx.to > 2) ctx.cancel()
      })
    }
    const plugin2: SketchRulerPlugin = {
      name: 'p2',
      beforeZoom: vi.fn()
    }

    manager.register(plugin1)
    manager.register(plugin2)

    const allowed = await manager.beforeZoom({
      from: 1,
      to: 3,
      center: { x: 100, y: 100 },
      cancel: () => {}
    })

    expect(allowed).toBe(false)
    expect(plugin1.beforeZoom).toHaveBeenCalledOnce()
    // p2 should not be called because p1 cancelled
    expect(plugin2.beforeZoom).not.toHaveBeenCalled()
  })

  it('should allow zoom when no plugin cancels', async () => {
    // 无插件取消时允许缩放
    const plugin: SketchRulerPlugin = {
      name: 'p1',
      beforeZoom: vi.fn()
    }
    manager.register(plugin)

    const allowed = await manager.beforeZoom({
      from: 1,
      to: 1.5,
      center: { x: 100, y: 100 },
      cancel: () => {}
    })

    expect(allowed).toBe(true)
  })

  it('should trigger afterPan hooks', () => {
    // 触发 afterPan 钩子
    const plugin: SketchRulerPlugin = {
      name: 'p1',
      afterPan: vi.fn()
    }
    manager.register(plugin)

    manager.afterPan({ offset: { x: 10, y: 20 }, delta: { x: 5, y: 5 } })
    expect(plugin.afterPan).toHaveBeenCalledOnce()
  })

  it('should trigger afterZoom hooks', () => {
    // 触发 afterZoom 钩子
    const plugin: SketchRulerPlugin = {
      name: 'p1',
      afterZoom: vi.fn()
    }
    manager.register(plugin)

    manager.afterZoom({ from: 1, to: 2, center: { x: 100, y: 100 } })
    expect(plugin.afterZoom).toHaveBeenCalledOnce()
  })

  it('should trigger beforePan hooks and allow cancellation', async () => {
    // 触发 beforePan 钩子并允许取消
    const plugin: SketchRulerPlugin = {
      name: 'p1',
      beforePan: vi.fn(async (ctx) => {
        if (ctx.delta.x > 10) ctx.cancel()
      })
    }
    manager.register(plugin)

    const allowed = await manager.beforePan({
      offset: { x: 0, y: 0 },
      delta: { x: 20, y: 0 },
      cancel: () => {}
    })

    expect(allowed).toBe(false)
    expect(plugin.beforePan).toHaveBeenCalledOnce()
  })

  it('should trigger line event hooks', () => {
    // 触发参考线事件钩子
    const plugin: SketchRulerPlugin = {
      name: 'p1',
      onLineCreate: vi.fn(),
      onLineDelete: vi.fn(),
      onLineMove: vi.fn()
    }
    manager.register(plugin)

    const line = { id: '1', orientation: 'h' as const, position: 100, visible: true, locked: false }

    manager.onLineCreate({ line })
    expect(plugin.onLineCreate).toHaveBeenCalledWith({ line, api: mockApi })

    manager.onLineDelete({ line })
    expect(plugin.onLineDelete).toHaveBeenCalledWith({ line, api: mockApi })

    manager.onLineMove({ line, from: 50, to: 100 })
    expect(plugin.onLineMove).toHaveBeenCalledWith({ line, from: 50, to: 100, api: mockApi })
  })

  it('should manage custom renderers', () => {
    // 管理自定义渲染器
    const renderer = {
      renderTicks: vi.fn(),
      renderLabels: vi.fn()
    }
    const plugin: SketchRulerPlugin = {
      name: 'p1',
      registerRenderer: () => ({ name: 'custom', renderer })
    }

    manager.register(plugin)
    expect(manager.getRendererNames()).toContain('custom')
    expect(manager.getActiveRenderer()).toBe(renderer)

    manager.setActiveRenderer('custom')
    expect(manager.getActiveRenderer()).toBe(renderer)
  })

  it('should not re-call registerRenderer on unregister', () => {
    // 注销时不重复调用 registerRenderer
    const registerRenderer = vi.fn(() => ({
      name: 'custom',
      renderer: { renderTicks: vi.fn(), renderLabels: vi.fn() }
    }))
    const plugin: SketchRulerPlugin = {
      name: 'p1',
      registerRenderer
    }

    manager.register(plugin)
    expect(registerRenderer).toHaveBeenCalledTimes(1)

    manager.unregister(plugin)
    expect(registerRenderer).toHaveBeenCalledTimes(1)
    expect(manager.getRendererNames()).not.toContain('custom')
  })

  it('should sort plugins by priority descending', async () => {
    // 按优先级降序排列插件
    const order: string[] = []
    const p1: SketchRulerPlugin = {
      name: 'low',
      priority: 0,
      beforeZoom: async () => {
        order.push('low')
      }
    }
    const p2: SketchRulerPlugin = {
      name: 'high',
      priority: 10,
      beforeZoom: async () => {
        order.push('high')
      }
    }
    const p3: SketchRulerPlugin = {
      name: 'mid',
      priority: 5,
      beforeZoom: async () => {
        order.push('mid')
      }
    }

    manager.register(p1)
    manager.register(p2)
    manager.register(p3)

    await manager.beforeZoom({ from: 1, to: 2, center: { x: 0, y: 0 }, cancel: () => {} })
    expect(order).toEqual(['high', 'mid', 'low'])
  })

  it('should isolate errors in sync hooks', () => {
    // 同步钩子中隔离错误
    const p1: SketchRulerPlugin = {
      name: 'thrower',
      afterPan: () => {
        throw new Error('oops')
      }
    }
    const p2: SketchRulerPlugin = {
      name: 'safe',
      afterPan: vi.fn()
    }

    manager.register(p1)
    manager.register(p2)

    // should not throw
    expect(() => manager.afterPan({ offset: { x: 0, y: 0 }, delta: { x: 1, y: 1 } })).not.toThrow()
    expect(p2.afterPan).toHaveBeenCalledOnce()
  })

  it('should isolate errors in async hooks', async () => {
    // 异步钩子中隔离错误
    const p1: SketchRulerPlugin = {
      name: 'thrower',
      beforeZoom: async () => {
        throw new Error('async oops')
      }
    }
    const p2: SketchRulerPlugin = {
      name: 'safe',
      beforeZoom: vi.fn()
    }

    manager.register(p1)
    manager.register(p2)

    const allowed = await manager.beforeZoom({
      from: 1,
      to: 2,
      center: { x: 0, y: 0 },
      cancel: () => {}
    })
    expect(allowed).toBe(true)
    expect(p2.beforeZoom).toHaveBeenCalledOnce()
  })

  it('should clear all plugins and renderers', () => {
    // 清除所有插件和渲染器
    const plugin: SketchRulerPlugin = {
      name: 'p1',
      registerRenderer: () => ({
        name: 'custom',
        renderer: { renderTicks: vi.fn(), renderLabels: vi.fn() }
      })
    }
    manager.register(plugin)
    manager.clear()
    expect(manager.getRendererNames()).toEqual([])
    expect(manager.getActiveRenderer()).toBeNull()
  })

  it('should throw if api not set when dispatching hooks', () => {
    // 未设置 api 时派发钩子抛出错误
    const m = new PluginManager()
    expect(() => m.afterPan({ offset: { x: 0, y: 0 }, delta: { x: 1, y: 1 } })).toThrow(
      '[PluginManager] api not set'
    )
  })
})
