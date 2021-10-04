import SketchRule from './sketchRuler/sketchRuler.vue'
import { version } from '../package.json'
import type { App } from 'vue'
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

export function install(app: App) {
  app.component(SketchRule.name, SketchRule)
}

export interface SketchRulerOptions {
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
  palette?: PaletteType
}
const plugin = {
  version,
  install
}

export { SketchRule }
export default plugin
