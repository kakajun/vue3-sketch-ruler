import { createCanvas, CanvasRenderingContext2D } from 'canvas'
import { drawCavaseRuler } from '../src/canvas-ruler/utils'
import { describe, expect, test, beforeEach, it } from 'vitest'
describe('drawCavaseRuler', () => {
  let ctx: CanvasRenderingContext2D

  beforeEach(() => {
    const canvas = createCanvas(200, 200)
    ctx = canvas.getContext('2d')
  })

  it('should fill the canvas with the background color', () => {
    const options = {
      scale: 1,
      width: 100,
      height: 100,
      ratio: 1,
      palette: {
        bgColor: 'red',
        fontColor: 'black',
        shadowColor: 'gray',
        longfgColor: 'blue'
      },
      endNumX: 100,
      endNumY: 100
    }

    drawCavaseRuler(ctx, 0, 0, 0, options, true)
    // 在这里，您可以添加一些断言来验证 canvas 的状态
    // 例如，检查背景颜色是否已正确设置
    // 这可能需要一些额外的工作，因为直接验证 canvas 的像素可能比较复杂
  })

  // 添加更多的测试用例来验证其他行为，如刻度线绘制、文本位置等
})
