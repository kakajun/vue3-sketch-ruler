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

  test('multiple instances have independent panzoom elements', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const wrapper1 = mount(SketchRule as any, {
      props: {
        width: 400,
        height: 300,
        canvasWidth: 300,
        canvasHeight: 200,
        panzoomOption: { canvas: true, noBind: true }
      },
      slots: {
        default: '<div data-type="page1" style="width:300px;height:200px;"></div>'
      },
      attachTo: container
    })

    const wrapper2 = mount(SketchRule as any, {
      props: {
        width: 400,
        height: 300,
        canvasWidth: 300,
        canvasHeight: 200,
        panzoomOption: { canvas: true, noBind: true }
      },
      slots: {
        default: '<div data-type="page2" style="width:300px;height:200px;"></div>'
      },
      attachTo: container
    })

    await Promise.resolve()
    await new Promise((r) => setTimeout(r, 50))

    const inst1 = (wrapper1.vm as any).panzoomInstance
    const inst2 = (wrapper2.vm as any).panzoomInstance

    // 每个实例都应该有自己的 panzoom 实例
    expect(inst1).toBeTruthy()
    expect(inst2).toBeTruthy()
    expect(inst1).not.toBe(inst2)

    // 每个实例操作的 canvasedit 元素应该不同
    const canvas1 = wrapper1.find('[data-type="page1"]')
    const canvas2 = wrapper2.find('[data-type="page2"]')
    expect(canvas1.exists()).toBe(true)
    expect(canvas2.exists()).toBe(true)

    // 对第二个实例执行 zoomIn，验证第一个实例没有收到 update:scale 事件
    const emitted1Before = (wrapper1.emitted('update:scale') || []).length
    inst2.zoomIn({ animate: false } as any)
    await new Promise((r) => setTimeout(r, 50))
    const emitted1After = (wrapper1.emitted('update:scale') || []).length
    expect(emitted1After).toBe(emitted1Before)

    document.body.removeChild(container)
  })
})