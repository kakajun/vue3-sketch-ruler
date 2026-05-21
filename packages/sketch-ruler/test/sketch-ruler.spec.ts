import { mount } from '@vue/test-utils'
import SketchRuler from '../src/components/SketchRuler.vue'

describe('SketchRuler integration', () => {
  test('emits update:scale on zoomIn', async () => {
    const wrapper = mount(SketchRuler as any, {
      props: {
        width: 800,
        height: 600,
        canvasWidth: 600,
        canvasHeight: 400,
        selfHandle: true
      },
      slots: {
        default: '<div data-type="page" style="width:600px;height:400px;"></div>'
      },
      attachTo: document.body
    })

    await Promise.resolve()
    const engine = (wrapper.vm as any).engine
    expect(engine).toBeTruthy()
    // 通过引擎直接设置缩放值触发 update:scale
    engine.setTransform({ scale: 1.5 })
    await new Promise((r) => setTimeout(r, 30))
    const emitted = wrapper.emitted('update:scale') || []
    expect(emitted.length).toBeGreaterThan(0)
  })

  test('corner click emits onCornerClick and toggles', async () => {
    const wrapper = mount(SketchRuler as any, {
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

  test('multiple instances have independent transform engines', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const wrapper1 = mount(SketchRuler as any, {
      props: {
        width: 400,
        height: 300,
        canvasWidth: 300,
        canvasHeight: 200,
        selfHandle: true
      },
      slots: {
        default: '<div data-type="page1" style="width:300px;height:200px;"></div>'
      },
      attachTo: container
    })

    const wrapper2 = mount(SketchRuler as any, {
      props: {
        width: 400,
        height: 300,
        canvasWidth: 300,
        canvasHeight: 200,
        selfHandle: true
      },
      slots: {
        default: '<div data-type="page2" style="width:300px;height:200px;"></div>'
      },
      attachTo: container
    })

    await Promise.resolve()
    await new Promise((r) => setTimeout(r, 50))

    const engine1 = (wrapper1.vm as any).engine
    const engine2 = (wrapper2.vm as any).engine

    // 每个实例都应该有自己的引擎
    expect(engine1).toBeTruthy()
    expect(engine2).toBeTruthy()
    expect(engine1).not.toBe(engine2)

    // 每个实例操作的 canvasedit 元素应该不同
    const canvas1 = wrapper1.find('[data-type="page1"]')
    const canvas2 = wrapper2.find('[data-type="page2"]')
    expect(canvas1.exists()).toBe(true)
    expect(canvas2.exists()).toBe(true)

    // 对第二个实例执行缩放，验证第一个实例没有收到 update:scale 事件
    const emitted1Before = (wrapper1.emitted('update:scale') || []).length
    engine2.setTransform({ scale: 2 })
    await new Promise((r) => setTimeout(r, 50))
    const emitted1After = (wrapper1.emitted('update:scale') || []).length
    expect(emitted1After).toBe(emitted1Before)

    document.body.removeChild(container)
  })
})
