import { ExtractPropTypes } from 'vue'
export const lineProps = {
  index: Number,
  start: Number,
  vertical: Boolean,
  value: Number
}
export type LineProps = ExtractPropTypes<typeof lineProps>
