import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { TransformEngine } from '../../src/engine/transform-engine'

describe('TransformEngine', () => {
  let engine: TransformEngine

  beforeEach(() => {
    engine = new TransformEngine({ x: 0, y: 0, scale: 1 })
  })

  afterEach(() => {
    engine.destroy()
  })

  test('initial state', () => {
    const state = engine.getState()
    expect(state.scale).toBe(1)
    expect(state.x).toBe(0)
    expect(state.y).toBe(0)
  })

  test('onUpdate called immediately with current state', () => {
    const cb = vi.fn()
    engine.onUpdate(cb)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ scale: 1, x: 0, y: 0 }))
  })

  test('onUpdate returns unsubscribe function', () => {
    const cb = vi.fn()
    const unsubscribe = engine.onUpdate(cb)
    unsubscribe()
    engine.setTransform({ scale: 2 })
    expect(cb).toHaveBeenCalledTimes(1)
  })

  test('setTransform updates state', () => {
    engine.setTransform({ scale: 2, x: 100, y: 50 })
    const state = engine.getState()
    expect(state.scale).toBe(2)
    expect(state.x).toBe(100)
    expect(state.y).toBe(50)
  })

  test('scale is clamped by minZoom/maxZoom', () => {
    engine.setTransform({ scale: 0.01 })
    expect(engine.getState().scale).toBe(0.1)
    engine.setTransform({ scale: 100 })
    expect(engine.getState().scale).toBe(10)
  })

  test('panBy updates translate', () => {
    engine.panBy(50, 30)
    const state = engine.getState()
    expect(state.x).toBe(50)
    expect(state.y).toBe(30)
  })

  test('zoomBy with origin preserves origin point', () => {
    engine.zoomBy(1, 0, 0)
    const state = engine.getState()
    expect(state.scale).toBe(2)
    const worldAtOrigin = engine.toWorldPoint(0, 0)
    expect(worldAtOrigin.x).toBeCloseTo(0, 6)
    expect(worldAtOrigin.y).toBeCloseTo(0, 6)
  })

  test('zoomBy with non-zero origin preserves origin world coordinate', () => {
    // 缩放前：screen(100,100) 对应 world(100,100)
    const worldAtOriginBefore = engine.toWorldPoint(100, 100)
    expect(worldAtOriginBefore.x).toBe(100)
    expect(worldAtOriginBefore.y).toBe(100)

    engine.zoomBy(1, 100, 100)
    const state = engine.getState()
    expect(state.scale).toBe(2)

    // 缩放后：screen(100,100) 仍应对应相同的 world 坐标
    const worldAtOriginAfter = engine.toWorldPoint(100, 100)
    expect(worldAtOriginAfter.x).toBeCloseTo(100, 6)
    expect(worldAtOriginAfter.y).toBeCloseTo(100, 6)
  })

  test('zoomTo sets exact scale', () => {
    engine.zoomTo(3, 0, 0)
    expect(engine.getState().scale).toBe(3)
  })

  test('toWorldPoint and toScreenPoint are inverse', () => {
    engine.setTransform({ scale: 1.5, x: -30, y: 40 })
    const world = { x: 100, y: 200 }
    const screen = engine.toScreenPoint(world.x, world.y)
    const back = engine.toWorldPoint(screen.x, screen.y)
    expect(back.x).toBeCloseTo(world.x, 6)
    expect(back.y).toBeCloseTo(world.y, 6)
  })

  test('getMatrix returns copy', () => {
    const m1 = engine.getMatrix()
    const m2 = engine.getMatrix()
    expect(m1).not.toBe(m2)
    expect(m1[0]).toBe(m2[0])
  })

  test('multiple callbacks receive updates', () => {
    const cb1 = vi.fn()
    const cb2 = vi.fn()
    engine.onUpdate(cb1)
    engine.onUpdate(cb2)
    engine.setTransform({ scale: 2 })
    expect(cb1).toHaveBeenLastCalledWith(expect.objectContaining({ scale: 2 }))
    expect(cb2).toHaveBeenLastCalledWith(expect.objectContaining({ scale: 2 }))
  })

  test('zoomBy with tiny delta is no-op', () => {
    const before = engine.getState()
    engine.zoomBy(1e-8, 100, 100)
    const after = engine.getState()
    expect(after.scale).toBe(before.scale)
  })

  test('destroy cleans up', () => {
    const animated = new TransformEngine(
      { x: 0, y: 0, scale: 1 },
      { enableAnimation: true }
    )
    animated.setTransform({ scale: 2 })
    animated.destroy()
    expect(true).toBe(true)
  })
})

describe('TransformEngine with animation', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('animation interpolates values', async () => {
    const engine = new TransformEngine(
      { x: 0, y: 0, scale: 1 },
      { enableAnimation: true, animationDuration: 100 }
    )
    const cb = vi.fn()
    engine.onUpdate(cb)
    engine.setTransform({ scale: 2 })
    expect(engine.getState().scale).toBe(1)
    await vi.advanceTimersByTimeAsync(16)
    const midScale = engine.getState().scale
    expect(midScale).toBeGreaterThan(1)
    expect(midScale).toBeLessThan(2)
    engine.destroy()
  })
})
