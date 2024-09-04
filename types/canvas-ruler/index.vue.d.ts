import {
  DefineComponent,
  ExtractPropTypes,
  Ref,
  ComponentOptionsMixin,
  PublicProps,
  ComponentProvideOptions
} from 'vue-demi'
declare const _default: DefineComponent<
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
export default _default
