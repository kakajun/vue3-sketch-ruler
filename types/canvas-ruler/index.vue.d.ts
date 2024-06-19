import {
  DefineComponent,
  Ref,
  ComponentOptionsMixin,
  PublicProps,
  ExtractPropTypes
} from 'vue-demi'
declare const _default: DefineComponent<
  {
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
  },
  {
    handle: (e: MouseEvent, key: string) => void
    canvas: Ref<HTMLCanvasElement | null>
  },
  unknown,
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  ('onAddLine' | 'update:showIndicator' | 'update:valueNum')[],
  'onAddLine' | 'update:showIndicator' | 'update:valueNum',
  PublicProps,
  Readonly<
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
    }>
  > & {
    onOnAddLine?: ((...args: any[]) => any) | undefined
    'onUpdate:showIndicator'?: ((...args: any[]) => any) | undefined
    'onUpdate:valueNum'?: ((...args: any[]) => any) | undefined
  },
  {
    showIndicator: boolean
    vertical: boolean
  },
  {}
>
export default _default
