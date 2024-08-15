import { computed, ref } from 'vue'
import type { PaletteType, LineType } from '../index-types'
interface Props {
  palette: PaletteType
  lockLine: boolean
  scale: number
  snapThreshold: number
  snapsObj: LineType
  lines: LineType
  canvasHeight: number
  canvasWidth: number
  rate: number
  index?: number
}
export default function useLine(props: Props, vertical: boolean) {
  const offsetLine = ref(0)
  const startValue = ref(0)
  const actionStyle = computed(() => ({
    backgroundColor: props.palette.hoverBg,
    color: props.palette.hoverColor,
    [vertical ? 'top' : 'left']: `-8px`,
    [vertical ? 'left' : 'top']: `${offsetLine.value + 10}px`
  }))

  const handleMouseMove = ({ offsetX, offsetY }: { offsetX: number; offsetY: number }) => {
    offsetLine.value = vertical ? offsetX : offsetY
  }

  const handleMouseDown = (e: MouseEvent, propValue?: number) => {
    return new Promise<void>((resolve) => {
      if (props.lockLine) return
      const startPosition = vertical ? e.clientY : e.clientX
      const initialValue = propValue || startValue.value
      let tempStartValue = initialValue
      const moveHandler = (e: MouseEvent) => {
        const currentPosition = vertical ? e.clientY : e.clientX
        const delta = (currentPosition - startPosition) / props.scale
        let nextPos = delta + initialValue
        let guidePos = nextPos
        const snaps = vertical ? props.snapsObj.h : props.snapsObj.v
        const guideSnaps = snaps!.slice().sort((a: number, b: number) => {
          return Math.abs(guidePos - a) - Math.abs(guidePos - b)
        })
        // 吸附效果跟scale有关, 缩放后吸附效果会变差,所以要除props.scale
        if (
          guideSnaps.length &&
          Math.abs(guideSnaps[0] - nextPos) < props.snapThreshold / props.scale
        ) {
          guidePos = guideSnaps[0]
          nextPos = guidePos
        }
        tempStartValue = Math.round(nextPos)
        startValue.value = tempStartValue
      }
      const mouseUpHandler = () => {
        document.removeEventListener('mousemove', moveHandler)
        handleLineRelease(tempStartValue, props.index)
        resolve()
      }
      document.addEventListener('mousemove', moveHandler)
      document.addEventListener('mouseup', mouseUpHandler, { once: true })
    })
  }

  /**
   * @description: 放开线条处理
   * @param {*} value  距离边框的位置
   * @param {*} index  选的哪条线
   */
  const handleLineRelease = (value: number, index?: number) => {
    const linesArrs = vertical ? props.lines?.h : props.lines?.v
    const isOutOfRange = checkBoundary(value)
    if (!linesArrs) {
      return
    }
    if (isOutOfRange) {
      if (typeof index === 'number') {
        linesArrs.splice(index, 1)
      } else {
        return // 新增越界,什么也不做
      }
    }
    if (typeof index !== 'number') {
      linesArrs.push(value)
    }
  }

  /**
   * @desc:检查越界
   * @param {number} value
   */
  const checkBoundary = (value: number) => {
    const maxOffset = vertical ? props.canvasHeight : props.canvasWidth
    return value < 0 || value > maxOffset
  }

  const labelContent = computed(() => {
    if (checkBoundary(startValue.value)) return '放开删除'
    return `${vertical ? 'Y' : 'X'}：${startValue.value * props.rate}`
  })

  return {
    startValue,
    actionStyle,
    labelContent,
    handleMouseMove,
    handleMouseDown
  }
}
