import { PropType } from 'vue'
export interface PaletteType {
  bgColor?: string
  longfgColor?: string
  fontColor?: string
  shadowColor?: string
  lineColor?: string
  lineType?: string
  lockLineColor?: string
  hoverColor?: string
  hoverBg?: string
  borderColor?: string
}

export interface FinalPaletteType {
  bgColor: string
  longfgColor: string
  fontColor: string
  shadowColor: string
  lineColor: string
  lineType: string
  lockLineColor: string
  hoverColor: string
  hoverBg: string
  borderColor: string
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
  showRuler: {
    type: Boolean,
    default: true
  },
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
  rate: {
    type: Number,
    default: 1
  },
  thick: {
    type: Number,
    default: 16
  },
  palette: Object as PropType<PaletteType>,
  width: {
    type: Number,
    default: 1400
  },
  height: {
    type: Number,
    default: 800
  },
  paddingRatio: {
    type: Number,
    default: 0.2 // 外框的0.2的宽度
  },
  autoCenter: {
    type: Boolean,
    default: true
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
  snapsObj: {
    type: Object as PropType<lineType>,
    default: () => {
      return {
        h: [],
        v: []
      }
    }
  },
  snapThreshold: {
    type: Number,
    default: 5
  },
  gridRatio: {
    type: Number,
    default: 1
  },
  lockLine: {
    type: Boolean,
    default: false
  },
  selfHandle: {
    type: Boolean,
    default: false
  },
  panzoomOption: {
    type: Object,
    default: () => {}
  }
}
