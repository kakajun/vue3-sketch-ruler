import {
  DefineComponent,
  Ref,
  ComputedRef,
  ComponentOptionsMixin,
  PublicProps,
  ExtractPropTypes
} from 'vue-demi'
declare const _default: DefineComponent<
  {
    scale: NumberConstructor
    thick: NumberConstructor
    palette: ObjectConstructor
    index: NumberConstructor
    start: NumberConstructor
    vertical: BooleanConstructor
    value: NumberConstructor
    isShowReferLine: BooleanConstructor
  },
  {
    startValue: Ref<number>
    showLine: Ref<boolean>
    offset: ComputedRef<
      | {
          top: string
          left?: undefined
        }
      | {
          left: string
          top?: undefined
        }
    >
    borderCursor: ComputedRef<
      | {
          borderTop: string
          borderLeft?: undefined
          cursor: string
        }
      | {
          borderLeft: string
          borderTop?: undefined
          cursor: string
        }
    >
    actionStyle: ComputedRef<
      | {
          left: string
          top?: undefined
        }
      | {
          top: string
          left?: undefined
        }
    >
    handleDown: (e: MouseEvent) => void
    handleRemove: () => void
  },
  unknown,
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  ('onMouseDown' | 'onRelease' | 'onRemove')[],
  'onMouseDown' | 'onRelease' | 'onRemove',
  PublicProps,
  Readonly<
    ExtractPropTypes<{
      scale: NumberConstructor
      thick: NumberConstructor
      palette: ObjectConstructor
      index: NumberConstructor
      start: NumberConstructor
      vertical: BooleanConstructor
      value: NumberConstructor
      isShowReferLine: BooleanConstructor
    }>
  > & {
    onOnMouseDown?: ((...args: any[]) => any) | undefined
    onOnRelease?: ((...args: any[]) => any) | undefined
    onOnRemove?: ((...args: any[]) => any) | undefined
  },
  {
    vertical: boolean
    isShowReferLine: boolean
  },
  {}
>
export default _default
