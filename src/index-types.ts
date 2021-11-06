import { PropType, ExtractPropTypes } from 'vue'
export interface PaletteType {
  bgColor?: string
  longfgColor?: string
  shortfgColor?: string
  fontColor?: string
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
/*
TODO 本来Provide需要重新定义一下,不能用SketchRulerProps粗暴的就规范了
因为palette对象merge后每个都有值
 */
export interface RulerProvide {
  isShowReferLine: {
    type: Boolean
    default: true
  }
}
interface lineType {
  h?: Array<number>
  v?: Array<number>
}
export const sketchRulerProps = {
  scale: {
    type: Number,

    default: 1
  },
  ratio: {
    type: Number,
    default: 1
  },
  thick: {
    type: Number,
    default: 16
  },
  palette: Object as PropType<PaletteType>,
  startX: {
    type: Number,
    default: 0
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

  lines: {
    type: Object as PropType<lineType>,
    default: () => {
      return {
        h: [],
        v: []
      }
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

export const sketchRulerWrapperProps = {
  ratio: {
    type: Number,
    default: 1
  },
  screenWidth: {
    type: Number,
    default: 1440
  },
  screenHeight: {
    type: Number,
    default: 1000
  },
  thick: {
    type: Number,
    default: 16
  },
  palette: Object as PropType<PaletteType>,
  lines: {
    type: Object as PropType<lineType>,
    default: () => {
      return {
        h: [],
        v: []
      }
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
export type SketchRulerWrapperProps = ExtractPropTypes<
  typeof sketchRulerWrapperProps
>
