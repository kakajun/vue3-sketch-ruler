import { mount } from '@vue/test-utils'
import SketchRule from '../src/index'

describe('SketchRule integration', () => {
  test('emits update:scale on zoomIn', async () => {
    const wrapper = mount(SketchRule as any, {
      props: {
        width: 800,
        height: 600,
        canvasWidth: 600,
        canvasHeight: 400,
        panzoomOption: { canvas: true, noBind: true }
      },
      slots: {
        default: '<div data-type="page" style="width:600px;height:400px;"></div>'
      },
      attachTo: document.body
    })

    await Promise.resolve()
    const inst = (wrapper.vm as any).panzoomInstance
    expect(inst).toBeTruthy()
    inst.zoomIn({ animate: false } as any)
    await new Promise((r) => setTimeout(r, 30))
    const emitted = wrapper.emitted('update:scale') || []
    expect(emitted.length).toBeGreaterThan(0)
  })

  test('corner click emits onCornerClick and toggles', async () => {
    const wrapper = mount(SketchRule as any, {
      props: {
        width: 800,
        height: 600,
        canvasWidth: 600,
        canvasHeight: 400
      },
      attachTo: document.body
    })
    const corner = wrapper.find('.corner')
    expect(corner.exists()).toBe(true)
    await corner.trigger('click')
    const emitted = wrapper.emitted('onCornerClick') || []
    expect(emitted.length).toBe(1)
    expect(typeof emitted[0][0]).toBe('boolean')
  })

  test('change-line-state bubbles update:lockLine', async () => {
    const wrapper = mount(SketchRule as any, {
      props: {
        width: 800,
        height: 600,
        canvasWidth: 600,
        canvasHeight: 400
      },
      attachTo: document.body
    })
    // 直接调用组件方法以模拟子组件事件处理
    ;(wrapper.vm as any).changeLineState(true)
    const emitted = wrapper.emitted('update:lockLine') || []
    expect(emitted.length).toBe(1)
    expect(emitted[0][0]).toBe(true)
  })
})