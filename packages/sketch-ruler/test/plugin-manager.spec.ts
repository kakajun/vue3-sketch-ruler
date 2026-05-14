import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PluginManager } from '../src/plugins/plugin-manager'
import type { SketchRulerPlugin, BeforeZoomContext } from '../src/plugins/types'

describe('PluginManager', () => {
  let manager: PluginManager

  beforeEach(() => {
    manager = new PluginManager()
  })

  it('should register and unregister plugin', () => {
    const plugin: SketchRulerPlugin = { name: 'test' }
    const unregister = manager.register(plugin)
    expect(unregister).toBeTypeOf('function')
    unregister()
  })

  it('should trigger beforeZoom hooks and allow cancellation', async () => {
    const plugin1: SketchRulerPlugin = {
      name: 'p1',
      beforeZoom: vi.fn(async (ctx: BeforeZoomContext) => {
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
    const plugin: SketchRulerPlugin = {
      name: 'p1',
      afterPan: vi.fn()
    }
    manager.register(plugin)

    manager.afterPan({ offset: { x: 10, y: 20 }, delta: { x: 5, y: 5 } })
    expect(plugin.afterPan).toHaveBeenCalledOnce()
  })

  it('should trigger line event hooks', () => {
    const plugin: SketchRulerPlugin = {
      name: 'p1',
      onLineCreate: vi.fn(),
      onLineDelete: vi.fn(),
      onLineMove: vi.fn()
    }
    manager.register(plugin)

    const line = { id: '1', orientation: 'h' as const, position: 100, visible: true, locked: false }

    manager.onLineCreate({ line })
    expect(plugin.onLineCreate).toHaveBeenCalledWith({ line })

    manager.onLineDelete({ line })
    expect(plugin.onLineDelete).toHaveBeenCalledWith({ line })

    manager.onLineMove({ line, from: 50, to: 100 })
    expect(plugin.onLineMove).toHaveBeenCalledWith({ line, from: 50, to: 100 })
  })

  it('should manage custom renderers', () => {
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

  it('should clear all plugins', () => {
    manager.register({ name: 'p1' })
    manager.register({ name: 'p2' })
    manager.clear()
    expect(manager.getRendererNames()).toEqual([])
  })
})
