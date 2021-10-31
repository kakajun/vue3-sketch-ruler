import type {
  DefineComponent,
  Ref,
  ComponentOptionsMixin,
  VNodeProps,
  AllowedComponentProps,
  ComponentCustomProps
} from 'vue'
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
  },
  {
    handle: (e: MouseEvent, key: string) => void
    state: {
      canvasContext: {
        readonly canvas: HTMLCanvasElement
        globalAlpha: number
        globalCompositeOperation: string
        drawImage: {
          (image: CanvasImageSource, dx: number, dy: number): void
          (
            image: CanvasImageSource,
            dx: number,
            dy: number,
            dw: number,
            dh: number
          ): void
          (
            image: CanvasImageSource,
            sx: number,
            sy: number,
            sw: number,
            sh: number,
            dx: number,
            dy: number,
            dw: number,
            dh: number
          ): void
        }
        beginPath: () => void
        clip: {
          (fillRule?: CanvasFillRule | undefined): void
          (path: Path2D, fillRule?: CanvasFillRule | undefined): void
        }
        fill: {
          (fillRule?: CanvasFillRule | undefined): void
          (path: Path2D, fillRule?: CanvasFillRule | undefined): void
        }
        isPointInPath: {
          (x: number, y: number, fillRule?: CanvasFillRule | undefined): boolean
          (
            path: Path2D,
            x: number,
            y: number,
            fillRule?: CanvasFillRule | undefined
          ): boolean
        }
        isPointInStroke: {
          (x: number, y: number): boolean
          (path: Path2D, x: number, y: number): boolean
        }
        stroke: {
          (): void
          (path: Path2D): void
        }
        fillStyle:
          | string
          | {
              addColorStop: (offset: number, color: string) => void
            }
          | {
              setTransform: (transform?: DOMMatrix2DInit | undefined) => void
            }
        strokeStyle:
          | string
          | {
              addColorStop: (offset: number, color: string) => void
            }
          | {
              setTransform: (transform?: DOMMatrix2DInit | undefined) => void
            }
        createLinearGradient: (
          x0: number,
          y0: number,
          x1: number,
          y1: number
        ) => CanvasGradient
        createPattern: (
          image: CanvasImageSource,
          repetition: string | null
        ) => CanvasPattern | null
        createRadialGradient: (
          x0: number,
          y0: number,
          r0: number,
          x1: number,
          y1: number,
          r1: number
        ) => CanvasGradient
        filter: string
        createImageData: {
          (sw: number, sh: number): ImageData
          (imagedata: ImageData): ImageData
        }
        getImageData: (
          sx: number,
          sy: number,
          sw: number,
          sh: number
        ) => ImageData
        putImageData: {
          (imagedata: ImageData, dx: number, dy: number): void
          (
            imagedata: ImageData,
            dx: number,
            dy: number,
            dirtyX: number,
            dirtyY: number,
            dirtyWidth: number,
            dirtyHeight: number
          ): void
        }
        imageSmoothingEnabled: boolean
        imageSmoothingQuality: ImageSmoothingQuality
        arc: (
          x: number,
          y: number,
          radius: number,
          startAngle: number,
          endAngle: number,
          anticlockwise?: boolean | undefined
        ) => void
        arcTo: (
          x1: number,
          y1: number,
          x2: number,
          y2: number,
          radius: number
        ) => void
        bezierCurveTo: (
          cp1x: number,
          cp1y: number,
          cp2x: number,
          cp2y: number,
          x: number,
          y: number
        ) => void
        closePath: () => void
        ellipse: (
          x: number,
          y: number,
          radiusX: number,
          radiusY: number,
          rotation: number,
          startAngle: number,
          endAngle: number,
          anticlockwise?: boolean | undefined
        ) => void
        lineTo: (x: number, y: number) => void
        moveTo: (x: number, y: number) => void
        quadraticCurveTo: (
          cpx: number,
          cpy: number,
          x: number,
          y: number
        ) => void
        rect: (x: number, y: number, w: number, h: number) => void
        lineCap: CanvasLineCap
        lineDashOffset: number
        lineJoin: CanvasLineJoin
        lineWidth: number
        miterLimit: number
        getLineDash: () => number[]
        setLineDash: (segments: number[]) => void
        clearRect: (x: number, y: number, w: number, h: number) => void
        fillRect: (x: number, y: number, w: number, h: number) => void
        strokeRect: (x: number, y: number, w: number, h: number) => void
        shadowBlur: number
        shadowColor: string
        shadowOffsetX: number
        shadowOffsetY: number
        restore: () => void
        save: () => void
        fillText: (
          text: string,
          x: number,
          y: number,
          maxWidth?: number | undefined
        ) => void
        measureText: (text: string) => TextMetrics
        strokeText: (
          text: string,
          x: number,
          y: number,
          maxWidth?: number | undefined
        ) => void
        direction: CanvasDirection
        font: string
        textAlign: CanvasTextAlign
        textBaseline: CanvasTextBaseline
        getTransform: () => DOMMatrix
        resetTransform: () => void
        rotate: (angle: number) => void
        scale: (x: number, y: number) => void
        setTransform: {
          (
            a: number,
            b: number,
            c: number,
            d: number,
            e: number,
            f: number
          ): void
          (transform?: DOMMatrix2DInit | undefined): void
        }
        transform: (
          a: number,
          b: number,
          c: number,
          d: number,
          e: number,
          f: number
        ) => void
        translate: (x: number, y: number) => void
        drawFocusIfNeeded: {
          (element: Element): void
          (path: Path2D, element: Element): void
        }
        scrollPathIntoView: {
          (): void
          (path: Path2D): void
        }
      } | null
    }
    canvas: Ref<HTMLCanvasElement | null>
    initCanvasRef: () => void
  },
  unknown,
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  ('onAddLine' | 'update:showIndicator' | 'update:valueNum')[],
  'onAddLine' | 'update:showIndicator' | 'update:valueNum',
  VNodeProps & AllowedComponentProps & ComponentCustomProps,
  Readonly<
    {
      showIndicator?: unknown
      valueNum?: unknown
      scale?: unknown
      ratio?: unknown
      palette?: unknown
      vertical?: unknown
      start?: unknown
      width?: unknown
      height?: unknown
      selectStart?: unknown
      selectLength?: unknown
    } & {
      showIndicator: boolean
      vertical: boolean
    } & {
      scale?: number | undefined
      ratio?: number | undefined
      palette?: Record<string, any> | undefined
      width?: number | undefined
      height?: number | undefined
      valueNum?: number | undefined
      start?: number | undefined
      selectStart?: number | undefined
      selectLength?: number | undefined
    }
  > & {
    onOnAddLine?: ((...args: any[]) => any) | undefined
    'onUpdate:showIndicator'?: ((...args: any[]) => any) | undefined
    'onUpdate:valueNum'?: ((...args: any[]) => any) | undefined
  },
  {
    showIndicator: boolean
    vertical: boolean
  }
>
export default _default
