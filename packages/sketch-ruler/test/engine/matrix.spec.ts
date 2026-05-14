import { describe, test, expect } from 'vitest'
import {
  createMatrix,
  fromTransform,
  multiply,
  invert,
  decompose,
  toCSSString,
  equals
} from '../../src/engine/matrix'

describe('matrix', () => {
  test('createMatrix returns identity matrix', () => {
    const m = createMatrix()
    expect(m[0]).toBe(1)
    expect(m[1]).toBe(0)
    expect(m[2]).toBe(0)
    expect(m[3]).toBe(1)
    expect(m[4]).toBe(0)
    expect(m[5]).toBe(0)
  })

  test('fromTransform creates correct matrix', () => {
    const m = fromTransform(2, 100, 50)
    expect(m[0]).toBe(2)
    expect(m[3]).toBe(2)
    expect(m[4]).toBe(100)
    expect(m[5]).toBe(50)
  })

  test('multiply combines transforms', () => {
    const m1 = fromTransform(2, 100, 50)
    const m2 = fromTransform(0.5, 20, 10)
    const result = multiply(m1, m2)
    expect(result[0]).toBeCloseTo(1, 6)
    expect(result[3]).toBeCloseTo(1, 6)
    expect(result[4]).toBeCloseTo(140, 6)
    expect(result[5]).toBeCloseTo(70, 6)
  })

  test('invert reverses transform', () => {
    const m = fromTransform(2, 100, 50)
    const inv = invert(m)
    expect(inv).not.toBeNull()
    const restored = multiply(m, inv!)
    expect(restored[0]).toBeCloseTo(1, 6)
    expect(restored[3]).toBeCloseTo(1, 6)
    expect(restored[4]).toBeCloseTo(0, 6)
    expect(restored[5]).toBeCloseTo(0, 6)
  })

  test('invert returns null for singular matrix', () => {
    const m = new Float64Array([0, 0, 0, 0, 0, 0])
    expect(invert(m)).toBeNull()
  })

  test('decompose extracts scale and translate', () => {
    const m = fromTransform(2.5, 100, -50)
    const d = decompose(m)
    expect(d.scale).toBe(2.5)
    expect(d.translateX).toBe(100)
    expect(d.translateY).toBe(-50)
  })

  test('toCSSString formats correctly', () => {
    const m = fromTransform(2, 100, 50)
    expect(toCSSString(m)).toBe('matrix(2, 0, 0, 2, 100, 50)')
  })

  test('equals with epsilon', () => {
    const m1 = fromTransform(2, 100, 50)
    const m2 = fromTransform(2.0000001, 100.0000001, 50.0000001)
    expect(equals(m1, m2)).toBe(true)
    expect(equals(m1, m2, 1e-12)).toBe(false)
  })
})
