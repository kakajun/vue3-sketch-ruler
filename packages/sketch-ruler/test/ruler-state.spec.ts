import { describe, it, expect } from 'vitest'
import { produceState, createDefaultState, type RulerAction } from '../src/state/ruler-state'
import type { GuideLine } from '../src/state/ruler-context'

describe('produceState', () => {
  const base = createDefaultState()

  it('createDefaultState returns valid initial state', () => {
    expect(base.lines).toEqual([])
    expect(base.palette.bgColor).toBe('#f6f7f9')
    expect(base.snapConfig.enabled).toBe(true)
    expect(base.showReferLine).toBe(true)
  })

  it('addLine appends a line', () => {
    const line: GuideLine = {
      id: 'l1',
      orientation: 'h',
      position: 100,
      visible: true,
      locked: false
    }
    const next = produceState(base, { type: 'addLine', line })
    expect(next.lines).toHaveLength(1)
    expect(next.lines[0].id).toBe('l1')
    expect(next.lines[0].position).toBe(100)
  })

  it('removeLine filters by id', () => {
    const s1 = produceState(base, {
      type: 'addLine',
      line: { id: 'l1', orientation: 'h', position: 100, visible: true, locked: false }
    })
    const s2 = produceState(s1, { type: 'removeLine', id: 'l1' })
    expect(s2.lines).toHaveLength(0)
  })

  it('removeLine returns same state if id not found', () => {
    const next = produceState(base, { type: 'removeLine', id: 'missing' })
    expect(next).toBe(base)
  })

  it('moveLine updates position', () => {
    const s1 = produceState(base, {
      type: 'addLine',
      line: { id: 'l1', orientation: 'h', position: 100, visible: true, locked: false }
    })
    const s2 = produceState(s1, { type: 'moveLine', id: 'l1', position: 200 })
    expect(s2.lines[0].position).toBe(200)
  })

  it('updateLine merges updates', () => {
    const s1 = produceState(base, {
      type: 'addLine',
      line: { id: 'l1', orientation: 'h', position: 100, visible: true, locked: false }
    })
    const s2 = produceState(s1, { type: 'updateLine', id: 'l1', updates: { locked: true } })
    expect(s2.lines[0].locked).toBe(true)
    expect(s2.lines[0].position).toBe(100)
  })

  it('setLines replaces entire array', () => {
    const next = produceState(base, {
      type: 'setLines',
      lines: [{ id: 'x', orientation: 'v', position: 50, visible: true, locked: false }]
    })
    expect(next.lines).toHaveLength(1)
    expect(next.lines[0].id).toBe('x')
  })

  it('setLines replaces with converted h/v arrays', () => {
    const lines: GuideLine[] = [
      { id: 'h1', orientation: 'h', position: 10, visible: true, locked: false },
      { id: 'h2', orientation: 'h', position: 20, visible: true, locked: false },
      { id: 'v1', orientation: 'v', position: 30, visible: true, locked: false }
    ]
    const next = produceState(base, { type: 'setLines', lines })
    expect(next.lines).toHaveLength(3)
    expect(next.lines.filter((l) => l.orientation === 'h')).toHaveLength(2)
    expect(next.lines.filter((l) => l.orientation === 'v')).toHaveLength(1)
  })

  it('setPalette merges partial palette', () => {
    const next = produceState(base, { type: 'setPalette', palette: { bgColor: '#000' } })
    expect(next.palette.bgColor).toBe('#000')
    expect(next.palette.tickColor).toBe(base.palette.tickColor)
  })

  it('setSnapConfig merges partial config', () => {
    const next = produceState(base, { type: 'setSnapConfig', config: { threshold: 10 } })
    expect(next.snapConfig.threshold).toBe(10)
    expect(next.snapConfig.enabled).toBe(true)
  })

  it('toggleReferLine toggles boolean', () => {
    const s1 = produceState(base, { type: 'toggleReferLine' })
    expect(s1.showReferLine).toBe(false)
    const s2 = produceState(s1, { type: 'toggleReferLine' })
    expect(s2.showReferLine).toBe(true)
  })

  it('toggleReferLine accepts explicit value', () => {
    const next = produceState(base, { type: 'toggleReferLine', value: false })
    expect(next.showReferLine).toBe(false)
  })

  it('structural sharing: unchanged parts are same reference', () => {
    const s1 = produceState(base, { type: 'setPalette', palette: { bgColor: '#fff' } })
    expect(s1.lines).toBe(base.lines)
    expect(s1.snapConfig).toBe(base.snapConfig)
  })
})
