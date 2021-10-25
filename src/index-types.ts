import { PropType, ExtractPropTypes } from 'vue'
export interface PaletteType {
  bgColor?: string
  longfgColor?: string
  shortfgColor?: string
  fontColor?: string
  shadowColor?: string
  lineColor?: string
  borderColor?: string
  cornerActiveColor?: string
  menu?: MenuType
}

export interface MenuType {
  bgColor?: string
  dividerColor?: string
  listItem?: {
    textColor?: string
    hoverTextColor?: string
    disabledTextColor?: string
    bgColor?: string
    hoverBgColor?: string
  }
}
interface configType {
  width: number
  height: number
}
export interface ShadowType {
  x: number
  y: number
  width: number
  height: number
}
export const sketchRulerProps = {
  config: Object as PropType<configType>,
  ratio: {
    type: Number,
    default: 1
  },
  thick: {
    type: Number,
    default: 16
  },
  palette: Object as PropType<PaletteType>,
  shadow: Object as PropType<ShadowType>,
  horLineArr: {
    type: Array as PropType<Array<number>>,
    default: () => {
      return [100, 200]
    }
  },
  verLineArr: {
    type: Array as PropType<Array<number>>,
    default: () => {
      return [100, 200]
    }
  },
  cornerActive: {
    type: Boolean,
    default: false
  },

  isShowReferLine: {
    type: Boolean,
    default: true
  }
}
export type SketchRulerProps = ExtractPropTypes<typeof sketchRulerProps>
