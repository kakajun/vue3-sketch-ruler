import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useCanvasTransform } from '../../src/composables/useCanvasTransform'

describe('useCanvasTransform', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  test('initial values', () => {
    const { scale, offset } = useCanvasTransform({
      initialScale: 2,
      initialOffset: { x: 100, y: 50 }
    })
    expect(scale.value).toBe(2)
    expect(offset.value).toEqual({ x: 100, y: 50 })
  })

  test('setTransform updates reactive state', () => {
    const { scale, offset, setTransform } = useCanvasTransform()
    setTransform({ scale: 2, x: 50, y: 30 })
    expect(scale.value).toBe(2)
    expect(offset.value).toEqual({ x: 50, y: 30 })
  })

  test('panBy accumulates offset', () => {
    const { offset, panBy } = useCanvasTransform()
    panBy(10, 20)
    expect(offset.value).toEqual({ x: 10, y: 20 })
    panBy(5, -5)
    expect(offset.value).toEqual({ x: 15, y: 15 })
  })

  test('zoomBy updates scale', () => {
    const { scale, zoomBy } = useCanvasTransform()
    zoomBy(1, 0, 0)
    expect(scale.value).toBe(2)
  })

  test('zoomTo sets exact scale', () => {
    const { scale, zoomTo } = useCanvasTransform()
    zoomTo(3, 0, 0)
    expect(scale.value).toBe(3)
  })

  test('zoom clamps to min/max', () => {
    const { scale, zoomTo } = useCanvasTransform({ minZoom: 0.5, maxZoom: 5 })
    zoomTo(0.1, 0, 0)
    expect(scale.value).toBe(0.5)
    zoomTo(10, 0, 0)
    expect(scale.value).toBe(5)
  })

  test('reset restores initial values', () => {
    const { scale, offset, reset, setTransform } = useCanvasTransform({
      initialScale: 1.5,
      initialOffset: { x: 10, y: 20 }
    })
    setTransform({ scale: 3, x: 100, y: 200 })
    expect(scale.value).toBe(3)
    expect(offset.value).toEqual({ x: 100, y: 200 })
    reset()
    expect(scale.value).toBe(1.5)
    expect(offset.value).toEqual({ x: 10, y: 20 })
  })

  test('toWorldPoint and toScreenPoint are inverse', () => {
    const { setTransform, toWorldPoint, toScreenPoint } = useCanvasTransform({
      initialScale: 2,
      initialOffset: { x: 100, y: 50 }
    })
    setTransform({ scale: 2, x: 100, y: 50 })
    const world = { x: 50, y: 50 }
    const screen = toScreenPoint(world.x, world.y)
    const back = toWorldPoint(screen.x, screen.y)
    expect(back.x).toBeCloseTo(world.x, 6)
    expect(back.y).toBeCloseTo(world.y, 6)
  })

  test('external scale change syncs to engine', async () => {
    const { scale, offset } = useCanvasTransform({ initialScale: 1 })
    scale.value = 2
    await nextTick()
    expect(scale.value).toBe(2)
  })

  test('engine is markRaw and not reactive', () => {
    const { engine } = useCanvasTransform()
    expect(engine).toBeDefined()
    expect(typeof engine.setTransform).toBe('function')
  })
})
