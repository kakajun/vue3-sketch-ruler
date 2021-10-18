import { ExtractPropTypes } from 'vue'
export const lineProps = {
  scale: Number,
  thick: Number,
  palette: Object,
  index: Number,
  start: Number,
  vertical: Boolean,
  value: Number,
  isShowReferLine: Boolean
}
export type LineProps = ExtractPropTypes<typeof lineProps>
