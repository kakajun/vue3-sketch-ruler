let lineIdCounter = 0
let canvasIdCounter = 0

export function generateLineId(): string {
  return `line-${++lineIdCounter}-${Date.now()}`
}

export function generateCanvasId(): string {
  return `canvas-${++canvasIdCounter}-${Date.now()}`
}
