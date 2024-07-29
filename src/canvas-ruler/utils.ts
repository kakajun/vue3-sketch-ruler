// 标尺中每小格代表的宽度(根据scale的不同实时变化)
const getGridSize = (scale: number) => {
  if (scale <= 0.25) return 40
  if (scale <= 0.5) return 20
  if (scale <= 1) return 10
  if (scale <= 2) return 5
  if (scale <= 4) return 2
  return 1
}

const FONT_SCALE = 0.83 // 10 / 12
export const drawCavaseRuler = (
  ctx: CanvasRenderingContext2D,
  start: number,
  selectStart: number,
  selectLength: number,
  options: {
    scale: number
    width: number
    height: number
    ratio: number
    gridRatio: number
    palette: any
    canvasWidth: number
    canvasHeight: number
  },
  isHorizontal?: boolean //横向为true,纵向缺省
) => {
  const { scale, width, height, ratio, palette, gridRatio } = options
  const { bgColor, fontColor, shadowColor, longfgColor } = palette
  const endNum = isHorizontal ? options.canvasWidth : options.canvasHeight
  // 缩放ctx, 以简化计算
  ctx.scale(ratio, ratio)
  ctx.clearRect(0, 0, width / ratio, height / ratio)

  // 1. 画标尺底色
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)

  const gridSize = getGridSize(scale) * gridRatio // 每小格表示的宽度
  const gridSize10 = gridSize * 10 // 每大格表示的宽度
  const gridPixel10 = gridSize10 * scale
  const startValue10 = Math.floor(start / gridSize10) * gridSize10
  const offsetX10 = ((startValue10 - start) / gridSize10) * gridPixel10 // 长间隔起点刻度距离ctx原点(start)的px距离
  const endValue = start + Math.ceil((isHorizontal ? width : height) / scale) // 终点刻度
  // 2. 画阴影
  if (selectLength) {
    const shadowX = (selectStart - start) * scale // 阴影起点坐标
    const shadowWidth = selectLength * scale // 阴影宽度
    ctx.fillStyle = shadowColor

    isHorizontal
      ? ctx.fillRect(shadowX, 0, shadowWidth, height)
      : ctx.fillRect(0, shadowX, width, shadowWidth)
  }
  // 3. 画刻度和文字(因为刻度遮住了阴影)
  ctx.beginPath()
  ctx.fillStyle = fontColor
  ctx.strokeStyle = longfgColor

  // 绘制长间隔和文字
  for (let value = startValue10, count = 0; value < endValue; value += gridSize10, count++) {
    const x = offsetX10 + count * gridPixel10 + 0.5 // prevent canvas 1px line blurry
    if ((value - gridSize10 < endNum && value > endNum) || value == endNum) {
      // 如果尾数画最后一个刻度
      const xl = offsetX10 + count * gridPixel10 + 0.5 + (endNum - value) * scale
      setLast(xl, endNum)
      return
    }

    if (value >= 0 && value <= endNum) {
      if (value == 0) {
        isHorizontal ? ctx.moveTo(x, 0) : ctx.moveTo(0, x)
      } else {
        isHorizontal ? ctx.moveTo(x, 20) : ctx.moveTo(20, x)
      }

      ctx.save()
      // 影响文字位置
      if (value == 0) {
        isHorizontal ? ctx.translate(x - 15, height * 0.2) : ctx.translate(width * 0.3, x - 5)
      } else {
        isHorizontal ? ctx.translate(x - 12, height * 0.05) : ctx.translate(width * 0.05, x + 12)
      }

      if (!isHorizontal) {
        ctx.rotate(-Math.PI / 2) // 旋转 -90 度
      }
      ctx.scale(FONT_SCALE / ratio, FONT_SCALE / ratio)
      ctx.fillText(value.toString(), 4 * ratio, 7 * ratio)
      ctx.restore()
      // 影响刻度位置
      if (value == 0) {
        isHorizontal ? ctx.lineTo(x, height) : ctx.lineTo(width, x)
      } else {
        isHorizontal ? ctx.lineTo(x, (height * 10) / 16) : ctx.lineTo((width * 10) / 16, x)
      }
    }
    ctx.stroke()
    ctx.closePath()
    // 恢复ctx matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  function setLast(x: number, value: number) {
    isHorizontal ? ctx.moveTo(x, 0) : ctx.moveTo(0, x)
    ctx.save()

    isHorizontal ? ctx.translate(x + 5, height * 0.2) : ctx.translate(width * 0.1, x + 32)
    if (!isHorizontal) {
      ctx.rotate(-Math.PI / 2) // 旋转 -90 度
    }
    ctx.scale(FONT_SCALE / ratio, FONT_SCALE / ratio)
    ctx.fillText(Math.round(value).toString(), 4 * ratio, 7 * ratio)
    ctx.restore()
    isHorizontal ? ctx.lineTo(x, height) : ctx.lineTo(width, x)
    ctx.stroke()
    ctx.closePath()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
}

export function debounce(func: () => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func()
    }, wait)
  }
}

export function merge(obj: { [key: string]: any }, o: { [key: string]: any }) {
  Object.keys(obj).forEach((key) => {
    if (key && obj.hasOwnProperty(key)) {
      if (typeof o[key] === 'object') {
        obj[key] = merge(obj[key], o[key])
      } else if (o.hasOwnProperty(key)) {
        obj[key] = o[key]
      }
    }
  })
  return obj
}
