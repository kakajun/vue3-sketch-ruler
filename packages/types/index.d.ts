import { PropType } from 'vue'
import { VarComponent } from './varComponent'

export interface SketchRulerProps {
  scale?: number
  ratio?: number
  thick?: number
  width: number
  height: number
  startX?: number
  startY?: number
  shadow?: ShadowType
  horLineArr?: Array<number>
  verLineArr?: Array<number>
  cornerActive?: boolean
  isShowReferLine?: boolean
  palette: PaletteType
}

export interface PaletteType {
  bgColor: string
  longfgColor: string
  shortfgColor: string
  fontColor: string
  shadowColor: string
  lineColor: string
  borderColor: string
  cornerActiveColor: string
  menu: MenuType
}

export interface MenuType {
  bgColor: string
  dividerColor: string
  listItem: {
    textColor: string
    hoverTextColor: string
    disabledTextColor: string
    bgColor: string
    hoverBgColor: string
  }
}
export interface PaletteType {
  bgColor: string
  longfgColor: string
  shortfgColor: string
  fontColor: string
  shadowColor: string
  lineColor: string
  borderColor: string
  cornerActiveColor: string
  menu: MenuType
}

export interface ShadowType {
  x: number
  y: number
  width: number
  height: number
}

export class SketchRule extends VarComponent {
  $props: SketchRulerProps
}

export class _SketchRuleComponent extends SketchRule {}
