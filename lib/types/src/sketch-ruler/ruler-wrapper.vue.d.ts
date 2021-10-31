import type {
  DefineComponent,
  PropType,
  Ref,
  ComputedRef,
  ComponentOptionsMixin,
  VNodeProps,
  AllowedComponentProps,
  ComponentCustomProps
} from 'vue'
declare const _default: DefineComponent<
  {
    scale: NumberConstructor
    ratio: NumberConstructor
    thick: NumberConstructor
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
  Record<string, any>,
  string,
  VNodeProps & AllowedComponentProps & ComponentCustomProps,
  Readonly<
    {
      scale?: unknown
      ratio?: unknown
      thick?: unknown
      palette?: unknown
      vertical?: unknown
      width?: unknown
      height?: unknown
      start?: unknown
      lines?: unknown
      selectStart?: unknown
      selectLength?: unknown
      isShowReferLine?: unknown
    } & {
      width: number
      height: number
      lines: number[]
      isShowReferLine: boolean
      vertical: boolean
      start: number
    } & {
      scale?: number | undefined
      ratio?: number | undefined
      thick?: number | undefined
      palette?: Record<string, any> | undefined
      selectStart?: number | undefined
      selectLength?: number | undefined
    }
  >,
  {
    width: number
    height: number
    lines: number[]
    isShowReferLine: boolean
    vertical: boolean
    start: number
  }
>
export default _default
