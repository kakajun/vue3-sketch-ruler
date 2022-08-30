import { PropType } from 'vue-demi'
export const wrapperProps = {
  scale: Number,
  ratio: Number,
  thick: Number,
  palette: Object,
  vertical: {
    type: Boolean,
    default: true
  },
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 200
  },
  start: {
    type: Number,
    default: 0
  },
  lines: {
    type: Array as PropType<Array<number>>,
    default: () => []
  },
  selectStart: {
    type: Number
  },
  selectLength: {
    type: Number
  },
  isShowReferLine: {
    type: Boolean
  }
}
