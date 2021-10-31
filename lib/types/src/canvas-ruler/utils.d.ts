declare const drawCavaseRuler: (
  ctx: CanvasRenderingContext2D,
  start: number,
  selectStart: number,
  selectLength: number,
  options: {
    scale: number
    width: number
    height: number
    palette: any
  },
  h?: boolean | undefined
) => void
export default drawCavaseRuler
