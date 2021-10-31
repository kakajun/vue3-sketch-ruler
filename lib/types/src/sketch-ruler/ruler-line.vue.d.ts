import type {
  DefineComponent,
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
  VNodeProps & AllowedComponentProps & ComponentCustomProps,
  Readonly<
    {
      scale?: unknown
      thick?: unknown
      palette?: unknown
      index?: unknown
      start?: unknown
      vertical?: unknown
      value?: unknown
      isShowReferLine?: unknown
    } & {
      isShowReferLine: boolean
      vertical: boolean
    } & {
      scale?: number | undefined
      thick?: number | undefined
      palette?: Record<string, any> | undefined
      start?: number | undefined
      index?: number | undefined
      value?: number | undefined
    }
  > & {
    onOnMouseDown?: ((...args: any[]) => any) | undefined
    onOnRelease?: ((...args: any[]) => any) | undefined
    onOnRemove?: ((...args: any[]) => any) | undefined
  },
  {
    isShowReferLine: boolean
    vertical: boolean
  }
>
export default _default
