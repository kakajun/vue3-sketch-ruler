import {
  DefineComponent,
  ExtractPropTypes,
  Ref,
  ComputedRef,
  ComponentOptionsMixin,
  PublicProps,
  ComponentProvideOptions
} from 'vue-demi'
declare const _default: DefineComponent<
  ExtractPropTypes<{
    scale: NumberConstructor
    thick: NumberConstructor
    palette: ObjectConstructor
    index: NumberConstructor
    start: NumberConstructor
    vertical: BooleanConstructor
    value: NumberConstructor
    isShowReferLine: BooleanConstructor
  }>,
  {
    startValue: Ref<number, number>
    showLine: Ref<boolean, boolean>
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
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  ('onMouseDown' | 'onRelease' | 'onRemove')[],
  'onMouseDown' | 'onRelease' | 'onRemove',
  PublicProps,
  Readonly<
    {
      vertical: boolean
      isShowReferLine: boolean
    } & {
      scale?: number | undefined
      palette?: Record<string, any> | undefined
      start?: number | undefined
      thick?: number | undefined
      index?: number | undefined
      value?: number | undefined
    } & {
      onOnMouseDown?: ((...args: any[]) => any) | undefined
      onOnRelease?: ((...args: any[]) => any) | undefined
      onOnRemove?: ((...args: any[]) => any) | undefined
    }
  >,
  {
    vertical: boolean
    isShowReferLine: boolean
  },
  {},
  {},
  {},
  string,
  ComponentProvideOptions,
  true,
  {}
>
export default _default
