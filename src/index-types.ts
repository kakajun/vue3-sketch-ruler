import { PropType } from 'vue-demi'
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

export interface ShadowType {
  x: number
  y: number
  width: number
  height: number
}
interface lineType {
  h?: Array<number>
  v?: Array<number>
}
export const sketchRulerProps = {
  eyeIcon: {
    type: String
  },
  closeEyeIcon: {
    type: String
  },
  scale: {
    type: Number,
    default: 1
  },
  ratio: {
    type: Number
    // default: window.devicePixelRatio || 1
  },
  thick: {
    type: Number,
    default: 16
  },
  palette: Object as PropType<PaletteType>,
  startX: {
    type: Number
  },
  startY: {
    type: Number,
    default: 0
  },
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 200
  },
  shadow: {
    type: Object as PropType<ShadowType>,
    default: () => {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    }
  },

  lines: {
    type: Object as PropType<lineType>,
    default: () => {
      return {
        h: [],
        v: []
      }
    }
  },
  isShowReferLine: {
    type: Boolean,
    default: true
  }
}
