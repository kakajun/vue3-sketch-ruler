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
export declare const sketchRulerProps: {
  scale: {
    type: NumberConstructor
    default: number
  }
  ratio: {
    type: NumberConstructor
    default: number
  }
  thick: {
    type: NumberConstructor
    default: number
  }
  palette: PropType<PaletteType>
  startX: {
    type: NumberConstructor
  }
  startY: {
    type: NumberConstructor
    default: number
  }
  width: {
    type: NumberConstructor
    default: number
  }
  height: {
    type: NumberConstructor
    default: number
  }
  shadow: {
    type: PropType<ShadowType>
    default: () => {
      x: number
      y: number
      width: number
      height: number
    }
  }
  lines: {
    type: PropType<lineType>
    default: () => {
      h: never[]
      v: never[]
    }
  }
  cornerActive: {
    type: BooleanConstructor
    default: boolean
  }
  isShowReferLine: {
    type: BooleanConstructor
    default: boolean
  }
}
export declare type SketchRulerProps = ExtractPropTypes<typeof sketchRulerProps>
export {}
