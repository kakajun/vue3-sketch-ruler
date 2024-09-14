import { vi } from 'vitest'
import { createCanvas } from 'canvas'
import { drawCanvasRuler, setLast } from '../src/canvas-ruler/utils'

import { describe, it, expect } from 'vitest'

// 创建一个Canvas元素并获取其上下文
function createCanvasContext(width: number = 800, height: number = 600) {
  const canvas = createCanvas(width, height)
  return canvas.getContext('2d') as unknown as CanvasRenderingContext2D
}

// 测试setLast函数
describe('setLast function', () => {
  it('should draw correctly for horizontal orientation', () => {
    const ctx = createCanvasContext()
    const x = 100
    const value = 50
    const width = 800
    const height = 600

    // 调用setLast函数
    setLast(x, value, width, height, ctx, true)

    // 检查路径是否正确
    // 由于canvas库不提供直接检查路径的方法，你可能需要将路径导出为图像或使用其他方法来验证
    // 这里我们假设有一个方法来验证路径，例如 _getPath()
    expect(ctx._getPath()).toEqual([
      ['moveTo', x, 0],
      ['lineTo', x, height],
      ['stroke'],
      ['closePath']
    ])
  })

  it('should draw correctly for vertical orientation', () => {
    const ctx = createCanvasContext()
    const x = 100
    const value = 50
    const width = 800
    const height = 600

    // 调用setLast函数
    setLast(x, value, width, height, ctx, false)

    // 检查路径是否正确
    expect(ctx._getPath()).toEqual([
      ['moveTo', 0, x],
      ['lineTo', width, x],
      ['stroke'],
      ['closePath']
    ])
  })
})

// 扩展CanvasRenderingContext2D以记录路径
interface PathEntry {
  fn: string
  args: any[]
}

interface ExtendedCanvasRenderingContext2D extends CanvasRenderingContext2D {
  _path: PathEntry[]
}

function extendContext(ctx: CanvasRenderingContext2D): ExtendedCanvasRenderingContext2D {
  const extendedCtx = ctx as ExtendedCanvasRenderingContext2D
  extendedCtx._path = []

  const nativeMethods = {
    moveTo: ctx.moveTo,
    lineTo: ctx.lineTo,
    closePath: ctx.closePath,
    stroke: ctx.stroke
  }

  extendedCtx.moveTo = function (...args: any[]) {
    nativeMethods.moveTo.apply(ctx, args)
    extendedCtx._path.push({ fn: 'moveTo', args })
  }

  extendedCtx.lineTo = function (...args: any[]) {
    nativeMethods.lineTo.apply(ctx, args)
    extendedCtx._path.push({ fn: 'lineTo', args })
  }

  extendedCtx.closePath = function () {
    nativeMethods.closePath.call(ctx)
    extendedCtx._path.push({ fn: 'closePath', args: [] })
  }

  extendedCtx.stroke = function () {
    nativeMethods.stroke.call(ctx)
    extendedCtx._path.push({ fn: 'stroke', args: [] })
  }

  return extendedCtx
}

// 替换原有的getContext函数
const originalGetContext = HTMLCanvasElement.prototype.getContext
;(HTMLCanvasElement.prototype as any).getContext = function (contextId: any, ...args: any[]) {
  if (contextId === '2d') {
    const canvas = this as unknown as { width: number; height: number }
    const ctx = originalGetContext.call(this, contextId, ...args) as CanvasRenderingContext2D
    return extendContext(ctx)
  }
  return originalGetContext.call(this, contextId, ...args)
}

// 获取记录的路径
CanvasRenderingContext2D.prototype._getPath = function () {
  return this._path
}
