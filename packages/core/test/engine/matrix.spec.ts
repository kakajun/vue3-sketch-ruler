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
  // 矩阵运算测试
  test('createMatrix returns identity matrix', () => {
    // createMatrix 返回单位矩阵
    const m = createMatrix()
    expect(m[0]).toBe(1)
    expect(m[1]).toBe(0)
    expect(m[2]).toBe(0)
    expect(m[3]).toBe(1)
    expect(m[4]).toBe(0)
    expect(m[5]).toBe(0)
  })

  test('fromTransform creates correct matrix', () => {
    // fromTransform 创建正确矩阵
    const m = fromTransform(2, 100, 50)
    expect(m[0]).toBe(2)
    expect(m[3]).toBe(2)
    expect(m[4]).toBe(100)
    expect(m[5]).toBe(50)
  })

  test('multiply combines transforms', () => {
    // multiply 组合变换
    const m1 = fromTransform(2, 100, 50)
    const m2 = fromTransform(0.5, 20, 10)
    const result = multiply(m1, m2)
    expect(result[0]).toBeCloseTo(1, 6)
    expect(result[3]).toBeCloseTo(1, 6)
    expect(result[4]).toBeCloseTo(140, 6)
    expect(result[5]).toBeCloseTo(70, 6)
  })

  test('invert reverses transform', () => {
    // invert 反转变换
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
    // invert 对奇异矩阵返回 null
    const m = new Float64Array([0, 0, 0, 0, 0, 0])
    expect(invert(m)).toBeNull()
  })

  test('decompose extracts scale and translate', () => {
    // decompose 提取缩放和平移
    const m = fromTransform(2.5, 100, -50)
    const d = decompose(m)
    expect(d.scale).toBe(2.5)
    expect(d.translateX).toBe(100)
    expect(d.translateY).toBe(-50)
  })

  test('toCSSString formats correctly', () => {
    // toCSSString 正确格式化
    const m = fromTransform(2, 100, 50)
    expect(toCSSString(m)).toBe('matrix(2, 0, 0, 2, 100, 50)')
  })

  test('equals with epsilon', () => {
    // equals 在精度范围内比较
    const m1 = fromTransform(2, 100, 50)
    const m2 = fromTransform(2.0000001, 100.0000001, 50.0000001)
    expect(equals(m1, m2)).toBe(true)
    expect(equals(m1, m2, 1e-12)).toBe(false)
  })
})
