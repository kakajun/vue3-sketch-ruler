/**
 * 2D 仿射变换矩阵运算
 * 使用 Float64Array(6) 紧凑存储: [a, b, c, d, e, f]
 * 对应变换矩阵:
 *   | a  c  e |
 *   | b  d  f |
 *   | 0  0  1 |
 *
 * 零 DOM 依赖，纯数学运算，可在 Node.js 环境直接测试
 */

export type Matrix6 = Float64Array

/**
 * 创建单位矩阵
 */
export function createMatrix(): Matrix6 {
  return new Float64Array([1, 0, 0, 1, 0, 0])
}

/**
 * 从缩放和平移参数创建矩阵
 */
export function fromTransform(scale: number, x: number, y: number): Matrix6 {
  return new Float64Array([scale, 0, 0, scale, x, y])
}

/**
 * 矩阵乘法: result = a * b
 */
export function multiply(a: Matrix6, b: Matrix6): Matrix6 {
  const result = new Float64Array(6)
  result[0] = a[0] * b[0] + a[2] * b[1]
  result[1] = a[1] * b[0] + a[3] * b[1]
  result[2] = a[0] * b[2] + a[2] * b[3]
  result[3] = a[1] * b[2] + a[3] * b[3]
  result[4] = a[0] * b[4] + a[2] * b[5] + a[4]
  result[5] = a[1] * b[4] + a[3] * b[5] + a[5]
  return result
}

/**
 * 求逆矩阵
 */
export function invert(m: Matrix6): Matrix6 | null {
  const det = m[0] * m[3] - m[1] * m[2]
  if (Math.abs(det) < 1e-10) {
    return null
  }

  const invDet = 1 / det
  const result = new Float64Array(6)
  result[0] = m[3] * invDet
  result[1] = -m[1] * invDet
  result[2] = -m[2] * invDet
  result[3] = m[0] * invDet
  result[4] = (m[2] * m[5] - m[3] * m[4]) * invDet
  result[5] = (m[1] * m[4] - m[0] * m[5]) * invDet
  return result
}

/**
 * 分解矩阵为 scale, x, y
 * 假设无旋转和倾斜（sketch-ruler 场景）
 */
export function decompose(m: Matrix6): { scale: number; translateX: number; translateY: number } {
  return {
    scale: m[0],
    translateX: m[4],
    translateY: m[5]
  }
}

/**
 * 转换为 CSS transform string
 */
export function toCSSString(m: Matrix6): string {
  return `matrix(${m[0]}, ${m[1]}, ${m[2]}, ${m[3]}, ${m[4]}, ${m[5]})`
}

/**
 * 判断两个矩阵是否相等（考虑浮点误差）
 */
export function equals(a: Matrix6, b: Matrix6, epsilon = 1e-6): boolean {
  for (let i = 0; i < 6; i++) {
    if (Math.abs(a[i] - b[i]) > epsilon) {
      return false
    }
  }
  return true
}
