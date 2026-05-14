import { describe, test, expect } from 'vitest'
import { ref } from 'vue'
import { useRulerScale, getTickConfig } from '../../src/composables/useRulerScale'

describe('getTickConfig', () => {
  test('returns correct config for scale < 0.2', () => {
    const config = getTickConfig(0.1)
    expect(config.interval).toBe(500)
    expect(config.subdivisions).toBe(5)
  })

  test('returns correct config for scale 0.3', () => {
    const config = getTickConfig(0.3)
    expect(config.interval).toBe(200)
    expect(config.subdivisions).toBe(4)
  })

  test('returns correct config for scale 1.0', () => {
    const config = getTickConfig(1.0)
    expect(config.interval).toBe(50)
    expect(config.subdivisions).toBe(5)
  })

  test('returns correct config for scale 3.0', () => {
    const config = getTickConfig(3.0)
    expect(config.interval).toBe(20)
    expect(config.subdivisions).toBe(4)
  })

  test('returns correct config for scale >= 10', () => {
    const config = getTickConfig(15)
    expect(config.interval).toBe(5)
    expect(config.subdivisions).toBe(5)
  })
})

describe('useRulerScale', () => {
  test('generates ticks for horizontal ruler', () => {
    const { ticks } = useRulerScale({
      thick: 20,
      viewportSize: ref({ width: 400, height: 300 }),
      scale: ref(1),
      offset: ref({ x: 0, y: 0 }),
      vertical: false
    })
    const result = ticks.value
    expect(result.length).toBeGreaterThan(0)
    const majors = result.filter((t) => t.isMajor)
    const minors = result.filter((t) => !t.isMajor)
    expect(majors.length).toBeGreaterThan(0)
    expect(minors.length).toBeGreaterThan(0)
    majors.forEach((t) => {
      expect(t.label).toBeDefined()
      expect(t.length).toBeGreaterThan(minors[0].length)
    })
  })

  test('generates ticks for vertical ruler', () => {
    const { ticks } = useRulerScale({
      thick: 20,
      viewportSize: ref({ width: 400, height: 300 }),
      scale: ref(1),
      offset: ref({ x: 0, y: 0 }),
      vertical: true
    })
    expect(ticks.value.length).toBeGreaterThan(0)
  })

  test('tick positions respect scale and offset', () => {
    const { ticks } = useRulerScale({
      thick: 20,
      viewportSize: ref({ width: 400, height: 300 }),
      scale: ref(2),
      offset: ref({ x: 100, y: 0 }),
      vertical: false
    })
    const result = ticks.value
    const zeroTick = result.find((t) => t.value === 0)
    if (zeroTick) {
      expect(zeroTick.position).toBe(100)
    }
  })

  test('returns empty array for zero viewport', () => {
    const { ticks } = useRulerScale({
      thick: 20,
      viewportSize: ref({ width: 0, height: 0 }),
      scale: ref(1),
      offset: ref({ x: 0, y: 0 })
    })
    expect(ticks.value).toEqual([])
  })

  test('includes buffer region ticks', () => {
    const { ticks } = useRulerScale({
      thick: 20,
      viewportSize: ref({ width: 200, height: 200 }),
      scale: ref(1),
      offset: ref({ x: 0, y: 0 })
    })
    const result = ticks.value
    const minPos = Math.min(...result.map((t) => t.position))
    const maxPos = Math.max(...result.map((t) => t.position))
    expect(minPos).toBeLessThan(0)
    expect(maxPos).toBeGreaterThan(200)
  })
})
