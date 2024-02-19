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
export interface lineType {
  h?: Array<number>
  v?: Array<number>
}
export declare const sketchRulerProps: {
  eyeIcon: {
    type: StringConstructor
  }
  closeEyeIcon: {
    type: StringConstructor
  }
  scale: {
    type: NumberConstructor
    default: number
  }
  ratio: {
    type: NumberConstructor
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
  isShowReferLine: {
    type: BooleanConstructor
    default: boolean
  }
  startNumX: {
    type: NumberConstructor
    default: number
  }
  endNumX: {
    type: NumberConstructor
    default: number
  }
  startNumY: {
    type: NumberConstructor
    default: number
  }
  endNumY: {
    type: NumberConstructor
    default: number
  }
}
