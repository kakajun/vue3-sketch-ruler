import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import CanvasRuler from '../src/canvas-ruler/index.vue'

describe('CanvasRuler', () => {
  it('renders correctly with the correct styles', () => {
    const wrapper = mount(CanvasRuler, {
      props: {
        scale: 1,
        palette: {
          borderColor: '#eeeeef'
          // ... other palette properties
        },
        vertical: false,
        start: 0,
        width: 100,
        height: 100,
        selectStart: 0,
        selectLength: 0,
        canvasWidth: 200,
        canvasHeight: 200,
        rate: 1,
        gridRatio: 0.5
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('ruler')
    expect(wrapper.attributes('style')).toContain('cursor: ew-resize')
    expect(wrapper.attributes('style')).toContain('border-bottom: 1px solid #eeeeef')
  })

  it('handles mousedown event correctly', async () => {
    const mockHandleDragStart = vi.fn()
    const wrapper = mount(CanvasRuler, {
      props: {
        scale: 1,
        palette: {
          borderColor: '#eeeeef'
          // ... other palette properties
        },
        vertical: false,
        start: 0,
        width: 100,
        height: 100,
        selectStart: 0,
        selectLength: 0,
        canvasWidth: 200,
        canvasHeight: 200,
        rate: 1,
        gridRatio: 0.5
      },
      global: {
        mocks: {
          $emit: mockHandleDragStart
        }
      }
    })

    const canvas = wrapper.find('canvas')
    await canvas.trigger('mousedown')

    expect(mockHandleDragStart).toHaveBeenCalled()
  })
})
