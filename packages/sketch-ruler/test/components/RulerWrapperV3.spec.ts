import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RulerWrapperV3 from '../../src/components/RulerWrapperV3.vue'

function mockRect(opts: Partial<DOMRect> = {}): DOMRect {
  const width = opts.width ?? 300
  const height = opts.height ?? 200
  return {
    top: opts.top ?? 0,
    left: opts.left ?? 0,
    right: opts.right ?? width,
    bottom: opts.bottom ?? height,
    width,
    height,
    x: opts.x ?? 0,
    y: opts.y ?? 0,
    toJSON: () => {}
  } as DOMRect
}

function mountRulerWrapper(props: Record<string, any> = {}) {
  const vertical = props.vertical ?? false
  const wrapper = mount(RulerWrapperV3 as any, {
    props: {
      vertical,
      width: vertical ? 20 : 300,
      height: vertical ? 300 : 20,
      thick: 20,
      scale: 1,
      offset: { x: 20, y: 20 },
      lines: [],
      palette: {
        bgColor: '#f6f7f9',
        tickColor: '#BABBBC',
        labelColor: '#7D8694',
        guideLineColor: '#51d6a9',
        guideLineLockedColor: '#d4d7dc',
        hoverBg: '#000',
        hoverColor: '#fff',
        borderColor: '#eeeeef',
        shadowColor: '#e9f7fe'
      },
      showReferLine: true,
      canvasWidth: 300,
      canvasHeight: 200,
      ...props
    },
    attachTo: document.body
  })

  const canvas = wrapper.find('canvas').element as HTMLCanvasElement
  canvas.getBoundingClientRect = vi.fn(() =>
    mockRect({
      width: vertical ? 20 : 300,
      height: vertical ? 300 : 20
    })
  )

  return wrapper
}

describe('RulerWrapperV3 line boundary deletion', () => {
  // RulerWrapperV3 参考线边界删除测试
  afterEach(() => {
    // 清理可能残留的 document 事件监听器
    document.dispatchEvent(new MouseEvent('mouseup'))
  })

  it('should emit deleteLine when dragging an existing horizontal line out of top boundary', async () => {
    // 水平参考线拖出上边界应触发 deleteLine，但拖拽过程中仍应更新位置
    const wrapper = mountRulerWrapper({
      lines: [{ id: 'h-1', orientation: 'h', position: 100, visible: true, locked: false }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 120, bubbles: true, cancelable: true })
    )

    // drag up: newPos = 100 + (-50 - 120) = -70 < 0
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: -50 }))
    await nextTick()

    // 拖拽过程中位置应更新（即使超出画布）
    expect(wrapper.emitted('updateLine')).toBeTruthy()
    expect(wrapper.emitted('updateLine')![0]).toEqual(['h-1', -70])

    document.dispatchEvent(new MouseEvent('mouseup', { clientY: -50 }))
    await nextTick()

    // 松手后才删除
    expect(wrapper.emitted('deleteLine')).toBeTruthy()
    expect(wrapper.emitted('deleteLine')![0]).toEqual(['h-1'])
  })

  it('should emit deleteLine when dragging an existing horizontal line out of bottom boundary', async () => {
    // 水平参考线拖出下边界应触发 deleteLine，但拖拽过程中仍应更新位置
    const wrapper = mountRulerWrapper({
      lines: [{ id: 'h-2', orientation: 'h', position: 100, visible: true, locked: false }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 120, bubbles: true, cancelable: true })
    )

    // drag down: newPos = 100 + (350 - 120) = 330 > canvasHeight(200)
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 350 }))
    await nextTick()

    // 拖拽过程中位置应更新（即使超出画布）
    expect(wrapper.emitted('updateLine')).toBeTruthy()
    expect(wrapper.emitted('updateLine')![0]).toEqual(['h-2', 330])

    document.dispatchEvent(new MouseEvent('mouseup', { clientY: 350 }))
    await nextTick()

    // 松手后才删除
    expect(wrapper.emitted('deleteLine')).toBeTruthy()
    expect(wrapper.emitted('deleteLine')![0]).toEqual(['h-2'])
  })

  it('should emit deleteLine when dragging an existing vertical line out of right boundary', async () => {
    // 垂直参考线拖出右边界应触发 deleteLine，但拖拽过程中仍应更新位置
    const wrapper = mountRulerWrapper({
      vertical: true,
      lines: [{ id: 'v-1', orientation: 'v', position: 100, visible: true, locked: false }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientX: 120, bubbles: true, cancelable: true })
    )

    // drag right: newPos = 100 + (450 - 120) = 430 > canvasWidth(300)
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 450 }))
    await nextTick()

    // 拖拽过程中位置应更新（即使超出画布）
    expect(wrapper.emitted('updateLine')).toBeTruthy()
    expect(wrapper.emitted('updateLine')![0]).toEqual(['v-1', 430])

    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 450 }))
    await nextTick()

    // 松手后才删除
    expect(wrapper.emitted('deleteLine')).toBeTruthy()
    expect(wrapper.emitted('deleteLine')![0]).toEqual(['v-1'])
  })

  it('should emit updateLine when dragging line within boundary', async () => {
    // 在边界内拖拽参考线应触发 updateLine
    const wrapper = mountRulerWrapper({
      lines: [{ id: 'h-1', orientation: 'h', position: 100, visible: true, locked: false }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 120, bubbles: true, cancelable: true })
    )

    // drag to clientY=150, newPos = 100 + (150 - 120) = 130 (within 0~200)
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 150 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientY: 150 }))

    await nextTick()

    expect(wrapper.emitted('updateLine')).toBeTruthy()
    expect(wrapper.emitted('updateLine')![0]).toEqual(['h-1', 130])
    expect(wrapper.emitted('deleteLine')).toBeFalsy()
  })

  it('should show default delete label when dragging line out of boundary', async () => {
    // 拖出边界时应显示默认删除标签
    const wrapper = mountRulerWrapper({
      lines: [{ id: 'h-1', orientation: 'h', position: 100, visible: true, locked: false }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 120, bubbles: true, cancelable: true })
    )

    // drag out of boundary
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: -50 }))

    await nextTick()

    const label = wrapper.find('.line-label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('放开删除')

    document.dispatchEvent(new MouseEvent('mouseup', { clientY: -50 }))
  })

  it('should show custom delete label when dragging line out of boundary', async () => {
    // 拖出边界时应显示自定义删除标签
    const wrapper = mountRulerWrapper({
      deleteLabel: 'Release to delete',
      lines: [{ id: 'h-1', orientation: 'h', position: 100, visible: true, locked: false }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 120, bubbles: true, cancelable: true })
    )

    // drag out of boundary
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: -50 }))

    await nextTick()

    const label = wrapper.find('.line-label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Release to delete')

    document.dispatchEvent(new MouseEvent('mouseup', { clientY: -50 }))
  })

  it('should emit addLine when creating a new horizontal line within boundary', async () => {
    // 在边界内新建水平参考线应触发 addLine
    const wrapper = mountRulerWrapper()
    const canvas = wrapper.find('canvas').element

    // mousedown on ruler: clientY=30 -> worldPos = (30 - 20) / 1 = 10
    canvas.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 30, bubbles: true, cancelable: true })
    )
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 30 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientY: 30 }))

    await nextTick()

    expect(wrapper.emitted('addLine')).toBeTruthy()
    const payload = wrapper.emitted('addLine')![0][0] as any
    expect(payload.orientation).toBe('h')
    expect(payload.position).toBe(10)
  })

  it('should not emit addLine when creating a new line beyond top boundary', async () => {
    // 超出上边界时不应触发 addLine
    const wrapper = mountRulerWrapper()
    const canvas = wrapper.find('canvas').element

    // clientY=10 -> worldPos = (10 - 20) / 1 = -10 < 0
    canvas.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 10, bubbles: true, cancelable: true })
    )
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 10 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientY: 10 }))

    await nextTick()

    expect(wrapper.emitted('addLine')).toBeFalsy()
  })

  it('should not emit addLine when creating a new line beyond bottom boundary', async () => {
    // 超出下边界时不应触发 addLine
    const wrapper = mountRulerWrapper()
    const canvas = wrapper.find('canvas').element

    // clientY=250 -> worldPos = (250 - 20) / 1 = 230 > canvasHeight(200)
    canvas.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 30, bubbles: true, cancelable: true })
    )
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 250 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientY: 250 }))

    await nextTick()

    expect(wrapper.emitted('addLine')).toBeFalsy()
  })

  it('should not emit addLine when creating a new vertical line beyond right boundary', async () => {
    // 超出右边界时不应触发 addLine
    const wrapper = mountRulerWrapper({ vertical: true })
    const canvas = wrapper.find('canvas').element

    // clientX=350 -> worldPos = (350 - 20) / 1 = 330 > canvasWidth(300)
    canvas.dispatchEvent(
      new MouseEvent('mousedown', { clientX: 30, bubbles: true, cancelable: true })
    )
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 350 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 350 }))

    await nextTick()

    expect(wrapper.emitted('addLine')).toBeFalsy()
  })

  it('should not emit deleteLine for locked lines', async () => {
    // 锁定参考线不应触发 deleteLine
    const wrapper = mountRulerWrapper({
      lines: [{ id: 'h-1', orientation: 'h', position: 100, visible: true, locked: true }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 120, bubbles: true, cancelable: true })
    )

    document.dispatchEvent(new MouseEvent('mousemove', { clientY: -50 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientY: -50 }))

    await nextTick()

    expect(wrapper.emitted('deleteLine')).toBeFalsy()
    expect(wrapper.emitted('updateLine')).toBeFalsy()
  })

  it('should update line position beyond boundary during drag and delete only on mouseup', async () => {
    // 拖拽过程中线应跟随鼠标移出画布，仅松手时才删除
    const wrapper = mountRulerWrapper({
      lines: [{ id: 'h-1', orientation: 'h', position: 100, visible: true, locked: false }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 120, bubbles: true, cancelable: true })
    )

    // 第一步：拖到画布内的新位置
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 150 }))
    await nextTick()
    expect(wrapper.emitted('updateLine')![0]).toEqual(['h-1', 130])

    // 第二步：继续拖出上边界
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: -30 }))
    await nextTick()
    expect(wrapper.emitted('updateLine')![1]).toEqual(['h-1', -50])

    // 此时不应触发 deleteLine
    expect(wrapper.emitted('deleteLine')).toBeFalsy()

    // 第三步：松手，才触发 deleteLine
    document.dispatchEvent(new MouseEvent('mouseup', { clientY: -30 }))
    await nextTick()
    expect(wrapper.emitted('deleteLine')).toBeTruthy()
    expect(wrapper.emitted('deleteLine')![0]).toEqual(['h-1'])
  })

  it('should allow dragging back from beyond boundary without deleting', async () => {
    // 从画布外拖回画布内不应删除
    const wrapper = mountRulerWrapper({
      lines: [{ id: 'h-1', orientation: 'h', position: 100, visible: true, locked: false }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 120, bubbles: true, cancelable: true })
    )

    // 拖出上边界
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: -50 }))
    await nextTick()
    expect(wrapper.emitted('updateLine')![0]).toEqual(['h-1', -70])

    // 拖回画布内
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 150 }))
    await nextTick()
    expect(wrapper.emitted('updateLine')![1]).toEqual(['h-1', 130])

    // 松手，不应删除
    document.dispatchEvent(new MouseEvent('mouseup', { clientY: 150 }))
    await nextTick()
    expect(wrapper.emitted('deleteLine')).toBeFalsy()
  })

  it('should emit deleteLine when dragging horizontal line back onto the ruler', async () => {
    // 水平参考线被拖回标尺区域（screenPos <= thick）也应删除
    const wrapper = mountRulerWrapper({
      lines: [{ id: 'h-1', orientation: 'h', position: 100, visible: true, locked: false }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientY: 120, bubbles: true, cancelable: true })
    )

    // 拖到标尺底部边缘：newPos = 0, screenPos = 0 * 1 + 20 = 20 <= thick(20)
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 20 }))
    await nextTick()

    expect(wrapper.emitted('updateLine')).toBeTruthy()
    expect(wrapper.emitted('updateLine')![0]).toEqual(['h-1', 0])

    const label = wrapper.find('.line-label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('放开删除')

    document.dispatchEvent(new MouseEvent('mouseup', { clientY: 20 }))
    await nextTick()

    expect(wrapper.emitted('deleteLine')).toBeTruthy()
    expect(wrapper.emitted('deleteLine')![0]).toEqual(['h-1'])
  })

  it('should emit deleteLine when dragging vertical line back onto the ruler', async () => {
    // 垂直参考线被拖回标尺区域（screenPos <= thick）也应删除
    const wrapper = mountRulerWrapper({
      vertical: true,
      lines: [{ id: 'v-1', orientation: 'v', position: 100, visible: true, locked: false }]
    })

    const lineEl = wrapper.find('.line').element
    lineEl.dispatchEvent(
      new MouseEvent('mousedown', { clientX: 120, bubbles: true, cancelable: true })
    )

    // 拖到标尺右侧边缘：newPos = 0, screenPos = 0 * 1 + 20 = 20 <= thick(20)
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 20 }))
    await nextTick()

    expect(wrapper.emitted('updateLine')).toBeTruthy()
    expect(wrapper.emitted('updateLine')![0]).toEqual(['v-1', 0])

    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 20 }))
    await nextTick()

    expect(wrapper.emitted('deleteLine')).toBeTruthy()
    expect(wrapper.emitted('deleteLine')![0]).toEqual(['v-1'])
  })
})
