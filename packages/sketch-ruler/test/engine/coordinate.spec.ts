import { describe, test, expect } from 'vitest'
import { fromTransform } from '../../src/engine/matrix'
import {
  toWorldPoint,
  toScreenPoint,
  batchToWorld,
  batchToScreen,
  fitRect
} from '../../src/engine/coordinate'

describe('coordinate', () => {
  test('toWorldPoint converts screen to world', () => {
    const m = fromTransform(2, 100, 50)
    const p = toWorldPoint(m, 300, 250)
    expect(p.x).toBe(100)
    expect(p.y).toBe(100)
  })

  test('toWorldPoint handles zero scale', () => {
    const m = fromTransform(0, 0, 0)
    const p = toWorldPoint(m, 100, 100)
    expect(p.x).toBe(0)
    expect(p.y).toBe(0)
  })

  test('toScreenPoint converts world to screen', () => {
    const m = fromTransform(2, 100, 50)
    const p = toScreenPoint(m, 100, 100)
    expect(p.x).toBe(300)
    expect(p.y).toBe(250)
  })

  test('round-trip conversion', () => {
    const m = fromTransform(1.5, -30, 40)
    const world = { x: 123.45, y: 678.9 }
    const screen = toScreenPoint(m, world.x, world.y)
    const back = toWorldPoint(m, screen.x, screen.y)
    expect(back.x).toBeCloseTo(world.x, 6)
    expect(back.y).toBeCloseTo(world.y, 6)
  })

  test('batchToWorld converts multiple points', () => {
    const m = fromTransform(2, 100, 50)
    const points = [
      { x: 300, y: 250 },
      { x: 400, y: 350 }
    ]
    const result = batchToWorld(m, points)
    expect(result[0].x).toBe(100)
    expect(result[0].y).toBe(100)
    expect(result[1].x).toBe(150)
    expect(result[1].y).toBe(150)
  })

  test('batchToScreen converts multiple points', () => {
    const m = fromTransform(2, 100, 50)
    const points = [
      { x: 100, y: 100 },
      { x: 150, y: 150 }
    ]
    const result = batchToScreen(m, points)
    expect(result[0].x).toBe(300)
    expect(result[0].y).toBe(250)
    expect(result[1].x).toBe(400)
    expect(result[1].y).toBe(350)
  })

  test('fitRect contain mode', () => {
    const content = { x: 0, y: 0, width: 1000, height: 800 }
    const viewport = { x: 0, y: 0, width: 500, height: 400 }
    const result = fitRect(content, viewport, 'contain')
    expect(result.scale).toBe(0.5)
    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
  })

  test('fitRect with padding', () => {
    const content = { x: 0, y: 0, width: 100, height: 100 }
    const viewport = { x: 0, y: 0, width: 200, height: 200 }
    const result = fitRect(content, viewport, 'contain', 0.2)
    expect(result.scale).toBe(1.6)
  })

  test('fitRect handles zero dimensions', () => {
    const content = { x: 0, y: 0, width: 0, height: 100 }
    const viewport = { x: 0, y: 0, width: 500, height: 400 }
    const result = fitRect(content, viewport)
    expect(result.scale).toBe(1)
    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
  })
})
