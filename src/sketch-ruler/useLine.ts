import { computed, ref } from 'vue'

export default function useLine(props, vertical: boolean) {
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

  function handleMouseDown(e: MouseEvent) {
    const startPosition = vertical ? e.clientY : e.clientX
    const initialValue = startValue.value
    debugger

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
      },
      { once: true }
    )
  }

  /**
   * @description:
   * @param {*} value  距离边框的位置
   * @param {*} index  选的哪条线
   */
  const handleLineRelease = (value: number, index?: number) => {
    debugger
    // 左右或上下超出时, 删除该条对齐线
    console.log(value, 'gap')
    console.log(index, 'indexindex')
    const num = (props.startOther - props.thick + value) / props.scale
    const maxOffset = props.vertical ? props.endNumX : props.endNumY
    if (num < 0 || num > maxOffset) {
      // 新增如果超出范围那么什么也不做
      if (index) {
        handleLineRemove(index)
      }
    }
    if (isNaN(index)) {
      props.vertical ? props.lines.v.push(value) : props.lines.h.push(value)
    }
  }

  const labelContent = computed(() => {
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
