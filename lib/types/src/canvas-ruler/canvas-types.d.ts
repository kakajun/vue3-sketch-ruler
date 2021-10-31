import { ExtractPropTypes } from 'vue'
export declare const canvasProps: {
  showIndicator: BooleanConstructor
  valueNum: NumberConstructor
  scale: NumberConstructor
  ratio: NumberConstructor
  palette: ObjectConstructor
  vertical: BooleanConstructor
  start: NumberConstructor
  width: NumberConstructor
  height: NumberConstructor
  selectStart: NumberConstructor
  selectLength: NumberConstructor
}
export declare type CanvasProps = ExtractPropTypes<typeof canvasProps>
