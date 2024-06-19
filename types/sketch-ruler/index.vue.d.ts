import { PaletteType, ShadowType, lineType } from '../index-types'
import {
  DefineComponent,
  PropType,
  Ref,
  ComputedRef,
  ComponentOptionsMixin,
  PublicProps,
  ExtractPropTypes
} from 'vue-demi'
declare const _default: DefineComponent<
  {
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
  },
  {
    showReferLine: Ref<boolean>
    paletteCpu: ComputedRef<{
      [key: string]: any
    }>
    cornerStyle: ComputedRef<{
      backgroundImage: string
      width: string
      height: string
      borderRight: string
      borderBottom: string
    }>
    onCornerClick: (e: MouseEvent) => void
  },
  unknown,
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  'onCornerClick'[],
  'onCornerClick',
  PublicProps,
  Readonly<
    ExtractPropTypes<{
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
    }>
  > & {
    onOnCornerClick?: ((...args: any[]) => any) | undefined
  },
  {
    scale: number
    width: number
    height: number
    startNumX: number
    endNumX: number
    startNumY: number
    endNumY: number
    thick: number
    isShowReferLine: boolean
    lines: lineType
    startY: number
    shadow: ShadowType
  },
  {}
>
export default _default
