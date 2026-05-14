import { describe, it, expect } from 'vitest'
import { StateManager } from '../src/state/state-manager'

describe('StateManager', () => {
  it('initializes with empty lines', () => {
    const sm = new StateManager()
    expect(sm.getLines().value).toEqual([])
  })

  it('addLine creates a line with id', () => {
    const sm = new StateManager()
    const line = sm.addLine({ orientation: 'h', position: 100, visible: true, locked: false })
    expect(line.id).toBeDefined()
    expect(line.orientation).toBe('h')
    expect(line.position).toBe(100)
    expect(sm.getLines().value).toHaveLength(1)
  })

  it('removeLine deletes by id', () => {
    const sm = new StateManager()
    const line = sm.addLine({ orientation: 'h', position: 100, visible: true, locked: false })
    const removed = sm.removeLine(line.id)
    expect(removed).toBe(true)
    expect(sm.getLines().value).toHaveLength(0)
  })

  it('removeLine returns false if id not found', () => {
    const sm = new StateManager()
    const removed = sm.removeLine('missing')
    expect(removed).toBe(false)
  })

  it('moveLine updates position', () => {
    const sm = new StateManager()
    const line = sm.addLine({ orientation: 'h', position: 100, visible: true, locked: false })
    const updated = sm.moveLine(line.id, 200)
    expect(updated).toBe(true)
    expect(sm.getLines().value[0].position).toBe(200)
  })

  it('toggleLock flips locked state', () => {
    const sm = new StateManager()
    const line = sm.addLine({ orientation: 'h', position: 100, visible: true, locked: false })
    sm.toggleLock(line.id)
    expect(sm.getLines().value[0].locked).toBe(true)
    sm.toggleLock(line.id)
    expect(sm.getLines().value[0].locked).toBe(false)
  })

  it('clear removes all lines', () => {
    const sm = new StateManager()
    sm.addLine({ orientation: 'h', position: 100, visible: true, locked: false })
    sm.addLine({ orientation: 'v', position: 200, visible: true, locked: false })
    sm.clear()
    expect(sm.getLines().value).toHaveLength(0)
  })

  it('importFromLegacy converts h/v arrays', () => {
    const sm = new StateManager()
    sm.importFromLegacy({ h: [10, 20], v: [30] })
    expect(sm.getLines().value).toHaveLength(3)
    expect(sm.getLines().value.filter((l) => l.orientation === 'h')).toHaveLength(2)
    expect(sm.getLines().value.filter((l) => l.orientation === 'v')).toHaveLength(1)
  })

  it('exportToLegacy filters invisible lines', () => {
    const sm = new StateManager()
    sm.importFromLegacy({ h: [10, 20], v: [30] })
    sm.updateLine(sm.getLines().value[0].id, { visible: false })
    const legacy = sm.exportToLegacy()
    expect(legacy.h).toHaveLength(1)
    expect(legacy.v).toHaveLength(1)
  })
})
