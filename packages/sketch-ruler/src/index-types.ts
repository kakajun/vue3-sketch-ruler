import type { PanzoomOptions } from 'simple-panzoom'

export interface PaletteType {
  bgColor?: string
  longfgColor?: string
  fontColor?: string
  fontShadowColor?: string
  shadowColor?: string
  lineColor?: string
  lineType?: string
  lockLineColor?: string
  borderColor?: string
  hoverBg?: string
  hoverColor?: string
  cornerActiveColor?: string
}

export interface FinalPaletteType {
  bgColor: string
  longfgColor: string
  fontColor: string
  fontShadowColor: string
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
export interface LineType {
  h: number[]
  v: number[]
}
export interface SketchRulerProps {
  showRuler?: boolean
  eyeIcon?: string
  closeEyeIcon?: string
  scale?: number
  rate?: number
  thick?: number
  palette?: PaletteType
  width?: number
  height?: number
  paddingRatio?: number
  autoCenter?: boolean
  shadow?: ShadowType
  lines?: LineType
  isShowReferLine?: boolean
  canvasWidth?: number
  canvasHeight?: number
  snapsObj?: LineType
  snapThreshold?: number
  gridRatio?: number
  lockLine?: boolean
  selfHandle?: boolean
  showShadowText?: boolean
  panzoomOption?: PanzoomOptions
}
