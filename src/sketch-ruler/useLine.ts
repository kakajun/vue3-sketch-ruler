import { computed, ref } from 'vue'

export default function useLine(props: any, vertical: boolean) {
  const offsetLine = ref(0)
  const startValue = ref(0)

  const actionStyle = computed(() => ({
    backgroundColor: props.palette.hoverBg,
    color: props.palette.hoverColor,
    [vertical ? 'top' : 'left']: `-8px`,
    [vertical ? 'left' : 'top']: `${offsetLine.value + 10}px`
  }))

  const handleMouseMove = (event: { offsetX: number; offsetY: number }) => {
    offsetLine.value = vertical ? event.offsetX : event.offsetY
  }
  const handleMouseDown = (e: MouseEvent) => {
    return new Promise<void>((resolve) => {
      const startPosition = vertical ? e.clientY : e.clientX
      const initialValue = startValue.value
      const moveHandler = (e: MouseEvent) => {
        const currentPosition = vertical ? e.clientY : e.clientX
        const delta = (currentPosition - startPosition) / props.scale
        startValue.value = Math.round(initialValue + delta)
      }

      document.addEventListener('mousemove', moveHandler)
      document.addEventListener(
        'mouseup',
        () => {
          document.removeEventListener('mousemove', moveHandler)
          handleLineRelease(startValue.value, props.index)
          resolve()
        },
        { once: true }
      )
    })
  }

  /**
   * @description: 放开线条处理
   * @param {*} value  距离边框的位置
   * @param {*} index  选的哪条线
   */
  const handleLineRelease = (value: number, index?: number) => {
    const linesArrs = vertical ? props.lines.h : props.lines.v
    const isOutOfRange = checkBoundary(value)
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
    const maxOffset = vertical ? props.endNumY : props.endNumX
    return value < 0 || value > maxOffset
  }

  const labelContent = computed(() => {
    if (checkBoundary(startValue.value)) return '放开删除'
    return `${vertical ? 'Y' : 'X'}：${startValue.value}`
  })

  return {
    startValue,
    actionStyle,
    labelContent,
    handleMouseMove,
    handleMouseDown
  }
}
