import { describe, it, expect } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useSketchRuler } from '../src/composables/useSketchRuler'

const TestComp = defineComponent({
  props: ['options'],
  setup(props) {
    const result = useSketchRuler(props.options)
    return { result }
  },
  render() {
    return h('div')
  }
})

describe('useSketchRuler', () => {
  it('returns engine and reactive state', async () => {
    const wrapper = mount(TestComp as any, {
      props: {
        options: {
          width: 800,
          height: 600,
          canvasWidth: 400,
          canvasHeight: 300,
          thick: 20,
          autoCenter: false
        }
      }
    })
    await nextTick()

    const { result } = wrapper.vm as any
    expect(result.engine).toBeDefined()
    expect(result.scale.value).toBe(1)
    expect(result.rectWidth.value).toBe(780)
    expect(result.rectHeight.value).toBe(580)
  })

  it('addLine and moveLine update state', async () => {
    const wrapper = mount(TestComp as any, {
      props: {
        options: {
          width: 800,
          height: 600,
          canvasWidth: 400,
          canvasHeight: 300,
          thick: 20,
          autoCenter: false
        }
      }
    })
    await nextTick()

    const { result } = wrapper.vm as any
    expect(result.horizontalLines.value).toHaveLength(0)

    result.addLine({ orientation: 'h', position: 100, visible: true, locked: false })
    await nextTick()
    expect(result.horizontalLines.value).toHaveLength(1)
    expect(result.horizontalLines.value[0].position).toBe(100)

    const id = result.horizontalLines.value[0].id
    result.moveLine(id, 200)
    await nextTick()
    expect(result.horizontalLines.value[0].position).toBe(200)
  })

  it('removeLine deletes line', async () => {
    const wrapper = mount(TestComp as any, {
      props: {
        options: {
          width: 800,
          height: 600,
          canvasWidth: 400,
          canvasHeight: 300,
          thick: 20,
          lines: { h: [50], v: [100] }
        }
      }
    })
    await nextTick()

    const { result } = wrapper.vm as any
    expect(result.horizontalLines.value).toHaveLength(1)
    expect(result.verticalLines.value).toHaveLength(1)

    const id = result.horizontalLines.value[0].id
    result.removeLine(id)
    await nextTick()
    expect(result.horizontalLines.value).toHaveLength(0)
  })

  it('zoomIn/zoomOut/reset work', async () => {
    const wrapper = mount(TestComp as any, {
      props: {
        options: {
          width: 800,
          height: 600,
          canvasWidth: 400,
          canvasHeight: 300,
          thick: 20,
          zoomStep: 0.25,
          autoCenter: false
        }
      }
    })
    await nextTick()

    const { result } = wrapper.vm as any
    const initialScale = result.scale.value

    result.zoomIn()
    await nextTick()
    expect(result.scale.value).toBeGreaterThan(initialScale)

    result.reset()
    await nextTick()
    expect(result.scale.value).toBe(initialScale)
  })

  it('paletteCpu merges custom palette', async () => {
    const wrapper = mount(TestComp as any, {
      props: {
        options: {
          width: 800,
          height: 600,
          canvasWidth: 400,
          canvasHeight: 300,
          palette: { bgColor: '#ff0000' },
          autoCenter: false
        }
      }
    })
    await nextTick()

    const { result } = wrapper.vm as any
    expect(result.paletteCpu.value.bgColor).toBe('#ff0000')
    expect(result.paletteCpu.value.tickColor).toBeDefined()
  })

  it('exportToLegacy and importFromLegacy are symmetric', async () => {
    const wrapper = mount(TestComp as any, {
      props: {
        options: {
          width: 800,
          height: 600,
          canvasWidth: 400,
          canvasHeight: 300,
          lines: { h: [10, 20], v: [30] },
          autoCenter: false
        }
      }
    })
    await nextTick()

    const { result } = wrapper.vm as any
    const legacy = result.exportToLegacy()
    expect(legacy.h).toContain(10)
    expect(legacy.h).toContain(20)
    expect(legacy.v).toContain(30)

    result.importFromLegacy({ h: [100], v: [] })
    await nextTick()
    expect(result.horizontalLines.value).toHaveLength(1)
    expect(result.horizontalLines.value[0].position).toBe(100)
  })
})
