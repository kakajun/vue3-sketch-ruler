import type { PropType } from 'vue'
import type { PaletteType } from '../types'

export const props = {
  scale: {
    type: Number,
    default: 1
  },
  ratio: {
    type: Number,
    default: window.devicePixelRatio || 1
  },
  thick: {
    type: Number,
    default: 16
  },
  palette: Object as PropType<PaletteType>
}
