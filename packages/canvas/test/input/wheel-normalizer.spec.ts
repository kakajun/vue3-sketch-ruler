import { describe, it, expect } from 'vitest'
import { normalizeWheel, getZoomDelta } from '../../src/input/wheel-normalizer'

describe('normalizeWheel', () => { // 滚轮归一化测试
  it('normalizes pixel mode (deltaMode = 0)', () => { // 归一化像素模式
    const event = new WheelEvent('wheel', {
      deltaX: 10,
      deltaY: 20,
      deltaZ: 0,
      deltaMode: WheelEvent.DOM_DELTA_PIXEL
    })
    const result = normalizeWheel(event)
    expect(result.deltaX).toBe(10)
    expect(result.deltaY).toBe(20)
    expect(result.deltaZ).toBe(0)
    expect(result.deltaMode).toBe(0)
  })

  it('normalizes line mode (deltaMode = 1)', () => { // 归一化行模式
    const event = new WheelEvent('wheel', {
      deltaX: 1,
      deltaY: 3,
      deltaMode: WheelEvent.DOM_DELTA_LINE
    })
    const result = normalizeWheel(event)
    expect(result.deltaX).toBe(40)
    expect(result.deltaY).toBe(120)
    expect(result.deltaMode).toBe(1)
  })

  it('normalizes page mode (deltaMode = 2)', () => { // 归一化页面模式
    const event = new WheelEvent('wheel', {
      deltaY: 1,
      deltaMode: WheelEvent.DOM_DELTA_PAGE
    })
    const result = normalizeWheel(event)
    expect(result.deltaY).toBe(800)
  })
})

describe('getZoomDelta', () => { // getZoomDelta 测试
  it('returns negative delta for scroll down', () => { // 向下滚动返回负增量
    const event = new WheelEvent('wheel', { deltaY: 100 })
    const delta = getZoomDelta(event, 0.001)
    expect(delta).toBeCloseTo(-0.1, 5)
  })

  it('returns positive delta for scroll up', () => { // 向上滚动返回正增量
    const event = new WheelEvent('wheel', { deltaY: -100 })
    const delta = getZoomDelta(event, 0.001)
    expect(delta).toBeCloseTo(0.1, 5)
  })

  it('falls back to deltaX when deltaY is 0', () => { // deltaY 为 0 时回退到 deltaX
    const event = new WheelEvent('wheel', { deltaX: 50, deltaY: 0 })
    const delta = getZoomDelta(event, 0.001)
    expect(delta).toBeCloseTo(-0.05, 5)
  })
})
