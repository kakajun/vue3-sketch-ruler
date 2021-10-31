import { ExtractPropTypes } from 'vue'
export declare const lineProps: {
  scale: NumberConstructor
  thick: NumberConstructor
  palette: ObjectConstructor
  index: NumberConstructor
  start: NumberConstructor
  vertical: BooleanConstructor
  value: NumberConstructor
  isShowReferLine: BooleanConstructor
}
export declare type LineProps = ExtractPropTypes<typeof lineProps>
