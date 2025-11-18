import Panzoom from '../src/panzoom'

function mockRect(el: HTMLElement, rect: { width: number; height: number; left: number; top: number }) {
  Object.defineProperty(el, 'getBoundingClientRect', {
    value: () => ({
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height
    })
  })
}

let origGetComputedStyle: typeof window.getComputedStyle

describe('simple-panzoom basic', () => {
  let parent: HTMLElement
  let elem: HTMLElement

  beforeEach(() => {
    parent = document.createElement('div')
    elem = document.createElement('div')
    parent.appendChild(elem)
    document.body.appendChild(parent)

    // styles for full dimensions
    parent.style.paddingLeft = '10px'
    parent.style.paddingTop = '10px'
    parent.style.borderLeftWidth = '2px'
    parent.style.borderTopWidth = '2px'
    elem.style.marginLeft = '5px'
    elem.style.marginTop = '5px'

    // mock rects
    mockRect(parent, { width: 1470, height: 750, left: 0, top: 0 })
    mockRect(elem, { width: 1000, height: 800, left: 100, top: 50 })

    // simplify computed style to return inline styles
    origGetComputedStyle = window.getComputedStyle
    // @ts-expect-error override
    window.getComputedStyle = (el: Element) => (el as HTMLElement).style as any
  })

  afterEach(() => {
    window.getComputedStyle = origGetComputedStyle
  })

  test('initialization and event dispatch', async () => {
    const panzoom = Panzoom(elem, { noBind: true, canvas: true })
    let changed = false
    elem.addEventListener('panzoomchange', (e: any) => {
      const detail = e.detail
      expect(detail).toBeTruthy()
      expect(typeof detail.scale).toBe('number')
      expect(detail.dimsOut).toBeTruthy()
      changed = true
    })
    panzoom.reset({ animate: false })
    await new Promise((r) => setTimeout(r, 50))
    expect(changed).toBeTruthy()
  })

  test('zoomWithWheel increases scale', async () => {
    const panzoom = Panzoom(elem, { noBind: true, canvas: true, step: 0.3 })
    const initial = panzoom.getScale()
    const wheel: any = {
      deltaY: -120,
      clientX: 500,
      clientY: 400,
      preventDefault: () => {}
    }
    panzoom.zoomWithWheel(wheel as WheelEvent)
    await new Promise((r) => setTimeout(r, 10))
    expect(panzoom.getScale()).toBeGreaterThan(initial)
  })

  test('disablePan prevents pan change', async () => {
    const panzoom = Panzoom(elem, { noBind: true, canvas: true, disablePan: true })
    const before = panzoom.getPan()
    panzoom.pan(200, 300)
    await new Promise((r) => setTimeout(r, 10))
    const after = panzoom.getPan()
    expect(after.x).toBe(before.x)
    expect(after.y).toBe(before.y)
  })

  test('contain inside clamps values', async () => {
    const panzoom = Panzoom(elem, { noBind: true, canvas: true, contain: 'inside' })
    const res = panzoom.pan(99999, 99999)
    expect(res.x).not.toBe(99999)
    expect(res.y).not.toBe(99999)
  })

  test('setOptions side effects apply cursor and touchAction', () => {
    const panzoom = Panzoom(elem, { noBind: true, canvas: true })
    panzoom.setOptions({ cursor: 'default', touchAction: 'none' })
    expect(parent.style.cursor).toBe('default')
    expect(parent.style.touchAction).toBe('none')
  })

  test("origin '0 0' works for zoomToPoint", async () => {
    const panzoom = Panzoom(elem, { noBind: true, canvas: true, origin: '0 0' })
    const initial = panzoom.getScale()
    panzoom.zoomToPoint(initial * 1.2, { clientX: 300, clientY: 200 })
    await new Promise((r) => setTimeout(r, 10))
    expect(panzoom.getScale()).toBeGreaterThan(initial)
  })
})