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
    scale: NumberConstructor
    ratio: NumberConstructor
    thick: NumberConstructor
    startNumX: NumberConstructor
    endNumX: NumberConstructor
    startNumY: NumberConstructor
    endNumY: NumberConstructor
    palette: ObjectConstructor
    vertical: {
      type: BooleanConstructor
      default: boolean
    }
    width: {
      type: NumberConstructor
      default: number
    }
    height: {
      type: NumberConstructor
      default: number
    }
    start: {
      type: NumberConstructor
      default: number
    }
    lines: {
      type: PropType<number[]>
      default: () => never[]
    }
    selectStart: {
      type: NumberConstructor
    }
    selectLength: {
      type: NumberConstructor
    }
    isShowReferLine: {
      type: BooleanConstructor
    }
  },
  {
    showIndicator: Ref<boolean>
    valueNum: Ref<number>
    rwClassName: ComputedRef<'v-container' | 'h-container'>
    rwStyle: ComputedRef<
      | {
          width: string
          height: string
          top: string
        }
      | {
          width: string
          height: string
          left: string
        }
    >
    indicatorStyle: ComputedRef<{
      [x: string]: string
    }>
    handleNewLine: (value: number) => void
    handleLineRelease: (value: number, index: number) => void
    handleLineRemove: (index: any) => void
  },
  unknown,
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  {},
  string,
  PublicProps,
  Readonly<
    ExtractPropTypes<{
      scale: NumberConstructor
      ratio: NumberConstructor
      thick: NumberConstructor
      startNumX: NumberConstructor
      endNumX: NumberConstructor
      startNumY: NumberConstructor
      endNumY: NumberConstructor
      palette: ObjectConstructor
      vertical: {
        type: BooleanConstructor
        default: boolean
      }
      width: {
        type: NumberConstructor
        default: number
      }
      height: {
        type: NumberConstructor
        default: number
      }
      start: {
        type: NumberConstructor
        default: number
      }
      lines: {
        type: PropType<number[]>
        default: () => never[]
      }
      selectStart: {
        type: NumberConstructor
      }
      selectLength: {
        type: NumberConstructor
      }
      isShowReferLine: {
        type: BooleanConstructor
      }
    }>
  >,
  {
    width: number
    height: number
    vertical: boolean
    start: number
    isShowReferLine: boolean
    lines: number[]
  },
  {}
>
export default _default
