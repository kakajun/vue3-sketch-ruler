import { ExtractPropTypes } from 'vue'
export const canvasProps = {
  showIndicator: Boolean,
  valueNum: Number,
  vertical: Boolean,
  start: Number,
  width: Number,
  height: Number,
  selectStart: Number,
  selectLength: Number
}
export type CanvasProps = ExtractPropTypes<typeof canvasProps>
