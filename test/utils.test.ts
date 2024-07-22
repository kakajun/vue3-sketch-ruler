import { vi } from 'vitest'
import { createCanvas } from 'canvas'
import { drawCavaseRuler } from '../src/canvas-ruler/utils'

describe('drawCavaseRuler', () => {
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D
  let options: any

  beforeEach(() => {
    canvas = createCanvas(500, 300)
    ctx = canvas.getContext('2d')
    options = {
      scale: 1,
      width: 500,
      height: 300,
      ratio: 1,
      palette: {
        bgColor: '#fff',
        fontColor: '#000',
        shadowColor: '#ccc',
        longfgColor: '#000'
      },
      canvasWidth: 100,
      startNumY: 0,
      canvasHeight: 300
    }
  })

  it('should call clearRect and fillRect methods', () => {
    const spyClearRect = vi.spyOn(ctx, 'clearRect')
    const spyFillRect = vi.spyOn(ctx, 'fillRect')

    drawCavaseRuler(ctx, 0, 0, 0, options)

    expect(spyClearRect).toHaveBeenCalled()
    expect(spyFillRect).toHaveBeenCalled()
  })

  it('should handle horizontal drawing', () => {
    const spyFillRect = vi.spyOn(ctx, 'fillRect')

    drawCavaseRuler(ctx, 0, 0, 0, options, true)

    expect(spyFillRect).toHaveBeenCalled()
  })

  it('should handle vertical drawing', () => {
    const spyFillRect = vi.spyOn(ctx, 'fillRect')

    drawCavaseRuler(ctx, 0, 0, 0, options, false)

    expect(spyFillRect).toHaveBeenCalled()
  })

  it('should handle selection drawing', () => {
    const spyFillRect = vi.spyOn(ctx, 'fillRect')

    drawCavaseRuler(ctx, 0, 50, 100, options)

    expect(spyFillRect).toHaveBeenCalled()
  })
})
