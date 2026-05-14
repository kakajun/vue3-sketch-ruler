import { describe, it, expect, beforeEach } from 'vitest'
import { CanvasManager, BUILTIN_TEMPLATES } from '../src/managers/canvas-manager'

describe('CanvasManager', () => {
  let manager: CanvasManager

  beforeEach(() => {
    manager = new CanvasManager()
  })

  it('should initialize empty', () => {
    expect(manager.canvasesList.value).toEqual([])
    expect(manager.activeCanvas).toBeNull()
  })

  it('should add canvas and auto-activate first', () => {
    const id = manager.addCanvas({ name: 'test', width: 800, height: 600 })
    expect(id).toBeTypeOf('string')
    expect(manager.canvasesList.value).toHaveLength(1)
    expect(manager.activeCanvasId.value).toBe(id)
    expect(manager.activeCanvas?.name).toBe('test')
  })

  it('should switch canvas', () => {
    const id1 = manager.addCanvas({ name: 'c1', width: 800, height: 600 })
    const id2 = manager.addCanvas({ name: 'c2', width: 1024, height: 768 })
    expect(manager.activeCanvasId.value).toBe(id1)

    manager.switchCanvas(id2)
    expect(manager.activeCanvasId.value).toBe(id2)
    expect(manager.activeCanvas?.name).toBe('c2')
  })

  it('should remove canvas and switch to another', () => {
    const id1 = manager.addCanvas({ name: 'c1', width: 800, height: 600 })
    const id2 = manager.addCanvas({ name: 'c2', width: 1024, height: 768 })
    manager.switchCanvas(id2)

    manager.removeCanvas(id2)
    expect(manager.canvasesList.value).toHaveLength(1)
    expect(manager.activeCanvasId.value).toBe(id1)
  })

  it('should update canvas state', () => {
    const id = manager.addCanvas({ name: 'c1', width: 800, height: 600 })
    manager.updateCanvasState(id, { scale: 2, offsetX: 100 })
    const canvas = manager.activeCanvas
    expect(canvas?.scale).toBe(2)
    expect(canvas?.offsetX).toBe(100)
  })

  it('should merge global lines with local lines', () => {
    const id = manager.addCanvas({
      name: 'c1',
      width: 800,
      height: 600,
      lines: { h: [100], v: [200] }
    })
    manager.setGlobalLines({ h: [50], v: [150] })

    const merged = manager.getMergedLines(id)
    expect(merged).toHaveLength(4)
  })

  it('should export and import canvas snapshot', () => {
    const id = manager.addCanvas({ name: 'c1', width: 800, height: 600 })
    const snapshot = manager.exportCanvas(id)
    expect(snapshot).not.toBeNull()
    expect(snapshot?.name).toBe('c1')

    snapshot!.name = 'renamed'
    manager.importCanvas(snapshot!)
    expect(manager.activeCanvas?.name).toBe('renamed')
  })

  it('should register and apply custom template', () => {
    manager.registerTemplate('custom', { name: 'Custom', width: 500, height: 500 })
    expect(manager.getTemplateNames()).toContain('custom')

    const id = manager.applyTemplate('custom')
    expect(id).toBeTypeOf('string')
    expect(manager.activeCanvas?.width).toBe(500)
  })

  it('should have builtin templates', () => {
    const names = manager.getTemplateNames()
    expect(names).toContain('A4 Portrait')
    expect(names).toContain('Web 1920')
    expect(names).toContain('Mobile 375')
  })
})

describe('BUILTIN_TEMPLATES', () => {
  it('should define all expected templates', () => {
    expect(BUILTIN_TEMPLATES['A4 Portrait']).toEqual({ name: 'A4 纵向', width: 794, height: 1123 })
    expect(BUILTIN_TEMPLATES['Web 1920']).toEqual({ name: 'Web 1920', width: 1920, height: 1080 })
    expect(BUILTIN_TEMPLATES['Mobile 375']).toEqual({ name: 'Mobile 375', width: 375, height: 812 })
  })
})
