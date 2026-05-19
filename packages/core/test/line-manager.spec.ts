import { describe, it, expect } from 'vitest'
import { LineManager } from '../src/state/line-manager'

describe('LineManager', () => {
  it('initializes with empty lines', () => {
    const manager = new LineManager()
    expect(manager.getLines()).toEqual([])
  })

  it('initializes with given lines', () => {
    const lines = [
      { id: '1', orientation: 'h' as const, position: 100, visible: true, locked: false }
    ]
    const manager = new LineManager(lines)
    expect(manager.getLines()).toHaveLength(1)
    expect(manager.getLines()[0].position).toBe(100)
  })

  it('adds a line and returns it', () => {
    const manager = new LineManager()
    const line = manager.addLine({ orientation: 'h', position: 50, visible: true, locked: false })
    expect(line.id).toBeTypeOf('string')
    expect(line.position).toBe(50)
    expect(manager.getLines()).toHaveLength(1)
  })

  it('notifies on update', () => {
    const manager = new LineManager()
    let notified = false
    manager.onUpdate(() => {
      notified = true
    })
    manager.addLine({ orientation: 'h', position: 50, visible: true, locked: false })
    expect(notified).toBe(true)
  })

  it('removes a line', () => {
    const manager = new LineManager()
    const line = manager.addLine({ orientation: 'h', position: 50, visible: true, locked: false })
    expect(manager.removeLine(line.id)).toBe(true)
    expect(manager.getLines()).toHaveLength(0)
    expect(manager.removeLine('nonexistent')).toBe(false)
  })

  it('updates a line', () => {
    const manager = new LineManager()
    const line = manager.addLine({ orientation: 'h', position: 50, visible: true, locked: false })
    expect(manager.updateLine(line.id, { position: 100 })).toBe(true)
    expect(manager.getLines()[0].position).toBe(100)
    expect(manager.updateLine('nonexistent', { position: 200 })).toBe(false)
  })

  it('moves a line', () => {
    const manager = new LineManager()
    const line = manager.addLine({ orientation: 'h', position: 50, visible: true, locked: false })
    expect(manager.moveLine(line.id, 200)).toBe(true)
    expect(manager.getLines()[0].position).toBe(200)
  })

  it('toggles lock', () => {
    const manager = new LineManager()
    const line = manager.addLine({ orientation: 'h', position: 50, visible: true, locked: false })
    expect(manager.toggleLock(line.id)).toBe(true)
    expect(manager.getLines()[0].locked).toBe(true)
    expect(manager.toggleLock(line.id)).toBe(true)
    expect(manager.getLines()[0].locked).toBe(false)
    expect(manager.toggleLock('nonexistent')).toBe(false)
  })

  it('toggles visible', () => {
    const manager = new LineManager()
    const line = manager.addLine({ orientation: 'h', position: 50, visible: true, locked: false })
    expect(manager.toggleVisible(line.id)).toBe(true)
    expect(manager.getLines()[0].visible).toBe(false)
    expect(manager.toggleVisible('nonexistent')).toBe(false)
  })

  it('clears all lines', () => {
    const manager = new LineManager()
    manager.addLine({ orientation: 'h', position: 50, visible: true, locked: false })
    manager.addLine({ orientation: 'v', position: 100, visible: true, locked: false })
    manager.clear()
    expect(manager.getLines()).toHaveLength(0)
  })

  it('sets lines', () => {
    const manager = new LineManager()
    manager.addLine({ orientation: 'h', position: 50, visible: true, locked: false })
    manager.setLines([
      { id: 'a', orientation: 'v', position: 200, visible: true, locked: false }
    ])
    expect(manager.getLines()).toHaveLength(1)
    expect(manager.getLines()[0].id).toBe('a')
  })
})
