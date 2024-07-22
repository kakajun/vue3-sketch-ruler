import { PropType } from 'vue'
export interface PaletteType {
  bgColor?: string
  longfgColor?: string
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
export interface lineType {
  h: Array<number>
  v: Array<number>
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
    default: 1400
  },
  height: {
    type: Number,
    default: 800
  },
  innerPadding: {
    type: Number,
    default: 60
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
  },
  canvasWidth: {
    type: Number,
    default: 1000
  },
  canvasHeight: {
    type: Number,
    default: 700
  },
  panzoomOption: Object
}
