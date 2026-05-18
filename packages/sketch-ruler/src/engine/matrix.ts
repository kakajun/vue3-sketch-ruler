/**
 * 2D 仿射变换矩阵操作
 * 使用 Float64Array(6) 紧凑存储 [a, b, c, d, e, f]
 * 对应 CSS transform matrix(a, b, c, d, e, f)
 *
 * 零 DOM 依赖，纯数学运算，可在 Node.js 环境中运行
 */

export type Matrix6 = Float64Array

/** 创建单位矩阵 */
export function createMatrix(): Matrix6 {
  return new Float64Array([1, 0, 0, 1, 0, 0])
}

/** 从 scale/translate 创建矩阵 */
export function fromTransform(scale: number, tx: number, ty: number): Matrix6 {
  return new Float64Array([scale, 0, 0, scale, tx, ty])
}

/** 矩阵乘法：result = m1 × m2 */
export function multiply(m1: Matrix6, m2: Matrix6): Matrix6 {
  const a1 = m1[0],
    b1 = m1[1],
    c1 = m1[2],
    d1 = m1[3],
    e1 = m1[4],
    f1 = m1[5]
  const a2 = m2[0],
    b2 = m2[1],
    c2 = m2[2],
    d2 = m2[3],
    e2 = m2[4],
    f2 = m2[5]

  return new Float64Array([
    a1 * a2 + c1 * b2,
    b1 * a2 + d1 * b2,
    a1 * c2 + c1 * d2,
    b1 * c2 + d1 * d2,
    a1 * e2 + c1 * f2 + e1,
    b1 * e2 + d1 * f2 + f1
  ])
}

/** 矩阵求逆 */
export function invert(m: Matrix6): Matrix6 | null {
  const a = m[0],
    b = m[1],
    c = m[2],
    d = m[3],
    e = m[4],
    f = m[5]
  const det = a * d - b * c

  if (Math.abs(det) < 1e-10) {
    return null
  }

  const invDet = 1 / det

  return new Float64Array([
    d * invDet,
    -b * invDet,
    -c * invDet,
    a * invDet,
    (c * f - d * e) * invDet,
    (b * e - a * f) * invDet
  ])
}

/** 分解矩阵为 { scale, translateX, translateY } */
export function decompose(m: Matrix6): { scale: number; translateX: number; translateY: number } {
  // 假设无旋转/倾斜（sketch-ruler 场景下仅支持缩放+平移）
  const scale = m[0]
  return {
    scale,
    translateX: m[4],
    translateY: m[5]
  }
}

/** 矩阵转 CSS matrix 字符串 */
export function toCSSString(m: Matrix6): string {
  return `matrix(${m[0]}, ${m[1]}, ${m[2]}, ${m[3]}, ${m[4]}, ${m[5]})`
}

/** 矩阵相等性判断（带 epsilon） */
export function equals(m1: Matrix6, m2: Matrix6, epsilon = 1e-6): boolean {
  for (let i = 0; i < 6; i++) {
    if (Math.abs(m1[i] - m2[i]) > epsilon) {
      return false
    }
  }
  return true
}
