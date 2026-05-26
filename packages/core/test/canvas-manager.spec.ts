import { describe, it, expect, beforeEach } from 'vitest'
import { CanvasManager, BUILTIN_TEMPLATES } from '../src/managers/canvas-manager'

describe('CanvasManager', () => {
  // 画布管理器测试
  let manager: CanvasManager

  beforeEach(() => {
    manager = new CanvasManager()
  })

  it('should initialize empty', () => {
    // 初始化为空状态
    expect(manager.getState().canvases).toEqual([])
    expect(manager.activeCanvas).toBeNull()
  })

  it('should add canvas and auto-activate first', () => {
    // 添加画布并自动激活第一个
    const id = manager.addCanvas({ name: 'test', width: 800, height: 600 })
    expect(id).toBeTypeOf('string')
    expect(manager.getState().canvases).toHaveLength(1)
    expect(manager.getState().activeId).toBe(id)
    expect(manager.activeCanvas?.name).toBe('test')
  })

  it('should notify on update', () => {
    // 更新时发出通知
    let notified = false
    manager.onUpdate(() => {
      notified = true
    })
    manager.addCanvas({ name: 'test', width: 800, height: 600 })
    expect(notified).toBe(true)
  })

  it('should switch canvas', () => {
    // 切换画布
    const id1 = manager.addCanvas({ name: 'c1', width: 800, height: 600 })
    const id2 = manager.addCanvas({ name: 'c2', width: 1024, height: 768 })
    expect(manager.getState().activeId).toBe(id1)

    manager.switchCanvas(id2)
    expect(manager.getState().activeId).toBe(id2)
    expect(manager.activeCanvas?.name).toBe('c2')
  })

  it('should remove canvas and switch to another', () => {
    // 移除画布并自动切换到另一个
    const id1 = manager.addCanvas({ name: 'c1', width: 800, height: 600 })
    const id2 = manager.addCanvas({ name: 'c2', width: 1024, height: 768 })
    manager.switchCanvas(id2)

    manager.removeCanvas(id2)
    expect(manager.getState().canvases).toHaveLength(1)
    expect(manager.getState().activeId).toBe(id1)
  })

  it('should update canvas state', () => {
    // 更新画布状态
    const id = manager.addCanvas({ name: 'c1', width: 800, height: 600 })
    manager.updateCanvasState(id, { scale: 2, offsetX: 100 })
    const canvas = manager.activeCanvas
    expect(canvas?.scale).toBe(2)
    expect(canvas?.offsetX).toBe(100)
  })

  it('should merge global lines with local lines', () => {
    // 合并全局参考线与本地参考线
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
    // 导出和导入画布快照
    const id = manager.addCanvas({ name: 'c1', width: 800, height: 600 })
    const snapshot = manager.exportCanvas(id)
    expect(snapshot).not.toBeNull()
    expect(snapshot?.name).toBe('c1')

    snapshot!.name = 'renamed'
    manager.importCanvas(snapshot!)
    expect(manager.activeCanvas?.name).toBe('renamed')
  })

  it('should register and apply custom template', () => {
    // 注册并应用自定义模板
    manager.registerTemplate('custom', { name: 'Custom', width: 500, height: 500 })
    expect(manager.getTemplateNames()).toContain('custom')

    const id = manager.applyTemplate('custom')
    expect(id).toBeTypeOf('string')
    expect(manager.activeCanvas?.width).toBe(500)
  })

  it('should have builtin templates', () => {
    // 拥有内置模板
    const names = manager.getTemplateNames()
    expect(names).toContain('A4 Portrait')
    expect(names).toContain('Web 1920')
    expect(names).toContain('Mobile 375')
  })
})

describe('BUILTIN_TEMPLATES', () => {
  // 内置模板测试
  it('should define all expected templates', () => {
    // 定义所有预期的模板
    expect(BUILTIN_TEMPLATES['A4 Portrait']).toEqual({ name: 'A4 纵向', width: 794, height: 1123 })
    expect(BUILTIN_TEMPLATES['Web 1920']).toEqual({ name: 'Web 1920', width: 1920, height: 1080 })
    expect(BUILTIN_TEMPLATES['Mobile 375']).toEqual({ name: 'Mobile 375', width: 375, height: 812 })
  })
})
