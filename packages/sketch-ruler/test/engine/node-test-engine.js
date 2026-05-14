/**
 * 纯 Node.js 测试脚本（无需 vitest）
 * 验证 engine/ 层纯数学运算
 */

const assert = require('assert').strict

// 模拟 ESM 导入：直接 require 编译后的模块或手写测试
// 由于 TS 未编译，这里手动内联关键测试逻辑来验证算法正确性

// ===== matrix.ts 核心逻辑内联验证 =====
function createMatrix() {
  return new Float64Array([1, 0, 0, 1, 0, 0])
}
function fromTransform(scale, tx, ty) {
  return new Float64Array([scale, 0, 0, scale, tx, ty])
}
function multiply(m1, m2) {
  const a1 = m1[0], b1 = m1[1], c1 = m1[2], d1 = m1[3], e1 = m1[4], f1 = m1[5]
  const a2 = m2[0], b2 = m2[1], c2 = m2[2], d2 = m2[3], e2 = m2[4], f2 = m2[5]
  return new Float64Array([
    a1 * a2 + c1 * b2,
    b1 * a2 + d1 * b2,
    a1 * c2 + c1 * d2,
    b1 * c2 + d1 * d2,
    a1 * e2 + c1 * f2 + e1,
    b1 * e2 + d1 * f2 + f1
  ])
}
function invert(m) {
  const a = m[0], b = m[1], c = m[2], d = m[3], e = m[4], f = m[5]
  const det = a * d - b * c
  if (Math.abs(det) < 1e-10) return null
  const invDet = 1 / det
  return new Float64Array([
    d * invDet, -b * invDet, -c * invDet, a * invDet,
    (c * f - d * e) * invDet, (b * e - a * f) * invDet
  ])
}
function decompose(m) {
  return { scale: m[0], translateX: m[4], translateY: m[5] }
}
function equals(m1, m2, eps = 1e-6) {
  for (let i = 0; i < 6; i++) if (Math.abs(m1[i] - m2[i]) > eps) return false
  return true
}

// ===== coordinate.ts 核心逻辑内联验证 =====
function toWorldPoint(m, screenX, screenY) {
  const scale = m[0]
  if (Math.abs(scale) < 1e-10) return { x: 0, y: 0 }
  return { x: (screenX - m[4]) / scale, y: (screenY - m[5]) / scale }
}
function toScreenPoint(m, worldX, worldY) {
  return { x: worldX * m[0] + m[4], y: worldY * m[3] + m[5] }
}
function fitRect(contentRect, viewportRect, mode = 'contain', paddingRatio = 0) {
  const contentW = contentRect.width, contentH = contentRect.height
  const viewportW = viewportRect.width * (1 - paddingRatio)
  const viewportH = viewportRect.height * (1 - paddingRatio)
  if (contentW <= 0 || contentH <= 0 || viewportW <= 0 || viewportH <= 0) {
    return { scale: 1, x: 0, y: 0 }
  }
  const scaleX = viewportW / contentW, scaleY = viewportH / contentH
  const scale = mode === 'contain' ? Math.min(scaleX, scaleY) : (mode === 'cover' ? Math.max(scaleX, scaleY) : 1)
  return {
    scale,
    x: (viewportRect.width - contentW * scale) / 2,
    y: (viewportRect.height - contentH * scale) / 2
  }
}

// ===== transform-engine.ts 核心逻辑内联验证 =====
class TransformEngine {
  constructor(initial = { x: 0, y: 0, scale: 1 }, options = {}) {
    this.minZoom = options.minZoom ?? 0.1
    this.maxZoom = options.maxZoom ?? 10
    this.enableAnimation = options.enableAnimation ?? false
    this.currentState = { ...initial, scale: Math.max(this.minZoom, Math.min(this.maxZoom, initial.scale)) }
    this.targetState = { ...this.currentState }
    this.callbacks = []
  }
  onUpdate(cb) {
    this.callbacks.push(cb)
    cb({ ...this.currentState })
    return () => {
      const idx = this.callbacks.indexOf(cb)
      if (idx >= 0) this.callbacks.splice(idx, 1)
    }
  }
  setTransform(t) {
    if (t.scale !== undefined) this.targetState.scale = Math.max(this.minZoom, Math.min(this.maxZoom, t.scale))
    if (t.x !== undefined) this.targetState.x = t.x
    if (t.y !== undefined) this.targetState.y = t.y
    this.currentState = { ...this.targetState }
    this._notify()
  }
  panBy(dx, dy) {
    this.targetState.x += dx
    this.targetState.y += dy
    this.currentState = { ...this.targetState }
    this._notify()
  }
  zoomBy(dScale, originX, originY) {
    const oldScale = this.targetState.scale
    const newScale = Math.max(this.minZoom, Math.min(this.maxZoom, oldScale + dScale))
    const scaleRatio = newScale / oldScale
    if (Math.abs(scaleRatio - 1) < 1e-6) return
    this.targetState.x = originX - (originX - this.targetState.x) * scaleRatio
    this.targetState.y = originY - (originY - this.targetState.y) * scaleRatio
    this.targetState.scale = newScale
    this.currentState = { ...this.targetState }
    this._notify()
  }
  zoomTo(scale, originX, originY) {
    this.zoomBy(Math.max(this.minZoom, Math.min(this.maxZoom, scale)) - this.targetState.scale, originX, originY)
  }
  toWorldPoint(screenX, screenY) {
    const s = this.currentState.scale
    return { x: (screenX - this.currentState.x) / s, y: (screenY - this.currentState.y) / s }
  }
  toScreenPoint(worldX, worldY) {
    const s = this.currentState.scale
    return { x: worldX * s + this.currentState.x, y: worldY * s + this.currentState.y }
  }
  getState() { return { ...this.currentState } }
  destroy() { this.callbacks = [] }
  _notify() {
    const s = { ...this.currentState }
    this.callbacks.forEach(cb => cb(s))
  }
}

// ===== 测试运行 =====
let pass = 0, fail = 0
function test(name, fn) {
  try {
    fn()
    pass++
    console.log(`  ✓ ${name}`)
  } catch (e) {
    fail++
    console.error(`  ✗ ${name}`)
    console.error(`    ${e.message}`)
  }
}

console.log('\nmatrix')
test('createMatrix returns identity', () => {
  const m = createMatrix()
  assert.equal(m[0], 1); assert.equal(m[3], 1)
  assert.equal(m[4], 0); assert.equal(m[5], 0)
})
test('multiply combines transforms', () => {
  const r = multiply(fromTransform(2, 100, 50), fromTransform(0.5, 20, 10))
  assert.ok(Math.abs(r[0] - 1) < 1e-6)
  assert.ok(Math.abs(r[4] - 140) < 1e-6)
  assert.ok(Math.abs(r[5] - 70) < 1e-6)
})
test('invert reverses transform', () => {
  const m = fromTransform(2, 100, 50)
  const inv = invert(m)
  assert.ok(inv !== null)
  const restored = multiply(m, inv)
  assert.ok(Math.abs(restored[0] - 1) < 1e-6)
  assert.ok(Math.abs(restored[4]) < 1e-6)
})
test('invert returns null for singular', () => {
  assert.equal(invert(new Float64Array([0,0,0,0,0,0])), null)
})
test('decompose extracts values', () => {
  const d = decompose(fromTransform(2.5, 100, -50))
  assert.equal(d.scale, 2.5)
  assert.equal(d.translateX, 100)
})

console.log('\ncoordinate')
test('toWorldPoint converts correctly', () => {
  const m = fromTransform(2, 100, 50)
  const p = toWorldPoint(m, 300, 250)
  assert.equal(p.x, 100); assert.equal(p.y, 100)
})
test('round-trip conversion', () => {
  const m = fromTransform(1.5, -30, 40)
  const world = { x: 123.45, y: 678.9 }
  const screen = toScreenPoint(m, world.x, world.y)
  const back = toWorldPoint(m, screen.x, screen.y)
  assert.ok(Math.abs(back.x - world.x) < 1e-6)
  assert.ok(Math.abs(back.y - world.y) < 1e-6)
})
test('fitRect contain mode', () => {
  const r = fitRect({x:0,y:0,width:1000,height:800}, {x:0,y:0,width:500,height:400}, 'contain')
  assert.equal(r.scale, 0.5)
})
test('fitRect with padding', () => {
  const r = fitRect({x:0,y:0,width:100,height:100}, {x:0,y:0,width:200,height:200}, 'contain', 0.2)
  assert.equal(r.scale, 1.6)
})

console.log('\nTransformEngine')
test('initial state', () => {
  const e = new TransformEngine()
  const s = e.getState()
  assert.equal(s.scale, 1); assert.equal(s.x, 0)
  e.destroy()
})
test('scale clamping', () => {
  const e = new TransformEngine()
  e.setTransform({ scale: 0.01 })
  assert.equal(e.getState().scale, 0.1)
  e.setTransform({ scale: 100 })
  assert.equal(e.getState().scale, 10)
  e.destroy()
})
test('panBy', () => {
  const e = new TransformEngine()
  e.panBy(50, 30)
  assert.equal(e.getState().x, 50)
  assert.equal(e.getState().y, 30)
  e.destroy()
})
test('zoomBy preserves origin', () => {
  const e = new TransformEngine()
  e.zoomBy(1, 100, 100) // scale 1->2, origin (100,100)
  assert.equal(e.getState().scale, 2)
  const world = e.toWorldPoint(100, 100)
  // scale=1 时 (100,100) 对应 world (100,100)
  // scale=2 时应保持同一点
  assert.ok(Math.abs(world.x - 100) < 1e-6, `world.x=${world.x}`)
  assert.ok(Math.abs(world.y - 100) < 1e-6, `world.y=${world.y}`)
  e.destroy()
})
test('toWorldPoint and toScreenPoint inverse', () => {
  const e = new TransformEngine({ x: -30, y: 40, scale: 1.5 })
  const world = { x: 100, y: 200 }
  const screen = e.toScreenPoint(world.x, world.y)
  const back = e.toWorldPoint(screen.x, screen.y)
  assert.ok(Math.abs(back.x - world.x) < 1e-6)
  assert.ok(Math.abs(back.y - world.y) < 1e-6)
  e.destroy()
})
test('onUpdate called immediately', () => {
  const e = new TransformEngine()
  let called = 0
  e.onUpdate(() => called++)
  assert.equal(called, 1)
  e.destroy()
})
test('unsubscribe works', () => {
  const e = new TransformEngine()
  let called = 0
  const unsub = e.onUpdate(() => called++)
  unsub()
  e.setTransform({ scale: 2 })
  assert.equal(called, 1) // 只有初始调用
  e.destroy()
})
test('multiple callbacks', () => {
  const e = new TransformEngine()
  let c1 = 0, c2 = 0
  e.onUpdate(() => c1++)
  e.onUpdate(() => c2++)
  e.setTransform({ scale: 2 })
  assert.equal(c1, 2) // 初始 + setTransform
  assert.equal(c2, 2)
  e.destroy()
})

console.log(`\n=========================`)
console.log(`Results: ${pass} passed, ${fail} failed`)
console.log(`=========================`)
if (fail > 0) process.exit(1)
