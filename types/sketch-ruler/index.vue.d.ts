import { PaletteType, ShadowType, lineType } from '../index-types'
import {
  DefineComponent,
  ExtractPropTypes,
  PropType,
  Ref,
  ComputedRef,
  ComponentOptionsMixin,
  PublicProps,
  ComponentProvideOptions
} from 'vue-demi'
declare const _default: DefineComponent<
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
  }>,
  {
    showReferLine: Ref<boolean, boolean>
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
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  'onCornerClick'[],
  'onCornerClick',
  PublicProps,
  Readonly<
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
    } & {
      ratio?: number | undefined
      palette?: PaletteType | undefined
      eyeIcon?: string | undefined
      closeEyeIcon?: string | undefined
      startX?: number | undefined
    } & {
      onOnCornerClick?: ((...args: any[]) => any) | undefined
    }
  >,
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
  {},
  {
    RulerWrapper: DefineComponent<
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
      }>,
      {
        showIndicator: Ref<boolean, boolean>
        valueNum: Ref<number, number>
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
      {},
      {},
      {},
      ComponentOptionsMixin,
      ComponentOptionsMixin,
      {},
      string,
      PublicProps,
      Readonly<
        {
          width: number
          height: number
          vertical: boolean
          start: number
          isShowReferLine: boolean
          lines: number[]
        } & {
          scale?: number | undefined
          ratio?: number | undefined
          palette?: Record<string, any> | undefined
          selectStart?: number | undefined
          selectLength?: number | undefined
          startNumX?: number | undefined
          endNumX?: number | undefined
          startNumY?: number | undefined
          endNumY?: number | undefined
          thick?: number | undefined
        } & {}
      >,
      {
        width: number
        height: number
        vertical: boolean
        start: number
        isShowReferLine: boolean
        lines: number[]
      },
      {},
      {
        CanvasRuler: DefineComponent<
          ExtractPropTypes<{
            showIndicator: BooleanConstructor
            valueNum: NumberConstructor
            scale: NumberConstructor
            ratio: NumberConstructor
            palette: ObjectConstructor
            vertical: BooleanConstructor
            start: NumberConstructor
            width: NumberConstructor
            height: NumberConstructor
            selectStart: NumberConstructor
            selectLength: NumberConstructor
            startNumX: NumberConstructor
            endNumX: NumberConstructor
            startNumY: NumberConstructor
            endNumY: NumberConstructor
          }>,
          {
            handle: (e: MouseEvent, key: string) => void
            canvas: Ref<HTMLCanvasElement | null, HTMLCanvasElement | null>
          },
          {},
          {},
          {},
          ComponentOptionsMixin,
          ComponentOptionsMixin,
          ('onAddLine' | 'update:showIndicator' | 'update:valueNum')[],
          'onAddLine' | 'update:showIndicator' | 'update:valueNum',
          PublicProps,
          Readonly<
            {
              showIndicator: boolean
              vertical: boolean
            } & {
              scale?: number | undefined
              width?: number | undefined
              height?: number | undefined
              ratio?: number | undefined
              palette?: Record<string, any> | undefined
              valueNum?: number | undefined
              start?: number | undefined
              selectStart?: number | undefined
              selectLength?: number | undefined
              startNumX?: number | undefined
              endNumX?: number | undefined
              startNumY?: number | undefined
              endNumY?: number | undefined
            } & {
              onOnAddLine?: ((...args: any[]) => any) | undefined
              'onUpdate:showIndicator'?: ((...args: any[]) => any) | undefined
              'onUpdate:valueNum'?: ((...args: any[]) => any) | undefined
            }
          >,
          {
            showIndicator: boolean
            vertical: boolean
          },
          {},
          {},
          {},
          string,
          ComponentProvideOptions,
          true,
          {}
        >
        RulerLine: DefineComponent<
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
      },
      {},
      string,
      ComponentProvideOptions,
      true,
      {}
    >
  },
  {},
  string,
  ComponentProvideOptions,
  true,
  {}
>
export default _default
