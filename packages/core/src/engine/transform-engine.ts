/**
 * TransformEngine - 内置变换引擎
 * 维护 2D 仿射变换矩阵，通过 requestAnimationFrame 驱动动画循环
 * 零 DOM 依赖，所有 DOM 操作由外部回调处理
 */

import { createMatrix, fromTransform, multiply, invert, type Matrix6 } from './matrix'
import { toWorldPoint, toScreenPoint } from './coordinate'

export interface TransformState {
  x: number
  y: number
  scale: number
}

export type AnimationMode = 'direct' | 'ease-out' | 'damped' | 'exponential'

export interface TransformEngineOptions {
  minZoom?: number
  maxZoom?: number
  enableAnimation?: boolean
  animationDuration?: number
  animationMode?: AnimationMode
  /** 阻尼系数（damped 模式），默认 0.8 */
  dampingRatio?: number
  /** 自然频率 rad/s（damped 模式），默认 20 */
  naturalFrequency?: number
  /** 时间常数 ms（exponential 模式），默认 80 */
  timeConstant?: number
}

export type TransformUpdateCallback = (state: TransformState) => void

export class TransformEngine {
  private matrix: Matrix6
  private targetState: TransformState
  private currentState: TransformState
  private minZoom: number
  private maxZoom: number
  private enableAnimation: boolean
  private animationDuration: number
  private animationMode: AnimationMode
  private dampingRatio: number
  private naturalFrequency: number
  private timeConstant: number

  private pendingTransform = false
  private rafId: number | null = null
  private callbacks: Set<TransformUpdateCallback> = new Set()

  private lastFrameTime = 0
  // damped 模式需要维护速度状态
  private velocity = { x: 0, y: 0, scale: 0 }

  constructor(
    initial: TransformState = { x: 0, y: 0, scale: 1 },
    options: TransformEngineOptions = {}
  ) {
    this.minZoom = options.minZoom ?? 0.1
    this.maxZoom = options.maxZoom ?? 10
    this.enableAnimation = options.enableAnimation ?? false
    this.animationDuration = options.animationDuration ?? 200
    this.animationMode = options.animationMode ?? 'ease-out'
    this.dampingRatio = options.dampingRatio ?? 0.8
    this.naturalFrequency = options.naturalFrequency ?? 20
    this.timeConstant = options.timeConstant ?? 80

    const clampedScale = this.clampScale(initial.scale)
    this.currentState = { ...initial, scale: clampedScale }
    this.targetState = { ...this.currentState }
    this.matrix = fromTransform(clampedScale, initial.x, initial.y)
  }

  /** 注册更新回调 */
  onUpdate(callback: TransformUpdateCallback): () => void {
    this.callbacks.add(callback)
    // 立即通知当前状态
    callback({ ...this.currentState })
    return () => {
      this.callbacks.delete(callback)
    }
  }

  /** 原子性设置变换状态 */
  setTransform(t: Partial<TransformState>): void {
    if (t.scale !== undefined) {
      this.targetState.scale = this.clampScale(t.scale)
    }
    if (t.x !== undefined) {
      this.targetState.x = t.x
    }
    if (t.y !== undefined) {
      this.targetState.y = t.y
    }

    if (!this.enableAnimation) {
      this.currentState = { ...this.targetState }
      this.updateMatrix()
      this.notify()
    } else {
      this.scheduleUpdate()
    }
  }

  /** 相对平移 */
  panBy(dx: number, dy: number): void {
    this.targetState.x += dx
    this.targetState.y += dy

    if (!this.enableAnimation) {
      this.currentState = { ...this.targetState }
      this.updateMatrix()
      this.notify()
    } else {
      this.scheduleUpdate()
    }
  }

  /**
   * 以指定原点为中心缩放
   * @param dScale 缩放增量（相对当前 scale）
   * @param originX 缩放原点屏幕坐标 X
   * @param originY 缩放原点屏幕坐标 Y
   */
  zoomBy(dScale: number, originX: number, originY: number): void {
    const oldScale = this.targetState.scale
    const newScale = this.clampScale(oldScale + dScale)
    const scaleRatio = newScale / oldScale

    if (Math.abs(scaleRatio - 1) < 1e-6) {
      return
    }

    // 以原点为中心的缩放公式：
    // newX = originX - (originX - oldX) * scaleRatio
    // newY = originY - (originY - oldY) * scaleRatio
    this.targetState.x = originX - (originX - this.targetState.x) * scaleRatio
    this.targetState.y = originY - (originY - this.targetState.y) * scaleRatio
    this.targetState.scale = newScale

    if (!this.enableAnimation) {
      this.currentState = { ...this.targetState }
      this.updateMatrix()
      this.notify()
    } else {
      this.scheduleUpdate()
    }
  }

  /** 缩放至目标比例 */
  zoomTo(scale: number, originX: number, originY: number): void {
    const dScale = this.clampScale(scale) - this.targetState.scale
    this.zoomBy(dScale, originX, originY)
  }

  /** 屏幕坐标 → 世界坐标 */
  toWorldPoint(screenX: number, screenY: number): { x: number; y: number } {
    return toWorldPoint(this.matrix, screenX, screenY)
  }

  /** 世界坐标 → 屏幕坐标 */
  toScreenPoint(worldX: number, worldY: number): { x: number; y: number } {
    return toScreenPoint(this.matrix, worldX, worldY)
  }

  /** 获取当前状态 */
  getState(): TransformState {
    return { ...this.currentState }
  }

  /** 获取当前变换矩阵 */
  getMatrix(): Matrix6 {
    return new Float64Array(this.matrix)
  }

  /** 销毁引擎，清理资源 */
  destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.callbacks.clear()
  }

  private clampScale(scale: number): number {
    return Math.max(this.minZoom, Math.min(this.maxZoom, scale))
  }

  private updateMatrix(): void {
    this.matrix = fromTransform(this.currentState.scale, this.currentState.x, this.currentState.y)
  }

  private scheduleUpdate(): void {
    this.pendingTransform = true
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame((time) => this.onFrame(time))
    }
  }

  private onFrame(time: number): void {
    this.rafId = null

    if (!this.pendingTransform) {
      return
    }
    this.pendingTransform = false

    if (!this.enableAnimation) {
      this.currentState = { ...this.targetState }
      this.updateMatrix()
      this.notify()
      return
    }

    const deltaTime = this.lastFrameTime === 0 ? 16 : time - this.lastFrameTime
    this.lastFrameTime = time
    const dt = deltaTime / 1000 // 秒

    switch (this.animationMode) {
      case 'direct': {
        this.currentState = { ...this.targetState }
        break
      }
      case 'ease-out': {
        const t = Math.min(1, deltaTime / this.animationDuration)
        const easeT = 1 - Math.pow(1 - t, 3)
        this.currentState.x = this.lerp(this.currentState.x, this.targetState.x, easeT)
        this.currentState.y = this.lerp(this.currentState.y, this.targetState.y, easeT)
        this.currentState.scale = this.lerp(this.currentState.scale, this.targetState.scale, easeT)
        break
      }
      case 'exponential': {
        // s_new = s_old + (s_target - s_old) * (1 - e^(-Δt/τ))
        const tau = this.timeConstant / 1000
        const k = 1 - Math.exp(-dt / tau)
        this.currentState.x = this.lerp(this.currentState.x, this.targetState.x, k)
        this.currentState.y = this.lerp(this.currentState.y, this.targetState.y, k)
        this.currentState.scale = this.lerp(this.currentState.scale, this.targetState.scale, k)
        break
      }
      case 'damped': {
        // 二阶系统：s̈ + 2ζω₀ṡ + ω₀²s = ω₀²s_target
        // 离散化（ semi-implicit Euler ）
        const zeta = this.dampingRatio
        const omega = this.naturalFrequency
        const omega2 = omega * omega

        // x 轴
        const ax =
          omega2 * (this.targetState.x - this.currentState.x) - 2 * zeta * omega * this.velocity.x
        this.velocity.x += ax * dt
        this.currentState.x += this.velocity.x * dt

        // y 轴
        const ay =
          omega2 * (this.targetState.y - this.currentState.y) - 2 * zeta * omega * this.velocity.y
        this.velocity.y += ay * dt
        this.currentState.y += this.velocity.y * dt

        // scale
        const as =
          omega2 * (this.targetState.scale - this.currentState.scale) -
          2 * zeta * omega * this.velocity.scale
        this.velocity.scale += as * dt
        this.currentState.scale += this.velocity.scale * dt
        break
      }
    }

    this.currentState.scale = this.clampScale(this.currentState.scale)

    // 如果还有明显差异，继续下一帧
    const eps = this.animationMode === 'damped' ? 1e-2 : 1e-4
    const needsMore =
      Math.abs(this.currentState.x - this.targetState.x) > eps ||
      Math.abs(this.currentState.y - this.targetState.y) > eps ||
      Math.abs(this.currentState.scale - this.targetState.scale) > eps ||
      (this.animationMode === 'damped' &&
        (Math.abs(this.velocity.x) > eps ||
          Math.abs(this.velocity.y) > eps ||
          Math.abs(this.velocity.scale) > eps))

    this.updateMatrix()
    this.notify()

    if (needsMore) {
      this.scheduleUpdate()
    } else {
      this.currentState = { ...this.targetState }
      this.velocity = { x: 0, y: 0, scale: 0 }
      this.lastFrameTime = 0
    }
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }

  private notify(): void {
    const state = { ...this.currentState }
    this.callbacks.forEach((cb) => cb(state))
  }
}
