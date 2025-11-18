function constrainXY(
  toX: number | string,
  toY: number | string,
  toScale: number,
  panOptions?: PanOptions
) {
  const opts = { ...options, ...panOptions }
  const result = { x, y, opts }
  if (
    !opts.force &&
    (opts.disablePan || (opts.panOnlyWhenZoomed && scale === opts.startScale))
  ) {
    return result
  }
  toX = parseFloat(toX as string)
  toY = parseFloat(toY as string)

  if (!opts.disableXAxis) {
    result.x = (opts.relative ? x : 0) + toX
  }

  if (!opts.disableYAxis) {
    result.y = (opts.relative ? y : 0) + toY
  }

  if (opts.contain) {
    const dims = getDimensions(elem)
    const realWidth = dims.elem.width
    const realHeight = dims.elem.height
    const scaledWidth = realWidth * toScale
    const scaledHeight = realHeight * toScale
    const diffHorizontal = (scaledWidth - realWidth) / 2
    const diffVertical = (scaledHeight - realHeight) / 2

    if (opts.contain === 'inside') {
      const minX =
        (diffHorizontal) /
        toScale
      const maxX =
        (dims.parent.width -
          scaledWidth -
          diffHorizontal) /
        toScale
      result.x = Math.max(Math.min(result.x, maxX), minX)
      const minY =
        (diffVertical) /
        toScale
      const maxY =
        (dims.parent.height -
          scaledHeight -
          diffVertical) /
        toScale
      result.y = Math.max(Math.min(result.y, maxY), minY)
    } else if (opts.contain === 'outside') {
      const minX =
        (-(scaledWidth - dims.parent.width) +
          diffHorizontal) /
        toScale
      const maxX = (diffHorizontal) / toScale
      result.x = Math.max(Math.min(result.x, maxX), minX)
      const minY =
        (-(scaledHeight - dims.parent.height) +
          diffVertical) /
        toScale
      const maxY = (diffVertical) / toScale
      result.y = Math.max(Math.min(result.y, maxY), minY)
    }
  }

  if (opts.roundPixels) {
    result.x = Math.round(result.x)
    result.y = Math.round(result.y)
  }

  return result
}
